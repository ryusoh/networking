"""Domain Lexicon Validity Experiment (spec T6 / A5.3).

Evaluates D_domain distribution on 20 real 金融 cards vs 20 generic cards.
Acceptance criteria:
- Mann-Whitney U test p < 0.01
- Median D_domain (金融) >= 2x Median D_domain (generic)
"""

from __future__ import annotations

import math
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.anki_density import domain_density, normalize_text, tokenize
from tools.research.anki_density_baseline import (
    compute_baseline,
    fetch_note_texts,
    top_k_hub_guids,
)

GENERIC_CARDS_20 = [
    {"front": "Weather forecasting", "back": "Meteorologists use barometer and satellite images to predict precipitation and temperature."},
    {"front": "Making pasta", "back": "Boil water in a large pot with salt, add pasta, and cook until al dente before draining."},
    {"front": "Photosynthesis process", "back": "Plants convert carbon dioxide and water into glucose and oxygen using sunlight energy."},
    {"front": "French greetings", "back": "Bonjour means good morning or hello, while bonsoir is used in the evening."},
    {"front": "Solar system planets", "back": "Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune orbit around the sun."},
    {"front": "Baking bread basics", "back": "Flour, water, yeast, and salt form dough that rises before baking in a hot oven."},
    {"front": "Dog training basics", "back": "Positive reinforcement using treats and clickers helps reinforce good canine behavior."},
    {"front": "Basic chess rules", "back": "The objective is to checkmate the opponent king so that it cannot escape capture."},
    {"front": "Coffee brewing methods", "back": "Pour-over, espresso, French press, and cold brew extract flavor compounds differently."},
    {"front": "Human respiratory system", "back": "Lungs exchange oxygen and carbon dioxide between the atmosphere and the bloodstream."},
    {"front": "Bicycle maintenance", "back": "Check tire pressure, clean the chain, and ensure front and rear brakes work properly."},
    {"front": "History of cinema", "back": "The Lumière brothers and Thomas Edison pioneered early motion picture projection."},
    {"front": "Gardening soil preparation", "back": "Mix compost and organic matter into garden soil to improve drainage and nutrients."},
    {"front": "Guitar chords for beginners", "back": "Major chords like C, G, D, and E minor are standard foundational guitar shapes."},
    {"front": "Water cycle stages", "back": "Evaporation, condensation, precipitation, and collection circulate water across Earth."},
    {"front": "Spanish vocabulary basics", "back": "Gracias means thank you and por favor means please in conversational Spanish."},
    {"front": "Running technique", "back": "Maintain an upright posture, land with a midfoot strike, and breathe rhythmically."},
    {"front": "Basic kitchen safety", "back": "Keep knives sharp, wipe spills immediately, and wash hands before food handling."},
    {"front": "Origins of the Olympic Games", "back": "Ancient Greeks competed in athletic contests at Olympia to honor Zeus."},
    {"front": "Beginner painting supplies", "back": "Canvas, acrylic paints, synthetic brushes, and an easel are standard starting gear."},
]


def _mann_whitney_u(sample1: list[float], sample2: list[float]) -> tuple[float, float]:
    """Compute Mann-Whitney U test statistic and asymptotic two-sided p-value."""
    n1 = len(sample1)
    n2 = len(sample2)
    combined = [(val, 1) for val in sample1] + [(val, 2) for val in sample2]
    # Sort with average ranks for ties
    combined.sort(key=lambda x: x[0])

    ranks = [0.0] * len(combined)
    i = 0
    while i < len(combined):
        j = i
        while j < len(combined) and combined[j][0] == combined[i][0]:
            j += 1
        avg_rank = (i + 1 + j) / 2.0
        for k in range(i, j):
            ranks[k] = avg_rank
        i = j

    rank_sum1 = sum(ranks[k] for k in range(len(combined)) if combined[k][1] == 1)
    u1 = rank_sum1 - (n1 * (n1 + 1)) / 2.0
    u2 = n1 * n2 - u1
    u = min(u1, u2)

    mean_u = (n1 * n2) / 2.0
    std_u = math.sqrt((n1 * n2 * (n1 + n2 + 1)) / 12.0)

    if std_u > 0:
        z = (u - mean_u) / std_u
        p_val = math.erfc(abs(z) / math.sqrt(2))
    else:
        p_val = 1.0

    return u, p_val


def run_validation() -> bool:
    """Execute domain lexicon validation experiment."""
    baseline = compute_baseline(deck="金融", k=20)
    lexicon = baseline.lexicon

    # Fetch 20 real 金融 hub cards
    guids_20 = top_k_hub_guids("金融", k=20)
    texts_20 = fetch_note_texts(guids_20, mode="live")

    finance_domain_scores: list[float] = []
    for g in guids_20:
        t = texts_20.get(g, {"front": "", "back": ""})
        tokens = tokenize(normalize_text(t.get("front", ""), t.get("back", "")))
        score = domain_density(tokens, lexicon)
        finance_domain_scores.append(score)

    generic_domain_scores: list[float] = []
    for card in GENERIC_CARDS_20:
        tokens = tokenize(normalize_text(card["front"], card["back"]))
        score = domain_density(tokens, lexicon)
        generic_domain_scores.append(score)

    sorted_fin = sorted(finance_domain_scores)
    sorted_gen = sorted(generic_domain_scores)

    median_fin = (sorted_fin[len(sorted_fin) // 2] + sorted_fin[(len(sorted_fin) - 1) // 2]) / 2.0
    median_gen = (sorted_gen[len(sorted_gen) // 2] + sorted_gen[(len(sorted_gen) - 1) // 2]) / 2.0

    u_stat, p_value = _mann_whitney_u(finance_domain_scores, generic_domain_scores)

    print(f"Domain Lexicon Validation (T6):")
    print(f"  Finance Cards (n=20) Mean D_domain: {sum(finance_domain_scores)/len(finance_domain_scores):.2f}%, Median: {median_fin:.2f}%")
    print(f"  Generic Cards (n=20) Mean D_domain: {sum(generic_domain_scores)/len(generic_domain_scores):.2f}%, Median: {median_gen:.2f}%")
    print(f"  Mann-Whitney U statistic: {u_stat}, p-value: {p_value:.6e}")

    # Acceptance criteria:
    # 1. p-value < 0.01
    # 2. median 金融 >= 2x median generic (or median_fin > 0 and median_gen == 0)
    p_pass = p_value < 0.01
    median_pass = (median_fin >= 2 * median_gen) if median_gen > 0 else (median_fin > 0)

    print(f"  Criteria p < 0.01: {'PASS' if p_pass else 'FAIL'}")
    print(f"  Criteria Median Ratio >= 2x: {'PASS' if median_pass else 'FAIL'}")

    return p_pass and median_pass


if __name__ == "__main__":
    success = run_validation()
    sys.exit(0 if success else 1)
