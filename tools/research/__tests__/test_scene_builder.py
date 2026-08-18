"""Unit tests for Phase 3 Host SceneBuilder (tools/research/scene_builder.py)."""

from pathlib import Path
from tools.research.memory_host import MemoryHost
from tools.research.scene_builder import SceneBuilder


def _make_chunks():
    return [
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


def test_scene_builder_assembles_payload_within_token_budget(tmp_path: Path):
    chunks = _make_chunks()
    builder = SceneBuilder(chunks, tmp_path)

    # Test scene assembly with large token budget
    scene = builder.build_scene("B4 traffic engineering", max_tokens=2000, top_k=2)
    assert scene["chunk_count"] == 1
    assert scene["chunks"][0]["chunk_id"] == "c1"
    assert "MANDATORY CITATION CONTRACT" in scene["markdown_payload"]
    assert "[B4 Traffic Engineering](file://" in scene["markdown_payload"]
    assert scene["memory_injected"] is False


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


def test_scene_builder_injects_memory_context_and_respects_budget(tmp_path: Path):
    memory_path = tmp_path / "durable_memory.json"
    memory_host = MemoryHost(memory_path)
    memory_host.record_mastery("default_user", "cs234-advanced-networks", "b4_traffic_engineering", 0.55)

    chunks = _make_chunks()
    builder = SceneBuilder(chunks, tmp_path, memory_host=memory_host)

    # Budget large enough for one chunk plus the memory section.
    scene = builder.build_scene("B4 traffic engineering", max_tokens=2000, top_k=2)
    assert scene["memory_injected"] is True
    assert "## DURABLE MEMORY CONTEXT" in scene["markdown_payload"]
    assert "b4_traffic_engineering" in scene["markdown_payload"]
    assert scene["chunk_count"] == 1
    assert scene["used_tokens"] > 200  # system prompt + memory + chunk


def test_scene_builder_omits_empty_memory_context(tmp_path: Path):
    memory_path = tmp_path / "empty_memory.json"
    memory_host = MemoryHost(memory_path)

    chunks = _make_chunks()
    builder = SceneBuilder(chunks, tmp_path, memory_host=memory_host)

    scene = builder.build_scene("B4 traffic engineering", max_tokens=2000, top_k=2)
    assert scene["memory_injected"] is False
    assert "## DURABLE MEMORY CONTEXT" not in scene["markdown_payload"]
    assert scene["chunk_count"] == 1


def test_scene_builder_memory_reduces_available_chunk_budget(tmp_path: Path):
    memory_path = tmp_path / "durable_memory.json"
    memory_host = MemoryHost(memory_path)
    memory_host.record_mastery("default_user", "cs234-advanced-networks", "b4_traffic_engineering", 0.55)

    chunks = _make_chunks()
    builder_with_memory = SceneBuilder(chunks, tmp_path, memory_host=memory_host)
    builder_without_memory = SceneBuilder(chunks, tmp_path)

    # Budget fits the first chunk fully only when no memory is injected.
    scene_with = builder_with_memory.build_scene("B4 traffic engineering", max_tokens=700, top_k=1)
    scene_without = builder_without_memory.build_scene("B4 traffic engineering", max_tokens=700, top_k=1)

    assert scene_with["memory_injected"] is True
    assert scene_without["memory_injected"] is False
    assert "Truncated for token budget" in scene_with["chunks"][0]["content"]
    assert "Truncated for token budget" not in scene_without["chunks"][0]["content"]
