"""Unit tests for Phase 4 Citation Verification Engine (tools/research/citation_engine.py)."""

from pathlib import Path
from tools.research.citation_engine import CitationEngine


def test_citation_engine_extracts_and_validates_correct_links(tmp_path: Path):
    target_file = tmp_path / "sample.md"
    target_file.write_text("Line 1\nLine 2\nLine 3\nLine 4\nLine 5\n")

    engine = CitationEngine(repo_root=tmp_path)

    # Text containing valid citation
    text = (
        "According to [sample.md#L1-L3](file://"
        + str(target_file)
        + "#L1-L3), Paxos requires a majority."
    )

    report = engine.verify_text(text)
    assert report["is_valid"] is True
    assert report["total_citations"] == 1
    assert report["valid_citations"] == 1
    assert report["invalid_citations"] == 0


def test_citation_engine_detects_non_existent_file(tmp_path: Path):
    engine = CitationEngine(repo_root=tmp_path)

    text = "See [does_not_exist.md#L1-L10](file:///tmp/does_not_exist.md#L1-L10)"
    report = engine.verify_text(text)

    assert report["is_valid"] is False
    assert report["invalid_citations"] == 1
    assert "File not found" in report["details"][0]["error"]


def test_citation_engine_detects_out_of_bounds_line_range(tmp_path: Path):
    target_file = tmp_path / "small.md"
    target_file.write_text("Line 1\nLine 2\n")

    engine = CitationEngine(repo_root=tmp_path)

    # Line 100 exceeds file size (2 lines)
    text = (
        "Check [small.md#L100-L200](file://"
        + str(target_file)
        + "#L100-L200)"
    )

    report = engine.verify_text(text)
    assert report["is_valid"] is False
    assert report["invalid_citations"] == 1
    assert "exceeds total file lines" in report["details"][0]["error"]
