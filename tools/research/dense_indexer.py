#!/usr/bin/env python3
"""Phase 2 dense vector index for research courseware.

Provides a lightweight, dependency-free dense indexer using deterministic
random-unit-vector embeddings. The vectors are reproducible given the same
input text and are cached alongside the chunks manifest so the index build is
one-off per corpus.

This is intentionally a local, pluggable embedding approach. Replace the
_embed method (or inject an embedder) to use a real semantic model later.
"""

from __future__ import annotations

import hashlib
import json
import math
import random
from pathlib import Path
from typing import Any


class DenseIndexer:
    """Deterministic dense vector indexer with cosine-similarity ranking."""

    def __init__(
        self,
        chunks: list[dict[str, Any]],
        repo_root: Path,
        vector_dim: int = 64,
        cache_name: str = ".dense_vectors.json",
    ):
        self.chunks = chunks
        self.repo_root = repo_root
        self.vector_dim = vector_dim
        self.cache_path = repo_root / "research" / cache_name
        self.vectors: dict[str, list[float]] = {}

    @staticmethod
    def _seed_from_text(text: str) -> int:
        return int(hashlib.md5(text.encode("utf-8")).hexdigest(), 16)

    def _random_unit_vector(self, seed: int) -> list[float]:
        rng = random.Random(seed)
        vec = [rng.uniform(-1.0, 1.0) for _ in range(self.vector_dim)]
        norm = math.sqrt(sum(v * v for v in vec))
        if norm == 0.0:
            norm = 1.0
        return [v / norm for v in vec]

    def _embed(self, text: str) -> list[float]:
        """Return a deterministic unit vector for ``text``."""
        return self._random_unit_vector(self._seed_from_text(text))

    @staticmethod
    def _cosine_similarity(a: list[float], b: list[float]) -> float:
        return sum(x * y for x, y in zip(a, b))

    def build_index(self, force: bool = False) -> None:
        """Build or load the dense vector cache."""
        if not force and self.cache_path.exists():
            try:
                data = json.loads(self.cache_path.read_text(encoding="utf-8"))
                if (
                    data.get("vector_dim") == self.vector_dim
                    and data.get("count") == len(self.chunks)
                ):
                    self.vectors = {cid: vec for cid, vec in data["vectors"].items()}
                    return
            except Exception:
                pass

        self.vectors = {}
        for chunk in self.chunks:
            text = f"{chunk.get('heading', '')} {chunk.get('content', '')}"
            self.vectors[chunk["chunk_id"]] = self._embed(text)
        self._save_cache()

    def _save_cache(self) -> None:
        self.cache_path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "vector_dim": self.vector_dim,
            "count": len(self.chunks),
            "vectors": self.vectors,
        }
        self.cache_path.write_text(json.dumps(data), encoding="utf-8")

    def score(self, query: str) -> list[tuple[dict[str, Any], float]]:
        """Rank chunks by cosine similarity to the query embedding."""
        if not self.vectors:
            self.build_index()

        query_vec = self._embed(query)
        results: list[tuple[dict[str, Any], float]] = []
        for chunk in self.chunks:
            cid = chunk["chunk_id"]
            vec = self.vectors.get(cid)
            if vec is None:
                continue
            sim = self._cosine_similarity(query_vec, vec)
            if sim > 0.0:
                results.append((chunk, round(sim, 4)))

        results.sort(key=lambda item: item[1], reverse=True)
        return results
