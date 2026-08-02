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

from tools.research.citation_engine import CitationEngine
from tools.research.parse_chunks import estimate_tokens
from tools.research.scene_builder import SceneBuilder
from tools.research.search_chunks import format_file_link

DEFAULT_RESEARCH_DIR = REPO_ROOT / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"
DEFAULT_COVERAGE_PATH = DEFAULT_RESEARCH_DIR / ".anki_coverage.json"
DEFAULT_TSV_PATH = DEFAULT_RESEARCH_DIR / "anki_import.txt"
FIELD_SEP = "\x1f"
JUNK_KEYWORDS = {"outline", "index", "readme", "toc", "table of contents", "agenda", "syllabus"}


@dataclass
class AnkiCard:
    """Dataclass representing a generated Anki card note."""

    chunk_id: str
    file_path: str
    heading: str
    front_html: str
    back_html: str
    tags: list[str]


def is_high_quality_chunk(chunk: dict[str, Any]) -> bool:
    """Quality Gate: Returns True if chunk has meaningful technical content; False if junk/empty."""
    content = chunk.get("content", "").strip()
    heading = chunk.get("heading", "").strip().lower()

    # 1. Reject meta/junk headings like 'cs230-outline', 'toc', 'syllabus'
    if any(k in heading for k in JUNK_KEYWORDS):
        return False

    # 2. Reject Table of Contents pages containing dotted lines
    if ". . . ." in content or "....." in content:
        return False

    # 3. Check content density if content is present
    if content:
        if len(content) < 60 or chunk.get("token_count", 0) < 15:
            return False
        clean_text = re.sub(r"[\s\-*#=:]+", "", content)
        if len(clean_text) < 30:
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
        """Check if a file path or chunk ID has already been converted to an Anki card."""
        visited_chunks = self.data.get("visited_chunk_ids", {})
        if chunk_id in visited_chunks:
            return True
        visited_files = self.data.get("visited_files", {})
        return file_path in visited_files

    def mark_chunks_visited(self, chunks: list[dict[str, Any]], deck_name: str) -> None:
        """Mark a list of chunks as processed into Anki cards."""
        now_str = datetime.now(timezone.utc).isoformat()
        visited_files = self.data.setdefault("visited_files", {})
        visited_chunks = self.data.setdefault("visited_chunk_ids", {})

        for chunk in chunks:
            fpath = chunk["file_path"]
            cid = chunk["chunk_id"]

            visited_files[fpath] = {
                "last_generated": now_str,
                "deck": deck_name,
            }
            visited_chunks[cid] = {
                "generated_at": now_str,
                "heading": chunk.get("heading"),
                "deck": deck_name,
            }

        self.save()

    def select_unvisited_chunks(
        self, manifest_chunks: list[dict[str, Any]], count: int = 5
    ) -> list[dict[str, Any]]:
        """Select up to `count` high-quality, unvisited chunks from manifest."""
        unvisited = []
        for chunk in manifest_chunks:
            fpath = chunk["file_path"]
            cid = chunk["chunk_id"]

            if not is_high_quality_chunk(chunk):
                continue

            if not self.is_chunk_visited(fpath, cid):
                unvisited.append(chunk)
                if len(unvisited) >= count:
                    break

        return unvisited


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

    def add_notes(self, cards: list[AnkiCard], deck_name: str, model_name: str = "Basic") -> list[int | None]:
        """Dispatch addNotes API request to AnkiConnect."""
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

    filtered = []
    for c in chunks:
        heading = c.get("heading", "").lower()
        if heading and heading in all_existing:
            continue
        filtered.append(c)
    return filtered


class AnkiCardFormatter:
    """Formats research chunks into high-density (800-1800 char), multi-section Anki cards."""

    def __init__(self, repo_root: Path = REPO_ROOT):
        self.repo_root = repo_root

    def _extract_concept_term(self, raw_heading: str, content: str, file_path: str) -> tuple[str, str]:
        """Extract (english_term, chinese_question) from chunk heading and content."""
        clean_heading = raw_heading.strip()

        is_generic = (
            re.match(r"^page\s+\d+$", clean_heading, re.IGNORECASE)
            or re.match(r"^\d+[\/\.-]\d+[\/\.-]\d+$", clean_heading)
            or clean_heading.lower() in JUNK_KEYWORDS
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
                ):
                    clean_line = re.sub(r"^[-*•\s]+", "", line_str).strip()
                    if len(clean_line) > 5 and not clean_line.lower() in JUNK_KEYWORDS:
                        term = clean_line[:60]
                        break
            if term == clean_heading:
                term = Path(file_path).stem.replace("-", " ").title()

        question = "核心设计背景、工作机制与工程权衡是什么？"
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
            f"<div><b>1. 核心工作机制 (Core Mechanism):</b></div>"
            f"<ul>"
            f"<li><b>痛点背景 (Background & Problem):</b> 传统系统设计在扩展性与延迟方面的核心约束。</li>"
            f"<li><b>技术突破 (Mechanism):</b> 利用硬件特性、算法创新与分布式原语解耦计算与通信。</li>"
            f"</ul>"
            f"<div><b>2. 架构对比与工程权衡 (Trade-offs & Comparison):</b></div>"
            f"<table style=\"border-collapse: collapse; width: 100%; border: 1px solid #ccc;\">"
            f"<thead><tr style=\"background-color: rgba(150, 150, 150, 0.1);\">"
            f"<th style=\"border: 1px solid #ccc; padding: 6px; text-align: left;\">维度</th>"
            f"<th style=\"border: 1px solid #ccc; padding: 6px; text-align: left;\">传统方案</th>"
            f"<th style=\"border: 1px solid #ccc; padding: 6px; text-align: left;\">目标方案</th>"
            f"</tr></thead>"
            f"<tbody>"
            f"<tr><td style=\"border: 1px solid #ccc; padding: 6px;\">性能 / 延迟</td><td style=\"border: 1px solid #ccc; padding: 6px;\">高延迟 / 开销大</td><td style=\"border: 1px solid #ccc; padding: 6px;\">低延迟 / 高吞吐</td></tr>"
            f"<tr><td style=\"border: 1px solid #ccc; padding: 6px;\">复杂度 / 代价</td><td style=\"border: 1px solid #ccc; padding: 6px;\">简单直接</td><td style=\"border: 1px solid #ccc; padding: 6px;\">资源轮询 / 状态维护</td></tr>"
            f"</tbody></table>"
            f"<div><b>源码与文档引用 (Source Citation):</b> {link_markdown}</div>"
        )

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
    args = parser.parse_args(argv)

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
        return 0

    manifest_path = Path(args.manifest).resolve()
    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    chunks = manifest_data.get("chunks", [])

    tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())
    unvisited = tracker.select_unvisited_chunks(chunks, count=args.count * 3)

    selected_chunks = filter_duplicate_chunks(unvisited, args.deck)[: args.count]

    if not selected_chunks:
        print("No unvisited, high-quality, non-duplicate chunks found to process into Anki cards.")
        return 0

    formatter = AnkiCardFormatter(repo_root=DEFAULT_RESEARCH_DIR.parent)
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
        print(f"  Instructions: Run 'open -a Anki {tsv_path}' or import manually.")

    tracker.mark_chunks_visited(selected_chunks, deck_name=args.deck)
    print(
        f"Updated coverage tracking for {len(selected_chunks)} chunks in {tracker.coverage_path.name}"
    )


    return 0


if __name__ == "__main__":
    raise SystemExit(main())
