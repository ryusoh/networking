"""Unit tests for tools/research/synthesis_service.py."""

from pathlib import Path
from tools.research.synthesis_service import build_comparative_scene


def test_comparative_scene_includes_chunks_from_both_topics(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "start_line": 1,
            "end_line": 10,
            "token_count": 200,
            "content": "Paxos reaches consensus across distributed systems.",
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs232/sdn.md",
            "heading": "SDN Controller",
            "start_line": 1,
            "end_line": 10,
            "token_count": 200,
            "content": "An SDN controller centrally manages network forwarding.",
        },
    ]

    scene = build_comparative_scene(
        "Paxos consensus", "SDN controller", chunks, tmp_path, max_tokens=2000, top_k_per_topic=1
    )

    sides = {c["chunk_id"]: c["side"] for c in scene["chunks"]}
    assert sides["c1"] == "A"
    assert sides["c2"] == "B"
    assert scene["chunk_count"] == 2
    assert "COMPARATIVE STUDY SCENE" in scene["markdown_payload"]
    assert "Topic A: Paxos consensus" in scene["markdown_payload"]
    assert "Topic B: SDN controller" in scene["markdown_payload"]


def test_comparative_scene_respects_token_budget(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "start_line": 1,
            "end_line": 10,
            "token_count": 500,
            "content": "Paxos reaches consensus across distributed systems.",
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs232/sdn.md",
            "heading": "SDN Controller",
            "start_line": 1,
            "end_line": 10,
            "token_count": 500,
            "content": "An SDN controller centrally manages network forwarding.",
        },
    ]

    # Tight budget: system prompt (200) + only one 500-token chunk fits.
    scene = build_comparative_scene(
        "Paxos consensus", "SDN controller", chunks, tmp_path, max_tokens=700, top_k_per_topic=1
    )
    assert scene["chunk_count"] == 1
