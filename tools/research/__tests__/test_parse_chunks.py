"""Unit tests for Phase 1 Structural Chunking Engine (tools/parse_research_chunks.py)."""

from pathlib import Path
from tools.research import parse_chunks


def test_parse_markdown_file_splits_on_headers_and_tracks_lines(tmp_path: Path):
    sample_md = tmp_path / "sample.md"
    sample_md.write_text(
        "# Title Header\n"
        "Line 2 preamble text.\n"
        "Line 3 preamble text.\n"
        "## Subheader One\n"
        "Line 5 section content.\n"
        "```python\n"
        "# ## Header inside code block should not split\n"
        "print('hello')\n"
        "```\n"
        "Line 10 section content.\n"
    )

    chunks = parse_chunks.parse_markdown_file(sample_md, tmp_path)
    assert len(chunks) == 2

    # Chunk 1: Title Header
    assert chunks[0]["heading"] == "Title Header"
    assert chunks[0]["start_line"] == 1
    assert chunks[0]["end_line"] == 3

    # Chunk 2: Subheader One (includes code block with embedded header string)
    assert chunks[1]["heading"] == "Subheader One"
    assert chunks[1]["start_line"] == 4
    assert chunks[1]["end_line"] == 10
    assert "print('hello')" in chunks[1]["content"]


def test_parse_source_code_file(tmp_path: Path):
    code_file = tmp_path / "test.p4"
    code_file.write_text("header Ethernet {\n    bit<48> dstAddr;\n}\n")

    chunks = parse_chunks.parse_source_code_file(code_file, tmp_path)
    assert len(chunks) == 1
    assert chunks[0]["start_line"] == 1
    assert chunks[0]["end_line"] == 3
    assert chunks[0]["heading"] == "Code File (test.p4)"


def test_build_chunks_manifest(tmp_path: Path):
    research_dir = tmp_path / "research"
    research_dir.mkdir()
    (research_dir / "note.md").write_text("# Note\nContent here.\n")

    manifest = parse_chunks.build_chunks_manifest(research_dir, tmp_path)
    assert manifest["metadata"]["total_files_parsed"] == 1
    assert manifest["metadata"]["total_chunks"] == 1
    assert manifest["chunks"][0]["heading"] == "Note"

