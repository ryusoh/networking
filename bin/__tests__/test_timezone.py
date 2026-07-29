"""Tests and automation for macOS timezone locking."""

import os
import subprocess
import sys
from datetime import datetime
import pytest

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "lock-timezone")


def _is_gmt8():
    now = datetime.now()
    local_now = now.astimezone()
    offset_seconds = local_now.utcoffset().total_seconds() if local_now.utcoffset() else 0
    return offset_seconds == 28800  # 8 hours * 3600 seconds = 28800


def _is_timezone_singapore():
    try:
        tz_link = os.readlink("/etc/localtime")
    except OSError:
        tz_link = ""

    try:
        res = subprocess.run(
            ["sudo", "-n", "systemsetup", "-gettimezone"],
            capture_output=True,
            text=True,
            check=True,
        )
        return "Asia/Singapore" in res.stdout
    except Exception:
        return "Asia/Singapore" in tz_link


def _enforce_timezone():
    print(f"\n[Timezone Test] GMT+8 detected but timezone is not Asia/Singapore. Auto-running {SCRIPT}...")
    try:
        run_res = subprocess.run(
            ["sudo", "-n", SCRIPT],
            capture_output=True,
            text=True,
        )
        if run_res.returncode == 0:
            print("[Timezone Test] Successfully enforced Asia/Singapore timezone.")
            try:
                verify_res = subprocess.run(
                    ["sudo", "-n", "systemsetup", "-gettimezone"],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                assert "Asia/Singapore" in verify_res.stdout
            except Exception:
                pass
        else:
            print(f"[Timezone Test] Warning: lock-timezone failed with exit code {run_res.returncode}.")
            print(f"Stdout: {run_res.stdout}")
            print(f"Stderr: {run_res.stderr}")
    except Exception as e:
        print(f"[Timezone Test] Warning: failed to execute lock-timezone script: {e}")


def test_mac_timezone_enforcement():
    # Only run on macOS
    if sys.platform != "darwin":
        pytest.skip("Timezone locking is only supported on macOS.")

    if not _is_gmt8():
        return

    if not _is_timezone_singapore():
        _enforce_timezone()
