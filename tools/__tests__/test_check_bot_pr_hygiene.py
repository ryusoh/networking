"""Tests for tools/check_bot_pr_hygiene.py (the bot-pr-check gate).

Builds real git repos in tmp_path: one human commit on main, then bot- or
human-authored commits on a branch, and asserts on the violation strings and
main() exit codes.
"""

import importlib.util
import os
import subprocess
from pathlib import Path

import pytest

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(TOOLS_DIR, "check_bot_pr_hygiene.py")

_spec = importlib.util.spec_from_file_location("check_bot_pr_hygiene", SCRIPT)
check_bot_pr_hygiene = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_bot_pr_hygiene)

find_violations = check_bot_pr_hygiene.find_violations
main = check_bot_pr_hygiene.main

BOT_NAME = "google-labs-jules[bot]"
BOT_EMAIL = "161369871+google-labs-jules[bot]@users.noreply.github.com"


def _git(repo: Path, *args: str) -> None:
    subprocess.run(["git", *args], cwd=repo, capture_output=True, check=True)


def _commit(repo: Path, message: str, bot: bool = True, allow_empty: bool = False) -> None:
    name = BOT_NAME if bot else "Dev"
    email = BOT_EMAIL if bot else "dev@example.com"
    args = ["-c", f"user.email={email}", "-c", f"user.name={name}", "commit", "-m", message]
    if allow_empty:
        args.append("--allow-empty")
    _git(repo, *args)


def _write_and_commit(repo: Path, path: str, content: str, message: str, bot: bool = True) -> None:
    target = repo / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content)
    _git(repo, "add", path)
    _commit(repo, message, bot=bot)


@pytest.fixture()
def repo(tmp_path: Path) -> Path:
    """A git repo with one human commit on main and a bot branch checked out."""
    _git(tmp_path, "init", "-b", "main")
    (tmp_path / "README.md").write_text("x\n")
    _git(tmp_path, "add", "README.md")
    _commit(tmp_path, "init", bot=False)
    _git(tmp_path, "checkout", "-b", "bot-branch")
    return tmp_path


def test_clean_bot_test_addition_passes(repo: Path) -> None:
    _write_and_commit(
        repo,
        "retriever/__tests__/test_pull.py",
        "def test_x():\n    assert True\n",
        "add tests",
    )
    assert find_violations(repo, "main") == []


def test_bot_python_test_deletion_flagged(repo: Path) -> None:
    _write_and_commit(
        repo,
        "retriever/__tests__/test_pull.py",
        "def test_x():\n    assert True\n",
        "add tests",
    )
    _write_and_commit(repo, "retriever/__tests__/test_pull.py", "def test_x():\n    pass\n", "rewrite tests")
    violations = find_violations(repo, "main")
    assert any("test deletion" in v and "retriever/__tests__/test_pull.py" in v for v in violations)


def test_bot_js_test_deletion_flagged(repo: Path) -> None:
    _write_and_commit(
        repo,
        "adblock/__tests__/picker.test.js",
        "test('a', () => {\n  expect(1).toBe(1);\n});\n",
        "add js tests",
    )
    _write_and_commit(repo, "adblock/__tests__/picker.test.js", "test('a', () => {});\n", "trim js tests")
    violations = find_violations(repo, "main")
    assert any("test deletion" in v and "adblock/__tests__/picker.test.js" in v for v in violations)


def test_bot_plain_tests_dir_deletion_flagged(repo: Path) -> None:
    """stall_guard keeps tests in plain tests/ (Chrome rejects _-prefixed dirs)."""
    _write_and_commit(
        repo,
        "stall_guard/tests/content.test.js",
        "test('a', () => {\n  expect(1).toBe(1);\n});\n",
        "add stall_guard tests",
    )
    _write_and_commit(repo, "stall_guard/tests/content.test.js", "test('a', () => {});\n", "trim stall_guard tests")
    violations = find_violations(repo, "main")
    assert any("test deletion" in v and "stall_guard/tests/content.test.js" in v for v in violations)


