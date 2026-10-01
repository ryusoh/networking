"""Anki Retention-Gap Bridge (tools/research/anki_retention.py).

Surfaces high-PageRank knowledge graph hubs whose cards have high lapse counts
(retention gaps), or zero lapses and high repetitions (stable hubs).
Fails open if AnkiConnect or graph data is unavailable.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

from tools.research.anki_generator import AnkiConnectChecker
from tools.research.anki_graph_bridge import ANKI_REPO_ROOT, AnkiGraphBridge


def _normalize_text(text: str) -> str:
    """Strip HTML tags and collapse whitespace."""
    no_html = re.sub(r"<[^>]+>", "", text)
    return " ".join(no_html.split()).strip().lower()


def _extract_front(fields: dict[str, Any]) -> str:
    """Extract raw front field text from AnkiConnect note fields."""
    if "Front" in fields:
        val = fields["Front"]
        return val.get("value", "") if isinstance(val, dict) else str(val)
    for k, v in fields.items():
        if k.lower() == "front":
            return v.get("value", "") if isinstance(v, dict) else str(v)
    if fields:
        first = next(iter(fields.values()))
        return first.get("value", "") if isinstance(first, dict) else str(first)
    return ""


def _compute_quantile(values: list[float], q: float) -> float:
    """Compute percentile value with linear interpolation."""
    if not values:
        return 0.0
    sorted_vals = sorted(values)
    if len(sorted_vals) == 1:
        return sorted_vals[0]
    q = max(0.0, min(1.0, q))
    idx = (len(sorted_vals) - 1) * q
    low = int(idx)
    high = min(low + 1, len(sorted_vals) - 1)
    weight = idx - low
    return sorted_vals[low] * (1.0 - weight) + sorted_vals[high] * weight


class AnkiRetentionBridge:
    def __init__(
        self,
        deck: str = "金融",
        repo_root: Path = ANKI_REPO_ROOT,
        url: str = "http://127.0.0.1:8765",
    ) -> None:
        self.deck = deck
        self.repo_root = Path(repo_root)
        self.url = url
        self._graph_bridge: AnkiGraphBridge | None = None

    def _get_graph_bridge(self) -> AnkiGraphBridge:
        if self._graph_bridge is None:
            self._graph_bridge = AnkiGraphBridge(target_deck=self.deck, repo_root=self.repo_root)
        return self._graph_bridge

    def _fetch_review_data(self) -> dict[str, list[dict[str, Any]]] | None:
        """Fetch notes and cards from AnkiConnect, joined by normalized front text."""
        try:
            checker = AnkiConnectChecker(url=self.url)
            query = f'deck:"{self.deck}"'
            nids = checker._invoke("findNotes", {"query": query})
            if not nids:
                return {}
            notes_info = checker._invoke("notesInfo", {"notes": nids}) or []
            all_cids = [
                cid
                for note in notes_info
                if isinstance(note, dict)
                for cid in note.get("cards", [])
            ]
            cards_info = (
                checker._invoke("cardsInfo", {"cards": all_cids}) if all_cids else []
            ) or []
            card_map = {
                c["cardId"]: c
                for c in cards_info
                if isinstance(c, dict) and "cardId" in c
            }

            front_to_cards: dict[str, list[dict[str, Any]]] = defaultdict(list)
            for note in notes_info:
                if not isinstance(note, dict):
                    continue
                fields = note.get("fields", {})
                raw_front = _extract_front(fields)
                norm_front = _normalize_text(raw_front)
                if not norm_front:
                    continue
                for cid in note.get("cards", []):
                    if cid in card_map:
                        front_to_cards[norm_front].append(card_map[cid])
            return front_to_cards
        except Exception as e:
            sys.stderr.write(f"Warning: AnkiRetentionBridge could not query AnkiConnect: {e}\n")
            return None

    def _aggregate_node_stats(
        self, front_to_cards: dict[str, list[dict[str, Any]]]
    ) -> list[dict[str, Any]]:
        bridge = self._get_graph_bridge()
        results: list[dict[str, Any]] = []
        for node in bridge.nodes:
            label = str(node.get("label") or node.get("l") or "")
            if not label:
                continue
            pr = float(node.get("pagerank") or node.get("p") or 0.0)
            norm_label = _normalize_text(label)
            cards = front_to_cards.get(norm_label, [])
            if not cards:
                continue
            reps = sum(int(c.get("reps", 0)) for c in cards)
            lapses = sum(int(c.get("lapses", 0)) for c in cards)
            max_ivl_days = max((int(c.get("ivl", 0)) for c in cards), default=0)
            results.append(
                {
                    "label": label,
                    "pagerank": pr,
                    "cards": len(cards),
                    "reps": reps,
                    "lapses": lapses,
                    "max_ivl_days": max_ivl_days,
                }
            )
        return results

    def get_retention_gaps(
        self, top_n: int = 10, min_pagerank_quantile: float = 0.75
    ) -> list[dict[str, Any]]:
        front_to_cards = self._fetch_review_data()
        if front_to_cards is None:
            return []
        bridge = self._get_graph_bridge()
        if not bridge.nodes:
            return []

        all_prs = [
            float(n.get("pagerank") or n.get("p") or 0.0) for n in bridge.nodes
        ]
        threshold = _compute_quantile(all_prs, min_pagerank_quantile)

        stats = self._aggregate_node_stats(front_to_cards)
        gaps = [
            s
            for s in stats
            if s["pagerank"] >= threshold and s["lapses"] >= 1
        ]
        gaps.sort(key=lambda x: (x["pagerank"], x["lapses"]), reverse=True)
        return gaps[:top_n]

    def get_stable_hubs(
        self, top_n: int = 10, min_reps: int = 5
    ) -> list[dict[str, Any]]:
        front_to_cards = self._fetch_review_data()
        if front_to_cards is None:
            return []
        bridge = self._get_graph_bridge()
        if not bridge.nodes:
            return []

        stats = self._aggregate_node_stats(front_to_cards)
        stable = [
            s
            for s in stats
            if s["lapses"] == 0 and s["reps"] >= min_reps
        ]
        stable.sort(key=lambda x: (x["pagerank"], x["reps"]), reverse=True)
        return stable[:top_n]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Surface retention gaps and stable hubs in Anki knowledge graph."
    )
    parser.add_argument("--deck", default="金融", help="Target deck name (default: 金融)")
    parser.add_argument("--top", type=int, default=10, help="Top N results (default: 10)")
    parser.add_argument(
        "--gaps", action="store_true", help="Surface retention gaps (high PageRank, lapses >= 1)"
    )
    parser.add_argument(
        "--stable", action="store_true", help="Surface stable hubs (lapses == 0, reps >= 5)"
    )
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=ANKI_REPO_ROOT,
        help="Path to anki repo root",
    )
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8765",
        help="AnkiConnect URL (default: http://127.0.0.1:8765)",
    )

    args = parser.parse_args(argv)

    bridge = AnkiRetentionBridge(
        deck=args.deck, repo_root=args.repo_root, url=args.url
    )

    # Default to gaps if neither or both specified
    results: list[dict[str, Any]]
    if args.stable and not args.gaps:
        results = bridge.get_stable_hubs(top_n=args.top)
    else:
        results = bridge.get_retention_gaps(top_n=args.top)

    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        for item in results:
            print(
                f"{item['label']} (PR: {item['pagerank']:.4f}, lapses: {item['lapses']}, "
                f"reps: {item['reps']}, ivl: {item['max_ivl_days']}d)"
            )

    return 0


if __name__ == "__main__":
    sys.exit(main())
