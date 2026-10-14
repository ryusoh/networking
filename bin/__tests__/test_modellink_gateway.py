"""Tests for the modellink-gateway LaunchAgent helper."""

import os
import subprocess
import sys

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "modellink-gateway")


def _run(*args):
    return subprocess.run(
        ["bash", SCRIPT, *args],
        capture_output=True,
        text=True,
    )


def test_script_has_valid_bash_syntax():
    res = subprocess.run(["bash", "-n", SCRIPT], capture_output=True, text=True)
    assert res.returncode == 0, res.stderr


def test_unknown_argument_prints_usage_and_exits_2():
    if sys.platform != "darwin":
        res = _run("--bogus")
        assert res.returncode == 1
        assert "macOS" in res.stdout
        return
    res = _run("--bogus")
    assert res.returncode == 2
    assert "Usage:" in res.stdout


def test_health_check_is_read_only_and_reports_status():
    if sys.platform != "darwin":
        res = _run()
        assert res.returncode == 1
        assert "macOS" in res.stdout
        return
    res = _run()
    assert res.returncode in (0, 1)
    assert "5678" in res.stdout
    if res.returncode == 0:
        assert "OK: gateway is listening" in res.stdout
    else:
        assert "FAIL:" in res.stdout or "WARN:" in res.stdout