def test_bot_bare_test_prefix_deletion_flagged(repo: Path) -> None:
    _write_and_commit(repo, "tools/test_widget.py", "a = 1\nb = 2\n", "add tool test")
    _write_and_commit(repo, "tools/test_widget.py", "a = 1\n", "trim tool test")
    violations = find_violations(repo, "main")
    assert any("test deletion" in v for v in violations)


def test_bot_production_deletion_not_flagged(repo: Path) -> None:
    _write_and_commit(repo, "retriever/core.py", "a = 1\nb = 2\n", "add prod code")
    _write_and_commit(repo, "retriever/core.py", "a = 1\n", "trim prod code")
    assert find_violations(repo, "main") == []


def test_bot_empty_commit_flagged(repo: Path) -> None:
    _commit(repo, "responding to feedback", allow_empty=True)
    violations = find_violations(repo, "main")
    assert any("empty commit" in v for v in violations)


def test_bot_zero_content_file_flagged(repo: Path) -> None:
    _write_and_commit(repo, "dummy_file.txt", "", "add placeholder")
    violations = find_violations(repo, "main")
    assert any("placeholder" in v and "dummy_file.txt" in v for v in violations)


def test_bot_stray_artifact_flagged(repo: Path) -> None:
    _write_and_commit(repo, "pr_body.txt", "Some PR body text\n", "perf(adblock): test")
    violations = find_violations(repo, "main")
    assert any("stray artifact" in v and "pr_body.txt" in v for v in violations)


def test_bot_suppressions_addition_flagged(repo: Path) -> None:
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 1}}}\n',
        "refactor(adblock): add suppression",
    )
    violations = find_violations(repo, "main")
    assert any("complexity ratchet violation" in v and "added suppression" in v for v in violations)


def test_bot_suppressions_increase_flagged(repo: Path) -> None:
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 1}}}\n',
        "init suppressions",
        bot=False,
    )
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 2}}}\n',
        "refactor(adblock): increase count",
        bot=True,
    )
    violations = find_violations(repo, "main")
    assert any("complexity ratchet violation" in v and "increased suppression count" in v for v in violations)


def test_bot_suppressions_prune_allowed(repo: Path) -> None:
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 1}}}\n',
        "init suppressions",
        bot=False,
    )
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        "{}\n",
        "refactor(adblock): cut complexity",
        bot=True,
    )
    assert find_violations(repo, "main") == []


def test_bot_non_architect_suppression_touch_flagged(repo: Path) -> None:
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 1}}}\n',
        "init suppressions",
        bot=False,
    )
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        "{}\n",
        "perf(adblock): optimize loops",
        bot=True,
    )
    violations = find_violations(repo, "main")
    assert any("lane violation: only Architect (refactor) may touch" in v for v in violations)


def test_human_test_deletion_and_empty_commit_ignored(repo: Path) -> None:
    _write_and_commit(repo, "retriever/__tests__/test_pull.py", "a = 1\nb = 2\n", "add tests", bot=False)
    _write_and_commit(repo, "retriever/__tests__/test_pull.py", "a = 1\n", "rewrite tests", bot=False)
    _write_and_commit(repo, "pr_body.txt", "notes\n", "add notes", bot=False)
    _write_and_commit(
        repo,
        "eslint-suppressions.json",
        '{"adblock/foo.js": {"complexity": {"count": 1}}}\n',
        "human suppression",
        bot=False,
    )
    _commit(repo, "human empty commit", bot=False, allow_empty=True)
    assert find_violations(repo, "main") == []


def test_main_returns_1_with_violations(repo: Path, capsys: pytest.CaptureFixture[str]) -> None:
    _commit(repo, "empty", allow_empty=True)
    assert main(["--repo", str(repo), "--base", "main"]) == 1
    assert "empty commit" in capsys.readouterr().out


def test_main_returns_0_when_clean(repo: Path) -> None:
    _write_and_commit(repo, "retriever/__tests__/test_pull.py", "x = 1\n", "add tests")
    assert main(["--repo", str(repo), "--base", "main"]) == 0


def test_main_returns_0_on_empty_range(repo: Path) -> None:
    _git(repo, "checkout", "main")
    assert main(["--repo", str(repo), "--base", "main"]) == 0


def test_main_returns_2_on_missing_base(repo: Path) -> None:
    assert main(["--repo", str(repo), "--base", "no-such-ref"]) == 2
