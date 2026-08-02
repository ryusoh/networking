#!/usr/bin/env python3
"""Autonomous Anki Flashcard Generation & Ingestion Pipeline (tools/research/anki_generator.py).

Systematically converts research/ courseware into high-density Anki notes styled primarily in Chinese
with English technical terminology annotations. Enforces coverage tracking and deduplication.
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
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

DEFAULT_RESEARCH_DIR = REPO_ROOT / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"
DEFAULT_COVERAGE_PATH = DEFAULT_RESEARCH_DIR / ".anki_coverage.json"
FIELD_SEP = "\x1f"


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
        """Select up to `count` unvisited, high-density chunks from manifest."""
        unvisited = []
        for chunk in manifest_chunks:
            fpath = chunk["file_path"]
            cid = chunk["chunk_id"]

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


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Autonomous Anki Flashcard Generation Pipeline (Phase 1 Coverage & Phase 2 Deduplication)."
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
    args = parser.parse_args(argv)

    manifest_path = Path(args.manifest).resolve()
    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    chunks = manifest_data.get("chunks", [])

    tracker = CoverageTracker(coverage_path=Path(args.coverage).resolve())
    unvisited = tracker.select_unvisited_chunks(chunks, count=args.count * 2)

    filtered = filter_duplicate_chunks(unvisited, args.deck)[: args.count]

    print(f"=== ANKI COVERAGE & DEDUPLICATION REPORT ===")
    print(f"Total Chunks in Manifest: {len(chunks)}")
    print(f"Target Deck: {args.deck}")
    print(f"Selected Non-Duplicate Chunks ({len(filtered)} / {args.count}):\n")

    for idx, c in enumerate(filtered, start=1):
        print(f"{idx}. [{c['file_path']}#L{c['start_line']}-L{c['end_line']}] {c.get('heading')}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
