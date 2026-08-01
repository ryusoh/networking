#!/usr/bin/env python3
"""Structural Parser and Line Mapping Engine for research courseware.

Ingests Markdown (.md) sidecars, lecture slides, source code (.p4, .py, .c, .h),
and network topology manifests (.gns3) within research/ to build a structured
chunk index with line-number offset maps.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Sequence

HEADER_PATTERN = re.compile(r"^(#{1,6})\s+(.+)$")
SLIDE_PATTERN = re.compile(r"^\s*<!--\s*slide\s*-->\s*$", re.IGNORECASE)

DEFAULT_RESEARCH_DIR = Path(__file__).resolve().parent.parent / "research"
DEFAULT_MANIFEST_PATH = DEFAULT_RESEARCH_DIR / ".chunks_manifest.json"

CODE_EXTENSIONS = {".p4", ".py", ".c", ".h", ".gns3", ".json", ".sh"}


def estimate_tokens(text: str) -> int:
    """Rough token estimation (approx 4 chars per token)."""
    return max(1, len(text) // 4)


def parse_markdown_file(file_path: Path, repo_root: Path) -> list[dict[str, Any]]:
    """Parse a Markdown file into structural heading/slide-based chunks with line offsets."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return []

    lines = content.splitlines()
    if not lines:
        return []

    rel_path = str(file_path.relative_to(repo_root))
    chunks: list[dict[str, Any]] = []

    current_heading = "Preamble"
    current_start_line = 1
    current_lines: list[str] = []
    in_code_block = False
    chunk_index = 1

    for line_idx, line in enumerate(lines, start=1):
        # Check code block toggle
        if line.strip().startswith("```"):
            in_code_block = not in_code_block

        is_header = not in_code_block and HEADER_PATTERN.match(line)
        is_slide = not in_code_block and SLIDE_PATTERN.match(line)

        if (is_header or is_slide) and current_lines:
            # Finalize previous chunk if non-empty
            chunk_text = "\n".join(current_lines).strip()
            if chunk_text:
                chunk_id = f"{rel_path}:chunk-{chunk_index}"
                chunks.append(
                    {
                        "chunk_id": chunk_id,
                        "file_path": rel_path,
                        "heading": current_heading,
                        "start_line": current_start_line,
                        "end_line": line_idx - 1,
                        "token_count": estimate_tokens(chunk_text),
                        "content": chunk_text,
                    }
                )
                chunk_index += 1

            current_lines = []
            current_start_line = line_idx

        if is_header:
            match = HEADER_PATTERN.match(line)
            if match:
                current_heading = match.group(2).strip()
        elif is_slide:
            current_heading = f"Slide (Line {line_idx})"

        current_lines.append(line)

    # Finalize trailing chunk
    if current_lines:
        chunk_text = "\n".join(current_lines).strip()
        if chunk_text:
            chunk_id = f"{rel_path}:chunk-{chunk_index}"
            chunks.append(
                {
                    "chunk_id": chunk_id,
                    "file_path": rel_path,
                    "heading": current_heading,
                    "start_line": current_start_line,
                    "end_line": len(lines),
                    "token_count": estimate_tokens(chunk_text),
                    "content": chunk_text,
                }
            )

    return chunks


def parse_source_code_file(file_path: Path, repo_root: Path) -> list[dict[str, Any]]:
    """Parse a code or topology file as an intact structural chunk."""
    try:
        content = file_path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return []

    lines = content.splitlines()
    if not lines:
        return []

    rel_path = str(file_path.relative_to(repo_root))
    chunk_text = content.strip()
    if not chunk_text:
        return []

    return [
        {
            "chunk_id": f"{rel_path}:chunk-1",
            "file_path": rel_path,
            "heading": f"Code File ({file_path.name})",
            "start_line": 1,
            "end_line": len(lines),
            "token_count": estimate_tokens(chunk_text),
            "content": chunk_text,
        }
    ]


def build_chunks_manifest(research_dir: Path, repo_root: Path) -> dict[str, Any]:
    """Scan research directory and build structural chunk manifest."""
    all_chunks: list[dict[str, Any]] = []
    file_count = 0

    for root, _, files in os.walk(research_dir):
        for file_name in sorted(files):
            file_path = Path(root) / file_name
            # Skip hidden files or git objects
            if file_name.startswith(".") or ".git" in file_path.parts:
                continue

            ext = file_path.suffix.lower()
            if ext == ".md":
                chunks = parse_markdown_file(file_path, repo_root)
                if chunks:
                    all_chunks.extend(chunks)
                    file_count += 1
            elif ext in CODE_EXTENSIONS:
                chunks = parse_source_code_file(file_path, repo_root)
                if chunks:
                    all_chunks.extend(chunks)
                    file_count += 1

    total_tokens = sum(chunk["token_count"] for chunk in all_chunks)
    manifest = {
        "metadata": {
            "total_files_parsed": file_count,
            "total_chunks": len(all_chunks),
            "total_estimated_tokens": total_tokens,
            "version": "1.0.0",
        },
        "chunks": all_chunks,
    }
    return manifest


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build structural chunk manifest for research courseware.")
    parser.add_argument(
        "--research-dir",
        default=str(DEFAULT_RESEARCH_DIR),
        help="Path to research directory.",
    )
    parser.add_argument(
        "--output",
        default=str(DEFAULT_MANIFEST_PATH),
        help="Path to output JSON manifest.",
    )
    args = parser.parse_args(argv)

    research_dir = Path(args.research_dir).resolve()
    repo_root = research_dir.parent
    output_path = Path(args.output).resolve()

    if not research_dir.exists():
        print(f"Error: Research directory not found at {research_dir}", file=sys.stderr)
        return 1

    manifest = build_chunks_manifest(research_dir, repo_root)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")

    meta = manifest["metadata"]
    print(f"Successfully generated structural chunk manifest: {output_path}")
    print(f"Parsed Files: {meta['total_files_parsed']}")
    print(f"Total Chunks: {meta['total_chunks']}")
    print(f"Estimated Tokens: {meta['total_estimated_tokens']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
