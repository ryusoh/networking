"""Build a deck-derived acronym exemption cache for the card validator.

Scans the Anki collection notes dump and records, per acronym, how many
notes use it and whether it has ever been expanded anywhere in the deck.
Acronyms that are ubiquitous (>= threshold notes) or already expanded
somewhere in the deck need not be expanded again on new cards — the deck
itself already teaches them. The validator
(`tools/research/anki_card_validator.py`) reads the cache this writes and
exempts those acronyms from the expansion requirement; a missing cache
falls back to the static COMMON_ACRONYMS list only.

The scan is scoped to one deck (default 金融): an acronym known only from
other decks does not exempt cards written for this one.
"""

from __future__ import annotations

import argparse
from collections import Counter
import gzip
import json
from pathlib import Path
import re
from typing import Any

from tools.research.anki_card_validator import _acronym_is_explained

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_NOTES_PATH = Path.home() / "dev/anki/data/cloudflare/collection/notes.json.gz"
DEFAULT_CACHE_PATH = REPO_ROOT / "research" / ".anki_deck_acronyms.json"
DEFAULT_DECK = "金融"
DEFAULT_FREQ_THRESHOLD = 25

_ACRONYM_RE = re.compile(r"\b[A-Z]{2,}(?:-[A-Z]+)*\b")
_TAG_RE = re.compile(r"<[^>]+>")
# Acronym adjacent to a parenthetical, either direction. Expansion patterns in
# the validator are all local (the paren plus a few preceding words), so a
# small context window around each candidate is enough to reuse its matcher.
_ACR_PAREN_RE = re.compile(
    r"\b[A-Z]{2,}(?:-[A-Z]+)*\b\s*[（(][^（）()]*[)）]"
    r"|[（(][^（）()]*\b[A-Z]{2,}(?:-[A-Z]+)*\b[^（）()]*[)）]"
)
_CONTEXT_BACK_CHARS = 200


def _load_notes(notes_path: Path) -> list[dict[str, Any]]:
    with gzip.open(notes_path, "rt", encoding="utf-8") as f:
        return json.load(f)


def scan_acronyms(
    notes: list[dict[str, Any]], deck: str | None = None
) -> dict[str, dict[str, Any]]:
    """Count note usage and prior expansion per acronym.

    Args:
        notes: note dicts from the collection dump (need `flds`, `deck`).
        deck: restrict to this deck name; None scans the whole collection.

    Returns:
        `{acronym: {"notes": int, "expanded": bool}}` for every acronym seen.
    """
    texts = [
        _TAG_RE.sub(" ", n.get("flds", ""))
        for n in notes
        if deck is None or n.get("deck") == deck
    ]
    counts: Counter[str] = Counter()
    for text in texts:
        for acronym in set(_ACRONYM_RE.findall(text)):
            counts[acronym] += 1

    explained: set[str] = set()
    for text in texts:
        for match in _ACR_PAREN_RE.finditer(text):
            start = max(0, match.start() - _CONTEXT_BACK_CHARS)
            context = text[start : match.end()]
            for acronym in set(_ACRONYM_RE.findall(match.group(0))) - explained:
                if _acronym_is_explained(acronym, context):
                    explained.add(acronym)

    return {
        acronym: {"notes": note_count, "expanded": acronym in explained}
        for acronym, note_count in counts.items()
    }


def exempt_acronyms(stats: dict[str, dict[str, Any]], threshold: int) -> list[str]:
    """Acronyms the deck already teaches: ubiquitous or previously expanded."""
    return sorted(
        a for a, s in stats.items() if s["expanded"] or s["notes"] >= threshold
    )


def build_cache(
    notes_path: Path, deck: str | None = DEFAULT_DECK, threshold: int = DEFAULT_FREQ_THRESHOLD
) -> dict[str, Any]:
    """Scan the collection dump and return the cache payload."""
    stats = scan_acronyms(_load_notes(notes_path), deck=deck)
    return {
        "notes_path": str(notes_path),
        "deck": deck,
        "threshold": threshold,
        "exempt": exempt_acronyms(stats, threshold),
        "acronyms": stats,
    }


def main(argv: list[str] | None = None) -> int:
    """CLI entry point for cache rebuilds."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--notes", type=Path, default=DEFAULT_NOTES_PATH)
    parser.add_argument(
        "--deck",
        default=DEFAULT_DECK,
        help="Deck to scan (default: 金融; pass empty string for whole collection).",
    )
    parser.add_argument("--threshold", type=int, default=DEFAULT_FREQ_THRESHOLD)
    parser.add_argument("--output", type=Path, default=DEFAULT_CACHE_PATH)
    args = parser.parse_args(argv)

    deck = args.deck or None
    cache = build_cache(args.notes, deck=deck, threshold=args.threshold)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    scope = deck or "collection"
    print(
        f"Scanned {scope}: {len(cache['acronyms'])} acronyms, "
        f"{len(cache['exempt'])} exempt (expanded before or >= {args.threshold} notes). "
        f"Cache written to {args.output}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
