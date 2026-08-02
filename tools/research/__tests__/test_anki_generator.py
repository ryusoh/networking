"""Unit tests for Phase 1 Anki Pipeline Coverage Tracker (tools/research/anki_generator.py)."""

from pathlib import Path
from tools.research.anki_generator import CoverageTracker


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

    # Select 2 unvisited chunks
    selected = tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected) == 2
    assert selected[0]["chunk_id"] == "c1"
    assert selected[1]["chunk_id"] == "c2"

    # Mark c1 as visited
    tracker.mark_chunks_visited([manifest_chunks[0]], deck_name="TestDeck")

    # Select unvisited chunks again
    new_tracker = CoverageTracker(coverage_path=coverage_path)
    selected_after = new_tracker.select_unvisited_chunks(manifest_chunks, count=2)
    assert len(selected_after) == 2
    assert selected_after[0]["chunk_id"] == "c2"
    assert selected_after[1]["chunk_id"] == "c3"
