"""End-to-End (E2E) Integration Test for Research Agent & Anki Pipeline.

Executes the complete end-to-end workflow across Phases 1 through 5 and the
inverted Anki pipeline (code emits candidates, LLM authors cards, code imports).
"""

import json
from pathlib import Path

from tools.research.anki_generator import (
    AnkiConnectChecker,
    CoverageTracker,
    TSVExporter,
    emit_candidates,
    filter_duplicate_chunks,
    import_reviewed_cards,
)
from tools.research.citation_engine import CitationEngine
from tools.research.memory_host import MemoryHost
from tools.research.parse_chunks import build_chunks_manifest
from tools.research.scene_builder import SceneBuilder
from tools.research.search_chunks import BM25Indexer


def test_complete_research_agent_and_anki_pipeline_e2e(monkeypatch, tmp_path: Path):
    # Setup temporary courseware structure
    research_dir = tmp_path / "research"
    course_dir = research_dir / "cs234-advanced-networks"
    course_dir.mkdir(parents=True, exist_ok=True)

    sample_doc1 = course_dir / "b4-wan.md"
    sample_doc1.write_text(
        "# B4: Software-Defined WAN\n\n"
        "## Overview\n"
        "Google B4 is a globally-deployed Software Defined WAN connecting data centers.\n"
        "B4 uses merchant switch silicon and centralized Traffic Engineering (TE).\n"
    )

    sample_doc2 = course_dir / "paxos-consensus.md"
    sample_doc2.write_text(
        "# Paxos Agreement Protocol Overview\n\n"
        "Paxos reaches consensus across distributed systems with fault-tolerant acceptors and proposers.\n\n"
        "## Consensus Algorithm Details\n"
        "Paxos reaches consensus over unreliable network channels using 2-phase rounds (Phase 1a/1b and Phase 2a/2b).\n"
    )

    # 1. Phase 1: Structural Parsing
    manifest = build_chunks_manifest(research_dir, tmp_path)
    manifest_path = tmp_path / ".chunks_manifest.json"
    manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
    chunks = manifest["chunks"]
    assert len(chunks) == 4

    # 2. Phase 2: BM25 Lexical Search
    indexer = BM25Indexer(chunks)
    search_results = indexer.score("Traffic Engineering OpenFlow")
    assert len(search_results) > 0
    top_chunk, score = search_results[0]
    assert "B4" in top_chunk["heading"] or "Overview" in top_chunk["heading"]

    # 3. Phase 3: Scene Assembly & Token Governor
    builder = SceneBuilder(chunks, repo_root=tmp_path)
    scene = builder.build_scene("Software Defined WAN", max_tokens=1000, top_k=2)
    assert scene["chunk_count"] > 0
    assert "MANDATORY CITATION CONTRACT" in scene["markdown_payload"]

    # 4. Phase 4: Citation Verification Engine
    citation_engine = CitationEngine(repo_root=tmp_path)
    report = citation_engine.verify_text(scene["markdown_payload"])
    assert report["is_valid"] is True
    assert report["total_citations"] > 0

    # 5. Phase 5: Durable Memory & Mastery Matrix
    memory_path = research_dir / ".durable_memory.json"
    memory_host = MemoryHost(memory_path=memory_path)
    memory_host.record_mastery("student1", "cs234-advanced-networks", "b4_sdn", 0.92)
    memory_report = memory_host.get_student_report("student1")
    assert memory_report["average_mastery"] == 0.92

    # 6. Inverted Anki Pipeline: candidates -> authored cards -> import
    coverage_path = research_dir / ".anki_coverage.json"
    coverage_tracker = CoverageTracker(coverage_path=coverage_path)

    # Select unvisited chunks
    unvisited = coverage_tracker.select_unvisited_chunks(chunks, count=2)
    assert len(unvisited) == 2

    # Deduplication check
    non_duplicates = filter_duplicate_chunks(unvisited, deck_name="TestDeck")
    assert len(non_duplicates) == 2

    # Emit candidates JSONL
    candidates_path = research_dir / "anki_candidates.jsonl"
    ret = emit_candidates(
        count=2,
        deck_name="TestDeck",
        manifest_path=tmp_path / ".chunks_manifest.json",
        coverage_path=coverage_path,
        candidates_path=candidates_path,
    )
    assert ret == 0
    assert candidates_path.exists()

    # LLM authors cards (simulated here by reading candidates and writing cards)
    cards_path = research_dir / "anki_cards.jsonl"
    candidates = [json.loads(line) for line in candidates_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    with cards_path.open("w", encoding="utf-8") as fh:
        for cand in candidates:
            card = {
                "chunk_id": cand["chunk_id"],
                "front": f"{cand['heading']} (English Term): what is the core mechanism?",
                "back": (
                    f"<div><b>定义 (Definition):</b></div><div><b>{cand['heading']}</b> explanation.</div>"
                    f"<div><b>机制 (Mechanism):</b></div><div><b>Term</b> details based on {cand['content']}.</div>"
                    f"<div><b>源码与文档引用 (Source Citation):</b> [{cand['citation']}](file:///tmp/x.md)</div>"
                ),
                "tags": ["research", "cs234"],
                "citation": cand["citation"],
            }
            fh.write(json.dumps(card, ensure_ascii=False) + "\n")

    # Mock AnkiConnect and import
    monkeypatch.setattr(AnkiConnectChecker, "is_available", lambda self: True)
    monkeypatch.setattr(AnkiConnectChecker, "add_notes", lambda self, cards, deck_name: [12345])

    ret = import_reviewed_cards("TestDeck", coverage_path, cards_path=cards_path)
    assert ret == 0
    coverage = json.loads(coverage_path.read_text(encoding="utf-8"))
    assert coverage["visited_chunk_ids"][candidates[0]["chunk_id"]]["status"] == "imported"
    assert coverage["visited_chunk_ids"][candidates[0]["chunk_id"]]["note_id"] == 12345

    # TSVExporter is still available for manual fallback
    tsv_path = research_dir / "anki_import.txt"
    from tools.research.anki_generator import AnkiCard

    exporter = TSVExporter(output_path=tsv_path)
    export_file = exporter.export(
        [
            AnkiCard(
                chunk_id="manual",
                file_path="manual",
                heading="Manual card",
                front_html="Front",
                back_html="<div>Back</div>",
                tags=["research"],
            )
        ]
    )
    assert export_file.exists()
    assert "#separator:Tab" in export_file.read_text(encoding="utf-8")

    # Select remaining unvisited chunks (none left)
    coverage_tracker = CoverageTracker(coverage_path=coverage_path)
    remaining = coverage_tracker.select_unvisited_chunks(chunks, count=2)
    assert len(remaining) == 0
