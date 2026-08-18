#!/usr/bin/env python3
"""Autonomous Anki Flashcard Generation & Ingestion Pipeline (tools/research/anki_generator.py).

Systematically converts research/ courseware into high-density Anki notes styled primarily in Chinese
with English technical terminology annotations. Enforces coverage tracking, quality filtering, and deduplication.
"""

from __future__ import annotations

import argparse
import glob
import hashlib
import json
import os
import re
import shutil
import sqlite3
import sys
import tempfile
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.anki_card_validator import (
    canonical_tag,
    canonicalize_tags,
    validate_cards,
    validate_tsv,
)
from tools.research.anki_graph_bridge import AnkiGraphBridge
from tools.research.citation_engine import CitationEngine
from tools.research.parse_chunks import estimate_tokens
from tools.research.scene_builder import SceneBuilder
from tools.research.search_chunks import format_file_link

DEFAULT_RESEARCH_DIR = REPO_ROOT / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"
DEFAULT_COVERAGE_PATH = DEFAULT_RESEARCH_DIR / ".anki_coverage.json"
DEFAULT_TSV_PATH = DEFAULT_RESEARCH_DIR / "anki_import.txt"
DEFAULT_CANDIDATES_PATH = DEFAULT_RESEARCH_DIR / "anki_candidates.jsonl"
DEFAULT_CARDS_PATH = DEFAULT_RESEARCH_DIR / "anki_cards.jsonl"
DEFAULT_REVIEW_PATH = DEFAULT_RESEARCH_DIR / "anki_review.jsonl"
DEFAULT_VERDICTS_PATH = DEFAULT_RESEARCH_DIR / "anki_density_verdicts.jsonl"
FIELD_SEP = "\x1f"
JUNK_KEYWORDS = {
    "outline",
    "index",
    "readme",
    "toc",
    "table of contents",
    "agenda",
    "syllabus",
    "schedule",
    "logistics",
    "office hours",
    "grading",
    "homework",
    "due date",
    "midterm",
    "final exam",
    "announcements",
    "assignment",
    "copyright",
    "prerequisites",
    "course overview",
}
SLIDE_MARKER_PATTERN = re.compile(r"^slide\s*\(\s*line\s*\d+\s*\)$", re.IGNORECASE)
SEMESTER_HEADING_PATTERN = re.compile(
    r"^(winter|spring|summer|fall|autumn)\s+\d{4}", re.IGNORECASE
)
PAGE_NUM_PATTERN = re.compile(r"^(page\s+\d+|\d+\s*/\s*\d+)$", re.IGNORECASE)
PROGRESS_BAR_WIDTH = 40

REJECT_REASONS = (
    "title-slide",
    "metadata-dump",
    "author-block",
    "diagram",
    "ocr-fragment",
    "date-stamp",
    "outline",
    "qa-mismatch",
    "duplicate",
    "other",
)


def _append_review_log(
    review_path: Path,
    chunk_id: str,
    verdict: str,
    reason: str | None = None,
    note_id: int | None = None,
) -> None:
    """Append a single verdict to the review log (append-only audit artifact)."""
    review_path.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "chunk_id": chunk_id,
        "verdict": verdict,
    }
    if reason:
        entry["reason"] = reason
    if note_id is not None:
        entry["note_id"] = note_id
    with review_path.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _front_hash(front_html: str) -> str:
    """Stable hash of card front for duplicate detection."""
    plain = re.sub(r"<[^>]+>", "", front_html).lower()
    plain = re.sub(r"\s+", " ", plain).strip()
    return hashlib.sha1(plain.encode("utf-8")).hexdigest()


def _load_reject_rates(review_path: Path) -> dict[str, float]:
    """Return reject rate per top-level course directory from the review log."""
    rates: dict[str, dict[str, int]] = {}
    if not review_path.exists():
        return {}
    for raw in review_path.read_text(encoding="utf-8").splitlines():
        raw = raw.strip()
        if not raw:
            continue
        entry = json.loads(raw)
        chunk_id = entry.get("chunk_id", "")
        parts = chunk_id.split("/")
        key = parts[1] if len(parts) > 1 else "unknown"
        bucket = rates.setdefault(key, {"accept": 0, "reject": 0})
        if entry.get("verdict") == "accept":
            bucket["accept"] += 1
        elif entry.get("verdict") == "reject":
            bucket["reject"] += 1
    return {
        key: bucket["reject"] / (bucket["accept"] + bucket["reject"])
        for key, bucket in rates.items()
        if (bucket["accept"] + bucket["reject"]) > 0
    }


def _approve_rate(review_path: Path, window: int = 100) -> tuple[int, int, float]:
    """Return (accepted, total_decided, rate) over the last `window` review entries."""
    if not review_path.exists():
        return 0, 0, 0.0
    entries = []
    for raw in review_path.read_text(encoding="utf-8").splitlines():
        raw = raw.strip()
        if raw:
            entries.append(json.loads(raw))
    recent = entries[-window:]
    accepts = sum(1 for e in recent if e.get("verdict") == "accept")
    rejects = sum(1 for e in recent if e.get("verdict") == "reject")
    total = accepts + rejects
    rate = (accepts / total * 100) if total else 0.0
    return accepts, total, rate


