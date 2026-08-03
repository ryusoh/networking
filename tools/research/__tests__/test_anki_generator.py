"""Unit tests for Phase 1-4 Anki Pipeline (tools/research/anki_generator.py)."""

import sqlite3
from pathlib import Path
from tools.research.anki_generator import (
    AnkiCard,
    AnkiConnectChecker,
    CoverageTracker,
    SQLiteInspector,
    TSVExporter,
    emit_candidates,
    filter_duplicate_chunks,
    format_progress_bar,
    import_reviewed_cards,
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


def test_is_high_quality_chunk_filters_logistics_and_slide_markers():
    from tools.research.anki_generator import is_high_quality_chunk

    junk_slide = {
        "chunk_id": "c1",
        "file_path": "research/cs231/slides.md",
        "heading": "Slide (Line 142)",
        "content": "Administrative details for homework submission due date and office hours.",
        "token_count": 50,
    }
    junk_logistics = {
        "chunk_id": "c2",
        "file_path": "research/cs231/grading.md",
        "heading": "Course Grading Policy",
        "content": "The midterm exam and final exam each count for 40% of the grade.",
        "token_count": 60,
    }
    valid_tech = {
        "chunk_id": "c3",
        "file_path": "research/cs231/raft.md",
        "heading": "Raft Consensus Algorithm",
        "content": "Raft decomposes consensus into leader election, log replication, and safety guarantees.",
        "token_count": 120,
    }

    assert is_high_quality_chunk(junk_slide) is False
    assert is_high_quality_chunk(junk_logistics) is False
    assert is_high_quality_chunk(valid_tech) is True


def test_is_high_quality_chunk_allows_page_num_headings():
    """Page N headings with dense technical content must be accepted as high quality."""
    from tools.research.anki_generator import is_high_quality_chunk

    page_chunk = {
        "chunk_id": "c_page",
        "file_path": "research/cs232/kurose_ch4.md",
        "heading": "Page 15",
        "content": (
            "BGP Path Vector Protocol: Autonomous System routing policies use AS-PATH, "
            "NEXT-HOP, and Local-Pref attributes for BGP route selection."
        ),
        "token_count": 80,
    }
    assert is_high_quality_chunk(page_chunk) is True


def test_coverage_tracker_allows_multiple_chunks_per_file(tmp_path: Path):
    """Generating one chunk from a file must NOT blacklist remaining high-quality chunks in the same file."""
    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    manifest_chunks = [
        {
            "chunk_id": "file_a_chunk_1",
            "file_path": "research/cs232/ch4.md",
            "heading": "Page 1: Link State",
            "content": "Dijkstra link state algorithm computes shortest path using global LSA topology.",
            "token_count": 100,
        },
        {
            "chunk_id": "file_a_chunk_2",
            "file_path": "research/cs232/ch4.md",
            "heading": "Page 2: Distance Vector",
            "content": "Bellman-Ford distance vector algorithm computes routing tables using neighbor exchanges.",
            "token_count": 100,
        },
    ]

    # Generate card for chunk 1
    tracker.mark_chunks_visited([manifest_chunks[0]], deck_name="金融")

    # Chunk 2 from same file must still be selectable
    new_tracker = CoverageTracker(coverage_path=coverage_path)
    selected = new_tracker.select_unvisited_chunks(manifest_chunks, count=5)
    assert len(selected) == 1
    assert selected[0]["chunk_id"] == "file_a_chunk_2"


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


def test_custom_qa_card_cli_ingestion(tmp_path: Path, capsys):
    """Test custom Q&A card ingestion via --front and --back CLI flags."""
    import json
    from tools.research.anki_generator import main

    manifest_file = tmp_path / "manifest.json"
    coverage_file = tmp_path / "coverage.json"
    manifest_file.write_text(
        json.dumps({"chunks": [{"chunk_id": "c1", "file_path": "research/cs234/b4.md"}]}),
        encoding="utf-8",
    )
    coverage_file.write_text(
        json.dumps({"visited_chunk_ids": {"c1": {"status": "generated"}}}), encoding="utf-8"
    )

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
            "--manifest",
            str(manifest_file),
            "--coverage",
            str(coverage_file),
            "--tsv",
        ]
    )
    assert ret == 0
    captured = capsys.readouterr().out
    assert "Memorization Progress Report" in captured


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


