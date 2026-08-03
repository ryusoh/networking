"""Tests for the Anki TSV card validator."""
from pathlib import Path

from tools.research.anki_card_validator import validate_tsv


def _write_tsv(tmp_path: Path, rows: list[str]) -> Path:
    p = tmp_path / "test_import.txt"
    p.write_text("#separator:Tab\n#html:true\n" + "\n".join(rows) + "\n", encoding="utf-8")
    return p


def _card_issues(issues: dict, card_num: int) -> list[str]:
    for key, vals in issues.items():
        if key.startswith(f"card {card_num} "):
            return vals
    return []


def _all_issue_texts(issues: dict) -> list[str]:
    return [text for vals in issues.values() for text in vals]


def test_clean_card_passes(tmp_path: Path) -> None:
    rows = [
        "What is BGP?\t<div>Border Gateway Protocol</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    assert validate_tsv(path) == {}


def test_control_characters_are_flagged(tmp_path: Path) -> None:
    rows = [
        "BGP basics\t<div>peers\x01path vector\x02</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("control character" in i for i in _all_issue_texts(issues))


def test_slide_title_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Wireless, Mobile Networks 6-58: question\t<div>Mobile IP</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("slide title" in i for i in _all_issue_texts(issues))


def test_generic_topic_is_flagged(tmp_path: Path) -> None:
    rows = ["BGP basics\t<div>content</div>\tresearch networking"]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("generic topic" in i.lower() for i in _all_issue_texts(issues))


def test_duplicate_titles_within_batch_are_flagged(tmp_path: Path) -> None:
    rows = [
        "BGP Path Vector\t<div>a</div>\tresearch networking",
        "BGP Path Vector: ask\t<div>b</div>\tresearch networking",
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("duplicate title" in i.lower() for i in _all_issue_texts(issues))


def test_ocr_errors_are_flagged(tmp_path: Path) -> None:
    rows = [
        "Question\t<div>limi e due to the q frequent changes</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("ocr" in i.lower() for i in _all_issue_texts(issues))
