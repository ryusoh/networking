"""End-to-End (E2E) Integration Test for Research Agent & Anki Pipeline.

Executes the complete end-to-end workflow across Phases 1 through 5 and Anki Flashcard Generation:
1. Structural Parsing & Line Mapping (parse_chunks.py)
2. BM25 Lexical Search & Ranking (search_chunks.py)
3. Token-Bounded Scene Assembly (scene_builder.py)
4. Citation Verification Engine (citation_engine.py)
5. Durable Memory & Mastery Matrix (memory_host.py)
6. Anki Flashcard Generation, Deduplication, & Ingestion (anki_generator.py)
"""

from pathlib import Path
from tools.research.anki_generator import AnkiCardFormatter, CoverageTracker, TSVExporter, filter_duplicate_chunks
from tools.research.citation_engine import CitationEngine
from tools.research.memory_host import MemoryHost
from tools.research.parse_chunks import build_chunks_manifest
from tools.research.scene_builder import SceneBuilder
from tools.research.search_chunks import BM25Indexer


def test_complete_research_agent_and_anki_pipeline_e2e(tmp_path: Path):
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
        "# Paxos Agreement Protocol\n\n"
        "## Consensus\n"
        "Paxos reaches consensus over unreliable network channels using 2-phase rounds.\n"
    )

    # 1. Phase 1: Structural Parsing
    manifest = build_chunks_manifest(research_dir, tmp_path)
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

    # 6. Anki Flashcard Generation Pipeline
    coverage_path = research_dir / ".anki_coverage.json"
    coverage_tracker = CoverageTracker(coverage_path=coverage_path)

    # Select unvisited chunks
    unvisited = coverage_tracker.select_unvisited_chunks(chunks, count=2)
    assert len(unvisited) == 2

    # Deduplication check
    non_duplicates = filter_duplicate_chunks(unvisited, deck_name="TestDeck")
    assert len(non_duplicates) == 2

    # Card Formatting
    card_formatter = AnkiCardFormatter(repo_root=tmp_path)
    card = card_formatter.format_card(non_duplicates[0])
    assert "B4" in card.front_html or "Overview" in card.front_html
    assert "Source Citation" in card.back_html

    # Package Export
    tsv_path = research_dir / "anki_import.txt"
    exporter = TSVExporter(output_path=tsv_path)
    export_file = exporter.export([card])
    assert export_file.exists()
    assert "#separator:Tab" in export_file.read_text(encoding="utf-8")

    # Update coverage (marks doc1 as visited)
    coverage_tracker.mark_chunks_visited([non_duplicates[0]], deck_name="TestDeck")

    # Select remaining unvisited chunks (from doc2)
    remaining = coverage_tracker.select_unvisited_chunks(chunks, count=2)
    assert len(remaining) == 2
    assert "paxos-consensus.md" in remaining[0]["file_path"]
