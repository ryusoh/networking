"""Density Gate for Generated Anki Cards (tools/research/anki_density_gate.py).

Evaluates newly authored flashcards against deck baseline information density.
Emits verdicts: accept, enrich, or consolidate.
"""

from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass
import json
from pathlib import Path
import sys
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.anki_density import card_density
from tools.research.anki_density_baseline import (
    DEFAULT_BASELINE_CACHE_PATH,
    BaselineReport,
    compute_baseline,
)

DEFAULT_CARDS_PATH = Path("research/anki_cards.jsonl")
DEFAULT_CANDIDATES_PATH = Path("research/anki_candidates.jsonl")
DEFAULT_VERDICTS_PATH = Path("research/anki_density_verdicts.jsonl")


@dataclass(frozen=True)
class Verdict:
    """Verdict emitted by the density gate for a candidate card."""

    chunk_id: str
    density: float
    threshold: float
    decision: str  # "accept" | "enrich" | "consolidate"
    consolidation_group: list[str] | None = None
    enrich_context: str | None = None


def _get_card_filepath(card: dict[str, Any], candidates_map: dict[str, dict[str, Any]]) -> str:
    """Extract source file path for a card."""
    if "file_path" in card and card["file_path"]:
        return card["file_path"]
    chunk_id = card.get("chunk_id", "")
    if chunk_id in candidates_map and "file_path" in candidates_map[chunk_id]:
        return candidates_map[chunk_id]["file_path"]
    if ":" in chunk_id:
        return chunk_id.split(":", 1)[0]
    return ""


def evaluate_cards(
    cards: list[dict[str, Any]],
    baseline: BaselineReport,
    config: dict[str, Any] | None = None,
    candidates_map: dict[str, dict[str, Any]] | None = None,
) -> list[Verdict]:
    """Evaluate candidate cards against baseline density and emit verdicts."""
    if config is None:
        config = {}
    if candidates_map is None:
        candidates_map = {}

    threshold_scale = float(config.get("threshold_scale", 1.0))
    max_merge_chars = int(config.get("max_merge_chars", 2000))
    threshold = baseline.mean_density * threshold_scale

    card_scores: list[tuple[dict[str, Any], float]] = []
    for card in cards:
        front = card.get("front", "")
        back = card.get("back", "")
        report = card_density(front, back, baseline.lexicon)
        card_scores.append((card, report.composite))

    below_threshold_indices: list[int] = []
    verdicts_dict: dict[int, Verdict] = {}

    for idx, (card, score) in enumerate(card_scores):
        chunk_id = card.get("chunk_id", f"unknown-{idx}")
        if score >= threshold:
            verdicts_dict[idx] = Verdict(
                chunk_id=chunk_id,
                density=score,
                threshold=threshold,
                decision="accept",
                consolidation_group=None,
                enrich_context=None,
            )
        else:
            below_threshold_indices.append(idx)

    # Group below-threshold cards
    # Two cards connect if same chunk_id OR (same file_path AND share >= 1 tag)
    groups: list[list[int]] = []
    visited: set[int] = set()

    for idx_a in below_threshold_indices:
        if idx_a in visited:
            continue
        group = [idx_a]
        visited.add(idx_a)
        queue = [idx_a]

        while queue:
            curr = queue.pop(0)
            card_curr = card_scores[curr][0]
            chunk_curr = card_curr.get("chunk_id", "")
            file_curr = _get_card_filepath(card_curr, candidates_map)
            tags_curr = set(card_curr.get("tags", []))

            for idx_b in below_threshold_indices:
                if idx_b in visited:
                    continue
                card_b = card_scores[idx_b][0]
                chunk_b = card_b.get("chunk_id", "")
                file_b = _get_card_filepath(card_b, candidates_map)
                tags_b = set(card_b.get("tags", []))

                connected = False
                if chunk_curr and chunk_curr == chunk_b:
                    connected = True
                elif file_curr and file_curr == file_b and (tags_curr & tags_b):
                    connected = True

                if connected:
                    visited.add(idx_b)
                    group.append(idx_b)
                    queue.append(idx_b)

        groups.append(group)

    # Evaluate decisions for grouped below-threshold cards
    for group in groups:
        total_chars = sum(
            len(card_scores[i][0].get("front", "")) + len(card_scores[i][0].get("back", ""))
            for i in group
        )
        group_chunk_ids = [card_scores[i][0].get("chunk_id", f"unknown-{i}") for i in group]

        if len(group) >= 2 and total_chars <= max_merge_chars:
            for i in group:
                card, score = card_scores[i]
                verdicts_dict[i] = Verdict(
                    chunk_id=card.get("chunk_id", f"unknown-{i}"),
                    density=score,
                    threshold=threshold,
                    decision="consolidate",
                    consolidation_group=group_chunk_ids,
                    enrich_context=None,
                )
        else:
            for i in group:
                card, score = card_scores[i]
                chunk_id = card.get("chunk_id", f"unknown-{i}")
                candidate_info = candidates_map.get(chunk_id, {})
                enrich_citation = (
                    candidate_info.get("citation")
                    or card.get("citation")
                    or candidate_info.get("heading")
                    or ""
                )
                verdicts_dict[i] = Verdict(
                    chunk_id=chunk_id,
                    density=score,
                    threshold=threshold,
                    decision="enrich",
                    consolidation_group=None,
                    enrich_context=enrich_citation if enrich_citation else None,
                )

    # Return verdicts in original card order
    return [verdicts_dict[i] for i in range(len(cards))]


