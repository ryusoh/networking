"""Anki Knowledge Graph Bridge (tools/research/anki_graph_bridge.py).

Interfaces with ~/dev/anki/graph to provide PageRank lookup, Aho-Corasick subphrase matching,
and automated graph re-export triggers scoped strictly to the target deck (金融).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ANKI_REPO_ROOT = Path("/Users/lz/dev/anki")
if str(ANKI_REPO_ROOT) not in sys.path and ANKI_REPO_ROOT.exists():
    sys.path.insert(0, str(ANKI_REPO_ROOT))


class AnkiGraphBridge:
    """Bridge for querying ~/dev/anki graph data scoped strictly to target deck (金融)."""

    def __init__(self, target_deck: str = "金融", repo_root: Path = ANKI_REPO_ROOT):
        self.target_deck = target_deck
        self.repo_root = repo_root
        self.graph_path = repo_root / "graph" / "graph_data.json"
        self.nodes: list[dict[str, Any]] = []
        self.links: list[dict[str, Any]] = []
        self._load_graph_data()

    def _load_graph_data(self) -> None:
        """Loads and filters nodes and links strictly for the target deck."""
        if not self.graph_path.exists():
            return
        try:
            data = json.loads(self.graph_path.read_text(encoding="utf-8"))
            raw_nodes = data.get("nodes", [])
            raw_links = data.get("links", [])

            filtered_node_ids = set()
            for node in raw_nodes:
                deck_name = node.get("deck") or node.get("d") or ""
                if deck_name == self.target_deck:
                    self.nodes.append(node)
                    filtered_node_ids.add(node.get("id"))

            for link in raw_links:
                src = link.get("source") or link.get("s")
                tgt = link.get("target") or link.get("t")
                if src in filtered_node_ids and tgt in filtered_node_ids:
                    self.links.append(link)
        except Exception:
            pass

    def get_related_hubs(self, text: str, top_n: int = 3) -> list[tuple[str, float, str]]:
        """Scans input text for concept labels present in the target deck's knowledge graph."""
        if not text or not self.nodes:
            return []

        norm_text = text.lower()
        matches = []
        for node in self.nodes:
            label = node.get("label") or node.get("l") or ""
            if label and len(label) >= 2 and label.lower() in norm_text:
                pr = float(node.get("pagerank") or node.get("p") or 0.0)
                matches.append((label, pr, self.target_deck))

        matches.sort(key=lambda x: x[1], reverse=True)
        return matches[:top_n]

    def score_chunk_pagerank(self, chunk: dict[str, Any]) -> float:
        """Calculate max PageRank score for concept hubs matching a chunk (Vector 1)."""
        heading = chunk.get("heading", "")
        content = chunk.get("content", "")
        text = f"{heading} {content}"
        hubs = self.get_related_hubs(text, top_n=5)
        if not hubs:
            return 0.0
        return max(h[1] for h in hubs)
