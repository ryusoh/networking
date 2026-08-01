"""Unit tests for Phase 5 MemoryHost and Mastery Matrix (tools/research/memory_host.py)."""

from pathlib import Path
from tools.research.memory_host import MemoryHost


def test_memory_host_records_and_reports_mastery(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    # Record weak topic
    host.record_mastery("student1", "cs231-distributed-systems", "paxos_consensus", 0.50)

    # Record strong topic
    host.record_mastery("student1", "cs234-advanced-networks", "b4_traffic_engineering", 0.95)

    report = host.get_student_report("student1")
    assert report["total_topics_tracked"] == 2
    assert report["average_mastery"] == 0.725
    assert len(report["weak_topics"]) == 1
    assert report["weak_topics"][0]["topic"] == "paxos_consensus"
    assert len(report["strong_topics"]) == 1
    assert report["strong_topics"][0]["topic"] == "b4_traffic_engineering"


def test_memory_host_renders_memory_context(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    context_empty = host.render_memory_context("student1")
    assert "No previous study history" in context_empty

    host.record_mastery("student1", "cs231", "raft", 0.60)
    context_filled = host.render_memory_context("student1")
    assert "Focus Needed (Weak Areas): raft (cs231)" in context_filled