def test_coverage_progress_reporter_with_dict(capsys):
    """Test CoverageProgressReporter when passed a dict with 'generated' and 'skipped_low_quality' statuses."""
    from tools.research.anki_generator import CoverageProgressReporter

    manifest_chunks = [
        {"chunk_id": "c1", "file_path": "research/cs231/00-materials/paxos.md"},
        {"chunk_id": "c2", "file_path": "research/cs231/00-materials/raft.md"},
        {"chunk_id": "c3", "file_path": "research/cs234/b4.md"},
    ]
    visited_dict = {
        "c1": {"status": "generated"},
        "c2": {"status": "skipped_low_quality"},
    }

    CoverageProgressReporter.print_report(
        manifest_chunks, visited_dict, active_file_path="research/cs231/00-materials/paxos.md"
    )
    captured = capsys.readouterr().out
    assert "Anki Courseware Memorization Progress Report" in captured
    assert "Generated: 1 cards (33.33%)" in captured
    assert "Audited/Skipped: 1 chunks (33.3%)" in captured
    assert "Unvisited: 1 chunks (33.3%)" in captured


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


def test_select_unvisited_chunks_pagerank_guided(tmp_path: Path):
    import json
    from tools.research.anki_generator import CoverageTracker
    from tools.research.anki_graph_bridge import AnkiGraphBridge

    graph_dir = tmp_path / "graph"
    graph_dir.mkdir(parents=True, exist_ok=True)
    graph_data = {
        "nodes": [
            {"id": "n1", "l": "Paxos", "course": "cs231", "d": "金融", "p": 0.85},
            {"id": "n2", "l": "Vector Clocks", "course": "cs231", "d": "金融", "p": 0.95},
        ],
    }
    (graph_dir / "graph_data.json").write_text(json.dumps(graph_data), encoding="utf-8")
    bridge = AnkiGraphBridge(target_deck="金融", repo_root=tmp_path)

    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    manifest_chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs231/seq.md",
            "heading": "Sequential Order Chunk",
            "content": "Sequential chunk with no hub links or extra technical annotations present in this test document.",
            "token_count": 100,
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "content": "Paxos consensus algorithm and replicated state machine implementation for distributed locks.",
            "token_count": 100,
        },
        {
            "chunk_id": "c3",
            "file_path": "research/cs231/vc.md",
            "heading": "Vector Clocks",
            "content": "Vector Clocks for tracking logical time and causality ordering in distributed storage.",
            "token_count": 100,
        },
    ]

    # Without graph bridge (sequential order)
    seq_selected = tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert [c["chunk_id"] for c in seq_selected] == ["c1", "c2"]

    # With PageRank-guided graph bridge (Vector Clocks 0.95 > Paxos 0.85 > Sequential 0.0)
    pr_selected = tracker.select_unvisited_chunks(manifest_chunks, count=2, graph_bridge=bridge)
    assert [c["chunk_id"] for c in pr_selected] == ["c3", "c2"]


def test_coverage_tracker_pending_import_status(tmp_path: Path):
    """TSV-exported chunks should be marked pending_import and store front_html."""
    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    chunks = [
        {
            "chunk_id": "c_pending",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
        }
    ]
    tracker.mark_chunks_visited(
        chunks,
        deck_name="TestDeck",
        status="pending_import",
        front_htmls={"c_pending": "What is B4?"},
    )

    data = tracker.data["visited_chunk_ids"]["c_pending"]
    assert data["status"] == "pending_import"
    assert data["front_html"] == "What is B4?"
    assert tracker.is_chunk_visited("research/cs234/b4.md", "c_pending")


