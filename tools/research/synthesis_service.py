#!/usr/bin/env python3
"""Phase 2.5 SynthesisService: deterministic cross-course comparative scene assembly.

The interactive host agent supplies the synthesis prose; this module only
retrieves and assembles token-bounded source context from two topics.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.parse_chunks import estimate_tokens
from tools.research.search_chunks import BM25Indexer, format_file_link, load_manifest

DEFAULT_RESEARCH_DIR = Path(__file__).resolve().parent.parent.parent / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"


def _course_prefix(file_path: str) -> str | None:
    """Extract the short course code (e.g. cs231) from a chunk path."""
    import re

    parts = file_path.split("/")
    if len(parts) > 1:
        m = re.match(r"(cs2\d\d)", parts[1], re.IGNORECASE)
        if m:
            return m.group(1).lower()
    return None


def build_comparative_scene(
    query_a: str,
    query_b: str,
    chunks: list[dict[str, Any]],
    repo_root: Path,
    max_tokens: int = 8192,
    top_k_per_topic: int = 3,
) -> dict[str, Any]:
    """Assemble a token-bounded comparative scene across two topics.

    Selects up to ``top_k_per_topic`` BM25-ranked chunks for each query,
    preferring chunks whose course prefix differs between the two sides.
    """
    indexer = BM25Indexer(chunks)
    system_instruction_tokens = 200
    current_tokens = system_instruction_tokens
    selected_chunks: list[dict[str, Any]] = []

    def try_add(chunk: dict[str, Any], score: float, side: str) -> bool:
        nonlocal current_tokens
        chunk_tokens = chunk.get("token_count", estimate_tokens(chunk.get("content", "")))
        if current_tokens + chunk_tokens > max_tokens:
            return False
        copy = dict(chunk)
        copy["score"] = score
        copy["side"] = side
        selected_chunks.append(copy)
        current_tokens += chunk_tokens
        return True

    def pick(query: str, side: str) -> None:
        ranked = indexer.score(query)
        seen_courses: set[str | None] = set()
        for chunk, score in ranked:
            if len([c for c in selected_chunks if c["side"] == side]) >= top_k_per_topic:
                break
            course = _course_prefix(chunk["file_path"])
            # Prioritize diversity: if we already picked from this course, still
            # allow it, but try to find a cross-course chunk first by skipping one.
            if course in seen_courses and len(seen_courses) < 2:
                continue
            if try_add(chunk, score, side):
                seen_courses.add(course)

    pick(query_a, "A")
    pick(query_b, "B")

    payload = _render_comparative_scene(query_a, query_b, selected_chunks, current_tokens, max_tokens)
    return {
        "query_a": query_a,
        "query_b": query_b,
        "token_budget": max_tokens,
        "used_tokens": current_tokens,
        "chunk_count": len(selected_chunks),
        "chunks": selected_chunks,
        "markdown_payload": payload,
    }


def _render_comparative_scene(
    query_a: str,
    query_b: str,
    chunks: list[dict[str, Any]],
    used_tokens: int,
    max_tokens: int,
) -> str:
    lines = [
        f"# COMPARATIVE STUDY SCENE: {query_a.upper()} vs {query_b.upper()}",
        f"**Token Budget:** {used_tokens} / {max_tokens} tokens | **Included Chunks:** {len(chunks)}",
        "",
        "## MANDATORY CITATION CONTRACT",
        "When comparing the two topics, cite all claims using exact line-anchored Markdown links in the following format:",
        "`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`",
        "",
        "## SOURCE CONTEXT BLOCKS",
        "",
    ]

    current_side: str | None = None
    for chunk in chunks:
        side = chunk.get("side", "A")
        if side != current_side:
            lines.append(f"### Topic {side}: {query_a if side == 'A' else query_b}")
            current_side = side

        file_path = chunk["file_path"]
        start_line = chunk["start_line"]
        end_line = chunk["end_line"]
        heading = chunk.get("heading", "Untitled Section")
        content = chunk.get("content", "")
        link = format_file_link(repo_root=REPO_ROOT, file_path=file_path, start_line=start_line, end_line=end_line, label=heading)

        lines.append(f"#### {heading}")
        lines.append(f"**Source Link:** {link}")
        lines.append("```")
        lines.append(content)
        lines.append("```")
        lines.append("")

    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Assemble cross-course comparative scenes for synthesis.")
    parser.add_argument("query_a", help="First topic/query.")
    parser.add_argument("query_b", help="Second topic/query.")
    parser.add_argument("--manifest", default=str(DEFAULT_MANIFEST_PATH), help="Path to chunks manifest JSON.")
    parser.add_argument("--max-tokens", type=int, default=8192, help="Maximum token budget.")
    parser.add_argument("--top-k-per-topic", type=int, default=3, help="Chunks to include per topic.")
    parser.add_argument("--json", action="store_true", help="Emit JSON payload instead of Markdown text.")
    args = parser.parse_args(argv)

    manifest_path = Path(args.manifest).resolve()
    repo_root = manifest_path.parent.parent
    if not manifest_path.exists():
        parser.error(f"Manifest not found at {manifest_path}. Run parse_chunks.py first.")

    manifest_data = load_manifest(manifest_path)
    scene = build_comparative_scene(
        args.query_a,
        args.query_b,
        manifest_data.get("chunks", []),
        repo_root=repo_root,
        max_tokens=args.max_tokens,
        top_k_per_topic=args.top_k_per_topic,
    )

    if args.json:
        print(json.dumps(scene, indent=2, ensure_ascii=False))
    else:
        print(scene["markdown_payload"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
