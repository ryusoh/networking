"""Tests for bin/vpn-recover.

The script is driven against stub commands (netstat/ping/lsof/scutil/...)
shadowed via PATH, plus the VR_KILL hook for the shell-builtin kill, so the
tests never touch real interfaces, routes, or processes. macOS-only, matching
the script's own platform guard.
"""

import os
import subprocess
import sys

import pytest

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "vpn-recover")

pytestmark = pytest.mark.skipif(
    sys.platform != "darwin", reason="vpn-recover targets macOS only"
)

NETSTAT_ZOMBIE = """Routing tables

Internet:
Destination        Gateway            Flags               Netif Expire
default            link#23            UCSg                utun8
default            192.168.1.1        UGScIg                en0
"""

NETSTAT_CLEAN = """Routing tables

Internet:
Destination        Gateway            Flags               Netif Expire
default            192.168.1.1        UGScg                 en0
"""

LSOF_UPSTREAM = (
    "MacPacketTunnel 4321 lz 10u IPv4 0x123 0t0 TCP "
    "198.18.0.1:52233->8.8.8.8:443 (ESTABLISHED)\n"
)


def _write_stub(stub_dir, name, body):
    path = stub_dir / name
    path.write_text("#!/bin/bash\n" + body)
    path.chmod(0o755)
    return path


def _make_env(tmp_path, *, ping_mode="alive", curl_mode="ok", lsof_out=""):
    stub = tmp_path / "bin"
    stub.mkdir()
    state = tmp_path / "state"
    state.mkdir()

    lsof_file = tmp_path / "lsof.out"
    lsof_file.write_text(lsof_out)

    _write_stub(stub, "sudo", 'exec "$@"\n')
    _write_stub(stub, "sleep", "exit 0\n")
    _write_stub(stub, "killall", "exit 0\n")
    _write_stub(stub, "pfctl", "exit 0\n")
    _write_stub(stub, "route", 'echo "$@" >> "$ROUTE_LOG"\n')
    _write_stub(stub, "dscacheutil", 'echo "name: apple.com"\nexit 0\n')
    _write_stub(stub, "lsof", 'cat "$LSOF_OUT_FILE" 2>/dev/null\nexit 0\n')
    _write_stub(
        stub,
        "pgrep",
        'if [[ "${2:-}" == "MacPacketTunnel" ]]; then\n'
        "    echo 4321\n"
        "    exit 0\n"
        "fi\n"
        "exit 1\n",
    )
    _write_stub(
        stub,
        "netstat",
        'if [[ -f "$STATE_DIR/killed" ]]; then\n'
        f"    cat <<'EOF'\n{NETSTAT_CLEAN}EOF\n"
        "else\n"
        f"    cat <<'EOF'\n{NETSTAT_ZOMBIE}EOF\n"
        "fi\n",
    )
    _write_stub(
        stub,
        "scutil",
        'if [[ "$1" == "--nc" ]]; then\n'
        '    echo \'* (Connected) 5F677A82-0000 "Shadowrocket" (IPSec)\'\n'
        "else\n"
        "    echo 'resolver #1'\n"
        "    echo '  nameserver[0] : 198.18.0.2'\n"
        "fi\n",
    )
    _write_stub(
        stub,
        "ping",
        'if [[ "$PING_MODE" == "stale" ]]; then\n'
        '    for a in "$@"; do\n'
        '        [[ "$a" == "-b" ]] && exit 1\n'
        "    done\n"
        "fi\n"
        "exit 0\n",
    )
    _write_stub(
        stub,
        "curl",
        'if [[ "$CURL_MODE" == "fail" || ( "$CURL_MODE" == "recover" && ! -f "$STATE_DIR/killed" ) ]]; then\n'
        '    echo "curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL" >&2\n'
        "    exit 35\n"
        "fi\n"
        "exit 0\n",
    )
    killrec = _write_stub(
        stub,
        "killrec",
        'echo "$@" >> "$KILL_LOG"\ntouch "$STATE_DIR/killed"\n',
    )

    env = dict(os.environ)
    env.update(
        {
            "PATH": f"{stub}{os.pathsep}{os.environ['PATH']}",
            "STATE_DIR": str(state),
            "ROUTE_LOG": str(tmp_path / "route.log"),
            "KILL_LOG": str(tmp_path / "kill.log"),
            "LSOF_OUT_FILE": str(lsof_file),
            "PING_MODE": ping_mode,
            "CURL_MODE": curl_mode,
            "VR_KILL": str(killrec),
        }
    )
    return env


def _run(env, *args):
    return subprocess.run(
        ["bash", SCRIPT, *args], env=env, capture_output=True, text=True
    )


def test_zombie_fix_kills_provider_and_recovers(tmp_path):
    env = _make_env(tmp_path, curl_mode="recover")
    res = _run(env, "--fix")
    assert res.returncode == 0, res.stdout
    assert "ZOMBIE" in res.stdout
    assert "killing MacPacketTunnel (pid 4321)" in res.stdout
    assert "network recovered" in res.stdout
    assert (tmp_path / "kill.log").read_text().strip() == "4321"
    # The provider teardown removed the routes; no sudo route surgery needed.
    assert not (tmp_path / "route.log").exists()


def test_zombie_fix_still_failing_reports_verdict(tmp_path):
    env = _make_env(tmp_path, curl_mode="fail")
    res = _run(env, "--fix")
    assert res.returncode == 1
    assert "killing MacPacketTunnel (pid 4321)" in res.stdout
    assert "repairs applied but connectivity still failing" in res.stdout
    assert (tmp_path / "kill.log").exists()


def test_zombie_diagnose_only_does_not_kill(tmp_path):
    env = _make_env(tmp_path, curl_mode="fail")
    res = _run(env)
    assert res.returncode == 1
    assert "ZOMBIE" in res.stdout
    assert "problems found" in res.stdout
    assert not (tmp_path / "kill.log").exists()


def test_tunnel_with_upstream_is_kept(tmp_path):
    env = _make_env(tmp_path, lsof_out=LSOF_UPSTREAM)
    res = _run(env)
    assert res.returncode == 0, res.stdout
    assert "keeping" in res.stdout
    assert not (tmp_path / "kill.log").exists()


def test_healthy_zombie_is_not_killed(tmp_path):
    # Zero upstream connections but verification passes: an idle-but-healthy
    # tunnel must survive --fix.
    env = _make_env(tmp_path, curl_mode="ok")
    res = _run(env, "--fix")
    assert res.returncode == 0, res.stdout
    assert "ZOMBIE" in res.stdout
    assert not (tmp_path / "kill.log").exists()


def test_stale_fix_deletes_route_without_killing(tmp_path):
    env = _make_env(tmp_path, ping_mode="stale")
    res = _run(env, "--fix")
    assert res.returncode == 0, res.stdout
    assert "STALE" in res.stdout
    assert "removing default route via utun8" in res.stdout
    assert "delete" in (tmp_path / "route.log").read_text()
    assert not (tmp_path / "kill.log").exists()