def test_coverage_tracker_imported_status_is_visited(tmp_path: Path):
    """Imported chunks must be treated as visited so they are not regenerated."""
    coverage_path = tmp_path / ".anki_coverage.json"
    tracker = CoverageTracker(coverage_path=coverage_path)

    chunks = [
        {
            "chunk_id": "c_imported",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
        }
    ]
    tracker.mark_chunks_visited(chunks, deck_name="TestDeck", status="imported")

    selected = tracker.select_unvisited_chunks(chunks, count=1)
    assert selected == []



def test_resolve_model_name_prefers_localized_basic(monkeypatch):
    """Japanese UI localizes 'Basic' to ベーシック; the resolver must find it."""
    from tools.research.anki_generator import AnkiConnectChecker

    models = {"トリプル": ["Front", "Back"], "ベーシック": ["Front", "Back"]}
    monkeypatch.setattr(
        AnkiConnectChecker,
        "_invoke",
        lambda self, action, params=None: (
            list(models) if action == "modelNames" else models[params["modelName"]]
        ),
    )
    assert AnkiConnectChecker().resolve_model_name("Basic") == "ベーシック"


def test_resolve_model_name_shape_fallback(monkeypatch):
    """Without a known alias, any Front/Back-shaped model is acceptable."""
    from tools.research.anki_generator import AnkiConnectChecker

    models = {"クローズ": ["Text", "Extra"], "マイモデル": ["Front", "Back"]}
    monkeypatch.setattr(
        AnkiConnectChecker,
        "_invoke",
        lambda self, action, params=None: (
            list(models) if action == "modelNames" else models[params["modelName"]]
        ),
    )
    assert AnkiConnectChecker().resolve_model_name("Basic") == "マイモデル"


def _write_draft(tmp_path: Path, rows: list[str], chunk_ids: list[str]):
    import json

    tsv = tmp_path / "anki_import.txt"
    tsv.write_text("#separator:Tab\n#html:true\n" + "\n".join(rows) + "\n", encoding="utf-8")
    sidecar = tmp_path / "anki_import.chunks.json"
    sidecar.write_text(json.dumps(chunk_ids), encoding="utf-8")
    return tsv


def test_import_refuses_validator_flagged_draft(monkeypatch, tmp_path: Path):
    """A junk draft must not reach Anki even if the reviewer runs --import."""
    from tools.research.anki_generator import AnkiConnectChecker, import_reviewed_cards

    def _boom(self, cards, deck_name):
        raise AssertionError("add_notes must not be called for a flagged draft")

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", _boom)

    tsv = _write_draft(
        tmp_path,
        ["Paxos: 【Paxos】的核心技术机制、计算公式与工程应用是什么？\t<div>consensus</div>\tresearch"],
        ["research/x.md:chunk-1"],
    )
    ret = import_reviewed_cards("金融", tmp_path / "cov.json", tsv_path=tsv)
    assert ret == 2


def test_import_refuses_row_sidecar_mismatch(monkeypatch, tmp_path: Path):
    from tools.research.anki_generator import AnkiConnectChecker, import_reviewed_cards

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(
        AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [1] * len(cards)
    )

    tsv = _write_draft(
        tmp_path,
        ["拜占庭将军问题中口头消息的可解条件是什么？\t<div>n ≥ 3m+1，超过三分之二忠诚时可解。</div>\tresearch"],
        ["research/x.md:chunk-1", "research/x.md:chunk-2"],
    )
    ret = import_reviewed_cards("金融", tmp_path / "cov.json", tsv_path=tsv)
    assert ret == 2


def test_import_marks_reviewed_chunks_imported(monkeypatch, tmp_path: Path):
    """Clean reviewed rows import and flip pending_import to imported with the edited front."""
    import json

    from tools.research.anki_generator import AnkiConnectChecker, import_reviewed_cards

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [424242])

    reviewed_front = "拜占庭将军问题中口头消息的可解条件是什么？"
    tsv = _write_draft(
        tmp_path,
        [f"{reviewed_front}\t<div>超过三分之二忠诚（n ≥ 3m+1）时可解。</div>\tresearch"],
        ["research/x.md:chunk-1"],
    )
    coverage = tmp_path / "cov.json"
    coverage.write_text(
        json.dumps(
            {
                "visited_chunk_ids": {
                    "research/x.md:chunk-1": {
                        "status": "pending_import",
                        "front_html": "draft front",
                    }
                }
            }
        ),
        encoding="utf-8",
    )

    ret = import_reviewed_cards("金融", coverage, tsv_path=tsv)
    assert ret == 0
    entry = json.loads(coverage.read_text(encoding="utf-8"))["visited_chunk_ids"][
        "research/x.md:chunk-1"
    ]
    assert entry["status"] == "imported"
    assert entry["front_html"] == reviewed_front
    assert "imported_at" in entry


