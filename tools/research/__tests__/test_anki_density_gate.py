"""Unit tests for Phase 3 Anki Density Gate (tools/research/anki_density_gate.py)."""

import json
from pathlib import Path
from tools.research.anki_density import DensityReport
from tools.research.anki_density_baseline import BaselineReport
from tools.research.anki_density_gate import (
    Verdict,
    evaluate_cards,
    main,
)


def _make_dummy_baseline(mean_density: float = 0.5, lexicon: set[str] | None = None) -> BaselineReport:
    """Create a minimal baseline report for unit testing."""
    if lexicon is None:
        lexicon = {"tcp", "congestion", "variance", "risk"}
    return BaselineReport(
        deck="金融",
        top_guids=["g1", "g2"],
        mean_density=mean_density,
        per_card=[],
        lexicon=lexicon,
        zlib_version="1.2.12",
        jieba_version="0.42.1",
        graph_hash="dummy_hash",
    )


def test_evaluate_cards_accept():
    """Card with high density above threshold must be accepted."""
    baseline = _make_dummy_baseline(mean_density=0.1)
    cards = [
        {
            "chunk_id": "chunk_1",
            "front": "TCP congestion control with BBR and CUBIC algorithms",
            "back": "Detailed mechanism for bandwidth estimation and round trip time optimization in high throughput networks.",
            "tags": ["cs", "network"],
        }
    ]

    verdicts = evaluate_cards(cards, baseline)
    assert len(verdicts) == 1
    assert verdicts[0].decision == "accept"
    assert verdicts[0].density >= verdicts[0].threshold
    assert verdicts[0].consolidation_group is None


def test_evaluate_cards_enrich_single():
    """Single sparse card below threshold must be marked for enrichment."""
    # Set high threshold so sparse card falls below
    baseline = _make_dummy_baseline(mean_density=0.9)
    cards = [
        {
            "chunk_id": "chunk_sparse",
            "front": "short",
            "back": "sparse",
            "tags": ["cs"],
        }
    ]
    candidates = {
        "chunk_sparse": {
            "chunk_id": "chunk_sparse",
            "citation": "research/cs234/test.md#L10-L20",
        }
    }

    verdicts = evaluate_cards(cards, baseline, candidates_map=candidates)
    assert len(verdicts) == 1
    assert verdicts[0].decision == "enrich"
    assert verdicts[0].enrich_context == "research/cs234/test.md#L10-L20"
    assert verdicts[0].consolidation_group is None


def test_evaluate_cards_consolidate_pair():
    """Two sparse cards below threshold sharing chunk_id must be consolidated."""
    baseline = _make_dummy_baseline(mean_density=0.9)
    cards = [
        {
            "chunk_id": "chunk_shared",
            "front": "part 1 front",
            "back": "part 1 back",
            "tags": ["cs"],
        },
        {
            "chunk_id": "chunk_shared",
            "front": "part 2 front",
            "back": "part 2 back",
            "tags": ["cs"],
        },
    ]

    verdicts = evaluate_cards(cards, baseline)
    assert len(verdicts) == 2
    assert verdicts[0].decision == "consolidate"
    assert verdicts[1].decision == "consolidate"
    assert verdicts[0].consolidation_group == ["chunk_shared", "chunk_shared"]


def test_evaluate_cards_threshold_scaling():
    """Threshold scale parameter modulates effective acceptance cutoff."""
    baseline = _make_dummy_baseline(mean_density=0.5)
    cards = [
        {
            "chunk_id": "c1",
            "front": "moderate length front topic with technical tags",
            "back": "moderate length back explanation covering variance and risk concepts",
            "tags": ["cs"],
        }
    ]

    # At 1.0x threshold, card density might be below 0.5
    v_strict = evaluate_cards(cards, baseline, config={"threshold_scale": 1.5})
    assert v_strict[0].threshold == 0.75

    # At 0.1x threshold, card should be accepted
    v_lenient = evaluate_cards(cards, baseline, config={"threshold_scale": 0.1})
    assert v_lenient[0].threshold == 0.05
    assert v_lenient[0].decision == "accept"


def test_cli_execution_with_temp_files(tmp_path: Path):
    """Verify CLI main() execution reading inputs and writing verdict JSONL."""
    baseline = _make_dummy_baseline(mean_density=0.2)
    baseline_path = tmp_path / "baseline.json"
    baseline_dict = {
        "deck": baseline.deck,
        "top_guids": baseline.top_guids,
        "mean_density": baseline.mean_density,
        "per_card": [],
        "lexicon": list(baseline.lexicon),
        "zlib_version": baseline.zlib_version,
        "jieba_version": baseline.jieba_version,
        "graph_hash": baseline.graph_hash,
    }
    baseline_path.write_text(json.dumps(baseline_dict), encoding="utf-8")

    cards_path = tmp_path / "cards.jsonl"
    cards_data = [
        {
            "chunk_id": "c_cli_1",
            "front": "TCP congestion BBR algorithm",
            "back": "Detailed bandwidth estimation and pacing mechanics.",
            "tags": ["cs"],
        }
    ]
    with open(cards_path, "w", encoding="utf-8") as f:
        for c in cards_data:
            f.write(json.dumps(c) + "\n")

    candidates_path = tmp_path / "candidates.jsonl"
    candidates_path.write_text("{}", encoding="utf-8")

    out_path = tmp_path / "verdicts.jsonl"

    ret = main([
        "--cards", str(cards_path),
        "--candidates", str(candidates_path),
        "--baseline", str(baseline_path),
        "--output", str(out_path),
        "--threshold-scale", "0.5",
    ])

    assert ret == 0
    assert out_path.exists()

    verdict_lines = [json.loads(line) for line in out_path.read_text(encoding="utf-8").splitlines() if line]
    assert len(verdict_lines) == 1
    assert verdict_lines[0]["chunk_id"] == "c_cli_1"
    assert "decision" in verdict_lines[0]
