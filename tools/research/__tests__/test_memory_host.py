"""Unit tests for Phase 5 MemoryHost and Mastery Matrix (tools/research/memory_host.py)."""

import json
from pathlib import Path

from tools.research import memory_host as memory_host_module
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


def test_memory_host_computes_mastery_from_performance_events(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    host.record_performance("student1", "cs231", "paxos", 0.5)
    host.record_performance("student1", "cs231", "paxos", 0.75)
    host.record_performance("student1", "cs231", "paxos", 1.0)

    report = host.get_student_report("student1")
    assert report["total_topics_tracked"] == 1
    assert report["average_mastery"] == 0.75

    # Older direct mastery records are unaffected.
    host.record_mastery("student1", "cs231", "paxos", 0.9)
    report = host.get_student_report("student1")
    assert report["average_mastery"] == 0.9


def test_memory_host_empty_flush_is_a_no_op(tmp_path: Path):
    memory_path = tmp_path / ".durable_memory.json"
    host = MemoryHost(memory_path=memory_path)

    result = host.flush_working_memory("student1")
    assert result["flushed"] == 0
    assert result["summarized"] is False

    data = json.loads(memory_path.read_text(encoding="utf-8"))
    assert "student1" not in data["students"] or not data["students"]["student1"].get("working_memory")


def test_cli_report_path_uses_default_memory(tmp_path: Path, monkeypatch):
    memory_path = tmp_path / ".durable_memory.json"
    monkeypatch.setattr(memory_host_module, "DEFAULT_MEMORY_PATH", memory_path)

    host = MemoryHost(memory_path=memory_path)
    host.record_mastery("cli_student", "cs234", "b4", 0.95)

    assert memory_host_module.main(["--student", "cli_student"]) == 0


def test_cli_record_turn_and_flush_round_trip(tmp_path: Path, monkeypatch):
    memory_path = tmp_path / ".durable_memory.json"
    monkeypatch.setattr(memory_host_module, "DEFAULT_MEMORY_PATH", memory_path)

    assert (
        memory_host_module.main(
            [
                "--student",
                "cli_turn_student",
                "--record-turn",
                "--module",
                "cs231",
                "--topic",
                "paxos",
                "--query",
                "What is Paxos?",
                "--response",
                "A consensus protocol.",
            ]
        )
        == 0
    )

    assert (
        memory_host_module.main(
            [
                "--student",
                "cli_turn_student",
                "--flush",
                "--summary",
                "Reviewed Paxos.",
            ]
        )
        == 0
    )

    data = json.loads(memory_path.read_text(encoding="utf-8"))
    assert len(data["students"]["cli_turn_student"]["session_history"]) == 2