def test_reject_chunk_marks_skipped(tmp_path: Path):
    import json

    from tools.research.anki_generator import main

    coverage = tmp_path / "cov.json"
    coverage.write_text(
        json.dumps(
            {"visited_chunk_ids": {"research/x.md:chunk-9": {"status": "pending_import"}}}
        ),
        encoding="utf-8",
    )
    ret = main(
        [
            "--reject-chunk",
            "research/x.md:chunk-9",
            "--reason",
            "title-slide",
            "--coverage",
            str(coverage),
        ]
    )
    assert ret == 0
    entry = json.loads(coverage.read_text(encoding="utf-8"))["visited_chunk_ids"][
        "research/x.md:chunk-9"
    ]
    assert entry["status"] == "skipped_low_quality"
    assert "audited_at" in entry
    assert entry["reason"] == "title-slide"


def test_emit_candidates_writes_jsonl_and_marks_candidate(monkeypatch, tmp_path: Path):
    import json

    from tools.research import anki_generator
    from tools.research.anki_generator import emit_candidates

    monkeypatch.setattr(anki_generator, "filter_duplicate_chunks", lambda chunks, deck, **kw: chunks)

    manifest_file = tmp_path / "manifest.json"
    coverage_file = tmp_path / "cov.json"
    candidates_file = tmp_path / "anki_candidates.jsonl"
    manifest_file.write_text(
        json.dumps(
            {
                "chunks": [
                    {
                        "chunk_id": "c1",
                        "file_path": "research/cs234/b4.md",
                        "heading": "B4 Traffic Engineering",
                        "start_line": 10,
                        "end_line": 25,
                        "content": (
                            "B4 uses centralized software-defined networking control over a "
                            "wide-area network built from merchant switch silicon. The traffic "
                            "engineering system computes forwarding paths that balance capacity "
                            "against demand and reacts to link failures within seconds."
                        ),
                        "token_count": 45,
                    },
                    {
                        "chunk_id": "c2",
                        "file_path": "research/cs231/paxos.md",
                        "heading": "Paxos Consensus",
                        "start_line": 1,
                        "end_line": 5,
                        "content": (
                            "Paxos is a family of protocols for solving consensus in a network of "
                            "unreliable processors. Consensus is the process of agreeing on one "
                            "result among a group of participants, even if some fail."
                        ),
                        "token_count": 38,
                    },
                ]
            }
        ),
        encoding="utf-8",
    )
    coverage_file.write_text("{}", encoding="utf-8")

    ret = emit_candidates(
        count=2,
        deck_name="金融",
        manifest_path=manifest_file,
        coverage_path=coverage_file,
        candidates_path=candidates_file,
    )
    assert ret == 0
    assert candidates_file.exists()
    records = [json.loads(line) for line in candidates_file.read_text(encoding="utf-8").splitlines() if line.strip()]
    assert len(records) == 2
    assert records[0]["chunk_id"] == "c1"
    assert "#L10-L25" in records[0]["citation"]

    coverage = json.loads(coverage_file.read_text(encoding="utf-8"))
    assert coverage["visited_chunk_ids"]["c1"]["status"] == "candidate"
    assert coverage["visited_chunk_ids"]["c2"]["status"] == "candidate"


