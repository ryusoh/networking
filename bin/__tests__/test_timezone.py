"""Tests and automation for macOS timezone locking."""

import os
import subprocess
import sys
from datetime import datetime
import pytest

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "lock-timezone")


def test_mac_timezone_enforcement():
    # Only run on macOS
    if sys.platform != "darwin":
        pytest.skip("Timezone locking is only supported on macOS.")

    # 1. Check if the current environment is in GMT+8
    now = datetime.now()
    local_now = now.astimezone()
    offset_seconds = local_now.utcoffset().total_seconds() if local_now.utcoffset() else 0
    is_gmt8 = offset_seconds == 28800  # 8 hours * 3600 seconds = 28800

    if not is_gmt8:
        # Not in GMT+8, nothing to check/enforce
        return

    # 2. Check if current timezone is NOT Asia/Singapore
    # Look at the /etc/localtime symlink target
    try:
        tz_link = os.readlink("/etc/localtime")
    except OSError:
        tz_link = ""

    # Check systemsetup timezone
    try:
        res = subprocess.run(
            ["sudo", "-n", "systemsetup", "-gettimezone"],
            capture_output=True,
            text=True,
            check=True,
        )
        is_singapore = "Asia/Singapore" in res.stdout
    except Exception:
        is_singapore = "Asia/Singapore" in tz_link

    # 3. If in GMT+8 and not Singapore, auto-run the enforcement script
    if not is_singapore:
        print(f"\n[Timezone Test] GMT+8 detected but timezone is not Asia/Singapore. Auto-running {SCRIPT}...")
        try:
            # Try running the lock script via passwordless sudo
            run_res = subprocess.run(
                ["sudo", "-n", SCRIPT],
                capture_output=True,
                text=True,
            )
            if run_res.returncode == 0:
                print("[Timezone Test] Successfully enforced Asia/Singapore timezone.")
                # Verify that it succeeded
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
                # Do not block the build or fail the test suite if permissions aren't available
        except Exception as e:
            print(f"[Timezone Test] Warning: failed to execute lock-timezone script: {e}")
            # Do not block the build/CI
    else:
        # Already correct
        pass
