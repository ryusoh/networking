#!/usr/bin/env python3
"""Phase 3 Host SceneBuilder & Token Governor for research courseware.

Assembles token-bounded context payloads ("Study Scenes") from ranked BM25 search chunks.
Enforces context window budgets and system instructions requiring line-anchored Markdown citations.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.parse_chunks import estimate_tokens
from tools.research.search_chunks import BM25Indexer, format_file_link, load_manifest

DEFAULT_RESEARCH_DIR = Path(__file__).resolve().parent.parent.parent / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"


class SceneBuilder:
    """Host SceneBuilder for assembling token-bounded Study Scenes."""

    def __init__(self, chunks: list[dict[str, Any]], repo_root: Path):
        self.chunks = chunks
        self.repo_root = repo_root
        self.indexer = BM25Indexer(chunks)

    def build_scene(self, query: str, max_tokens: int = 8192, top_k: int = 5) -> dict[str, Any]:
        """Query indexer and assemble a token-bounded Study Scene dictionary."""
        ranked = self.indexer.score(query)
        selected_chunks: list[dict[str, Any]] = []

        system_instruction_tokens = 200
        current_tokens = system_instruction_tokens

        for chunk, score in ranked:
            chunk_tokens = chunk.get("token_count", estimate_tokens(chunk.get("content", "")))
            if current_tokens + chunk_tokens > max_tokens:
                if not selected_chunks:
                    # Truncate content to fit if first chunk exceeds max_tokens
                    allowed_tokens = max(100, max_tokens - system_instruction_tokens)
                    allowed_chars = allowed_tokens * 4
                    truncated_chunk = dict(chunk)
                    truncated_chunk["content"] = chunk["content"][:allowed_chars] + "\n... [Truncated for token budget]"
                    truncated_chunk["token_count"] = allowed_tokens
                    selected_chunks.append(truncated_chunk)
                    current_tokens += allowed_tokens
                break

            chunk_copy = dict(chunk)
            chunk_copy["score"] = score
            selected_chunks.append(chunk_copy)
            current_tokens += chunk_tokens

            if len(selected_chunks) >= top_k:
                break

        formatted_payload = self._render_markdown_scene(query, selected_chunks, current_tokens, max_tokens)

        return {
            "query": query,
            "token_budget": max_tokens,
            "used_tokens": current_tokens,
            "chunk_count": len(selected_chunks),
            "chunks": selected_chunks,
            "markdown_payload": formatted_payload,
        }

    def _render_markdown_scene(
        self, query: str, chunks: list[dict[str, Any]], used_tokens: int, max_tokens: int
    ) -> str:
        lines: list[str] = [
            f"# STUDY SCENE CONTEXT: {query.upper()}",
            f"**Token Budget:** {used_tokens} / {max_tokens} tokens | **Included Chunks:** {len(chunks)}",
            "",
            "## MANDATORY CITATION CONTRACT",
            "When answering or explaining concepts from this context, you MUST cite all claims and code details using exact line-anchored Markdown links in the following format:",
            "`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`",
            "",
            "## SOURCE CONTEXT BLOCKS",
            "",
        ]

        for idx, chunk in enumerate(chunks, start=1):
            file_path = chunk["file_path"]
            start_line = chunk["start_line"]
            end_line = chunk["end_line"]
            link = format_file_link(self.repo_root, file_path, start_line, end_line)
            heading = chunk.get("heading", "Untitled Section")
            content = chunk.get("content", "")

            lines.append(f"### Block {idx}: {heading}")
            lines.append(f"**Source Link:** {link}")
            lines.append("```")
            lines.append(content)
            lines.append("```")
            lines.append("")

        return "\n".join(lines)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Assemble token-bounded Study Scenes for research courseware.")
    parser.add_argument("query", nargs="?", help="Search query or study topic.")
    parser.add_argument(
        "--manifest",
        default=str(DEFAULT_MANIFEST_PATH),
        help="Path to structural chunks manifest JSON.",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=8192,
        help="Maximum token budget for assembled scene.",
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=5,
        help="Maximum number of chunks to include in scene.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit JSON payload instead of Markdown text.",
    )
    args = parser.parse_args(argv)

    if not args.query:
        parser.error("Please provide a search query or study topic.")

    manifest_path = Path(args.manifest).resolve()
    repo_root = manifest_path.parent.parent

    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = load_manifest(manifest_path)
    chunks = manifest_data.get("chunks", [])

    builder = SceneBuilder(chunks, repo_root)
    scene = builder.build_scene(args.query, max_tokens=args.max_tokens, top_k=args.top_k)

    if args.json:
        print(json.dumps(scene, indent=2, ensure_ascii=False))
    else:
        print(scene["markdown_payload"])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
