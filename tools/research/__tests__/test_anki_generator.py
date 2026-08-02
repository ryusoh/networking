"""Unit tests for Phase 1-4 Anki Pipeline (tools/research/anki_generator.py)."""

import sqlite3
from pathlib import Path
from tools.research.anki_generator import (
    AnkiCard,
    AnkiCardFormatter,
    AnkiConnectChecker,
    CoverageTracker,
    SQLiteInspector,
    TSVExporter,
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
    ]

    selected = tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected) == 2
    assert selected[0]["chunk_id"] == "c1"

    tracker.mark_chunks_visited([manifest_chunks[0]], deck_name="TestDeck")

    new_tracker = CoverageTracker(coverage_path=coverage_path)
    selected_after = new_tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected_after) == 1
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


def test_anki_card_formatter(tmp_path: Path):
    target_file = tmp_path / "research" / "cs234" / "b4.md"
    target_file.parent.mkdir(parents=True, exist_ok=True)
    target_file.write_text("# B4 Traffic Engineering\n- Centralized SDN control WAN\n- Merchant switch silicon\n")

    chunk = {
        "chunk_id": "c1",
        "file_path": "research/cs234/b4.md",
        "heading": "B4 Traffic Engineering",
        "start_line": 1,
        "end_line": 3,
        "content": "- Centralized SDN control WAN\n- Merchant switch silicon",
    }

    formatter = AnkiCardFormatter(repo_root=tmp_path)
    card = formatter.format_card(chunk)

    assert "B4 Traffic Engineering:" in card.front_html
    assert "核心设计背景" in card.front_html
    assert "<b>1. 核心工作机制 (Core Mechanism):</b>" in card.back_html
    assert "<table" in card.back_html
    assert "Centralized SDN control WAN" in card.back_html
    assert "research" in card.tags


def test_tsv_exporter(tmp_path: Path):
    tsv_file = tmp_path / "anki_import.txt"
    exporter = TSVExporter(output_path=tsv_file)

    cards = [
        AnkiCard(
            chunk_id="c1",
            file_path="research/cs234/b4.md",
            heading="B4",
            front_html="<strong>B4 WAN</strong>",
            back_html="<div>Centralized TE</div>",
            tags=["research", "cs234"],
        )
    ]

    path = exporter.export(cards)
    assert path.exists()

    content = path.read_text(encoding="utf-8")
    assert "#separator:Tab" in content
    assert "#html:true" in content
    assert "<strong>B4 WAN</strong>\t<div>Centralized TE</div>\tresearch cs234" in content
