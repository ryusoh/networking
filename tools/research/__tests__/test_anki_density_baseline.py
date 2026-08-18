"""Unit tests for Phase 2 Anki Density Baseline module (tools/research/anki_density_baseline.py)."""

import gzip
import json
from pathlib import Path
import pytest

from tools.research.anki_density_baseline import (
    BaselineReport,
    build_domain_lexicon,
    compute_baseline,
    compute_graph_hash,
    fetch_note_texts,
    top_k_hub_guids,
)


def _setup_mock_anki_repo(tmp_path: Path) -> Path:
    """Create mock anki repo structure with graph and notes datasets."""
    repo = tmp_path / "anki_repo"
    graph_dir = repo / "graph"
    graph_dir.mkdir(parents=True)
    anki_data = repo / "data" / "anki"
    anki_data.mkdir(parents=True)
    cf_data = repo / "data" / "cloudflare" / "collection"
    cf_data.mkdir(parents=True)

    # Mock graph_data.json
    graph_data = {
        "nodes": [
            {"id": "guid_1", "label": "Portfolio Variance", "deck": "金融", "pagerank": 0.005},
            {"id": "guid_2", "label": "Bond Yields", "deck": "金融", "pagerank": 0.008},
            {"id": "guid_3", "label": "Other Deck Concept", "deck": "Other", "pagerank": 0.009},
            {"id": "guid_4", "label": "Capital Asset Pricing", "deck": "金融", "pagerank": 0.003},
        ],
        "links": [],
    }
    (graph_dir / "graph_data.json").write_text(json.dumps(graph_data), encoding="utf-8")

    # Mock data/anki/notes.json.gz (guid -> nid)
    notes_id_map = [
        {"guid": "guid_1", "id": 101},
        {"guid": "guid_2", "id": 102},
        {"guid": "guid_4", "id": 104},
    ]
    with gzip.open(anki_data / "notes.json.gz", "wt", encoding="utf-8") as f:
        json.dump(notes_id_map, f)

    # Mock data/cloudflare/collection/notes.json.gz (staged with flds)
    staged_notes = [
        {"guid": "guid_1", "flds": "Portfolio Variance\x1fCalculation of total portfolio risk and variance."},
        {"guid": "guid_2", "flds": "Bond Yields\x1fYield curve metrics and duration calculation."},
        {"guid": "guid_4", "flds": "CAPM Pricing\x1fExpected return on asset based on beta."},
    ]
    with gzip.open(cf_data / "notes.json.gz", "wt", encoding="utf-8") as f:
        json.dump(staged_notes, f)

    return repo


def test_top_k_hub_guids_ordering(tmp_path: Path):
    """Verify top_k_hub_guids sorts by PageRank descending and filters by deck."""
    repo = _setup_mock_anki_repo(tmp_path)
    guids = top_k_hub_guids(deck="金融", k=2, repo_root=repo)

    # guid_2 has 0.008, guid_1 has 0.005
    assert guids == ["guid_2", "guid_1"]


def test_fetch_note_texts_staged(tmp_path: Path):
    """Verify fetch_note_texts in staged mode extracts front and back fields."""
    repo = _setup_mock_anki_repo(tmp_path)
    texts = fetch_note_texts(["guid_1", "guid_2"], mode="staged", repo_root=repo)

    assert "guid_1" in texts
    assert texts["guid_1"]["front"] == "Portfolio Variance"
    assert "portfolio risk" in texts["guid_1"]["back"]


def test_fetch_note_texts_live_mocked(tmp_path: Path, monkeypatch):
    """Verify fetch_note_texts in live mode parses AnkiConnect response."""
    repo = _setup_mock_anki_repo(tmp_path)

    # Mock urllib.request.urlopen for AnkiConnect notesInfo
    class MockResponse:
        def __init__(self, data: dict):
            self.data = json.dumps(data).encode("utf-8")

        def read(self):
            return self.data

        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

    def mock_urlopen(req, *args, **kwargs):
        payload = json.loads(req.data.decode("utf-8"))
        assert payload["action"] == "notesInfo"
        resp_data = {
            "result": [
                {
                    "noteId": 102,
                    "fields": {
                        "Front": {"value": "Live Bond Yields", "order": 0},
                        "Back": {"value": "Live Yield description", "order": 1},
                    },
                }
            ],
            "error": None,
        }
        return MockResponse(resp_data)

    monkeypatch.setattr("urllib.request.urlopen", mock_urlopen)

    texts = fetch_note_texts(["guid_2"], mode="live", repo_root=repo)
    assert texts["guid_2"]["front"] == "Live Bond Yields"
    assert texts["guid_2"]["back"] == "Live Yield description"


def test_fetch_note_texts_missing_guid_error(tmp_path: Path):
    """Verify fetch_note_texts raises RuntimeError when GUID is not found."""
    repo = _setup_mock_anki_repo(tmp_path)
    with pytest.raises(RuntimeError, match="not found"):
        fetch_note_texts(["nonexistent_guid"], mode="staged", repo_root=repo)


def test_build_domain_lexicon(tmp_path: Path):
    """Verify build_domain_lexicon extracts non-stopword domain tokens."""
    repo = _setup_mock_anki_repo(tmp_path)
    lexicon = build_domain_lexicon(deck="金融", k=2, max_terms=10, mode="staged", repo_root=repo)

    # Common words in mock data: portfolio, variance, risk, bond, yields, curve, duration
    assert "variance" in lexicon or "portfolio" in lexicon or "yields" in lexicon
    # Stopwords like 'and', 'of' must be excluded
    assert "and" not in lexicon
    assert "of" not in lexicon


def test_compute_baseline_caching(tmp_path: Path):
    """Verify baseline computation, caching, and cache invalidation on graph hash change."""
    repo = _setup_mock_anki_repo(tmp_path)
    cache_path = tmp_path / "baseline_cache.json"

    # 1. Initial compute
    baseline1 = compute_baseline(
        deck="金融", k=2, mode="staged", repo_root=repo, cache_path=cache_path
    )
    assert isinstance(baseline1, BaselineReport)
    assert baseline1.deck == "金融"
    assert len(baseline1.top_guids) == 2
    assert cache_path.exists()

    # 2. Cached load
    baseline2 = compute_baseline(
        deck="金融", k=2, mode="staged", repo_root=repo, cache_path=cache_path
    )
    assert baseline2.mean_density == baseline1.mean_density
    assert baseline2.graph_hash == baseline1.graph_hash

    # 3. Hash change invalidation
    graph_file = repo / "graph" / "graph_data.json"
    graph_file.write_text(json.dumps({"nodes": [], "links": []}), encoding="utf-8")

    baseline3 = compute_baseline(
        deck="金融", k=2, mode="staged", repo_root=repo, cache_path=cache_path
    )
    assert baseline3.graph_hash != baseline1.graph_hash
