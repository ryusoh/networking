"""Validate a generated Anki TSV package before import.

Flags common quality problems that slip through the generator's chunk-level
gate: control characters, slide-number titles, ASCII diagrams, OCR fragments,
and generic topic labels that don't ask a concrete question.

Usage:
    python3 tools/research/anki_card_validator.py research/anki_import.txt
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

FIELD_SEP = "\t"
CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0b-\x1f\x7f-\x9f]")
SLIDE_TITLE_PATTERNS = [
    re.compile(r"Network Layer\s+\d+-\d+", re.IGNORECASE),
    re.compile(r"Wireless,\s*Mobile Networks\s+\d+-\d+", re.IGNORECASE),
    re.compile(r"\b\d+-\d+\b.*Mobile IP", re.IGNORECASE),
    re.compile(r"^Page\s+\d+\s*:", re.IGNORECASE),
]
DIAGRAM_PATTERNS = [
    re.compile(r"\b(R|H|F|M|G|V)\s*bit\b", re.IGNORECASE),
    re.compile(r"\btype\s*=\s*\d+\b.*\bcode\s*=\s*\d+\b", re.IGNORECASE),
    re.compile(r"\d+\s+\d+\s+\d+\s+\d+\s*$"),  # column headers like 0 8 16 24
    # router ID lists like "Router1 Router2"; (?!\.\w) exempts domains like router137.cerf.edu
    re.compile(r"\b(?:AS\s+\d+|Router\d+|router\d+)(?!\.\w)\b", re.IGNORECASE),
]
GENERIC_TOPIC_LABELS = {
    "bgp basics",
    "lsa updates",
    "link-state routing",
    "distance vector",
    "network layer",
    "transport layer",
    "introduction",
    "overview",
    "summary",
    "conclusion",
}
OCR_ERROR_PATTERNS = [
    re.compile(r"\b(limi|limi e)\b", re.IGNORECASE),
    re.compile(r"\bq\s+[a-z]+", re.IGNORECASE),  # q frequent
    re.compile(r"Ø\s+"),
]
PAPER_METADATA_PATTERNS = [
    re.compile(r"Categories and Subject Descriptors", re.IGNORECASE),
    re.compile(r"\bGeneral Terms\s*:", re.IGNORECASE),
    re.compile(r"Additional Key Words", re.IGNORECASE),
    re.compile(r"Permission to make digital", re.IGNORECASE),
    re.compile(r"\b\d+\.\s+(?:INTRODUCTION|BACKGROUND|CONCLUSION|RELATED WORK)\b"),
]
ALLCAPS_NAME_RUN_RE = re.compile(r"\b[A-Z]{2,}\s+[A-Z]\.?\s*[A-Z]{2,}\b")
ORG_KEYWORD_RE = re.compile(
    r"\b(?:University|Institute|Laboratories|Laboratory|International|SRI)\b"
)
DATE_STAMP_RE = re.compile(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b")
TEMPLATE_FRONT_RE = re.compile(r"【.+】的核心技术机制、计算公式与工程应用是什么？?$")


def _count_control_chars(text: str) -> int:
    return len(CONTROL_CHAR_RE.findall(text))


def _has_slide_title(front: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", front)
    return any(pat.search(plain) for pat in SLIDE_TITLE_PATTERNS)


def _has_diagram_artifacts(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in DIAGRAM_PATTERNS)


def _is_generic_topic(front: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", front).strip().rstrip(":?").lower()
    # Extract the topic before the Chinese question part
    topic = plain.split(":")[0].strip().lower()
    return topic in GENERIC_TOPIC_LABELS or len(topic) < 8


def _has_ocr_errors(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in OCR_ERROR_PATTERNS)


def _question_matches_answer(front: str, back: str) -> bool:
    """Basic sanity check: if the front asks for a numbered list, the back should mention it."""
    plain_front = re.sub(r"<[^>]+>", "", front)
    plain_back = re.sub(r"<[^>]+>", "", back)
    # If front mentions "4 级选路优先级" (4-level route selection), back should mention selection levels
    if "4 级" in plain_front or "四级" in plain_front or "4级" in plain_front:
        if "优先级" in plain_front and "选路" in plain_front:
            return "优先级" in plain_back or "决策" in plain_back or "local-pref" in plain_back.lower()
    return True


def _has_paper_metadata(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in PAPER_METADATA_PATTERNS)


def _has_author_block(back: str) -> bool:
    """Author/affiliation dump: an ALL-CAPS name run next to an org keyword."""
    plain = re.sub(r"<[^>]+>", "", back)
    return bool(ALLCAPS_NAME_RUN_RE.search(plain) and ORG_KEYWORD_RE.search(plain))


def _has_date_stamp(text: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", text)
    return bool(DATE_STAMP_RE.search(plain))


def _is_template_front(front: str) -> bool:
    """The generator's fallback front (【topic】的核心技术机制…) is not a real question."""
    plain = re.sub(r"<[^>]+>", "", front).strip()
    return bool(TEMPLATE_FRONT_RE.search(plain))


