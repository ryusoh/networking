"""Unit tests for tools/research/anki_retention.py."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any
import pytest

from tools.research.anki_generator import AnkiConnectChecker
from tools.research.anki_retention import AnkiRetentionBridge, main


@pytest.fixture
def mock_graph_dir(tmp_path: Path) -> Path:
    graph_dir = tmp_path / "graph"
    graph_dir.mkdir(parents=True, exist_ok=True)
    graph_data = {
        "nodes": [
            {"id": "n1", "l": "Paxos", "d": "金融", "p": 0.90},
            {"id": "n2", "l": "Vector Clocks", "d": "金融", "p": 0.80},
            {"id": "n3", "l": "Two-Phase Commit", "d": "金融", "p": 0.70},
            {"id": "n4", "l": "Raft", "d": "金融", "p": 0.60},
            {"id": "n5", "l": "Other Deck Concept", "d": "言語日語", "p": 0.95},
        ],
        "links": [],
    }
    (graph_dir / "graph_data.json").write_text(json.dumps(graph_data), encoding="utf-8")
    return tmp_path


def test_gap_predicate_and_html_stripping(mock_graph_dir: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        if action == "findNotes":
            return [101, 102, 103]
        if action == "notesInfo":
            return [
                {"noteId": 101, "fields": {"Front": {"value": "<b>Paxos</b>"}}, "cards": [1001]},
                {"noteId": 102, "fields": {"Front": {"value": "Vector Clocks"}}, "cards": [1002]},
                {"noteId": 103, "fields": {"Front": {"value": "Raft"}}, "cards": [1003]},
            ]
        if action == "cardsInfo":
            return [
                {"cardId": 1001, "reps": 10, "lapses": 3, "ivl": 15},
                {"cardId": 1002, "reps": 8, "lapses": 0, "ivl": 30},
                {"cardId": 1003, "reps": 4, "lapses": 2, "ivl": 5},
            ]
        return None

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    bridge = AnkiRetentionBridge(deck="金融", repo_root=mock_graph_dir)
    gaps = bridge.get_retention_gaps(top_n=5, min_pagerank_quantile=0.50)

    # Paxos: PR 0.90, lapses 3 -> qualifies
    # Vector Clocks: lapses 0 -> excluded
    # Raft: PR 0.60 < 0.75 quantile (0.50 quantile of [0.60, 0.70, 0.80, 0.90] is 0.75) -> excluded
    assert len(gaps) == 1
    assert gaps[0]["label"] == "Paxos"
    assert gaps[0]["pagerank"] == 0.90
    assert gaps[0]["lapses"] == 3
    assert gaps[0]["reps"] == 10
    assert gaps[0]["max_ivl_days"] == 15
    assert gaps[0]["cards"] == 1


def test_duplicate_fronts_pooled(mock_graph_dir: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        if action == "findNotes":
            return [201, 202]
        if action == "notesInfo":
            return [
                {"noteId": 201, "fields": {"Front": {"value": "Paxos"}}, "cards": [2001]},
                {"noteId": 202, "fields": {"Front": {"value": "  Paxos  "}}, "cards": [2002]},
            ]
        if action == "cardsInfo":
            return [
                {"cardId": 2001, "reps": 4, "lapses": 1, "ivl": 10},
                {"cardId": 2002, "reps": 3, "lapses": 2, "ivl": 25},
            ]
        return None

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    bridge = AnkiRetentionBridge(deck="金融", repo_root=mock_graph_dir)
    gaps = bridge.get_retention_gaps(top_n=5, min_pagerank_quantile=0.50)

    assert len(gaps) == 1
    assert gaps[0]["label"] == "Paxos"
    assert gaps[0]["cards"] == 2
    assert gaps[0]["reps"] == 7
    assert gaps[0]["lapses"] == 3
    assert gaps[0]["max_ivl_days"] == 25


def test_stable_hubs(mock_graph_dir: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        if action == "findNotes":
            return [301, 302]
        if action == "notesInfo":
            return [
                {"noteId": 301, "fields": {"Front": {"value": "Vector Clocks"}}, "cards": [3001]},
                {"noteId": 302, "fields": {"Front": {"value": "Paxos"}}, "cards": [3002]},
            ]
        if action == "cardsInfo":
            return [
                {"cardId": 3001, "reps": 6, "lapses": 0, "ivl": 40},
                {"cardId": 3002, "reps": 10, "lapses": 2, "ivl": 10},
            ]
        return None

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    bridge = AnkiRetentionBridge(deck="金融", repo_root=mock_graph_dir)
    stable = bridge.get_stable_hubs(top_n=5, min_reps=5)

    assert len(stable) == 1
    assert stable[0]["label"] == "Vector Clocks"
    assert stable[0]["reps"] == 6
    assert stable[0]["lapses"] == 0


def test_fail_open_on_ankiconnect_error(mock_graph_dir: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        raise RuntimeError("Connection refused")

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    bridge = AnkiRetentionBridge(deck="金融", repo_root=mock_graph_dir)
    gaps = bridge.get_retention_gaps()
    assert gaps == []
    captured = capsys.readouterr()
    assert "Warning: AnkiRetentionBridge could not query AnkiConnect" in captured.err


def test_fail_open_on_missing_graph(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        return []

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    bridge = AnkiRetentionBridge(deck="金融", repo_root=tmp_path / "nonexistent")
    assert bridge.get_retention_gaps() == []
    assert bridge.get_stable_hubs() == []


def test_main_cli(mock_graph_dir: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]) -> None:
    def fake_invoke(self: AnkiConnectChecker, action: str, params: dict[str, Any] | None = None) -> Any:
        if action == "findNotes":
            return [401]
        if action == "notesInfo":
            return [{"noteId": 401, "fields": {"Front": {"value": "Paxos"}}, "cards": [4001]}]
        if action == "cardsInfo":
            return [{"cardId": 4001, "reps": 10, "lapses": 2, "ivl": 15}]
        return None

    monkeypatch.setattr(AnkiConnectChecker, "_invoke", fake_invoke)

    code = main(["--repo-root", str(mock_graph_dir), "--gaps", "--json"])
    assert code == 0
    captured = capsys.readouterr()
    data = json.loads(captured.out)
    assert len(data) == 1
    assert data[0]["label"] == "Paxos"
