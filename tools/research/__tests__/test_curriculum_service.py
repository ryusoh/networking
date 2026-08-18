"""Unit tests for tools/research/curriculum_service.py."""

from tools.research.curriculum_service import CurriculumService


def test_immediate_prerequisites():
    service = CurriculumService()
    assert service.prerequisites("cs234-advanced-networks") == ["cs233-networking-laboratory"]
    assert service.prerequisites("tcp") == ["ip"]


def test_immediate_prerequisites_unknown_topic():
    service = CurriculumService()
    assert service.prerequisites("made-up-topic") == []


def test_transitive_chain():
    service = CurriculumService()
    chain = service.prerequisite_chain("bgp")
    assert "routing" in chain
    assert "tcp" in chain
    assert "ip" in chain
    assert "link_layer" in chain


def test_custom_graph():
    service = CurriculumService(graph={"a": ["b"], "b": ["c"]})
    assert service.prerequisite_chain("a") == ["b", "c"]


def test_case_insensitive_lookup():
    service = CurriculumService()
    assert service.prerequisites("TCP") == ["ip"]
    assert service.prerequisites("Cs234-Advanced-Networks") == ["cs233-networking-laboratory"]