def format_progress_bar(visited: int, total: int, width: int = PROGRESS_BAR_WIDTH) -> str:
    """Render a fixed-width progress bar string.

    Uses box-drawing characters ━ (U+2501) and ─ (U+2500) which are
    guaranteed to render at the same width in monospace fonts, unlike
    the visually mismatched █/░ pair.
    """
    pct = visited / total * 100 if total else 0
    filled = int(width * visited // total) if total else 0
    empty = width - filled
    return f"[{'━' * filled}{'─' * empty}] {pct:5.1f}% ({visited}/{total} chunks)"


class CoverageProgressReporter:
    """Computes and renders multi-level coverage progress bars."""

    @staticmethod
    def render_bar(visited: int, total: int, width: int = PROGRESS_BAR_WIDTH) -> str:
        """Renders a progress bar string."""
        return format_progress_bar(visited, total, width=width)

    @classmethod
    def print_report(
        cls,
        manifest_chunks: list[dict[str, Any]],
        visited_chunk_ids: set[str] | dict[str, Any],
        active_file_path: str | None = None,
        skipped_chunk_ids: set[str] | None = None,
    ) -> None:
        """Calculates and prints Submodule, Course, and Global progress bars."""
        if not manifest_chunks:
            return

        # If passed a dict mapping cid -> info, split generated vs skipped
        if isinstance(visited_chunk_ids, dict):
            gen_set = {
                cid
                for cid, info in visited_chunk_ids.items()
                if info.get("status") == "generated" or "status" not in info
            }
            skip_set = {
                cid
                for cid, info in visited_chunk_ids.items()
                if info.get("status") == "skipped_low_quality"
            }
        else:
            gen_set = visited_chunk_ids
            skip_set = skipped_chunk_ids or set()

        global_total = len(manifest_chunks)
        global_generated = sum(1 for c in manifest_chunks if c["chunk_id"] in gen_set)
        global_skipped = sum(1 for c in manifest_chunks if c["chunk_id"] in skip_set)
        global_unvisited = global_total - global_generated - global_skipped

        course_dir = ""
        submodule_dir = ""
        if active_file_path:
            parts = Path(active_file_path).parts
            if len(parts) >= 2:
                course_dir = str(Path(*parts[:2]))
            if len(parts) >= 3:
                submodule_dir = str(Path(*parts[:3]))

        print("\n" + "=" * 80)
        print("📊 Anki Courseware Memorization Progress Report")
        print("=" * 80)

        if submodule_dir:
            sub_chunks = [c for c in manifest_chunks if c["file_path"].startswith(submodule_dir)]
            sub_vis = sum(1 for c in sub_chunks if c["chunk_id"] in gen_set)
            sub_label = (
                Path(submodule_dir).relative_to("research")
                if submodule_dir.startswith("research")
                else submodule_dir
            )
            print(f"  Submodule : {sub_label}")
            print(f"              {cls.render_bar(sub_vis, len(sub_chunks))}\n")

        if course_dir:
            crs_chunks = [c for c in manifest_chunks if c["file_path"].startswith(course_dir)]
            crs_vis = sum(1 for c in crs_chunks if c["chunk_id"] in gen_set)
            crs_label = Path(course_dir).name
            print(f"  Course    : {crs_label}")
            print(f"              {cls.render_bar(crs_vis, len(crs_chunks))}\n")

        print("  Global    : research/ (cs231, cs232, cs233, cs234)")
        print(f"              {cls.render_bar(global_generated, global_total)}")
        print(
            f"              [Generated: {global_generated} cards ({global_generated / global_total * 100:.2f}%) | "
            f"Audited/Skipped: {global_skipped} chunks ({global_skipped / global_total * 100:.1f}%) | "
            f"Unvisited: {global_unvisited} chunks ({global_unvisited / global_total * 100:.1f}%)]"
        )
        print("=" * 80 + "\n")


@dataclass
class AnkiCard:
    """Dataclass representing a generated Anki card note."""

    chunk_id: str
    file_path: str
    heading: str
    front_html: str
    back_html: str
    tags: list[str]


def _has_valid_file_path(chunk: dict[str, Any]) -> bool:
    fpath = chunk.get("file_path", "").lower()
    # Reject non-documentation code files and binaries (.py, .c, .sh, .gns3, .png, .jpg)
    # Also reject README files, sample code repositories, test runners, and tutorial apps
    if not fpath.endswith((".md", ".txt", ".rst")):
        return False
    if (
        fpath.endswith(("readme.md", "readme.txt", "readme"))
        or "/sample-program/" in fpath
        or "/tests/" in fpath
        or "/test/" in fpath
        or "/gpac-temp/" in fpath
        or any(
            front in fpath
            for front in [
                "title-page",
                "copyright",
                "table-of-contents",
                "references",
                "-index.",
                "preface",
                "cover",
                "-contents.",
            ]
        )
    ):
        return False
    return True

def _has_valid_heading(chunk: dict[str, Any]) -> bool:
    raw_heading = chunk.get("heading", "").strip()
    heading_lower = raw_heading.lower()

    # 1. Reject meta/junk headings like 'cs230-outline', 'toc', 'syllabus', logistics, testing, chatting
    if any(k in heading_lower for k in JUNK_KEYWORDS) or heading_lower in {"testing", "chatting", "test_end", "build", "installation", "setup"}:
        return False

    # Reject short fragmented words, figure captions, table headers, or bullet markers as headings
    if heading_lower in {"bytes", "bits", "answer rrs", "answer", "rrs", "question", "questions", "part", "slide"}:
        return False

    # Reject figure captions, table headers, and chart labels
    caption_patterns = [
        r"^fig\.",
        r"^figure\b",
        r"^\([a-z]\)",
        r"\bvs\.",
        r"\bavg replic ratio\b",
        r"\bcumulative hop\b",
        r"\bdegree distribution\b",
        r"\bqueries performed\b",
        r"\bnode degree\b",
        r"\bnode rank\b",
        r"\bpush threshold\b",
        r"\bmax load\b",
        r"nodes\s*#\s*links",
    ]
    if any(re.search(pat, heading_lower) for pat in caption_patterns):
        return False

    # Reject headings that start with prepositions or numbers
    if re.match(r"^(of|for|in|by|with|to|from|on|at|and|or)\b", heading_lower):
        return False

    if SLIDE_MARKER_PATTERN.match(raw_heading):
        return False

    if SEMESTER_HEADING_PATTERN.match(raw_heading):
        return False

    return True

def _has_valid_content_metadata(content_str: str, content_lower: str) -> bool:
    # Reject raw simulation graphs, build/run commands, and test logs
    if any(
        term in content_lower
        for term in [
            "simulation methodology",
            "queries/minute",
            "zipf-like capacity distribution",
            "10,000 node simulation",
            "5,000 node simulation",
            "10000-node random graph",
            "go test 2>",
            "go build",
            "start a chat node with",
            "run the tests with",
        ]
    ):
        return False

    # 2. Reject Table of Contents pages containing dotted lines
    if ". . . ." in content_str or "....." in content_str:
        return False

    # Reject slide title/cover metadata, presenter lists, and PPT presentation metadata
    if re.search(r"^\d{1,2}/\d{1,2}/\d{4}\s+\d+\b", content_str) or re.search(r"\b\d{1,2}/\d{1,2}/\d{4}\b", content_str):
        return False
    if ".ppt" in content_lower or ".pptx" in content_lower or "cisco_presentation" in content_lower:
        return False

    return True

def _has_valid_content_semantics(content_lower: str) -> bool:
    # Reject ROT-1 / Caesar font-encoding artifacts from legacy PDFs
    rot1_artifacts = {"sboe", "ofx", "dpoofdujpo", "ftubcmjtife", "tfswfs", "qmbdft", "nvtu", "oet"}
    if any(tok in content_lower for tok in rot1_artifacts):
        return False

    # Reject administrative or logistics content
    if any(
        term in content_lower
        for term in [
            "due date",
            "office hours",
            "grading policy",
            "midterm exam",
            "submission link",
        ]
    ):
        return False

    return True

def _has_valid_content_preamble(content_str: str) -> bool:
    # Reject title-only or header-only preamble chunks
    non_header_lines = [
        l.strip()
        for l in content_str.splitlines()
        if l.strip() and not l.strip().startswith("#") and not l.strip().startswith("<!--")
    ]
    if not non_header_lines or sum(len(l) for l in non_header_lines) < 50:
        return False
    return True

def _has_valid_content_length(content_str: str, token_count: int) -> bool:
    if not content_str:
        return True

    if len(content_str) < 80 or token_count < 20:
        return False

    if not _has_valid_content_preamble(content_str):
        return False

    clean_text = re.sub(r"[\s\-*#=:]+", "", content_str)
    if len(clean_text) < 40:
        return False

    return True

def _has_valid_content_density(content_str: str) -> bool:
    alnum_count = sum(1 for c in content_str if c.isalnum() or c.isspace())
    if len(content_str) > 0 and (alnum_count / len(content_str)) < 0.5:
        return False
    return True

def _is_bibliography_section(content_str: str) -> bool:
    """Detect bibliography/reference list sections by citation pattern density."""
    lines = [l.strip() for l in content_str.splitlines() if l.strip()]
    if len(lines) < 5:
        return False
    cite_pattern = re.compile(r"\[\w[\w*]*\d{2,4}\]|\[\w+\s+\d{4}\]")
    cite_lines = sum(1 for l in lines if cite_pattern.search(l))
    return (cite_lines / len(lines)) > 0.4


def _is_outline_or_agenda(content_str: str) -> bool:
    """Agenda/outline slides: an 'Agenda'/'Outline' lead line followed by short
    topic bullets with no explanatory sentences."""
    lines = [
        l.strip() for l in content_str.splitlines() if l.strip() and not l.startswith("#")
    ]
    if not lines:
        return False
    lead = lines[0].lower().strip("´•-*: ")
    if lead not in {"agenda", "outline", "overview", "topics", "course outline", "lecture outline"}:
        return False
    bullets = [l for l in lines[1:] if l[0] in "´•-*"]
    return len(bullets) >= 2 and all(len(l) < 60 for l in bullets)


def _is_diagram_fragment(content_str: str) -> bool:
    """Word clouds and label-only diagram pages: many short lines with almost
    no sentence-length text (very low words per line)."""
    lines = [
        l.strip()
        for l in content_str.splitlines()
        if l.strip() and not l.startswith("#") and not l.strip().isdigit()
    ]
    if len(lines) < 6:
        return False
    total_words = sum(len(l.split()) for l in lines)
    return total_words / len(lines) < 3


def _has_valid_content(chunk: dict[str, Any]) -> bool:
    content_str = chunk.get("content", "").strip()
    content_lower = content_str.lower()
    token_count = chunk.get("token_count", 0)

    if not _has_valid_content_metadata(content_str, content_lower):
        return False

    if not _has_valid_content_semantics(content_lower):
        return False

    if _is_outline_or_agenda(content_str):
        return False

    if _is_diagram_fragment(content_str):
        return False

    if not _has_valid_content_density(content_str):
        return False

    if _is_bibliography_section(content_str):
        return False

    if not _has_valid_content_length(content_str, token_count):
        return False

    return True

def is_high_quality_chunk(chunk: dict[str, Any]) -> bool:
    """Quality Gate: Returns True if chunk has meaningful technical content; False if junk/empty."""
    if not _has_valid_file_path(chunk):
        return False
    if not _has_valid_heading(chunk):
        return False
    if not _has_valid_content(chunk):
        return False
    return True


class CoverageTracker:
    """Tracks processed courseware files and chunks to ensure zero duplicate generation."""

    def __init__(self, coverage_path: Path = DEFAULT_COVERAGE_PATH):
        self.coverage_path = coverage_path
        self.data: dict[str, Any] = self._load_coverage()

    def _load_coverage(self) -> dict[str, Any]:
        if self.coverage_path.exists():
            try:
                content = self.coverage_path.read_text(encoding="utf-8", errors="replace")
                return json.loads(content)
            except Exception:
                pass
        return {
            "metadata": {
                "created_at": datetime.now(timezone.utc).isoformat(),
                "version": "1.0.0",
            },
            "visited_files": {},
            "visited_chunk_ids": {},
        }

    def save(self) -> None:
        """Persist coverage state to JSON file."""
        self.coverage_path.parent.mkdir(parents=True, exist_ok=True)
        self.coverage_path.write_text(
            json.dumps(self.data, indent=2, ensure_ascii=False), encoding="utf-8"
        )

    def is_chunk_visited(self, file_path: str, chunk_id: str) -> bool:
        """Check if a file path or chunk ID has already been processed."""
        visited_chunks = self.data.get("visited_chunk_ids", {})
        if chunk_id in visited_chunks:
            status = visited_chunks[chunk_id].get("status")
            # Any of these statuses means the chunk has entered the pipeline
            # and should not be selected again unless explicitly reset.
            return status in (
                "generated",
                "candidate",
                "pending_import",
                "imported",
                "skipped_low_quality",
            )
        return False

    def mark_chunks_visited(
        self,
        chunks: list[dict[str, Any]],
        deck_name: str,
        status: str = "generated",
        front_htmls: dict[str, str] | None = None,
    ) -> None:
        """Mark a list of chunks as processed into Anki cards.

        Args:
            chunks: Chunks that were converted to cards.
            deck_name: Target deck name.
            status: One of "generated", "candidate", "pending_import", or "imported".
                "pending_import" is reserved for the TSV fire-and-forget flow and is
                not set by any current production caller.
            front_htmls: Mapping from chunk_id to the rendered front HTML.
        """
        now_str = datetime.now(timezone.utc).isoformat()
        visited_files = self.data.setdefault("visited_files", {})
        visited_chunks = self.data.setdefault("visited_chunk_ids", {})
        fronts = front_htmls or {}

        for chunk in chunks:
            fpath = chunk["file_path"]
            cid = chunk["chunk_id"]

            visited_files[fpath] = {
                "last_generated": now_str,
                "deck": deck_name,
            }
            entry: dict[str, Any] = {
                "generated_at": now_str,
                "heading": chunk.get("heading"),
                "deck": deck_name,
                "status": status,
            }
            if cid in fronts:
                entry["front_html"] = fronts[cid]
            visited_chunks[cid] = entry

        self.save()

    def pending_import_chunks(self) -> dict[str, dict[str, Any]]:
        """Return chunks exported to TSV but not yet verified as imported.

        Always empty in practice: no production code path sets
        `pending_import` (see anki_import_verifier.py module docstring).
        """
        visited_chunks = self.data.get("visited_chunk_ids", {})
        return {cid: info for cid, info in visited_chunks.items() if info.get("status") == "pending_import"}

    def mark_chunks_skipped(
        self, chunks: list[dict[str, Any]], reason: str = "skipped_low_quality"
    ) -> None:
        """Mark a list of low-quality or non-card-worthy chunks as audited & skipped."""
        now_str = datetime.now(timezone.utc).isoformat()
        visited_chunks = self.data.setdefault("visited_chunk_ids", {})

        for chunk in chunks:
            cid = chunk["chunk_id"]
            visited_chunks[cid] = {
                "audited_at": now_str,
                "heading": chunk.get("heading"),
                "status": reason,
            }

        self.save()

    def _calculate_chunk_priority(self, chunk: dict[str, Any], graph_bridge: AnkiGraphBridge | None = None) -> float:
        """Calculate overall selection priority for a candidate chunk.

        Combines PageRank graph hub score with directory type weighting
        (prioritizing 00-textbooks, 00-readings, 00-materials, and lecture-notes over 01-slides and homework).
        """
        fpath = chunk.get("file_path", "").lower()
        dir_weight = 0.0

        # Prioritize core textbooks, seminal research readings, and detailed primary materials
        if (
            "00-textbooks" in fpath
            or "00-readings" in fpath
            or "kurose-final-review" in fpath
            or "review-slide-lectures" in fpath
        ):
            dir_weight += 25.0
        elif "00-materials" in fpath or "01-readings" in fpath or "lecture-notes" in fpath or "04-final-paper" in fpath:
            dir_weight += 15.0
        elif "01-slides" in fpath:
            dir_weight += 0.0
        elif (
            "02-homework" in fpath
            or "03-homework" in fpath
            or "/hw" in fpath
            or "/lab" in fpath
            or "related-work" in fpath
            or "03-exams" in fpath
            or "04-finals" in fpath
        ):
            dir_weight -= 15.0

        pr_score = graph_bridge.score_chunk_pagerank(chunk) if graph_bridge else 0.0
        return dir_weight + pr_score

    def select_unvisited_chunks(
        self,
        manifest_chunks: list[dict[str, Any]],
        count: int = 5,
        graph_bridge: AnkiGraphBridge | None = None,
        review_path: Path | None = None,
    ) -> list[dict[str, Any]]:
        """Select up to `count` high-quality, unvisited chunks from manifest.

        Ranks candidates by directory priority and PageRank hub relevance, then
        penalizes sources with high historical rejection rates from the review log.
        """
        unvisited = []
        skipped_low_quality = []
        for chunk in manifest_chunks:
            fpath = chunk["file_path"]
            cid = chunk["chunk_id"]

            if self.is_chunk_visited(fpath, cid):
                continue

            if not is_high_quality_chunk(chunk):
                skipped_low_quality.append(chunk)
                continue

            unvisited.append(chunk)

        if skipped_low_quality:
            self.mark_chunks_skipped(skipped_low_quality, reason="skipped_low_quality")

        reject_rates = _load_reject_rates(review_path) if review_path else {}

        def _sort_key(c: dict[str, Any]) -> tuple[float, float]:
            course = c.get("file_path", "").split("/")[1] if "/" in c.get("file_path", "") else "unknown"
            rate = reject_rates.get(course, 0.0)
            priority = self._calculate_chunk_priority(c, graph_bridge=graph_bridge)
            return (rate, -priority)

        unvisited.sort(key=_sort_key)

        return unvisited[:count]


class SQLiteInspector:
    """Safe reader for local Anki collection.anki2 databases using temp copy pattern."""

    def __init__(self, collection_path: Path | None = None):
        self.collection_path = collection_path or self._default_collection()

    @staticmethod
    def _default_collection() -> Path | None:
        home = os.path.expanduser("~")
        candidates = glob.glob(
            os.path.join(home, "Library/Application Support/Anki2/*/collection.anki2")
        )
        if not candidates:
            return None
        return Path(max(candidates, key=os.path.getmtime))

    def get_existing_front_titles(self, deck_name: str | None = None) -> set[str]:
        """Fetch all Front field strings from notes table for a target deck."""
        if not self.collection_path or not self.collection_path.exists():
            return set()

        tmp_path = tempfile.mktemp(suffix=".anki2")
        try:
            shutil.copyfile(self.collection_path, tmp_path)
            con = sqlite3.connect(tmp_path)
            try:
                if deck_name:
                    rows = con.execute(
                        """
                        SELECT n.flds 
                        FROM cards c 
                        JOIN notes n ON c.nid = n.id 
                        JOIN decks d ON c.did = d.id 
                        WHERE d.name LIKE ?
                        """,
                        (f"%{deck_name}%",),
                    ).fetchall()
                else:
                    rows = con.execute("SELECT flds FROM notes").fetchall()

                titles = set()
                for (flds,) in rows:
                    fields = flds.split(FIELD_SEP)
                    if fields:
                        clean_title = re.sub(r"<[^>]+>", "", fields[0]).strip()
                        if clean_title:
                            titles.add(clean_title.lower())
                return titles
            finally:
                con.close()
        except Exception:
            return set()
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)