def main(argv: list[str] | None = None) -> int:
    """CLI entry point for density gate."""
    parser = argparse.ArgumentParser(
        description="Deterministic Anki Card Information Density Gate."
    )
    parser.add_argument(
        "--cards",
        type=Path,
        default=DEFAULT_CARDS_PATH,
        help="Path to candidate anki_cards.jsonl",
    )
    parser.add_argument(
        "--candidates",
        type=Path,
        default=DEFAULT_CANDIDATES_PATH,
        help="Path to anki_candidates.jsonl",
    )
    parser.add_argument(
        "--baseline",
        type=Path,
        default=DEFAULT_BASELINE_CACHE_PATH,
        help="Path to .anki_density_baseline.json",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_VERDICTS_PATH,
        help="Path to output anki_density_verdicts.jsonl",
    )
    parser.add_argument(
        "--report-only",
        action="store_true",
        default=True,
        help="Run in report-only mode without blocking imports (default: True)",
    )
    parser.add_argument(
        "--threshold-scale",
        type=float,
        default=1.0,
        help="Multiplier scale for baseline mean threshold (default: 1.0)",
    )
    parser.add_argument(
        "--rebuild-baseline",
        action="store_true",
        help="Force recomputation of deck baseline cache",
    )
    args = parser.parse_args(argv)

    baseline = compute_baseline(
        deck="金融",
        k=10,
        cache_path=args.baseline,
        force_recompute=args.rebuild_baseline,
    )

    cards: list[dict[str, Any]] = []
    if args.cards.exists():
        with open(args.cards, "r", encoding="utf-8") as f:
            for line in f:
                line_str = line.strip()
                if line_str:
                    cards.append(json.loads(line_str))

    candidates_map: dict[str, dict[str, Any]] = {}
    if args.candidates.exists():
        with open(args.candidates, "r", encoding="utf-8") as f:
            for line in f:
                line_str = line.strip()
                if line_str:
                    item = json.loads(line_str)
                    if "chunk_id" in item:
                        candidates_map[item["chunk_id"]] = item

    config = {
        "threshold_scale": args.threshold_scale,
    }

    verdicts = evaluate_cards(
        cards=cards,
        baseline=baseline,
        config=config,
        candidates_map=candidates_map,
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    with open(args.output, "w", encoding="utf-8") as f:
        for v in verdicts:
            f.write(json.dumps(asdict(v), ensure_ascii=False) + "\n")

    accepted = sum(1 for v in verdicts if v.decision == "accept")
    enriched = sum(1 for v in verdicts if v.decision == "enrich")
    consolidated = sum(1 for v in verdicts if v.decision == "consolidate")
    total = len(verdicts)

    print(
        f"Density Gate Summary (Threshold: {baseline.mean_density * args.threshold_scale:.4f}):\n"
        f"  Total Cards: {total}\n"
        f"  Accepted:     {accepted}\n"
        f"  Enriched:     {enriched}\n"
        f"  Consolidated: {consolidated}\n"
        f"Verdicts written to {args.output}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
