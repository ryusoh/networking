"""Unit tests for Phase 5 MemoryHost and Mastery Matrix (tools/research/memory_host.py)."""

import json
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


def test_memory_host_records_and_flushes_working_memory(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    host.record_turn("student1", "cs234-advanced-networks", "b4_te", "What is B4?", "B4 is Google's SD-WAN.")
    host.record_turn("student1", "cs234-advanced-networks", "b4_te", "How does B4 route?", "Via centralized TE.")

    data = json.loads(memory_path.read_text(encoding="utf-8"))
    assert len(data["students"]["student1"]["working_memory"]) == 2
    assert len(data["students"]["student1"]["session_history"]) == 0

    result = host.flush_working_memory("student1", summary="Reviewed B4 TE.")
    assert result["flushed"] == 2
    assert result["summarized"] is True

    data = json.loads(memory_path.read_text(encoding="utf-8"))
    assert len(data["students"]["student1"]["working_memory"]) == 0
    assert len(data["students"]["student1"]["session_history"]) == 3
    assert data["students"]["student1"]["session_history"][-1]["type"] == "session_summary"


def test_memory_host_empty_flush_is_a_no_op(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    result = host.flush_working_memory("student1")
    assert result["flushed"] == 0
    assert result["summarized"] is False

    data = json.loads(memory_path.read_text(encoding="utf-8"))
    assert "student1" not in data["students"] or not data["students"]["student1"].get("working_memory")