def test_emit_candidates_refuses_unresolved_chunks(tmp_path: Path):
    import json

    from tools.research.anki_generator import emit_candidates

    manifest_file = tmp_path / "manifest.json"
    coverage_file = tmp_path / "cov.json"
    manifest_file.write_text(json.dumps({"chunks": []}), encoding="utf-8")
    coverage_file.write_text(
        json.dumps(
            {"visited_chunk_ids": {"c1": {"status": "candidate"}}}
        ),
        encoding="utf-8",
    )
    ret = emit_candidates(
        count=1,
        deck_name="金融",
        manifest_path=manifest_file,
        coverage_path=coverage_file,
        candidates_path=tmp_path / "anki_candidates.jsonl",
    )
    assert ret == 2


def test_import_reviewed_cards_from_jsonl(monkeypatch, tmp_path: Path):
    import json

    from tools.research.anki_generator import AnkiConnectChecker, import_reviewed_cards

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [999999])

    cards_file = tmp_path / "anki_cards.jsonl"
    cards_file.write_text(
        json.dumps(
            {
                "chunk_id": "research/cs234/b4.md:chunk-1",
                "front": "拜占庭将军问题中口头消息的可解条件是什么？",
                "back": "<div>n ≥ 3m+1，超过三分之二忠诚时可解。</div>",
                "tags": ["research", "cs234"],
            },
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )
    coverage_file = tmp_path / "cov.json"
    coverage_file.write_text("{}", encoding="utf-8")

    ret = import_reviewed_cards("金融", coverage_file, cards_path=cards_file)
    assert ret == 0
    coverage = json.loads(coverage_file.read_text(encoding="utf-8"))
    entry = coverage["visited_chunk_ids"]["research/cs234/b4.md:chunk-1"]
    assert entry["status"] == "imported"
    assert entry["note_id"] == 999999
    assert entry["front_html"] == "拜占庭将军问题中口头消息的可解条件是什么？"


def test_reject_chunk_requires_reason(tmp_path: Path):
    import json

    import pytest
    from tools.research.anki_generator import main

    coverage = tmp_path / "cov.json"
    coverage.write_text(
        json.dumps(
            {"visited_chunk_ids": {"research/x.md:chunk-9": {"status": "candidate"}}}
        ),
        encoding="utf-8",
    )
    with pytest.raises(SystemExit):
        main(["--reject-chunk", "research/x.md:chunk-9", "--coverage", str(coverage)])


def test_reject_chunk_appends_review_log(tmp_path: Path):
    import json

    from tools.research.anki_generator import main

    coverage = tmp_path / "cov.json"
    review = tmp_path / "anki_review.jsonl"
    coverage.write_text(
        json.dumps(
            {"visited_chunk_ids": {"research/x.md:chunk-9": {"status": "candidate"}}}
        ),
        encoding="utf-8",
    )
    ret = main(
        [
            "--reject-chunk",
            "research/x.md:chunk-9",
            "--reason",
            "metadata-dump",
            "--coverage",
            str(coverage),
            "--review-path",
            str(review),
        ]
    )
    assert ret == 0
    lines = [l for l in review.read_text(encoding="utf-8").splitlines() if l.strip()]
    assert len(lines) == 1
    entry = json.loads(lines[0])
    assert entry["chunk_id"] == "research/x.md:chunk-9"
    assert entry["verdict"] == "reject"
    assert entry["reason"] == "metadata-dump"


def test_import_appends_accept_review_log(monkeypatch, tmp_path: Path):
    import json

    from tools.research.anki_generator import AnkiConnectChecker, main

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [111])

    cards_file = tmp_path / "anki_cards.jsonl"
    cards_file.write_text(
        json.dumps(
            {
                "chunk_id": "research/x.md:chunk-1",
                "front": "Question?",
                "back": "<div>Answer</div>",
                "tags": ["research"],
            }
        )
        + "\n",
        encoding="utf-8",
    )
    coverage = tmp_path / "cov.json"
    coverage.write_text("{}", encoding="utf-8")
    review = tmp_path / "anki_review.jsonl"

    ret = main(
        [
            "--import",
            "--deck",
            "金融",
            "--cards",
            str(cards_file),
            "--coverage",
            str(coverage),
            "--review-path",
            str(review),
        ]
    )
    assert ret == 0
    lines = [l for l in review.read_text(encoding="utf-8").splitlines() if l.strip()]
    assert len(lines) == 1
    entry = json.loads(lines[0])
    assert entry["chunk_id"] == "research/x.md:chunk-1"
    assert entry["verdict"] == "accept"
    assert entry["note_id"] == 111


