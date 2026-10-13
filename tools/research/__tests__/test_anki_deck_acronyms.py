"""Unit tests for deck-derived acronym exemptions (tools/research/anki_deck_acronyms.py)."""

import gzip
import json
from pathlib import Path

from tools.research import anki_card_validator as validator
from tools.research.anki_deck_acronyms import (
    exempt_acronyms,
    main,
    scan_acronyms,
)


def _note(flds: str, deck: str = "金融") -> dict:
    return {"flds": flds, "deck": deck}


def test_scan_counts_notes_and_prior_expansion():
    notes = [
        _note("<div>AI accelerator</div>"),
        _note("AI (Artificial Intelligence) 加速器和 GPU"),
        _note("GPU again"),
        _note("AI in another deck", deck="言語"),
    ]
    stats = scan_acronyms(notes)
    assert stats["AI"] == {"notes": 3, "expanded": True}
    assert stats["GPU"] == {"notes": 2, "expanded": False}

    fin_only = scan_acronyms(notes, deck="金融")
    assert fin_only["AI"]["notes"] == 2


def test_exempt_rule_is_expanded_or_frequent():
    stats = {
        "AI": {"notes": 100, "expanded": False},
        "CPI": {"notes": 3, "expanded": True},
        "ZQXV": {"notes": 1, "expanded": False},
    }
    assert exempt_acronyms(stats, threshold=25) == ["AI", "CPI"]


def test_main_writes_cache(tmp_path: Path):
    notes_path = tmp_path / "notes.json.gz"
    with gzip.open(notes_path, "wt", encoding="utf-8") as f:
        json.dump([_note("AI (Artificial Intelligence)"), _note("GPU")], f)
    out = tmp_path / "cache.json"

    assert main(["--notes", str(notes_path), "--output", str(out)]) == 0
    cache = json.loads(out.read_text(encoding="utf-8"))
    assert cache["deck"] == "金融"
    assert cache["threshold"] == 25
    assert "AI" in cache["exempt"]
    assert cache["acronyms"]["GPU"] == {"notes": 1, "expanded": False}


def _cache_file(tmp_path: Path, exempt: list[str]) -> Path:
    path = tmp_path / ".anki_deck_acronyms.json"
    path.write_text(json.dumps({"threshold": 25, "exempt": exempt}), encoding="utf-8")
    return path


def _card_with_acronym(acronym: str) -> dict:
    return {
        "chunk_id": "research/x.md:chunk-1",
        "front": f"<strong>概念</strong>: {acronym} 的机制是什么？",
        "back": (
            "<b>机制:</b> 机制说明。<br><br>"
            "<b>定量锚点:</b> 数字 \\(1\\)。<br><br>"
            "<b>源码与文档引用 (Source Citation):</b> "
            "[research/x.md#L1-L5](file:///tmp/x.md#L1-L5)"
        ),
        "tags": ["research"],
    }


def test_validator_exempts_deck_taught_acronyms(monkeypatch, tmp_path: Path):
    """An acronym in the cache needs no on-card expansion."""
    monkeypatch.setattr(
        validator, "DEFAULT_DECK_ACRONYMS_PATH", _cache_file(tmp_path, ["AI"])
    )
    validator._DECK_EXEMPT_MEMO.clear()
    assert validator.validate_cards([_card_with_acronym("AI")]) == {}


def test_validator_still_flags_unknown_acronyms(monkeypatch, tmp_path: Path):
    """Acronyms absent from the cache and static list stay gated."""
    monkeypatch.setattr(
        validator, "DEFAULT_DECK_ACRONYMS_PATH", _cache_file(tmp_path, ["AI"])
    )
    validator._DECK_EXEMPT_MEMO.clear()
    issues = validator.validate_cards([_card_with_acronym("ZQXV")])
    assert issues
    assert any("ZQXV" in issue for issue in next(iter(issues.values())))


def test_validator_falls_back_to_static_list_without_cache(monkeypatch, tmp_path: Path):
    """A missing cache restores pre-cache strictness."""
    monkeypatch.setattr(
        validator, "DEFAULT_DECK_ACRONYMS_PATH", tmp_path / "missing.json"
    )
    validator._DECK_EXEMPT_MEMO.clear()
    issues = validator.validate_cards([_card_with_acronym("AI")])
    assert issues
    assert any("AI" in issue for issue in next(iter(issues.values())))
