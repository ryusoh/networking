"""Unit tests for Phase 3 Host SceneBuilder (tools/research/scene_builder.py)."""

from pathlib import Path
from tools.research.scene_builder import SceneBuilder


def test_scene_builder_assembles_payload_within_token_budget(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "start_line": 10,
            "end_line": 50,
            "token_count": 500,
            "content": "B4 uses a centralized controller to manage WAN traffic engineering.",
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "start_line": 1,
            "end_line": 30,
            "token_count": 1000,
            "content": "Paxos agreement protocol uses phase 1a phase 1b phase 2a phase 2b.",
        },
    ]

    builder = SceneBuilder(chunks, tmp_path)

    # Test scene assembly with large token budget
    scene = builder.build_scene("B4 traffic engineering", max_tokens=2000, top_k=2)
    assert scene["chunk_count"] == 1
    assert scene["chunks"][0]["chunk_id"] == "c1"
    assert "MANDATORY CITATION CONTRACT" in scene["markdown_payload"]
    assert "[research/cs234/b4.md#L10-L50](file://" in scene["markdown_payload"]


def test_scene_builder_respects_token_truncation(tmp_path: Path):
    large_content = "X" * 4000
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/large.md",
            "heading": "Large Section",
            "start_line": 1,
            "end_line": 100,
            "token_count": 1000,
            "content": large_content,
        }
    ]

    builder = SceneBuilder(chunks, tmp_path)

    # Tight token budget (300 tokens)
    scene = builder.build_scene("Large Section", max_tokens=300, top_k=1)
    assert scene["chunk_count"] == 1
    assert "Truncated for token budget" in scene["chunks"][0]["content"]