class AnkiConnectChecker:
    """Checker for active AnkiConnect REST API endpoints (http://127.0.0.1:8765)."""

    def __init__(self, url: str = "http://127.0.0.1:8765"):
        self.url = url

    def is_available(self) -> bool:
        """Check if AnkiConnect HTTP endpoint is active."""
        try:
            req = urllib.request.Request(
                self.url,
                data=json.dumps({"action": "version", "version": 6}).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                return res.get("error") is None
        except Exception:
            return False

    def check_existing_notes(self, titles: list[str], deck_name: str) -> set[str]:
        """Query findNotes via AnkiConnect for existing titles."""
        if not self.is_available():
            return set()

        existing = set()
        for title in titles:
            query = f'deck:"{deck_name}" "{title}"'
            payload = json.dumps(
                {"action": "findNotes", "version": 6, "params": {"query": query}}
            ).encode("utf-8")
            try:
                req = urllib.request.Request(
                    self.url, data=payload, headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=1.0) as resp:
                    res = json.loads(resp.read().decode("utf-8"))
                    note_ids = res.get("result", [])
                    if note_ids:
                        existing.add(title.lower())
            except Exception:
                pass
        return existing

    def _invoke(self, action: str, params: dict[str, Any] | None = None) -> Any:
        """Send a single AnkiConnect action and return its result."""
        payload: dict[str, Any] = {"action": action, "version": 6}
        if params is not None:
            payload["params"] = params
        req = urllib.request.Request(
            self.url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=5.0) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            if res.get("error"):
                raise RuntimeError(f"AnkiConnect error: {res['error']}")
            return res.get("result")

    def resolve_model_name(self, model_name: str = "Basic") -> str:
        """Map a requested note type to one that exists in the local profile.

        Anki localizes the stock model names (e.g. "Basic" becomes
        "ベーシック" in a Japanese UI), so a hardcoded "Basic" is rejected
        with "model was not found". The field names stay "Front"/"Back".
        Resolution order: exact match, then known localized aliases of the
        stock "Basic" model, then any available model whose fields are
        exactly Front/Back (the Basic shape).
        """
        available = self._invoke("modelNames") or []
        if model_name in available:
            return model_name
        if model_name == "Basic":
            basic_aliases = (
                "ベーシック",  # Japanese
                "基础", "基本",  # Chinese
                "Básico",  # Spanish / Portuguese
                "Basique",  # French
                "기본",  # Korean
                "Основная",  # Russian
                "Temel",  # Turkish
                "Podstawowa",  # Polish
                "Basis",  # German
            )
            for alias in basic_aliases:
                if alias in available:
                    return alias
        for candidate in available:
            fields = self._invoke("modelFieldNames", {"modelName": candidate})
            if fields == ["Front", "Back"]:
                return candidate
        raise RuntimeError(
            f"AnkiConnect error: no usable note type found "
            f"(wanted {model_name!r}, profile has {available!r})"
        )

    def add_notes(self, cards: list[AnkiCard], deck_name: str, model_name: str = "Basic") -> list[int | None]:
        """Dispatch addNotes API request to AnkiConnect."""
        model_name = self.resolve_model_name(model_name)
        notes_payload = []
        for card in cards:
            notes_payload.append(
                {
                    "deckName": deck_name,
                    "modelName": model_name,
                    "fields": {
                        "Front": card.front_html,
                        "Back": card.back_html,
                    },
                    "tags": card.tags,
                }
            )

        payload = json.dumps(
            {"action": "addNotes", "version": 6, "params": {"notes": notes_payload}}
        ).encode("utf-8")

        req = urllib.request.Request(
            self.url, data=payload, headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=5.0) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            if res.get("error"):
                raise RuntimeError(f"AnkiConnect error: {res['error']}")
            return res.get("result", [])


def filter_duplicate_chunks(
    chunks: list[dict[str, Any]],
    deck_name: str,
    sqlite_inspector: SQLiteInspector | None = None,
    anki_connect_checker: AnkiConnectChecker | None = None,
) -> list[dict[str, Any]]:
    """Filter out chunks whose headings match existing notes in SQLite or AnkiConnect."""
    inspector = sqlite_inspector or SQLiteInspector()
    checker = anki_connect_checker or AnkiConnectChecker()

    existing_sqlite = inspector.get_existing_front_titles(deck_name)
    headings = [c.get("heading", "") for c in chunks if c.get("heading")]
    existing_connect = checker.check_existing_notes(headings, deck_name)

    all_existing = existing_sqlite | existing_connect

    seen_headings: set[str] = set()
    filtered = []
    for c in chunks:
        heading = c.get("heading", "").lower()
        if heading and heading in all_existing:
            continue
        if heading and heading in seen_headings:
            continue
        if heading:
            seen_headings.add(heading)
        filtered.append(c)
    return filtered


class TSVExporter:
    """Exporter for Anki tab-separated package files (#separator:Tab, #html:true)."""

    def __init__(self, output_path: Path = DEFAULT_TSV_PATH):
        self.output_path = output_path

    def _sanitize_field(self, html: str) -> str:
        """Strip newlines from HTML fields for TSV export.

        Anki's TSV import treats every line as a separate card, so
        multi-line HTML in a field creates junk cards with empty backs.
        """
        return html.replace("\n", "").replace("\r", "")

    def export(self, cards: list[AnkiCard]) -> Path:
        """Export cards to a tab-separated text file for Anki import."""
        self.output_path.parent.mkdir(parents=True, exist_ok=True)
        lines = [
            "#separator:Tab",
            "#html:true",
            "#tags:research networking",
        ]
        for card in cards:
            front = self._sanitize_field(card.front_html)
            back = self._sanitize_field(card.back_html)
            tags_str = " ".join(card.tags)
            lines.append(f"{front}\t{back}\t{tags_str}")

        self.output_path.write_text("\n".join(lines), encoding="utf-8")
        return self.output_path


def _parse_tsv_rows(tsv_path: Path) -> list[tuple[str, str, list[str]]]:
    """Parse (front, back, tags) rows from a TSV package, skipping # headers."""
    rows = []
    for raw in tsv_path.read_text(encoding="utf-8").splitlines():
        if raw.startswith("#") or not raw.strip():
            continue
        parts = raw.split("\t")
        if len(parts) < 2:
            continue
        tags = parts[2].split() if len(parts) > 2 and parts[2].strip() else ["research"]
        rows.append((parts[0], parts[1], tags))
    return rows


def _tsv_sidecar_path(tsv_path: Path) -> Path:
    """Sidecar JSON mapping each TSV data row (in order) to its source chunk_id."""
    return tsv_path.with_suffix(".chunks.json")


def _existing_front_hashes(coverage_path: Path) -> set[str]:
    """Return hashes of fronts already stored in coverage (imported or draft)."""
    hashes: set[str] = set()
    if not coverage_path.exists():
        return hashes
    try:
        data = json.loads(coverage_path.read_text(encoding="utf-8"))
    except Exception:
        return hashes
    for entry in data.get("visited_chunk_ids", {}).values():
        if entry.get("front_hash"):
            hashes.add(entry["front_hash"])
        elif entry.get("front_html"):
            hashes.add(_front_hash(entry["front_html"]))
    return hashes


def _load_cards_jsonl(cards_path: Path) -> list[dict[str, Any]]:
    """Load reviewed cards from agent-authored JSONL (new contract)."""
    cards = []
    for raw in cards_path.read_text(encoding="utf-8").splitlines():
        raw = raw.strip()
        if not raw:
            continue
        card = json.loads(raw)
        for key in ("chunk_id", "front", "back"):
            if not card.get(key):
                raise ValueError(f"Card missing required field {key!r}: {card}")
        card.setdefault("tags", ["research"])
        if isinstance(card["tags"], str):
            card["tags"] = card["tags"].split()
        cards.append(card)
    return cards


def _load_tsv_cards(tsv_path: Path) -> list[dict[str, Any]]:
    """Load reviewed cards from legacy TSV + sidecar (kept for migration)."""
    sidecar_path = _tsv_sidecar_path(tsv_path)
    if not sidecar_path.exists():
        raise FileNotFoundError(f"Missing chunk sidecar {sidecar_path}")
    chunk_ids = json.loads(sidecar_path.read_text(encoding="utf-8"))
    rows = _parse_tsv_rows(tsv_path)
    if len(rows) != len(chunk_ids):
        raise ValueError(
            f"TSV has {len(rows)} data rows but sidecar tracks {len(chunk_ids)} chunks"
        )
    cards = []
    for cid, (front, back, tags) in zip(chunk_ids, rows):
        cards.append({"chunk_id": cid, "front": front, "back": back, "tags": tags})
    return cards


def import_reviewed_cards(
    deck_name: str,
    coverage_path: Path,
    cards_path: Path = DEFAULT_CARDS_PATH,
    tsv_path: Path = DEFAULT_TSV_PATH,
    review_path: Path = DEFAULT_REVIEW_PATH,
    verdicts_path: Path = DEFAULT_VERDICTS_PATH,
    force: bool = False,
) -> int:
    """Import the human/LLM-reviewed cards JSONL via AnkiConnect.

    Falls back to the legacy TSV + sidecar if no cards JSONL exists.
    This is the ONLY path from generated candidates to the deck: generation
    emits candidates, not cards, and this function refuses to import anything
    the validator flags (unless --force).
    """
    if cards_path.exists():
        cards = _load_cards_jsonl(cards_path)
        source_path = cards_path
    elif tsv_path.exists():
        try:
            cards = _load_tsv_cards(tsv_path)
        except FileNotFoundError as err:
            print(f"Legacy fallback failed: {err}")
            return 1
        except ValueError as err:
            print(f"Legacy TSV mismatch: {err}")
            return 2
        source_path = tsv_path
    else:
        print(f"No reviewed cards at {cards_path} (or legacy {tsv_path}). "
              "Run candidate generation, author cards to anki_cards.jsonl, then import.")
        return 1

    # Drop cards whose front already exists in coverage (same content = same hash).
    seen_hashes = _existing_front_hashes(coverage_path)
    unique_cards: list[dict[str, Any]] = []
    for card in cards:
        h = _front_hash(card["front"])
        if h in seen_hashes:
            print(f"  skipping duplicate front (content hash match): {card['chunk_id']}")
            continue
        seen_hashes.add(h)
        unique_cards.append(card)
    if len(unique_cards) < len(cards):
        print(f"Removed {len(cards) - len(unique_cards)} duplicate card(s) before import.")
    cards = unique_cards

    issues = validate_tsv(source_path) if str(source_path).endswith(".txt") else validate_cards(cards)
    if issues and not force:
        print(f"Validator rejects {source_path}; refusing to import:")
        for label, card_issues in issues.items():
            print(f"\n{label}:")
            for issue in card_issues:
                print(f"  - {issue}")
        print("\nRewrite or fix the flagged cards and re-run. Override with --force (not recommended).")
        return 2

    # Density gate filtering: if verdicts file exists, only import cards with decision == "accept".
    if verdicts_path and verdicts_path.exists():
        verdict_map: dict[str, str] = {}
        try:
            with open(verdicts_path, "r", encoding="utf-8") as f:
                for line in f:
                    line_str = line.strip()
                    if line_str:
                        v = json.loads(line_str)
                        if "chunk_id" in v and "decision" in v:
                            verdict_map[v["chunk_id"]] = v["decision"]
        except Exception as e:
            print(f"Warning: could not parse verdicts from {verdicts_path}: {e}")

        if verdict_map:
            accepted_cards: list[dict[str, Any]] = []
            for card in cards:
                cid = card.get("chunk_id", "")
                decision = verdict_map.get(cid, "accept")
                if decision == "accept":
                    accepted_cards.append(card)
                else:
                    print(f"  skipping card {cid} due to density verdict: {decision}")
                    _append_review_log(review_path, cid, "density_skipped")
            cards = accepted_cards

    if not cards:
        print("No cards accepted by density gate for import.")
        return 0

    checker = AnkiConnectChecker()
    if not checker.is_available():
        print("AnkiConnect is not reachable. Open Anki (with AnkiConnect installed) and retry.")
        return 1

    anki_cards = [
        AnkiCard(
            chunk_id=card["chunk_id"],
            file_path=card["chunk_id"].split(":")[0],
            heading=card["front"][:60],
            front_html=card["front"],
            back_html=card["back"],
            tags=canonicalize_tags(card["tags"]),
        )
        for card in cards
    ]

    # One bad row (e.g. a duplicate) must not sink the whole batch.
    note_ids: list[int | None] = []
    for card in anki_cards:
        try:
            ids = checker.add_notes([card], deck_name=deck_name)
            note_ids.append(ids[0] if ids else None)
        except Exception as err:
            print(f"  skipped {card.chunk_id}: {err}")
            note_ids.append(None)

    now_str = datetime.now(timezone.utc).isoformat()
    tracker = CoverageTracker(coverage_path=coverage_path)
    visited = tracker.data.setdefault("visited_chunk_ids", {})
    imported = 0
    for card, nid in zip(anki_cards, note_ids):
        if nid is None:
            continue
        entry = visited.setdefault(card.chunk_id, {})
        entry.update(
            {
                "status": "imported",
                "imported_at": now_str,
                "deck": deck_name,
                "front_html": card.front_html,
                "front_hash": _front_hash(card.front_html),
                "note_id": nid,
            }
        )
        _append_review_log(review_path, card.chunk_id, "accept", note_id=nid)
        imported += 1
    tracker.save()

    print(f"Imported {imported}/{len(cards)} reviewed cards into deck '{deck_name}'.")
    print(f"Anki Note IDs: {note_ids}")
    return 0


def emit_candidates(
    count: int,
    deck_name: str,
    manifest_path: Path,
    coverage_path: Path,
    candidates_path: Path = DEFAULT_CANDIDATES_PATH,
    review_path: Path = DEFAULT_REVIEW_PATH,
) -> int:
    """Select unvisited, dedup-filtered, quality-gated chunks and emit JSONL."""
    if not manifest_path.exists():
        print(f"Manifest not found at {manifest_path}. Run parse_chunks.py first.")
        return 1

    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    chunks = manifest_data.get("chunks", [])

    tracker = CoverageTracker(coverage_path=coverage_path)
    unresolved = [cid for cid, e in tracker.data.get("visited_chunk_ids", {}).items()
                  if e.get("status") in ("candidate", "pending_import")]
    if unresolved:
        print(f"ERROR: {len(unresolved)} chunk(s) are awaiting review/import:")
        for cid in unresolved:
            print(f"  - {cid}")
        print("Resolve them first: --import or --reject-chunk, then regenerate candidates.")
        return 2

    graph_bridge = AnkiGraphBridge(target_deck=deck_name)
    unvisited = tracker.select_unvisited_chunks(
        chunks, count=count * 3, graph_bridge=graph_bridge, review_path=review_path
    )
    selected_chunks = filter_duplicate_chunks(unvisited, deck_name)[:count]

    if not selected_chunks:
        print("No unvisited, high-quality, non-duplicate chunks found.")
        return 0

    candidates_path.parent.mkdir(parents=True, exist_ok=True)
    with candidates_path.open("w", encoding="utf-8") as fh:
        for chunk in selected_chunks:
            start = chunk.get("start_line", 1)
            end = chunk.get("end_line", start)
            file_path = chunk.get("file_path", "")
            record = {
                "chunk_id": chunk.get("chunk_id", f"{file_path}:chunk-0"),
                "file_path": file_path,
                "heading": chunk.get("heading", ""),
                "start_line": start,
                "end_line": end,
                "content": chunk.get("content", ""),
                "citation": f"{file_path}#L{start}-L{end}",
            }
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")

    tracker.mark_chunks_visited(
        selected_chunks,
        deck_name=deck_name,
        status="candidate",
    )
    print(f"Exported {len(selected_chunks)} candidate chunks to {candidates_path}")
    print("Next steps:")
    print("  1. Read candidates and author cards to research/anki_cards.jsonl")
    print("  2. python3 tools/research/anki_card_validator.py research/anki_cards.jsonl")
    print(f'  3. python3 tools/research/anki_generator.py --import --deck "{deck_name}"')

    visited_dict = tracker.data.get("visited_chunk_ids", {})
    active_path = selected_chunks[0]["file_path"] if selected_chunks else None
    CoverageProgressReporter.print_report(chunks, visited_dict, active_file_path=active_path)
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Autonomous Anki Flashcard Generation Pipeline (Phase 1-4 Complete Pipeline)."
    )
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH),
        help="Path to structural chunks manifest JSON.",
    )
    parser.add_argument(
        "--coverage",
        default=str(DEFAULT_COVERAGE_PATH),
        help="Path to persistent Anki coverage JSON.",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=5,
        help="Number of unvisited chunks to select.",
    )
    parser.add_argument(
        "--deck",
        default="金融",
        help="Target Anki deck name.",
    )
    parser.add_argument(
        "--tsv",
        action="store_true",
        help="Deprecated no-op for generation; still triggers TSV fallback in custom --front/--back path.",
    )
    parser.add_argument(
        "--tsv-path",
        default=str(DEFAULT_TSV_PATH),
        help="Legacy TSV draft path used by --import when no cards JSONL exists.",
    )
    parser.add_argument(
        "--candidates",
        action="store_true",
        help="Emit candidate chunks to research/anki_candidates.jsonl and exit.",
    )
    parser.add_argument(
        "--cards",
        default=str(DEFAULT_CARDS_PATH),
        help="Path to reviewed cards JSONL for --import (default: research/anki_cards.jsonl).",
    )
    parser.add_argument(
        "--import",
        dest="import_reviewed",
        action="store_true",
        help="Import the reviewed cards JSONL via AnkiConnect (validator-gated).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Import even when the validator reports issues (not recommended).",
    )
    parser.add_argument(
        "--reject-chunk",
        nargs="+",
        metavar="CHUNK_ID",
        default=None,
        help="Mark chunks as skipped_low_quality after review rejection.",
    )
    parser.add_argument(
        "--reason",
        default=None,
        choices=REJECT_REASONS,
        help="Required with --reject-chunk: rejection category (stored in review log).",
    )
    parser.add_argument(
        "--review-path",
        default=str(DEFAULT_REVIEW_PATH),
        help="Path to append-only review log (default: research/anki_review.jsonl).",
    )
    parser.add_argument(
        "--auto-launch",
        action="store_true",
        help="Automatically launch Anki.app if closed to enable AnkiConnect ingestion.",
    )
    parser.add_argument(
        "--front",
        default="",
        help="Custom Front field HTML/Text for Q&A card export.",
    )
    parser.add_argument(
        "--back",
        default="",
        help="Custom Back field HTML/Text for Q&A card export.",
    )
    parser.add_argument(
        "--tags",
        default="research networking",
        help="Space-separated tags for custom card export.",
    )
    parser.add_argument(
        "--verdicts",
        default=str(DEFAULT_VERDICTS_PATH),
        help="Path to density verdicts JSONL (default: research/anki_density_verdicts.jsonl).",
    )
    parser.add_argument(
        "--status",
        action="store_true",
        help="Print multi-level courseware memorization progress report and exit.",
    )
    args = parser.parse_args(argv)

    if args.import_reviewed:
        return import_reviewed_cards(
            deck_name=args.deck,
            coverage_path=Path(args.coverage).resolve(),
            cards_path=Path(args.cards).resolve(),
            tsv_path=Path(args.tsv_path).resolve(),
            review_path=Path(args.review_path).resolve(),
            verdicts_path=Path(args.verdicts).resolve(),
            force=args.force,
        )

    if args.reject_chunk:
        if not args.reason:
            parser.error("--reject-chunk requires --reason CATEGORY")
        tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())
        visited = tracker.data.setdefault("visited_chunk_ids", {})
        now_str = datetime.now(timezone.utc).isoformat()
        rejected = 0
        review_path = Path(args.review_path).resolve()
        for cid in args.reject_chunk:
            if cid in visited:
                visited[cid]["status"] = "skipped_low_quality"
                visited[cid]["audited_at"] = now_str
                visited[cid]["reason"] = args.reason
                visited[cid].pop("front_html", None)
                _append_review_log(review_path, cid, "reject", reason=args.reason)
                rejected += 1
            else:
                print(f"  unknown chunk id: {cid}")
        tracker.save()
        print(f"Marked {rejected} chunk(s) as skipped_low_quality.")
        return 0

    if args.candidates:
        return emit_candidates(
            count=args.count,
            deck_name=args.deck,
            manifest_path=Path(args.manifest).resolve(),
            coverage_path=Path(args.coverage).resolve(),
            review_path=Path(args.review_path).resolve(),
        )

    if args.status:
        manifest_path = Path(args.manifest).resolve()
        if not manifest_path.exists():
            parser.error(
                f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
            )
        manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
        chunks = manifest_data.get("chunks", [])
        tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())
        visited_dict = tracker.data.get("visited_chunk_ids", {})
        CoverageProgressReporter.print_report(chunks, visited_dict)
        accepts, decided, rate = _approve_rate(Path(args.review_path).resolve())
        if decided:
            print(f"\nApprove rate (last {decided} decisions): {rate:.1f}% ({accepts} accepted, {decided - accepts} rejected)")
        return 0

    # Custom Q&A card direct ingestion path
    if args.front and args.back:
        raw_tags = [t for t in args.tags.split() if t]
        tag_list = canonicalize_tags(raw_tags)
        dropped = [t for t in raw_tags if canonical_tag(t) is None]
        if dropped:
            print(
                f"Warning: dropping non-canonical tag(s) {dropped}; "
                "use the canonical vocabulary in anki_card_validator.CANONICAL_TAGS."
            )
        custom_card = AnkiCard(
            chunk_id="custom-qa",
            file_path="custom-qa",
            heading=args.front[:60],
            front_html=args.front,
            back_html=args.back,
            tags=tag_list if tag_list else ["research", "qa_export"],
        )
        cards = [custom_card]
        connect_checker = AnkiConnectChecker()

        if args.auto_launch and not connect_checker.is_available():
            print("Anki GUI is closed. Launching /Applications/Anki.app in background...")
            os.system("open -a Anki")
            import time

            for _ in range(10):
                time.sleep(0.5)
                if connect_checker.is_available():
                    break

        imported_via_api = False
        if not args.tsv and connect_checker.is_available():
            try:
                note_ids = connect_checker.add_notes(cards, deck_name=args.deck)
                print("🎉 CUSTOM Q&A CARD INGESTION SUCCESSFUL!")
                print(
                    f"Directly imported 1 custom Q&A card into Anki deck '{args.deck}' via AnkiConnect API."
                )
                print(f"Anki Note ID: {note_ids}")
                imported_via_api = True
            except Exception as err:
                print(
                    f"AnkiConnect import warning: {err}. Falling back to TSV package export..."
                )

        if not imported_via_api:
            exporter = TSVExporter()
            tsv_path = exporter.export(cards)
            print("Exported 1 custom Q&A card to TSV package file:")
            print(f"  Path: {tsv_path}")
            print(f"  Instructions: Run 'open -a Anki {tsv_path}' or import manually.")

        manifest_path = Path(args.manifest).resolve()
        if manifest_path.exists():
            try:
                manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
                chunks = manifest_data.get("chunks", [])
                tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())
                visited_dict = tracker.data.get("visited_chunk_ids", {})
                CoverageProgressReporter.print_report(chunks, visited_dict)
            except Exception:
                pass
        return 0

    # Default generation behavior: emit candidate chunks for the LLM to author.
    return emit_candidates(
        count=args.count,
        deck_name=args.deck,
        manifest_path=Path(args.manifest).resolve(),
        coverage_path=Path(args.coverage).resolve(),
        review_path=Path(args.review_path).resolve(),
    )


if __name__ == "__main__":
    raise SystemExit(main())
