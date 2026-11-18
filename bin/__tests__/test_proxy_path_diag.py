"""Tests for bin/proxy_path_diag.py.

Network-facing functions (resolve_doh, discover_proxies, probe) are kept
out of these tests except through monkeypatched fakes; the suite is pure
logic around parsing, classification, and output handling.
"""

import importlib.util
import json
import os
import subprocess

import pytest

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(BIN_DIR, "proxy_path_diag.py")

_spec = importlib.util.spec_from_file_location("proxy_path_diag", SCRIPT)
ppd = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ppd)

SCUTIL_SAMPLE = """<dictionary> {
  ExceptionsList : <array> {
    0 : localhost
  }
  HTTPEnable : 1
  HTTPPort : 1082
  HTTPProxy : 127.0.0.1
  HTTPSEnable : 1
  HTTPSPort : 1082
  HTTPSProxy : 127.0.0.1
  SOCKSEnable : 0
}
"""

SCUTIL_SOCKS_ONLY = """<dictionary> {
  SOCKSEnable : 1
  SOCKSPort : 1080
  SOCKSProxy : 127.0.0.1
  HTTPEnable : 0
}
"""


def test_is_fake_ip_recognises_tun_hijack_range():
    assert ppd.is_fake_ip("198.18.0.173") is True
    assert ppd.is_fake_ip("198.19.255.255") is True
    assert ppd.is_fake_ip("198.17.255.255") is False
    assert ppd.is_fake_ip("142.251.150.2") is False
    assert ppd.is_fake_ip("not-an-ip") is False
    # IPv4-mapped form of 198.18.0.173, as returned alongside the A record
    assert ppd.is_fake_ip("::ffff:0:c612:ad") is True
    assert ppd.is_fake_ip("::ffff:8efd:9602") is False  # 142.251.150.2 mapped


def test_parse_scutil_proxy_picks_enabled_schemes():
    parsed = ppd.parse_scutil_proxy(SCUTIL_SAMPLE)
    assert parsed["http"] == ("127.0.0.1", "1082")
    assert parsed["https"] == ("127.0.0.1", "1082")
    assert "socks5h" not in parsed


def test_parse_scutil_proxy_ignores_disabled_entries():
    parsed = ppd.parse_scutil_proxy(SCUTIL_SOCKS_ONLY)
    assert parsed == {"socks5h": ("127.0.0.1", "1080")}


def test_parse_scutil_proxy_handles_empty_output():
    assert ppd.parse_scutil_proxy("") == {}


def test_resolve_doh_extracts_a_records(monkeypatch):
    payload = json.dumps(
        {"Answer": [{"type": 1, "data": "142.251.150.2"},
                    {"type": 5, "data": "some-cname.example"},
                    {"type": 1, "data": "142.251.154.2"}]}
    ).encode("utf-8")

    class FakeResp:
        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def read(self):
            return payload

    monkeypatch.setattr(ppd, "urlopen", lambda url, timeout: FakeResp())
    addrs, err = ppd.resolve_doh("gemini.google.com")
    assert err is None
    assert addrs == ["142.251.150.2", "142.251.154.2"]


def test_probe_parses_curl_write_out(monkeypatch):
    completed = subprocess.CompletedProcess(
        args=[], returncode=0, stdout="200 0.001234 1.316896 1.926711\n", stderr=""
    )
    monkeypatch.setattr(ppd.subprocess, "run", lambda *a, **k: completed)
    result = ppd.probe("https://example.com/", "http://127.0.0.1:1082")
    assert result["http"] == "200"
    assert result["tls"] == pytest.approx(1.316896)
    assert result["error"] is None


def test_probe_surfaces_curl_failure(monkeypatch):
    completed = subprocess.CompletedProcess(
        args=[], returncode=28, stdout="", stderr="curl: (28) Connection timed out"
    )
    monkeypatch.setattr(ppd.subprocess, "run", lambda *a, **k: completed)
    result = ppd.probe("https://gemini.google.com/", "http://127.0.0.1:1082")
    assert result["http"] == "000"
    assert "timed out" in result["error"]


def test_probe_omits_proxy_flag_when_empty(monkeypatch):
    captured = {}

    def fake_run(cmd, **kwargs):
        captured["cmd"] = cmd
        return subprocess.CompletedProcess(args=cmd, returncode=0,
                                           stdout="200 0 0 1.0\n", stderr="")

    monkeypatch.setattr(ppd.subprocess, "run", fake_run)
    ppd.probe("https://example.com/", "")
    assert "-x" not in captured["cmd"]


def _probe(http="200", error=None):
    return {"http": http, "connect": 0.001, "tls": 1.0, "total": 2.0, "error": error}


def test_verdict_fake_ip_canary_ok_target_fails_is_rule_or_node():
    bucket, message = ppd.verdict(["198.18.0.173"], _probe(error="timeout"),
                                  _probe())
    assert bucket == "rule-or-node"
    assert "node" in message


def test_verdict_fake_ip_everything_fails_is_proxy_path():
    bucket, _ = ppd.verdict(["198.18.0.7"], _probe(error="timeout"),
                            _probe(error="timeout"))
    assert bucket == "proxy-path"


def test_verdict_fake_ip_target_ok_is_host_up():
    bucket, _ = ppd.verdict(["198.18.0.7"], _probe(), _probe())
    assert bucket == "host-up"


def test_verdict_no_system_answer_is_dns():
    bucket, _ = ppd.verdict([], _probe(error="timeout"), _probe())
    assert bucket == "dns"


def test_verdict_real_dns_and_failure_is_proxy_path():
    bucket, _ = ppd.verdict(["142.251.150.2"], _probe(error="timeout"), {})
    assert bucket == "proxy-path"


def test_main_usage_error_without_args(capsys):
    assert ppd.main(["proxy_path_diag.py"]) == 2
    assert "usage" in capsys.readouterr().err.lower()


def _geo_run(stdout, returncode=0):
    return subprocess.CompletedProcess(args=[], returncode=returncode,
                                       stdout=stdout, stderr="")


def test_exit_geo_parses_success(monkeypatch):
    monkeypatch.setattr(ppd.subprocess, "run",
                        lambda *a, **k: _geo_run('{"status":"success","countryCode":"US","query":"1.2.3.4"}'))
    assert ppd.exit_geo("http://127.0.0.1:1082") == {"country": "US", "ip": "1.2.3.4"}


def test_exit_geo_none_on_failure(monkeypatch):
    monkeypatch.setattr(ppd.subprocess, "run",
                        lambda *a, **k: _geo_run('{"status":"fail"}'))
    assert ppd.exit_geo("http://127.0.0.1:1082") is None
    monkeypatch.setattr(ppd.subprocess, "run",
                        lambda *a, **k: _geo_run("not json"))
    assert ppd.exit_geo("") is None
