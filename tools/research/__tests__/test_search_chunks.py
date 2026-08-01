"""Unit tests for Phase 2 BM25 Search Engine (tools/search_research_chunks.py)."""

from pathlib import Path
from tools.research import search_chunks


def test_tokenize():
    tokens = search_chunks.tokenize("BGP Route-Reflector 100% OK! #paxos")
    assert tokens == ["bgp", "route", "reflector", "100", "ok", "paxos"]


def test_bm25_indexer_ranks_matching_documents():
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
            "content": "Paxos agreement protocol uses phase 1a phase 1b phase 2a phase 2b.",
        },
        {
            "chunk_id": "c3",
            "file_path": "research/cs232/tcp.md",
            "heading": "TCP Congestion Control",
            "start_line": 1,
            "end_line": 20,
            "content": "TCP Cubic and Reno control congestion window size.",
        },
    ]

    indexer = search_chunks.BM25Indexer(chunks)

    # Search for Paxos
    results_paxos = indexer.score("paxos consensus")
    assert len(results_paxos) > 0
    assert results_paxos[0][0]["chunk_id"] == "c2"

    # Search for B4 Traffic Engineering
    results_b4 = indexer.score("B4 traffic engineering")
    assert len(results_b4) > 0
    assert results_b4[0][0]["chunk_id"] == "c1"


def test_format_file_link(tmp_path: Path):
    link = search_chunks.format_file_link(tmp_path, "research/cs234/b4.md", 10, 50)
    assert link.startswith("[research/cs234/b4.md#L10-L50](file://")
    assert "#L10-L50" in link