def _validate_card(front: str, back: str) -> list[str]:
    """Run all single-card quality checks."""
    card_issues: list[str] = []

    ctrl_count = _count_control_chars(front) + _count_control_chars(back)
    if ctrl_count:
        card_issues.append(f"Contains {ctrl_count} control character(s) (PDF extraction artifact)")

    if _has_slide_title(front):
        card_issues.append("Front looks like a slide title/page number, not a conceptual question")

    if _has_diagram_artifacts(back):
        card_issues.append("Back contains ASCII diagram/table fragments instead of explanation")

    if _is_generic_topic(front):
        card_issues.append("Front is a generic topic label, not a specific question")

    if _has_ocr_errors(back):
        card_issues.append("Back contains likely OCR/extraction errors (fragmented words)")

    if _has_paper_metadata(back):
        card_issues.append("Back contains paper metadata dump (ACM categories, section headings)")

    if _has_author_block(back):
        card_issues.append("Back contains author/affiliation block instead of explanation")

    if _has_date_stamp(front) or _has_date_stamp(back):
        card_issues.append("Contains slide date stamp (e.g. 8/13/2008)")

    if _is_template_front(front):
        card_issues.append("Front is the generator's fallback template, not a concrete question")

    if not _question_matches_answer(front, back):
        card_issues.append("Front asks for details not covered in the back")

    return card_issues


def validate_cards(cards: list[dict[str, Any]]) -> dict[str, list[str]]:
    """Validate a list of card dicts {front, back, chunk_id?, tags?}."""
    issues: dict[str, list[str]] = {}
    fronts: list[str] = []
    for i, card in enumerate(cards, start=1):
        front = card.get("front", "")
        back = card.get("back", "")
        fronts.append(front)
        card_issues = _validate_card(front, back)
        if card_issues:
            issues[f"card {i}"] = card_issues

    seen: dict[str, int] = {}
    for i, front in enumerate(fronts, start=1):
        plain = re.sub(r"<[^>]+>", "", front).split("【")[0].split(":")[0].strip()
        if plain in seen:
            key = f"card {i}"
            issues.setdefault(key, []).append(f"Duplicate title within batch (first seen at card {seen[plain]})")
        else:
            seen[plain] = i

    return issues


def validate_tsv(tsv_path: Path) -> dict[str, list[str]]:
    """Return a dict mapping card index to list of issue descriptions."""
    text = tsv_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    issues: dict[str, list[str]] = {}

    fronts: list[str] = []
    for idx, raw in enumerate(lines, start=1):
        if raw.startswith("#") or not raw.strip():
            continue
        parts = raw.split(FIELD_SEP)
        if len(parts) < 2:
            issues[f"line {idx}"] = ["Malformed TSV row (fewer than 2 fields)"]
            continue
        front, back = parts[0], parts[1]
        fronts.append(front)
        card_issues = _validate_card(front, back)
        if card_issues:
            issues[f"card {len(fronts)} (line {idx})"] = card_issues

    # Cross-card duplicate title check within the batch
    seen: dict[str, int] = {}
    for i, front in enumerate(fronts, start=1):
        plain = re.sub(r"<[^>]+>", "", front).split("【")[0].split(":")[0].strip()
        if plain in seen:
            key = f"card {i} (line unknown)"
            issues.setdefault(key, []).append(f"Duplicate title within batch (first seen at card {seen[plain]})")
        else:
            seen[plain] = i

    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate generated Anki cards before import")
    parser.add_argument("path", type=Path, default=Path("research/anki_cards.jsonl"), nargs="?")
    args = parser.parse_args(argv)

    if not args.path.exists():
        print(f"File not found: {args.path}", file=sys.stderr)
        return 1

    if str(args.path).endswith(".txt") or str(args.path).endswith(".tsv"):
        issues = validate_tsv(args.path)
    else:
        cards = []
        for raw in args.path.read_text(encoding="utf-8").splitlines():
            raw = raw.strip()
            if raw:
                cards.append(json.loads(raw))
        issues = validate_cards(cards)

    if not issues:
        print(f"OK: {args.path} passed quality checks.")
        return 0

    print(f"Quality issues found in {args.path}:")
    for label, card_issues in issues.items():
        print(f"\n{label}:")
        for issue in card_issues:
            print(f"  - {issue}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
