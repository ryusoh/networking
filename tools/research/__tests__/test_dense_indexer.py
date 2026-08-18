"""Unit tests for tools/research/dense_indexer.py."""

from pathlib import Path
from tools.research.dense_indexer import DenseIndexer


def test_dense_indexer_builds_and_caches_vectors(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "start_line": 10,
            "end_line": 50,
            "content": "B4 uses a centralized controller to manage WAN traffic engineering.",
        },
        {
            "chunk_id": "c2",
            "file_path": "research/cs231/paxos.md",
            "heading": "Paxos Consensus",
            "start_line": 1,
            "end_line": 30,
            "token_count": 1000,
            "content": "Paxos agreement protocol uses phase 1a phase 1b phase 2a phase 2b.",
        },
    ]

    indexer = DenseIndexer(chunks, repo_root=tmp_path, vector_dim=16)
    indexer.build_index()

    assert len(indexer.vectors) == 2
    assert all(len(v) == 16 for v in indexer.vectors.values())
    assert indexer.cache_path.exists()

    # Reload from cache
    indexer2 = DenseIndexer(chunks, repo_root=tmp_path, vector_dim=16)
    indexer2.build_index()
    assert indexer2.vectors == indexer.vectors


def test_dense_indexer_scores_are_deterministic(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "start_line": 10,
            "end_line": 50,
            "content": "B4 uses a centralized controller to manage WAN traffic engineering.",
        },
    ]

    indexer = DenseIndexer(chunks, repo_root=tmp_path, vector_dim=16)
    query = "B4 Traffic Engineering B4 uses a centralized controller to manage WAN traffic engineering."
    results1 = indexer.score(query)
    results2 = indexer.score(query)

    assert len(results1) == 1
    assert results1 == results2
    assert results1[0][1] == 1.0


def test_dense_indexer_force_rebuild(tmp_path: Path):
    chunks = [
        {
            "chunk_id": "c1",
            "file_path": "research/cs234/b4.md",
            "heading": "B4 Traffic Engineering",
            "start_line": 10,
            "end_line": 50,
            "content": "B4 uses a centralized controller.",
        },
    ]

    indexer = DenseIndexer(chunks, repo_root=tmp_path, vector_dim=16)
    indexer.build_index()
    first_vec = indexer.vectors["c1"].copy()

    indexer.build_index(force=True)
    assert indexer.vectors["c1"] == first_vec
