#!/usr/bin/env python3
"""Phase 2 CurriculumService: hand-authored prerequisite graph for the curriculum.

The graph is intentionally minimal and course-level-first; topic-level edges
are added only for concepts that clearly build on one another across the
four course modules.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import deque
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# Hand-authored prerequisite graph. Nodes are free-form topic/course identifiers;
# edges point from a topic to its immediate prerequisite.
DEFAULT_GRAPH: dict[str, list[str]] = {
    # Course-level chain
    "cs231-distributed-systems": [],
    "cs232-computer-networks": ["cs231-distributed-systems"],
    "cs233-networking-laboratory": ["cs232-computer-networks"],
    "cs234-advanced-networks": ["cs233-networking-laboratory"],
    # Cross-course topic dependencies
    "distributed_consensus": [],
    "paxos": ["distributed_consensus"],
    "raft": ["paxos"],
    "link_layer": [],
    "ip": ["link_layer"],
    "tcp": ["ip"],
    "routing": ["ip", "tcp"],
    "bgp": ["routing", "tcp"],
    "sdn": ["routing", "tcp"],
    "traffic_engineering": ["routing", "sdn"],
    "network_security": ["ip", "tcp"],
    "datacenter_networks": ["traffic_engineering", "network_security"],
}


def _normalize(topic: str) -> str:
    return topic.lower().strip().replace(" ", "_").replace("-", "_")


class CurriculumService:
    """Query a prerequisite dependency graph."""

    def __init__(self, graph: dict[str, list[str]] | None = None):
        self.graph = graph if graph is not None else dict(DEFAULT_GRAPH)
        self._aliases = {node: _normalize(node) for node in self.graph}

    def _resolve(self, topic: str) -> str | None:
        norm = _normalize(topic)
        for node, alias in self._aliases.items():
            if alias == norm or node == topic:
                return node
        return None

    def prerequisites(self, topic: str) -> list[str]:
        """Return immediate prerequisites for ``topic``."""
        node = self._resolve(topic)
        if node is None:
            return []
        return list(self.graph.get(node, []))

    def prerequisite_chain(self, topic: str) -> list[str]:
        """Return all transitive prerequisites for ``topic`` in dependency order."""
        node = self._resolve(topic)
        if node is None:
            return []

        chain: list[str] = []
        visited: set[str] = set()
        queue: deque[str] = deque(self.graph.get(node, []))

        while queue:
            current = queue.popleft()
            if current in visited:
                continue
            visited.add(current)
            chain.append(current)
            queue.extend(self.graph.get(current, []))

        return chain


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Query the curriculum prerequisite graph.")
    parser.add_argument("--before", required=True, help="Topic or course to look up prerequisites for.")
    parser.add_argument("--transitive", action="store_true", help="Return full transitive chain.")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args(argv)

    service = CurriculumService()
    if args.transitive:
        result = service.prerequisite_chain(args.before)
    else:
        result = service.prerequisites(args.before)

    if args.json:
        print(json.dumps({"topic": args.before, "prerequisites": result}, ensure_ascii=False))
    else:
        if not result:
            print(f"No known prerequisites for '{args.before}'.")
        else:
            print(f"Prerequisites for '{args.before}':")
            for item in result:
                print(f"  - {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
