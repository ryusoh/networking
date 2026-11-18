"""Tests for bin/proxy_watch.py."""

import importlib.util
import os
import subprocess
import sys

BIN_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

for name in ("proxy_path_diag", "proxy_watch"):
    spec = importlib.util.spec_from_file_location(name, os.path.join(BIN_DIR, name + ".py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    sys.modules[name] = module

proxy_watch = sys.modules["proxy_watch"]
ppd = sys.modules["proxy_path_diag"]

OK = {"http": "200", "connect": 0.001, "tls": 1.0, "total": 2.0, "error": None}
FAIL = {"http": "000", "connect": 0.001, "tls": 0.0, "total": 8.0, "error": "timeout"}


def test_status_line_success():
    line = proxy_watch.status_line(0, "https://x/", OK)
    assert "http=200" in line and "FAIL" not in line


def test_status_line_failure():
    line = proxy_watch.status_line(0, "https://x/", FAIL)
    assert "FAIL timeout" in line


def test_watch_stops_when_target_answers(monkeypatch):
    monkeypatch.setattr(ppd, "discover_proxies", lambda: [("system http", "http://127.0.0.1:9")])
    monkeypatch.setattr(ppd, "probe", lambda url, proxy: OK if "gemini" in url else FAIL)
    assert proxy_watch.watch("gemini.google.com", "https://gemini.google.com/", 0) is True


def test_watch_keeps_polling_while_failing(monkeypatch):
    calls = iter(range(3))

    def fake_probe(url, proxy):
        next(calls)
        return FAIL

    monkeypatch.setattr(ppd, "discover_proxies", lambda: [("system http", "http://127.0.0.1:9")])
    monkeypatch.setattr(ppd, "probe", fake_probe)
    monkeypatch.setattr(proxy_watch.time, "sleep", lambda s: None)
    try:
        proxy_watch.watch("x.example", "https://x.example/", 0)
        raised = None
    except StopIteration:
        raised = True
    assert raised, "watch should keep polling until the probe answers"


def test_main_usage_error(capsys):
    try:
        proxy_watch.main(["proxy_watch.py"])
        code = None
    except SystemExit as exc:
        code = exc.code
    assert code == 2