def test_select_unvisited_chunks_penalizes_high_reject_rate_course(tmp_path: Path):
    """Chunks from courses with high historical rejection must be ranked later."""
    import json

    from tools.research.anki_generator import CoverageTracker

    coverage_path = tmp_path / ".anki_coverage.json"
    review_path = tmp_path / "anki_review.jsonl"
    tracker = CoverageTracker(coverage_path=coverage_path)

    manifest_chunks = [
        {
            "chunk_id": "research/cs234/b4.md:chunk-1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "content": (
                "B4 uses centralized software-defined networking traffic engineering over a "
                "wide-area network built from merchant switch silicon and optical links."
            ),
            "token_count": 100,
        },
        {
            "chunk_id": "research/cs231/paxos.md:chunk-1",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "content": (
                "Paxos is a family of protocols for solving consensus in a network of "
                "unreliable processors using proposers, acceptors, and learners."
            ),
            "token_count": 100,
        },
    ]

    # cs234 has a 100% reject rate; cs231 has a 100% accept rate.
    with review_path.open("w", encoding="utf-8") as fh:
        fh.write(
            json.dumps({"chunk_id": "research/cs234/junk.md:chunk-1", "verdict": "reject"})
            + "\n"
        )
        fh.write(
            json.dumps({"chunk_id": "research/cs231/good.md:chunk-1", "verdict": "accept"})
            + "\n"
        )

    selected = tracker.select_unvisited_chunks(
        manifest_chunks, count=2, review_path=review_path
    )
    assert [c["chunk_id"] for c in selected] == [
        "research/cs231/paxos.md:chunk-1",
        "research/cs234/b4.md:chunk-1",
    ]


def test_import_skips_duplicate_front_hash(monkeypatch, tmp_path: Path):
    """A front already stored in coverage must not be re-imported as a new note."""
    import json

    from tools.research.anki_generator import AnkiConnectChecker, import_reviewed_cards

    def _boom(self, cards, deck_name):
        raise AssertionError("add_notes must not be called for a duplicate front")

    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", _boom)

    coverage = tmp_path / "cov.json"
    coverage.write_text(
        json.dumps(
            {
                "visited_chunk_ids": {
                    "research/cs234/b4.md:chunk-1": {
                        "status": "imported",
                        "front_html": "What is B4?",
                    }
                }
            }
        ),
        encoding="utf-8",
    )

    cards_file = tmp_path / "anki_cards.jsonl"
    cards_file.write_text(
        json.dumps(
            {
                "chunk_id": "research/cs234/b4.md:chunk-2",
                "front": "What is B4?",
                "back": "<div>different back</div>",
                "tags": ["research"],
            }
        )
        + "\n",
        encoding="utf-8",
    )

    ret = import_reviewed_cards("金融", coverage, cards_path=cards_file)
    assert ret == 0
    captured = coverage.read_text(encoding="utf-8")
    assert "chunk-2" not in captured


def test_status_reports_approve_rate(tmp_path: Path, capsys):
    import json

    from tools.research.anki_generator import main

    manifest = tmp_path / "manifest.json"
    manifest.write_text(json.dumps({"chunks": []}), encoding="utf-8")
    review = tmp_path / "anki_review.jsonl"
    with review.open("w", encoding="utf-8") as fh:
        fh.write(json.dumps({"chunk_id": "a", "verdict": "accept"}) + "\n")
        fh.write(json.dumps({"chunk_id": "b", "verdict": "reject", "reason": "diagram"}) + "\n")
        fh.write(json.dumps({"chunk_id": "c", "verdict": "accept"}) + "\n")

    ret = main(
        [
            "--status",
            "--manifest",
            str(manifest),
            "--coverage",
            str(tmp_path / "cov.json"),
            "--review-path",
            str(review),
        ]
    )
    assert ret == 0
    out = capsys.readouterr().out
    assert "Approve rate" in out
    assert "66.7%" in out
