"""Verify that cards generated for Anki actually landed in the collection.

When AnkiConnect is unavailable, the pipeline falls back to launching Anki with
a TSV file. That import is fire-and-forget: the agent cannot see whether the
user clicked Import. This script closes the loop by reading the local SQLite
collection and updating chunk status from `pending_import` to `imported`.

Usage:
    python3 tools/research/anki_import_verifier.py
    python3 tools/research/anki_import_verifier.py --coverage research/.anki_coverage.json --deck 金融
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_COVERAGE_PATH = Path("research/.anki_coverage.json")
DEFAULT_DECK = "金融"
FIELD_SEP = "\x1f"


def _normalize(text: str) -> str:
    """Strip HTML tags, unescape entities, collapse whitespace."""
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _default_collection() -> Path | None:
    candidates = list(Path.home().glob("Library/Application Support/Anki2/*/collection.anki2"))
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)


def fetch_existing_fronts(collection_path: Path, deck_name: str) -> set[str]:
    """Return normalized front fields for notes in the target deck."""
    tmp_path = Path(tempfile.mktemp(suffix=".anki2"))
    try:
        import shutil

        shutil.copyfile(collection_path, tmp_path)
        conn = sqlite3.connect(tmp_path)
        cur = conn.cursor()
        rows = cur.execute(
            """
            SELECT n.flds
            FROM cards c
            JOIN notes n ON c.nid = n.id
            JOIN decks d ON c.did = d.id
            WHERE d.name LIKE ?
            """,
            (f"%{deck_name}%",),
        ).fetchall()
        conn.close()
    finally:
        tmp_path.unlink(missing_ok=True)

    fronts: set[str] = set()
    for (flds,) in rows:
        fields = flds.split(FIELD_SEP)
        if fields:
            fronts.add(_normalize(fields[0]))
    return fronts


def verify_imports(
    coverage_path: Path = DEFAULT_COVERAGE_PATH,
    deck_name: str = DEFAULT_DECK,
    collection_path: Path | None = None,
) -> dict[str, int]:
    """Check pending_import chunks against the collection and update coverage.

    Returns a summary dict with counts: pending, verified, missing.
    """
    if not coverage_path.exists():
        raise FileNotFoundError(f"Coverage file not found: {coverage_path}")

    data = json.loads(coverage_path.read_text(encoding="utf-8"))
    visited = data.setdefault("visited_chunk_ids", {})

    pending = {
        cid: info
        for cid, info in visited.items()
        if info.get("status") == "pending_import"
    }

    if not pending:
        print("No pending imports to verify.")
        return {"pending": 0, "verified": 0, "missing": 0}

    col_path = collection_path or _default_collection()
    if not col_path or not col_path.exists():
        raise FileNotFoundError("Could not find Anki collection.anki2")

    existing = fetch_existing_fronts(col_path, deck_name)

    verified = 0
    missing = 0
    now = datetime.now(timezone.utc).isoformat()
    for cid, info in pending.items():
        front = _normalize(info.get("front_html", ""))
        if not front:
            # Fall back to the stored heading/title if front_html is absent
            front = _normalize(info.get("heading", ""))
        if front and front in existing:
            info["status"] = "imported"
            info["imported_at"] = now
            verified += 1
        else:
            missing += 1

    coverage_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    return {"pending": len(pending), "verified": verified, "missing": missing}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Verify Anki TSV imports against local collection")
    parser.add_argument("--coverage", type=Path, default=DEFAULT_COVERAGE_PATH)
    parser.add_argument("--deck", default=DEFAULT_DECK)
    parser.add_argument("--collection", type=Path, default=None)
    args = parser.parse_args(argv)

    result = verify_imports(
        coverage_path=args.coverage,
        deck_name=args.deck,
        collection_path=args.collection,
    )
    print(
        f"Import verification: {result['verified']} verified, "
        f"{result['missing']} missing, {result['pending']} checked."
    )
    return 0 if result["missing"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
