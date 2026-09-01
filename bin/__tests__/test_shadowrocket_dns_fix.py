"""Tests for bin/shadowrocket-dns-fix.

The script is driven through its test hooks (SR_DB / SR_BACKUP_DIR /
SR_NO_APP_RESTART) against a fabricated config database, so the tests never
touch the real Shadowrocket installation. They run on any platform with
bash + sqlite3.
"""

import os
import shutil
import subprocess

import pytest

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "shadowrocket-dns-fix")

SCHEMA = (
    "CREATE VIRTUAL TABLE config USING fts3("
    "section varchar(16), name varchar(16), value text, option varchar(32),"
    " ext varchar(32), remarks varchar(32), created integer);"
)

pytestmark = pytest.mark.skipif(
    shutil.which("sqlite3") is None, reason="sqlite3 CLI not available"
)


def _make_db(tmp_path, dns_server):
    db = tmp_path / "default.db"
    subprocess.run(["sqlite3", str(db), SCHEMA], check=True)
    subprocess.run(
        [
            "sqlite3",
            str(db),
            "insert into config(section,name,value,created) "
            f"values('general','dns-server','{dns_server}',1);",
        ],
        check=True,
    )
    return db


def _run(db, tmp_path, *args):
    env = dict(
        os.environ,
        SR_DB=str(db),
        SR_BACKUP_DIR=str(tmp_path / "backup"),
        SR_NO_APP_RESTART="1",
    )
    return subprocess.run(
        ["bash", SCRIPT, *args],
        env=env,
        capture_output=True,
        text=True,
    )


def _dns_server(db):
    out = subprocess.run(
        [
            "sqlite3",
            str(db),
            "select value from config where section='general'"
            " and name='dns-server';",
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return out.stdout.strip()


def test_diagnose_flags_system_dns_as_vulnerable(tmp_path):
    db = _make_db(tmp_path, "system")
    res = _run(db, tmp_path)
    assert res.returncode == 1
    assert "dns-server setting: system" in res.stdout
    assert "vulnerable" in res.stdout or "BROKEN" in res.stdout


def test_diagnose_accepts_explicit_resolver(tmp_path):
    db = _make_db(tmp_path, "223.5.5.5")
    res = _run(db, tmp_path)
    assert res.returncode == 0
    assert "healthy" in res.stdout


def test_fix_updates_dns_server_and_backs_up(tmp_path):
    db = _make_db(tmp_path, "system")
    res = _run(db, tmp_path, "--fix")
    assert res.returncode == 0, res.stdout
    assert _dns_server(db) == "223.5.5.5"
    backup = tmp_path / "backup" / "default.db"
    assert backup.exists()
    # The backup preserves the pre-fix value for rollback.
    assert _dns_server(backup) == "system"


def test_fix_honours_custom_resolver_argument(tmp_path):
    db = _make_db(tmp_path, "system")
    res = _run(db, tmp_path, "--fix", "119.29.29.29")
    assert res.returncode == 0, res.stdout
    assert _dns_server(db) == "119.29.29.29"


def test_fix_is_idempotent(tmp_path):
    db = _make_db(tmp_path, "223.5.5.5")
    res = _run(db, tmp_path, "--fix")
    assert res.returncode == 0
    assert "nothing to change" in res.stdout
    assert _dns_server(db) == "223.5.5.5"


def test_missing_database_is_a_noop(tmp_path):
    res = _run(tmp_path / "nonexistent.db", tmp_path)
    assert res.returncode == 0
    assert "nothing to do" in res.stdout
