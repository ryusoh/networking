"""Tests for bin/coverage_rank.py (the Testpilot coverage ranking helper)."""

import importlib.util
import json
import os
import subprocess
import sys

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "coverage_rank.py")

_spec = importlib.util.spec_from_file_location("coverage_rank", SCRIPT)
coverage_rank = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(coverage_rank)

JEST_SUMMARY = {
    "total": {"lines": {"pct": 80}},
    "clean_adblock/perfect.js": {"lines": {"pct": 100}, "branches": {"pct": 100}},
    "clean_adblock/worst.js": {"lines": {"pct": 12.5}, "branches": {"pct": 40}},
    "clean_adblock/middle.js": {"lines": {"pct": 75}, "branches": {"pct": 10}},
}

COVERAGE_PY = {
    "meta": {"version": "7.0"},
    "files": {
        "nas_proxy/server.py": {"summary": {"percent_covered": 55.0}},
        "retriever/pull.py": {"summary": {"percent_covered": 100.0}},
        "nas_proxy/util.py": {"summary": {"percent_covered": 20.0}},
    },
    "totals": {"percent_covered": 58.3},
}


def test_detects_coverage_py_vs_jest():
    assert coverage_rank.is_coverage_py(COVERAGE_PY) is True
    assert coverage_rank.is_coverage_py(JEST_SUMMARY) is False


def test_rank_jest_sorts_ascending_and_drops_total():
    ranked = coverage_rank.rank(JEST_SUMMARY, "lines")
    assert [f for f, _ in ranked] == [
        "clean_adblock/worst.js",
        "clean_adblock/middle.js",
        "clean_adblock/perfect.js",
    ]
    assert all(f != "total" for f, _ in ranked)


def test_rank_jest_honours_metric():
    ranked = coverage_rank.rank(JEST_SUMMARY, "branches")
    assert ranked[0][0] == "clean_adblock/middle.js"


def test_rank_coverage_py_uses_percent_covered():
    ranked = coverage_rank.rank(COVERAGE_PY)
    assert [f for f, _ in ranked] == [
        "nas_proxy/util.py",
        "nas_proxy/server.py",
        "retriever/pull.py",
    ]


def _run(args, **kwargs):
    return subprocess.run(
        [sys.executable, SCRIPT, *args],
        capture_output=True,
        text=True,
        **kwargs,
    )


def test_cli_json_skips_full_files_and_respects_limit(tmp_path):
    fixture = tmp_path / "coverage-summary.json"
    fixture.write_text(json.dumps(JEST_SUMMARY))
    result = _run(["--summary", str(fixture), "--limit", "1", "--json"])
    assert result.returncode == 0
    assert json.loads(result.stdout) == [{"file": "clean_adblock/worst.js", "pct": 12.5}]


def test_cli_missing_summary_exits_2_with_hint():
    result = _run(["--summary", "does-not-exist.json"])
    assert result.returncode == 2
    assert "not found" in result.stderr
