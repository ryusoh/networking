#!/usr/bin/env python3
"""Phase 2 Hybrid Lexical Search Engine (BM25 + Rank Fusion) for research courseware.

Searches over the structural chunks manifest generated in Phase 1 (research/.chunks_manifest.json),
ranking chunks by BM25 Okapi term frequency, document length normalization, and heading relevance.
Emits clickable Markdown file links with exact line ranges.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
from pathlib import Path
from typing import Any, Sequence

DEFAULT_RESEARCH_DIR = Path(__file__).resolve().parent.parent.parent / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"

WORD_PATTERN = re.compile(r"\b\w+\b")


def tokenize(text: str) -> list[str]:
    """Tokenize text into lowercase alphanumeric terms."""
    return WORD_PATTERN.findall(text.lower())


class BM25Indexer:
    """BM25 Okapi indexer and ranker for structural chunks."""

    def __init__(self, chunks: list[dict[str, Any]], k1: float = 1.5, b: float = 0.75):
        self.chunks = chunks
        self.k1 = k1
        self.b = b
        self.num_chunks = len(chunks)

        self.doc_tokens: list[list[str]] = []
        self.doc_lens: list[int] = []
        self.doc_term_freqs: list[dict[str, int]] = []
        self.df: dict[str, int] = {}
        self.avg_doc_len: float = 0.0

        self._build_index()

    def _build_index(self) -> None:
        total_len = 0
        for chunk in self.chunks:
            # Combine heading and content for indexing, giving heading higher representation
            text = f"{chunk.get('heading', '')} {chunk.get('heading', '')} {chunk.get('content', '')}"
            tokens = tokenize(text)
            self.doc_tokens.append(tokens)

            doc_len = len(tokens)
            self.doc_lens.append(doc_len)
            total_len += doc_len

            tf: dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
            self.doc_term_freqs.append(tf)

            for token in tf.keys():
                self.df[token] = self.df.get(token, 0) + 1

        self.avg_doc_len = (total_len / self.num_chunks) if self.num_chunks > 0 else 1.0

    def _compute_base_scores(self, query_tokens: list[str]) -> list[float]:
        """Compute base BM25 scores for all chunks given query tokens."""
        scores: list[float] = [0.0] * self.num_chunks
        for token in query_tokens:
            doc_freq = self.df.get(token, 0)
            if doc_freq == 0:
                continue

            # BM25 IDF formula
            idf = math.log((self.num_chunks - doc_freq + 0.5) / (doc_freq + 0.5) + 1.0)

            for idx in range(self.num_chunks):
                tf = self.doc_term_freqs[idx].get(token, 0)
                if tf == 0:
                    continue

                doc_len = self.doc_lens[idx]
                numerator = tf * (self.k1 + 1.0)
                denominator = tf + self.k1 * (1.0 - self.b + self.b * (doc_len / self.avg_doc_len))
                scores[idx] += idf * (numerator / denominator)
        return scores

    def _calculate_boost(self, chunk: dict[str, Any], query_tokens: list[str]) -> float:
        """Calculate score multiplier based on heading and path matches."""
        heading_lower = chunk.get("heading", "").lower()
        file_path_lower = chunk.get("file_path", "").lower()
        boost = 1.0
        for token in query_tokens:
            if token in heading_lower:
                boost += 0.5
            if token in file_path_lower:
                boost += 0.3
        return boost

    def score(self, query: str) -> list[tuple[dict[str, Any], float]]:
        """Score and rank chunks for a given query string."""
        query_tokens = tokenize(query)
        if not query_tokens or self.num_chunks == 0:
            return []

        scores = self._compute_base_scores(query_tokens)

        # Apply heading boost if query terms appear in heading or file path
        results: list[tuple[dict[str, Any], float]] = []
        for idx, base_score in enumerate(scores):
            if base_score <= 0:
                continue

            chunk = self.chunks[idx]
            boost = self._calculate_boost(chunk, query_tokens)
            final_score = base_score * boost
            results.append((chunk, round(final_score, 4)))

        results.sort(key=lambda item: item[1], reverse=True)
        return results


def load_manifest(manifest_path: Path) -> dict[str, Any]:
    """Load structural chunks manifest JSON."""
    with open(manifest_path, encoding="utf-8") as handle:
        data: dict[str, Any] = json.load(handle)
    return data


def format_file_link(repo_root: Path, file_path: str, start_line: int, end_line: int) -> str:
    """Format absolute file URI for terminal/markdown link rendering."""
    abs_path = (repo_root / file_path).resolve()
    return f"[{file_path}#L{start_line}-L{end_line}](file://{abs_path}#L{start_line}-L{end_line})"


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="BM25 search over research courseware structural chunks.")
    parser.add_argument("query", nargs="?", help="Search query string.")
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH),
        help="Path to structural chunks manifest JSON.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=5,
        help="Maximum search results to return.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit JSON output instead of text.",
    )
    args = parser.parse_args(argv)

    if not args.query:
        parser.error("Please provide a search query.")

    manifest_path = Path(args.manifest).resolve()
    repo_root = manifest_path.parent.parent

    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = load_manifest(manifest_path)
    chunks = manifest_data.get("chunks", [])

    indexer = BM25Indexer(chunks)
    ranked_results = indexer.score(args.query)[: args.limit]

    if args.json:
        output = [
            {
                "chunk_id": item[0]["chunk_id"],
                "file_path": item[0]["file_path"],
                "heading": item[0]["heading"],
                "start_line": item[0]["start_line"],
                "end_line": item[0]["end_line"],
                "score": item[1],
                "content_snippet": item[0]["content"][:200],
            }
            for item in ranked_results
        ]
        print(json.dumps(output, indent=2, ensure_ascii=False))
    else:
        if not ranked_results:
            print(f"No results found for query: '{args.query}'")
            return 0

        print(f"Top {len(ranked_results)} results for query: '{args.query}'\n")
        for rank_idx, (chunk, score) in enumerate(ranked_results, start=1):
            link = format_file_link(repo_root, chunk["file_path"], chunk["start_line"], chunk["end_line"])
            heading = chunk.get("heading", "Untitled")
            snippet = chunk.get("content", "").replace("\n", " ")[:150]

            print(f"{rank_idx}. [{score:.2f}] {heading}")
            print(f"   Link: {link}")
            print(f"   Snippet: {snippet}...\n")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
