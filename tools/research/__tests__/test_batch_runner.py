"""Unit tests for tools/research/batch_runner.py."""

from pathlib import Path
from tools.research.batch_runner import BATCH_COMMANDS, run_batch


class _FakeCompletedProcess:
    def __init__(self, returncode: int = 0, stdout: str = "", stderr: str = ""):
        self.returncode = returncode
        self.stdout = stdout
        self.stderr = stderr


class _StubRunner:
    def __init__(self):
        self.calls: list[tuple[list[str], dict[str, object]]] = []

    def run(self, cmd: list[str], **kwargs: object) -> _FakeCompletedProcess:
        self.calls.append((cmd, kwargs))
        return _FakeCompletedProcess(returncode=0, stdout="ok", stderr="")


def test_run_batch_executes_mapped_commands(tmp_path: Path):
    spec = {
        "jobs": [
            {"command": "search", "args": ["Paxos", "--limit", "3"]},
            {"command": "scene", "args": ["SDN", "--max-tokens", "1000"]},
        ]
    }
    stub = _StubRunner()
    results = run_batch(spec, repo_root=tmp_path, runner=stub)

    assert len(results) == 2
    assert results[0]["status"] == "success"
    assert results[1]["status"] == "success"
    assert stub.calls[0][0] == BATCH_COMMANDS["search"] + ["Paxos", "--limit", "3"]
    assert stub.calls[1][0] == BATCH_COMMANDS["scene"] + ["SDN", "--max-tokens", "1000"]
    assert stub.calls[0][1]["cwd"] == str(tmp_path)


def test_run_batch_dry_run_does_not_execute():
    spec = {"jobs": [{"command": "search", "args": ["Paxos"]}]}
    results = run_batch(spec, dry_run=True)

    assert len(results) == 1
    assert results[0]["status"] == "dry_run"
    assert results[0]["cmd"] == BATCH_COMMANDS["search"] + ["Paxos"]


def test_run_batch_reports_unknown_command():
    spec = {"jobs": [{"command": "nonexistent"}]}
    results = run_batch(spec)

    assert len(results) == 1
    assert results[0]["status"] == "unknown_command"


def test_run_batch_reports_failure():
    class _FailingRunner:
        def run(self, cmd: list[str], **kwargs: object) -> _FakeCompletedProcess:
            return _FakeCompletedProcess(returncode=1, stdout="", stderr="error")

    spec = {"jobs": [{"command": "search", "args": ["Paxos"]}]}
    results = run_batch(spec, runner=_FailingRunner())

    assert results[0]["status"] == "failure"
    assert results[0]["returncode"] == 1
