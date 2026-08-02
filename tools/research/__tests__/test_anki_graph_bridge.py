"""Unit tests for tools/research/anki_graph_bridge.py."""

from __future__ import annotations

import json
from pathlib import Path
from tools.research.anki_graph_bridge import AnkiGraphBridge


def test_anki_graph_bridge_missing_file(tmp_path: Path) -> None:
    bridge = AnkiGraphBridge(target_deck="金融", repo_root=tmp_path)
    assert bridge.nodes == []
    assert bridge.links == []
    assert bridge.get_related_hubs("Sample text") == []


def test_anki_graph_bridge_filtering_and_hubs(tmp_path: Path) -> None:
    graph_dir = tmp_path / "graph"
    graph_dir.mkdir(parents=True)
    graph_data = {
        "nodes": [
            {"id": "n1", "l": "Paxos", "d": "金融", "p": 0.85},
            {"id": "n2", "l": "Vector Clocks", "d": "金融", "p": 0.95},
            {"id": "n3", "l": "Japanese Grammar", "d": "言語日語", "p": 0.99},
        ],
        "links": [
            {"s": "n1", "t": "n2"},
            {"s": "n1", "t": "n3"},
        ],
    }
    (graph_dir / "graph_data.json").write_text(json.dumps(graph_data), encoding="utf-8")

    bridge = AnkiGraphBridge(target_deck="金融", repo_root=tmp_path)
    assert len(bridge.nodes) == 2
    assert len(bridge.links) == 1

    hubs = bridge.get_related_hubs("This card discusses Paxos consensus and Vector Clocks.")
    assert len(hubs) == 2
    # Vector Clocks has higher PageRank (0.95 vs 0.85)
    assert hubs[0][0] == "Vector Clocks"
    assert hubs[1][0] == "Paxos"


def test_score_chunk_pagerank(tmp_path: Path) -> None:
    graph_dir = tmp_path / "graph"
    graph_dir.mkdir(parents=True, exist_ok=True)
    graph_data = {
        "nodes": [
            {"id": "n1", "l": "Paxos", "d": "金融", "p": 0.85},
            {"id": "n2", "l": "Vector Clocks", "d": "金融", "p": 0.95},
        ],
    }
    (graph_dir / "graph_data.json").write_text(json.dumps(graph_data), encoding="utf-8")
    bridge = AnkiGraphBridge(target_deck="金融", repo_root=tmp_path)

    chunk_high = {"heading": "Vector Clocks", "content": "Logical clocks in distributed systems."}
    chunk_med = {"heading": "Paxos Protocol", "content": "Consensus algorithm for replicated state."}
    chunk_none = {"heading": "Unrelated", "content": "Plain text with no hubs."}

    assert bridge.score_chunk_pagerank(chunk_high) == 0.95
    assert bridge.score_chunk_pagerank(chunk_med) == 0.85
    assert bridge.score_chunk_pagerank(chunk_none) == 0.0
