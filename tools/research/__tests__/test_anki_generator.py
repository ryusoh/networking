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
    format_progress_bar,
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


def test_coverage_tracker_records_skipped_low_quality_chunks(tmp_path: Path):
    """Low quality chunks must be marked as audited & skipped in coverage JSON."""
    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    manifest_chunks = [
        {
            "chunk_id": "c_junk",
            "file_path": "research/cs230/outline.md",
            "heading": "Course Outline / Table of Contents",
            "content": ". . . . . . . .",
        },
        {
            "chunk_id": "c_valid",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "content": "Centralized SDN WAN architecture with software-based TE and Paxos state machines.",
            "token_count": 150,
        },
    ]

    selected = tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected) == 1
    assert selected[0]["chunk_id"] == "c_valid"

    # Verify junk chunk was recorded as skipped_low_quality
    visited = tracker.data.get("visited_chunk_ids", {})
    assert "c_junk" in visited
    assert visited["c_junk"]["status"] == "skipped_low_quality"


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


def test_format_progress_bar_fixed_width():
    """All progress bars must have identical character width regardless of fill %."""
    bar_0 = format_progress_bar(0, 100)
    bar_half = format_progress_bar(5, 8)
    bar_full = format_progress_bar(100, 100)
    bar_tiny = format_progress_bar(17, 13122)

    # Extract the bracket-enclosed portion [....]
    import re
    def bar_inner(s):
        m = re.search(r'\[(.+?)\]', s)
        assert m, f"No bracketed bar found in: {s}"
        return m.group(1)

    inner_0 = bar_inner(bar_0)
    inner_half = bar_inner(bar_half)
    inner_full = bar_inner(bar_full)
    inner_tiny = bar_inner(bar_tiny)

    assert len(inner_0) == 40, f"Expected width 40, got {len(inner_0)}"
    assert len(inner_half) == 40, f"Expected width 40, got {len(inner_half)}"
    assert len(inner_full) == 40, f"Expected width 40, got {len(inner_full)}"
    assert len(inner_tiny) == 40, f"Expected width 40, got {len(inner_tiny)}"

    # Verify they use consistent characters (━ and ─, not mixed █/░)
    assert '━' * 25 in inner_half  # 5/8 = 62.5% of 40 = 25
    assert '─' * 15 in inner_half
    assert '━' not in inner_0  # 0% filled
    assert '─' not in inner_full  # 100% filled


def test_tsv_exporter_strips_newlines_from_html(tmp_path: Path):
    """Multi-line HTML in front/back must be flattened to single-line TSV.

    Anki's TSV import treats every line as a separate card.  If back_html
    contains literal newlines, one card becomes N junk cards (most with
    empty backs).  Regression test for the 27-junk-card bug.
    """
    tsv_file = tmp_path / "anki_import.txt"
    exporter = TSVExporter(output_path=tsv_file)

    multiline_back = (
        "<div><b>Title</b></div>\n"
        "<ul>\n"
        "<li>Point A</li>\n"
        "<li>Point B</li>\n"
        "</ul>\n"
        "<table>\n"
        "<tr><td>Col1</td><td>Col2</td></tr>\n"
        "</table>"
    )
    cards = [
        AnkiCard(
            chunk_id="c1",
            file_path="research/test.md",
            heading="Test",
            front_html="Question\nwith newline?",
            back_html=multiline_back,
            tags=["research"],
        ),
        AnkiCard(
            chunk_id="c2",
            file_path="research/test2.md",
            heading="Test2",
            front_html="Second card",
            back_html="<div>Simple</div>",
            tags=["research"],
        ),
    ]

    path = exporter.export(cards)
    content = path.read_text(encoding="utf-8")
    lines = content.strip().split("\n")

    # 3 header lines + 2 card lines = 5 total
    header_lines = [l for l in lines if l.startswith("#")]
    data_lines = [l for l in lines if not l.startswith("#")]
    assert len(header_lines) == 3, f"Expected 3 headers, got {len(header_lines)}"
    assert len(data_lines) == 2, (
        f"Expected exactly 2 data lines (one per card), got {len(data_lines)}. "
        f"Newlines in HTML are leaking into the TSV."
    )

    # Each data line must have exactly 2 tabs (front\tback\ttags)
    for i, line in enumerate(data_lines):
        tab_count = line.count("\t")
        assert tab_count == 2, (
            f"Data line {i} has {tab_count} tabs, expected 2 (front\\tback\\ttags)"
        )

    # Verify HTML content is preserved (just flattened)
    assert "<li>Point A</li>" in data_lines[0]
    assert "<table>" in data_lines[0]


def test_custom_qa_card_cli_ingestion(tmp_path: Path):
    """Test custom Q&A card ingestion via --front and --back CLI flags."""
    from tools.research.anki_generator import main

    tsv_file = tmp_path / "anki_import.txt"
    ret = main(
        [
            "--front",
            "<strong>Custom Concept</strong>: Core Question?",
            "--back",
            "<div>Detailed Answer</div>",
            "--deck",
            "金融",
            "--tags",
            "research cs234 custom_qa",
            "--tsv",
        ]
    )
    assert ret == 0


def test_custom_qa_card_ankiconnect(monkeypatch, tmp_path: Path):
    """Test custom Q&A card ingestion via mocked AnkiConnect API."""
    from tools.research.anki_generator import AnkiConnectChecker, main

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [123456])

    ret = main(
        [
            "--front",
            "<strong>Paxos Consensus</strong>: How does Multi-Paxos work?",
            "--back",
            "<div>Leader election + Log replication</div>",
            "--deck",
            "金融",
        ]
    )
    assert ret == 0


def test_coverage_progress_reporter(capsys):
    from tools.research.anki_generator import CoverageProgressReporter

    manifest_chunks = [
        {"chunk_id": "c1", "file_path": "research/cs231/00-materials/paxos.md"},
        {"chunk_id": "c2", "file_path": "research/cs231/00-materials/raft.md"},
        {"chunk_id": "c3", "file_path": "research/cs234/b4.md"},
    ]
    visited_ids = {"c1"}

    CoverageProgressReporter.print_report(
        manifest_chunks, visited_ids, active_file_path="research/cs231/00-materials/paxos.md"
    )
    captured = capsys.readouterr().out
    assert "Anki Courseware Memorization Progress Report" in captured
    assert "Submodule : cs231/00-materials" in captured
    assert "Course    : cs231" in captured
    assert "Global    : research/" in captured
    assert "50.0%" in captured


def test_anki_generator_status_flag(tmp_path: Path, capsys):
    import json
    from tools.research.anki_generator import main

    manifest_file = tmp_path / "manifest.json"
    coverage_file = tmp_path / "coverage.json"

    manifest_file.write_text(
        json.dumps({"chunks": [{"chunk_id": "c1", "file_path": "research/cs231/paxos.md"}]}),
        encoding="utf-8",
    )
    coverage_file.write_text(
        json.dumps({"visited_chunk_ids": {"c1": {"status": "generated"}}}), encoding="utf-8"
    )

    ret = main(["--manifest", str(manifest_file), "--coverage", str(coverage_file), "--status"])
    assert ret == 0
    captured = capsys.readouterr().out
    assert "Memorization Progress Report" in captured

