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
from typing import Any, Sequence

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.memory_host import MemoryHost
from tools.research.parse_chunks import estimate_tokens
from tools.research.search_chunks import BM25Indexer, format_file_link, load_manifest

DEFAULT_RESEARCH_DIR = Path(__file__).resolve().parent.parent.parent / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"
DEFAULT_MEMORY_PATH = DEFAULT_RESEARCH_DIR / ".durable_memory.json"

# File extensions treated as lab code / topology sources for the explicit code slot.
CODE_EXTS = {".p4", ".py", ".gns3"}


class SceneBuilder:
    """Host SceneBuilder for assembling token-bounded Study Scenes."""

    def __init__(self, chunks: list[dict[str, Any]], repo_root: Path, memory_host: MemoryHost | None = None):
        self.chunks = chunks
        self.repo_root = repo_root
        self.indexer = BM25Indexer(chunks)
        self.memory_host = memory_host

    def build_scene(self, query: str, max_tokens: int = 8192, top_k: int = 5) -> dict[str, Any]:
        """Query indexer and assemble a token-bounded Study Scene dictionary."""
        ranked = self.indexer.score(query)
        selected_chunks: list[dict[str, Any]] = []

        system_instruction_tokens = 200
        current_tokens = system_instruction_tokens

        memory_context = ""
        memory_tokens = 0
        if self.memory_host is not None:
            report = self.memory_host.get_student_report()
            if report["total_topics_tracked"] > 0:
                memory_context = self.memory_host.render_memory_context()
                memory_section = self._render_memory_section(memory_context)
                memory_tokens = estimate_tokens(memory_section)
                current_tokens += memory_tokens

        def try_add(chunk: dict[str, Any], score: float, slot: str) -> bool:
            """Append a chunk to the scene if it fits the token budget."""
            nonlocal current_tokens
            chunk_tokens = chunk.get("token_count", estimate_tokens(chunk.get("content", "")))
            if current_tokens + chunk_tokens > max_tokens:
                if not selected_chunks:
                    # Truncate content to fit if the first chunk exceeds max_tokens.
                    allowed_tokens = max(100, max_tokens - system_instruction_tokens - memory_tokens)
                    allowed_chars = allowed_tokens * 4
                    truncated_chunk = dict(chunk)
                    truncated_chunk["content"] = chunk["content"][:allowed_chars] + "\n... [Truncated for token budget]"
                    truncated_chunk["token_count"] = allowed_tokens
                    truncated_chunk["score"] = score
                    truncated_chunk["slot"] = slot
                    selected_chunks.append(truncated_chunk)
                    current_tokens += allowed_tokens
                return False

            chunk_copy = dict(chunk)
            chunk_copy["score"] = score
            chunk_copy["slot"] = slot
            selected_chunks.append(chunk_copy)
            current_tokens += chunk_tokens
            return True

        if ranked:
            primary_chunk, primary_score = ranked[0]
            code_pool = [
                (c, s)
                for c, s in ranked[1:]
                if Path(c["file_path"]).suffix.lower() in CODE_EXTS
            ]
            code_ids = {c["chunk_id"] for c, _ in code_pool}
            prereq_pool = [
                (c, s)
                for c, s in ranked[1:]
                if c["chunk_id"] not in code_ids
            ]

            try_add(primary_chunk, primary_score, "primary")
            for chunk, score in prereq_pool:
                if len(selected_chunks) >= top_k:
                    break
                try_add(chunk, score, "prereq")
            for chunk, score in code_pool[:1]:
                if len(selected_chunks) >= top_k:
                    break
                try_add(chunk, score, "code")

        formatted_payload = self._render_markdown_scene(
            query, selected_chunks, current_tokens, max_tokens, memory_context
        )

        return {
            "query": query,
            "token_budget": max_tokens,
            "used_tokens": current_tokens,
            "chunk_count": len(selected_chunks),
            "chunks": selected_chunks,
            "memory_injected": bool(memory_context),
            "markdown_payload": formatted_payload,
        }

    def _render_memory_section(self, memory_context: str) -> str:
        """Render the durable-memory context block as it appears in the payload."""
        return "\n".join(
            [
                "",
                "## DURABLE MEMORY CONTEXT",
                "Use the student's known strengths and weaknesses below to tailor depth and emphasis.",
                "",
                memory_context,
                "",
            ]
        )

    def _render_markdown_scene(
        self, query: str, chunks: list[dict[str, Any]], used_tokens: int, max_tokens: int, memory_context: str = ""
    ) -> str:
        lines: list[str] = [
            f"# STUDY SCENE CONTEXT: {query.upper()}",
            f"**Token Budget:** {used_tokens} / {max_tokens} tokens | **Included Chunks:** {len(chunks)}",
            "",
            "## MANDATORY CITATION CONTRACT",
            "When answering or explaining concepts from this context, you MUST cite all claims and code details using exact line-anchored Markdown links in the following format:",
            "`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`",
        ]

        if memory_context:
            lines.append(self._render_memory_section(memory_context))
        else:
            lines.append("")

        lines.extend(
            [
                "## SOURCE CONTEXT BLOCKS",
                "",
            ]
        )

        for idx, chunk in enumerate(chunks, start=1):
            file_path = chunk["file_path"]
            start_line = chunk["start_line"]
            end_line = chunk["end_line"]
            heading = chunk.get("heading", "Untitled Section")
            content = chunk.get("content", "")
            slot = chunk.get("slot", "primary")
            link = format_file_link(self.repo_root, file_path, start_line, end_line, label=heading)

            lines.append(f"### Block {idx}: [{slot.upper()}] {heading}")
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
    parser.add_argument(
        "--memory",
        default=str(DEFAULT_MEMORY_PATH),
        help="Path to durable-memory JSON (default: research/.durable_memory.json).",
    )
    args = parser.parse_args(argv)

    if not args.query:
        parser.error("Please provide a search query or study topic.")

    manifest_path = Path(args.manifest).resolve()
    repo_root = manifest_path.parent.parent
    memory_path = Path(args.memory).resolve()

    if not manifest_path.exists():
        parser.error(
            f"Manifest file not found at {manifest_path}. Run 'python3 tools/research/parse_chunks.py' first."
        )

    manifest_data = load_manifest(manifest_path)
    chunks = manifest_data.get("chunks", [])

    memory_host = MemoryHost(memory_path)
    builder = SceneBuilder(chunks, repo_root, memory_host=memory_host)
    scene = builder.build_scene(args.query, max_tokens=args.max_tokens, top_k=args.top_k)

    if args.json:
        print(json.dumps(scene, indent=2, ensure_ascii=False))
    else:
        print(scene["markdown_payload"])

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
