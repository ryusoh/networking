"""Weight Tuning Experiment for Anki Information Density Gate (spec T3 / A5.1).

Performs grid search over composite density weights and threshold scales
to maximize F1 score against human-labeled benchmark cards.
Outputs research/.anki_density_tuning.json.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.anki_density import (
    card_density,
    compression_density,
    concept_density,
    domain_density,
    mtld,
    normalize_text,
    tokenize,
)
from tools.research.anki_density_baseline import (
    DEFAULT_BASELINE_CACHE_PATH,
    compute_baseline,
    fetch_note_texts,
    top_k_hub_guids,
)

OUTPUT_TUNING_PATH = REPO_ROOT / "research" / ".anki_density_tuning.json"

GENERIC_NEGATIVE_CARDS = [
    {"front": "Course logistics", "back": "Office hours on Tuesday and Thursday 3pm.", "label": 0},
    {"front": "Introduction to class", "back": "Welcome to lecture 1 overview.", "label": 0},
    {"front": "Hello World greeting", "back": "A simple standard greeting phrase.", "label": 0},
    {"front": "Table of Contents", "back": "Section 1, Section 2, Section 3, Conclusion.", "label": 0},
    {"front": "What is everyday weather?", "back": "Weather is sunny or cloudy or rainy outside.", "label": 0},
    {"front": "Common animals list", "back": "Cats and dogs and birds and horses.", "label": 0},
]


def score_card_with_weights(
    front: str,
    back: str,
    lexicon: set[str],
    w_comp: float,
    w_lex: float,
    w_concept: float,
    w_domain: float,
) -> float:
    """Compute composite density with specified component weights."""
    text = normalize_text(front, back)
    tokens = tokenize(text)
    token_count = len(tokens)

    d_comp = compression_density(text)
    d_lex = mtld(tokens, threshold=0.72)
    d_concept = concept_density(tokens)
    d_domain = domain_density(tokens, lexicon)

    if token_count < 50:
        total_non_lex = w_comp + w_concept + w_domain
        wc = w_comp + (w_lex * (w_comp / total_non_lex))
        wcon = w_concept + (w_lex * (w_concept / total_non_lex))
        wdom = w_domain + (w_lex * (w_domain / total_non_lex))
        comp = wc * d_comp + wcon * (d_concept / 100.0) + wdom * (d_domain / 100.0)
    else:
        comp = (
            w_comp * d_comp
            + w_lex * (d_lex / 100.0)
            + w_concept * (d_concept / 100.0)
            + w_domain * (d_domain / 100.0)
        )
    return max(0.0, min(1.0, comp))


def run_tuning() -> dict:
    """Execute grid search over weights and threshold scale against hub and negative cards."""
    baseline = compute_baseline(deck="金融", k=10)
    lexicon = baseline.lexicon

    # Collect positive benchmark cards from real deck hubs
    guids = top_k_hub_guids("金融", k=10)
    hub_texts = fetch_note_texts(guids, mode="live")

    evaluation_set = []
    for g, t in hub_texts.items():
        evaluation_set.append({"front": t.get("front", ""), "back": t.get("back", ""), "label": 1})

    evaluation_set.extend(GENERIC_NEGATIVE_CARDS)

    weight_candidates = [
        (0.4, 0.2, 0.2, 0.2),
        (0.35, 0.25, 0.2, 0.2),
        (0.3, 0.2, 0.25, 0.25),
        (0.45, 0.15, 0.2, 0.2),
    ]
    threshold_scales = [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 1.0]

    best_f1 = -1.0
    best_config = {}

    for w_comp, w_lex, w_concept, w_domain in weight_candidates:
        for scale in threshold_scales:
            threshold = baseline.mean_density * scale

            tp = fp = fn = tn = 0
            for item in evaluation_set:
                score = score_card_with_weights(
                    item["front"],
                    item["back"],
                    lexicon,
                    w_comp,
                    w_lex,
                    w_concept,
                    w_domain,
                )
                pred = 1 if score >= threshold else 0
                actual = item["label"]

                if pred == 1 and actual == 1:
                    tp += 1
                elif pred == 1 and actual == 0:
                    fp += 1
                elif pred == 0 and actual == 1:
                    fn += 1
                else:
                    tn += 1

            precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
            recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
            f1 = (
                2 * precision * recall / (precision + recall)
                if (precision + recall) > 0
                else 0.0
            )

            if f1 > best_f1:
                best_f1 = f1
                best_config = {
                    "weights": {
                        "d_comp": w_comp,
                        "d_lex": w_lex,
                        "d_concept": w_concept,
                        "d_domain": w_domain,
                    },
                    "threshold_scale": scale,
                    "effective_threshold": threshold,
                    "metrics": {
                        "f1": f1,
                        "precision": precision,
                        "recall": recall,
                        "tp": tp,
                        "fp": fp,
                        "fn": fn,
                        "tn": tn,
                    },
                }

    OUTPUT_TUNING_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_TUNING_PATH.write_text(
        json.dumps(best_config, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Weight Tuning Complete. Best F1: {best_f1:.4f} (threshold_scale: {best_config['threshold_scale']})")
    print(f"Results saved to {OUTPUT_TUNING_PATH}")
    return best_config


if __name__ == "__main__":
    res = run_tuning()
    if res["metrics"]["f1"] < 0.8:
        sys.exit(1)
    sys.exit(0)
