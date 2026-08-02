"""Unit tests for Phase 1 & Phase 2 Anki Pipeline (tools/research/anki_generator.py)."""

import sqlite3
from pathlib import Path
from tools.research.anki_generator import (
    AnkiConnectChecker,
    CoverageTracker,
    SQLiteInspector,
    filter_duplicate_chunks,
)


def test_coverage_tracker_filters_visited_chunks(tmp_path: Path):
    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    manifest_chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "start_line": 1,
            "end_line": 50,
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "start_line": 1,
            "end_line": 40,
        },
        {
            "chunk_id": "c3",
            "file_path": "research/cs232/cache.md",
            "heading": "Cache Invalidation",
            "start_line": 1,
            "end_line": 30,
        },
    ]

    selected = tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected) == 2
    assert selected[0]["chunk_id"] == "c1"

    tracker.mark_chunks_visited([manifest_chunks[0]], deck_name="TestDeck")

    new_tracker = CoverageTracker(coverage_path=coverage_path)
    selected_after = new_tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected_after) == 2
    assert selected_after[0]["chunk_id"] == "c2"


def test_sqlite_inspector_reads_existing_notes(tmp_path: Path):
    db_path = tmp_path / "collection.anki2"
    con = sqlite3.connect(db_path)
    con.execute("CREATE TABLE decks (id INTEGER PRIMARY KEY, name TEXT);")
    con.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, flds TEXT);")
    con.execute("CREATE TABLE cards (id INTEGER PRIMARY KEY, nid INTEGER, did INTEGER);")

    con.execute("INSERT INTO decks VALUES (1, 'TestDeck');")
    con.execute("INSERT INTO notes VALUES (10, 'NAPI\x1fExtra content');")
    con.execute("INSERT INTO cards VALUES (100, 10, 1);")
    con.commit()
    con.close()

    inspector = SQLiteInspector(collection_path=db_path)
    titles = inspector.get_existing_front_titles("TestDeck")
    assert "napi" in titles


def test_filter_duplicate_chunks(tmp_path: Path):
    db_path = tmp_path / "collection.anki2"
    con = sqlite3.connect(db_path)
    con.execute("CREATE TABLE decks (id INTEGER PRIMARY KEY, name TEXT);")
    con.execute("CREATE TABLE notes (id INTEGER PRIMARY KEY, flds TEXT);")
    con.execute("CREATE TABLE cards (id INTEGER PRIMARY KEY, nid INTEGER, did INTEGER);")

    con.execute("INSERT INTO decks VALUES (1, 'TestDeck');")
    con.execute("INSERT INTO notes VALUES (10, 'B4 Traffic Engineering\x1fExtra');")
    con.execute("INSERT INTO cards VALUES (100, 10, 1);")
    con.commit()
    con.close()

    chunks = [
        {"chunk_id": "c1", "heading": "B4 Traffic Engineering", "file_path": "f1.md"},
        {"chunk_id": "c2", "heading": "Paxos Consensus", "file_path": "f2.md"},
    ]

    inspector = SQLiteInspector(collection_path=db_path)
    checker = AnkiConnectChecker(url="http://127.0.0.1:99999")  # inactive port

    filtered = filter_duplicate_chunks(
        chunks, "TestDeck", sqlite_inspector=inspector, anki_connect_checker=checker
    )

    assert len(filtered) == 1
    assert filtered[0]["chunk_id"] == "c2"
