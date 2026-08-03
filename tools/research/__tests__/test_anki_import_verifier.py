"""Tests for the Anki import verifier."""
import json
import sqlite3
import tempfile
from pathlib import Path

from tools.research.anki_import_verifier import fetch_existing_fronts, verify_imports


def _make_collection(fronts: list[str]) -> Path:
    """Create a minimal Anki collection with the given note fronts."""
    tmp_dir = Path(tempfile.mkdtemp())
    col_path = tmp_dir / "collection.anki2"
    conn = sqlite3.connect(col_path)
    cur = conn.cursor()

    cur.execute("CREATE TABLE decks (id INTEGER PRIMARY KEY, name TEXT)")
    cur.execute("INSERT INTO decks VALUES (1, '金融')")

    cur.execute(
        """CREATE TABLE notes (
            id INTEGER PRIMARY KEY,
            flds TEXT,
            mid INTEGER DEFAULT 0,
            csum INTEGER DEFAULT 0,
            mod INTEGER DEFAULT 0,
            usn INTEGER DEFAULT 0,
            tags TEXT DEFAULT '',
            sfld TEXT DEFAULT '',
            data TEXT DEFAULT ''
        )"""
    )
    for i, front in enumerate(fronts, start=1):
        cur.execute(
            "INSERT INTO notes (id, flds) VALUES (?, ?)",
            (i, f"{front}\x1fback"),
        )

    cur.execute(
        """CREATE TABLE cards (
            id INTEGER PRIMARY KEY,
            nid INTEGER,
            did INTEGER DEFAULT 1,
            ord INTEGER DEFAULT 0,
            mod INTEGER DEFAULT 0,
            usn INTEGER DEFAULT 0,
            type INTEGER DEFAULT 0,
            queue INTEGER DEFAULT 0,
            due INTEGER DEFAULT 0,
            ivl INTEGER DEFAULT 0,
            factor INTEGER DEFAULT 0,
            reps INTEGER DEFAULT 0,
            lapses INTEGER DEFAULT 0,
            left INTEGER DEFAULT 0,
            odue INTEGER DEFAULT 0,
            odid INTEGER DEFAULT 0,
            flags INTEGER DEFAULT 0,
            data TEXT DEFAULT ''
        )"""
    )
    for i in range(1, len(fronts) + 1):
        cur.execute("INSERT INTO cards (id, nid, did) VALUES (?, ?, 1)", (i, i))

    conn.commit()
    conn.close()
    return col_path


def test_fetch_existing_fronts(tmp_path: Path) -> None:
    col = _make_collection(["BGP basics", "LSA Updates"])
    fronts = fetch_existing_fronts(col, "金融")
    assert "BGP basics" in fronts
    assert "LSA Updates" in fronts


def test_verify_imports_marks_pending_as_imported(tmp_path: Path) -> None:
    col = _make_collection(["BGP Path Vector", "LSA Updates"])
    coverage = tmp_path / "coverage.json"
    coverage.write_text(
        json.dumps(
            {
                "metadata": {"created_at": "2026-08-03T00:00:00+00:00"},
                "visited_files": {},
                "visited_chunk_ids": {
                    "file1:chunk-1": {
                        "generated_at": "2026-08-03T00:00:00+00:00",
                        "heading": "BGP Path Vector",
                        "deck": "金融",
                        "status": "pending_import",
                        "front_html": "BGP Path Vector",
                    },
                    "file1:chunk-2": {
                        "generated_at": "2026-08-03T00:00:00+00:00",
                        "heading": "Missing Card",
                        "deck": "金融",
                        "status": "pending_import",
                        "front_html": "Missing Card",
                    },
                },
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    result = verify_imports(coverage, deck_name="金融", collection_path=col)
    assert result == {"pending": 2, "verified": 1, "missing": 1}

    data = json.loads(coverage.read_text(encoding="utf-8"))
    assert data["visited_chunk_ids"]["file1:chunk-1"]["status"] == "imported"
    assert data["visited_chunk_ids"]["file1:chunk-2"]["status"] == "pending_import"


def test_verify_imports_html_entities(tmp_path: Path) -> None:
    col = _make_collection(["BGP Path Vector &amp; Routing Policy"])
    coverage = tmp_path / "coverage.json"
    coverage.write_text(
        json.dumps(
            {
                "metadata": {"created_at": "2026-08-03T00:00:00+00:00"},
                "visited_files": {},
                "visited_chunk_ids": {
                    "file1:chunk-1": {
                        "generated_at": "2026-08-03T00:00:00+00:00",
                        "heading": "BGP Path Vector & Routing Policy",
                        "deck": "金融",
                        "status": "pending_import",
                        "front_html": "BGP Path Vector &amp; Routing Policy",
                    }
                },
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    result = verify_imports(coverage, deck_name="金融", collection_path=col)
    assert result == {"pending": 1, "verified": 1, "missing": 0}
