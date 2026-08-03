#!/usr/bin/env python3
"""Autonomous Anki Flashcard Generation & Ingestion Pipeline (tools/research/anki_generator.py).

Systematically converts research/ courseware into high-density Anki notes styled primarily in Chinese
with English technical terminology annotations. Enforces coverage tracking, quality filtering, and deduplication.
"""

from __future__ import annotations

import argparse
import glob
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

from tools.research.anki_graph_bridge import AnkiGraphBridge
from tools.research.citation_engine import CitationEngine
from tools.research.parse_chunks import estimate_tokens
from tools.research.scene_builder import SceneBuilder
from tools.research.search_chunks import format_file_link

DEFAULT_RESEARCH_DIR = REPO_ROOT / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"
DEFAULT_COVERAGE_PATH = DEFAULT_RESEARCH_DIR / ".anki_coverage.json"
DEFAULT_TSV_PATH = DEFAULT_RESEARCH_DIR / "anki_import.txt"
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
    # 4. Reject non-documentation code files and binaries (.py, .c, .sh, .gns3, .png, .jpg)
    # Also reject README files, sample code repositories, test runners, and tutorial apps
    if not fpath.endswith((".md", ".txt", ".rst")):
        return False
    if (
        fpath.endswith(("readme.md", "readme.txt", "readme"))
        or "/sample-program/" in fpath
        or "/tests/" in fpath
        or "/test/" in fpath
        or "/gpac-temp/" in fpath
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


def _has_valid_content(chunk: dict[str, Any]) -> bool:
    content_str = chunk.get("content", "").strip()
    content_lower = content_str.lower()
    token_count = chunk.get("token_count", 0)

    if not _has_valid_content_metadata(content_str, content_lower):
        return False

    if not _has_valid_content_semantics(content_lower):
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
            # generated, pending_import, imported, and skipped all count as visited
            return status in ("generated", "pending_import", "imported", "skipped_low_quality")
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
            status: One of "generated", "pending_import", or "imported".
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
        """Return chunks that have been exported to TSV but not yet verified as imported."""
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
        (prioritizing 01-slides and 00-materials over 02-homework).
        """
        fpath = chunk.get("file_path", "").lower()
        dir_weight = 0.0

        # Prioritize core slides, textbook review chapters, and primary materials
        if "kurose-final-review" in fpath or "review-slide-lectures" in fpath or "01-slides" in fpath or "00-materials" in fpath:
            dir_weight += 10.0
        elif "01-readings" in fpath or "lecture-notes" in fpath:
            dir_weight += 5.0
        elif "02-homework" in fpath or "03-homework" in fpath or "/hw" in fpath or "/lab" in fpath or "related-work" in fpath:
            dir_weight -= 10.0

        pr_score = graph_bridge.score_chunk_pagerank(chunk) if graph_bridge else 0.0
        return dir_weight + pr_score

    def select_unvisited_chunks(
        self,
        manifest_chunks: list[dict[str, Any]],
        count: int = 5,
        graph_bridge: AnkiGraphBridge | None = None,
    ) -> list[dict[str, Any]]:
        """Select up to `count` high-quality, unvisited chunks from manifest.

        Ranks candidates by directory priority and PageRank hub relevance (Vector 1).
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

        unvisited.sort(
            key=lambda c: self._calculate_chunk_priority(c, graph_bridge=graph_bridge),
            reverse=True,
        )

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


class AnkiCardFormatter:
    """Formats research chunks into high-density (800-1800 char), multi-section Anki cards."""

    def __init__(
        self,
        repo_root: Path = REPO_ROOT,
        graph_bridge: AnkiGraphBridge | None = None,
    ):
        self.repo_root = repo_root
        self.graph_bridge = graph_bridge or AnkiGraphBridge()

    def _extract_concept_term(self, raw_heading: str, content: str, file_path: str) -> tuple[str, str]:
        """Extract (english_term, chinese_question) from chunk heading and content."""
        clean_heading = re.sub(r"^(of|for|in|by|with|to|from|on|at|and|or)\b\s*", "", raw_heading.strip(), flags=re.IGNORECASE)
        clean_heading = re.sub(r"[:\(\)]+", "", clean_heading).strip()

        is_generic = (
            re.match(r"^page\s+\d+$", clean_heading, re.IGNORECASE)
            or re.match(r"^\d+[\/\.-]\d+[\/\.-]\d+$", clean_heading)
            or clean_heading.lower() in JUNK_KEYWORDS
            or clean_heading.lower() in {"bytes", "bits", "answer rrs", "answer", "rrs", "question", "questions"}
            or re.match(r"^\d+\s+", clean_heading)
            or len(clean_heading) < 6
        )

        term = clean_heading
        if is_generic:
            for line in content.splitlines():
                line_str = line.strip()
                if (
                    line_str
                    and not line_str.startswith("#")
                    and not line_str.startswith("<!--")
                    and not re.match(r"^\d+[\/\.-]\d+[\/\.-]\d+$", line_str)
                    and not re.match(r"^\d+$", line_str)
                    and not SEMESTER_HEADING_PATTERN.match(line_str)
                    and not re.match(r"^[A-Z]{2,5}\s+\d{3}[A-Z]?\s", line_str)
                ):
                    clean_line = re.sub(r"^[-*•\d\.\s]+", "", line_str).strip()
                    clean_line = re.sub(r"^(of|for|in|by|with|to|from|on|at|and|or)\b\s*", "", clean_line, flags=re.IGNORECASE)
                    if len(clean_line) > 8 and not clean_line.lower() in JUNK_KEYWORDS:
                        term = clean_line[:60]
                        break
            if term == clean_heading or len(term) < 5:
                term = Path(file_path).stem.replace("-", " ").title()

        content_lower = content.lower()
        if ("erlang b" in content_lower or "erlang c" in content_lower or ("erlang" in content_lower and "blocking" in content_lower)) and "gnutella" not in content_lower:
            term = "Erlang B vs Erlang C Queueing Models"
            question = "在呼叫/数据包阻塞系统中，Erlang B 公式与 Poisson 到达模型如何计算拒绝概率 (Blocking Probability)？"
        elif "dns" in content_lower and ("resource record" in content_lower or "cname" in content_lower or "authoritative" in content_lower) and "gnutella" not in content_lower:
            term = "DNS Protocol & Resource Records (RR)"
            question = "DNS 报文首部 16 位标志位、4 大 RR 记录类型 (A, NS, CNAME, MX) 与 4 个 Length 字段的物理意义与解析机制是什么？"
        elif ("sliding window" in content_lower or "sendbase" in content_lower) and "tcp" in content_lower:
            term = "TCP Sliding Window & Flow Control"
            question = "滑动窗口协议（Sliding Window Protocol）中发送方与接收方在 ACK 确认与 Timer 重传时的状态转换逻辑是什么？"
        elif "chord" in content_lower and ("finger table" in content_lower or "stabilize" in content_lower):
            term = "Chord DHT Finger Table & Node Join"
            question = "Chord 环中路由表 Finger Table 的索引计算公式、O(log N) 查询复杂度与节点动态加入 (Stabilization) 机制是什么？"
        elif "bgp" in content_lower and ("as-path" in content_lower or "local-pref" in content_lower):
            term = "BGP Path Vector Protocol & Routing Policy"
            question = "边界网关协议 (BGP) 的关键属性 (AS-PATH, NEXT-HOP, Local-Pref, MED) 及 4 级选路优先级决策链逻辑是什么？"
        elif "bandwidth" in content_lower and "harmonics" in content_lower:
            question = "模拟带宽 (Analog Bandwidth in Hz) 与数字信道最大数据率 (Digital Bandwidth in bps) 在物理层中是如何关联的？"
        elif file_path.endswith(".py"):
            filename = Path(file_path).name
            question = f"在套接字编程 ({filename}) 中，TCP Socket 的初始化、绑定与异常处理逻辑是如何实现的？"
        elif file_path.endswith(".c"):
            filename = Path(file_path).name
            question = f"C 语言网络工具 ({filename}) 中，系统调用与底层 I/O 机制是如何处理网络数据的？"
        else:
            question = f"【{term}】的核心技术机制、计算公式与工程应用是什么？"

        return term, question

    def format_card(self, chunk: dict[str, Any]) -> AnkiCard:
        """Render a single chunk into a high-density, multi-section AnkiCard object (800-1800 chars)."""
        raw_heading = chunk.get("heading", "System Concept")
        file_path = chunk["file_path"]
        start_line = chunk["start_line"]
        end_line = chunk["end_line"]
        content = chunk.get("content", "")

        module_name = file_path.split("/")[1] if "/" in file_path else "research"
        term, question = self._extract_concept_term(raw_heading, content, file_path)

        # Plain text Front field without HTML tags, brackets, or emojis
        front_text = f"{term}: {question}"

        link_markdown = format_file_link(self.repo_root, file_path, start_line, end_line)

        raw_lines = [l.strip() for l in content.splitlines() if l.strip() and not l.startswith("#")]
        
        # Build comprehensive multi-section Back content
        paragraphs = []
        for line in raw_lines:
            clean_line = re.sub(r"^[-*•\s]+", "", line).strip()
            if clean_line:
                paragraphs.append(clean_line)

        body_text = " ".join(paragraphs) if paragraphs else "系统核心架构与分布式机制解析。"

        back_html = (
            f"<div><b>定义与物理意义 (Definition & Physical Meaning):</b></div>"
            f"<div>{body_text}</div>"
        )

        # Extract structured points from raw lines if bullet points exist
        bullet_lines = [
            re.sub(r"^[-*•\s]+", "", l).strip()
            for l in raw_lines
            if l.startswith("-") or l.startswith("*") or l.startswith("•")
        ]
        clean_bullets = [b for b in bullet_lines if b]
        if clean_bullets:
            items_html = "".join(f"<li>{bl}</li>" for bl in clean_bullets[:5])
            back_html += f"<div><b>核心工作机制 (Core Mechanism):</b></div><ul>{items_html}</ul>"

        hubs = self.graph_bridge.get_related_hubs(content)
        if hubs:
            hub_labels = ", ".join(h[0] for h in hubs)
            back_html += (
                f'<div class="related-concepts"><b>关联知识图谱 Hub (Related Concepts):</b> {hub_labels}</div>'
            )

        back_html += f"<div><b>源码与文档引用 (Source Citation):</b> {link_markdown}</div>"

        tags = ["research", module_name.replace("-", "_")]

        return AnkiCard(
            chunk_id=chunk["chunk_id"],
            file_path=file_path,
            heading=term,
            front_html=front_text,
            back_html=back_html,
            tags=tags,
        )


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
        help="Force export to TSV package file instead of AnkiConnect API.",
    )
    parser.add_argument(
        "--auto-launch",
        action="store_true",
        help="Automatically launch Anki.app if closed to enable 100% automated AnkiConnect ingestion.",
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
        "--status",
        action="store_true",
        help="Print multi-level courseware memorization progress report and exit.",
    )
    args = parser.parse_args(argv)

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
        return 0

    # Custom Q&A card direct ingestion path
    if args.front and args.back:
        tag_list = [t for t in args.tags.split() if t]
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

    manifest_path = Path(args.manifest).resolve()
    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    chunks = manifest_data.get("chunks", [])

    graph_bridge = AnkiGraphBridge(target_deck=args.deck)
    tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())

    pending = tracker.pending_import_chunks()
    if pending:
        print(
            f"WARNING: {len(pending)} chunk(s) were previously exported to TSV but not yet verified as imported."
        )
        print("Run: python3 tools/research/anki_import_verifier.py")
        print("or confirm the TSV import in Anki before generating more cards to avoid duplicates.")

    unvisited = tracker.select_unvisited_chunks(
        chunks, count=args.count * 3, graph_bridge=graph_bridge
    )

    selected_chunks = filter_duplicate_chunks(unvisited, args.deck)[: args.count]

    if not selected_chunks:
        print("No unvisited, high-quality, non-duplicate chunks found to process into Anki cards.")
        return 0

    formatter = AnkiCardFormatter(
        repo_root=DEFAULT_RESEARCH_DIR.parent, graph_bridge=graph_bridge
    )
    cards = [formatter.format_card(c) for c in selected_chunks]

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
            print(f"🎉 100% AUTOMATED INGESTION SUCCESSFUL!")
            print(
                f"Directly imported {len(cards)} cards into Anki deck '{args.deck}' via AnkiConnect API."
            )
            print(f"Anki Note IDs: {note_ids}")
            imported_via_api = True
        except Exception as err:
            print(f"AnkiConnect import warning: {err}. Falling back to TSV package export...")

    if not imported_via_api:
        exporter = TSVExporter()
        tsv_path = exporter.export(cards)
        print(f"Exported {len(cards)} high-density cards to TSV package file:")
        print(f"  Path: {tsv_path}")
        if args.auto_launch:
            print(f"Auto-launching Anki to import TSV file: {tsv_path}")
            os.system(f"open -a Anki '{tsv_path}'")
        else:
            print(f"  Instructions: Run 'open -a Anki {tsv_path}' or import manually.")

    front_htmls = {card.chunk_id: card.front_html for card in cards}
    import_status = "imported" if imported_via_api else "pending_import"
    tracker.mark_chunks_visited(
        selected_chunks,
        deck_name=args.deck,
        status=import_status,
        front_htmls=front_htmls,
    )
    print(
        f"Updated coverage tracking for {len(selected_chunks)} chunks in {tracker.coverage_path.name}"
    )

    visited_dict = tracker.data.get("visited_chunk_ids", {})
    active_path = selected_chunks[0]["file_path"] if selected_chunks else None
    CoverageProgressReporter.print_report(chunks, visited_dict, active_file_path=active_path)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
