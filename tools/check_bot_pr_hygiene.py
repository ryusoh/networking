#!/usr/bin/env python3
"""Bot PR hygiene gate: deterministic enforcement of AGENTS.md non-negotiable #11.

Unattended Jules routines (author ``google-labs-jules[bot]``) are bound by the
wording in AGENTS.md and their persona, but wording alone did not stop the
empty Typist PRs here (#75, #78), the sibling anki repo's PR #494, or PR #178
(ratchet suppression and committed pr_body.txt).
This check fails the gate on any bot-authored commit in ``<base>..HEAD`` that:

1. changes no files (empty commit),
2. adds or changes a file with zero content lines (placeholder/dummy pattern),
3. deletes lines from a test file — bot lanes are append-only in tests
   (Testpilot owns ``__tests__/`` and ``tests/``; no other bot lane may touch
   tests at all),
4. commits stray bot artifacts (e.g. ``pr_body.txt``, scratch/temp files),
5. touches ``eslint-suppressions.json`` from a non-refactor lane or increases
   suppressions (complexity ratchet violation).

Human-authored commits are out of scope and skipped: interactive agents may
legitimately delete or rewrite tests when the user asks.

Stdlib only (AGENTS.md non-negotiable #6: no new dependencies).
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

BOT_AUTHOR_MARKER = "google-labs-jules"
BYPASS_MARKERS = (
    "bypass empty pr",
    "allow non-empty pr",
    "no-op trigger",
    "typist no-op",
    "trigger to allow non-empty",
)


def _git(repo: Path, *args: str) -> str:
    """Run a git command in ``repo`` and return stdout as text."""
    result = subprocess.run(
        ["git", *args],
        cwd=repo,
        capture_output=True,
        check=True,
        text=True,
    )
    return result.stdout


def _is_test_path(path: str) -> bool:
    """Test paths here: ``__tests__/`` and ``tests/`` dirs, ``test_*.py``, ``*.test.js``."""
    parts = path.split("/")
    name = parts[-1]
    return (
        "tests" in parts
        or "__tests__" in parts
        or name.startswith("test_")
        or ".test." in name
    )


def _is_stray_artifact(path: str) -> bool:
    """Detect stray PR draft files, scratch logs, or temporary artifacts."""
    parts = path.split("/")
    name = parts[-1].lower()
    if name in {"pr_body.txt", "pr_description.txt"}:
        return True
    if name.endswith((".tmp", ".scratch", ".swp")):
        return True
    if name.startswith(("temp_", "dummy_")):
        return True
    return False


def _read_json_at(repo: Path, ref: str, path: str) -> dict:
    """Read and parse a JSON file at a given git revision."""
    try:
        content = _git(repo, "show", f"{ref}:{path}")
        data = json.loads(content)
        if isinstance(data, dict):
            return data
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        pass
    return {}





from typing import Any

def _get_suppression_count(rule_data: Any) -> int:
    """Extract the suppression count from a rule data object, defaulting to 1."""
    if isinstance(rule_data, dict):
        return int(rule_data.get("count", 1))
    if isinstance(rule_data, int):
        return rule_data
    return 1


def _check_file_rules(file_path: str, file_rules: dict, before_rules: dict) -> str | None:
    """Check all rules for a specific file for complexity ratchet violations."""
    for rule_name, rule_data in file_rules.items():
        if rule_name not in before_rules:
            return f"added suppression for new rule {rule_name} in {file_path}"
        after_count = _get_suppression_count(rule_data)
        before_count = _get_suppression_count(before_rules[rule_name])
        if after_count > before_count:
            return (
                f"increased suppression count for {rule_name} in {file_path} "
                f"({before_count} -> {after_count})"
            )
    return None


def _suppressions_violation(repo: Path, sha: str, path: str) -> str | None:
    """Check if a commit added new suppressions or increased counts in eslint-suppressions.json."""
    before = _read_json_at(repo, f"{sha}^", path)
    after = _read_json_at(repo, sha, path)

    for file_path, file_rules in after.items():
        if file_path not in before:
            return f"added suppression for new file {file_path}"
        if not isinstance(file_rules, dict):
            continue
        before_rules = before.get(file_path, {})
        before_rules_dict = before_rules if isinstance(before_rules, dict) else {}
        err = _check_file_rules(file_path, file_rules, before_rules_dict)
        if err:
            return err
    return None


def _numstat(repo: Path, sha: str) -> list[tuple[str, str, str]]:
    """Return (added, deleted, path) rows for one commit ('-' for binary)."""
    out = _git(repo, "show", "--numstat", "--format=", sha)
    rows = []
    for line in out.splitlines():
        fields = line.split("\t")
        if len(fields) >= 3:
            rows.append((fields[0], fields[1], fields[-1]))
    return rows


def _check_commit_message_bypass(sha: str, full_msg: str) -> str | None:
    for marker in BYPASS_MARKERS:
        if marker in full_msg:
            return f"{sha[:8]} bypass attempt: commit message matches prohibited evasion phrase {marker!r}"
    return None


def _check_typist_lane(sha: str, path: str, is_typist: bool) -> str | None:
    if is_typist and (path.endswith(".md") or _is_test_path(path) or path.endswith((".py", ".c", ".h", ".css"))):
        return f"{sha[:8]} lane violation: Typist may not touch {path}"
    return None


def _check_eslint_suppressions(repo: Path, sha: str, path: str, subject: str) -> list[str]:
    violations = []
    if path == "eslint-suppressions.json" or path.endswith("/eslint-suppressions.json"):
        if not subject.startswith("refactor"):
            violations.append(
                f"{sha[:8]} lane violation: only Architect (refactor) may touch {path}"
            )
        err = _suppressions_violation(repo, sha, path)
        if err:
            violations.append(
                f"{sha[:8]} complexity ratchet violation: {path} {err}"
            )
    return violations


def _check_file_change(
    repo: Path,
    sha: str,
    added: str,
    deleted: str,
    path: str,
    is_typist: bool,
    subject: str,
) -> list[str]:
    violations = []
    if added == "0" and deleted == "0":
        violations.append(f"{sha[:8]} placeholder change: {path} has zero content lines")
    if deleted not in ("0", "-") and _is_test_path(path):
        violations.append(
            f"{sha[:8]} test deletion: {path} loses {deleted} line(s)"
            " — bot lanes are append-only in tests"
        )
    if _is_stray_artifact(path):
        violations.append(
            f"{sha[:8]} stray artifact: {path} must not be committed"
        )

    typist_err = _check_typist_lane(sha, path, is_typist)
    if typist_err:
        violations.append(typist_err)

    violations.extend(_check_eslint_suppressions(repo, sha, path, subject))
    return violations


def find_violations(repo: Path, base: str, head: str = "HEAD") -> list[str]:
    """Inspect bot-authored commits in ``base..head``; return violation strings."""
    revs = _git(repo, "rev-list", "--no-merges", f"{base}..{head}").split()
    violations = []
    for sha in reversed(revs):
        author = _git(repo, "show", "-s", "--format=%ae %an", sha)
        if BOT_AUTHOR_MARKER not in author:
            continue
        subject = _git(repo, "show", "-s", "--format=%s", sha).strip()
        full_msg = _git(repo, "show", "-s", "--format=%B", sha).lower()

        msg_violation = _check_commit_message_bypass(sha, full_msg)
        if msg_violation:
            violations.append(msg_violation)

        is_typist = (
            any(
                subject.startswith(f"{t}(types)")
                for t in ("refactor", "build", "chore", "fix", "docs", "feat")
            )
            or "lane: typist" in full_msg
            or "persona: typist" in full_msg
        )
        rows = _numstat(repo, sha)
        if not rows:
            violations.append(f"{sha[:8]} empty commit: changes no files")
            continue
        for added, deleted, path in rows:
            violations.extend(
                _check_file_change(repo, sha, added, deleted, path, is_typist, subject)
            )
    return violations


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Fail on empty commits, placeholder files, or test deletions in bot-authored commits.",
    )
    parser.add_argument(
        "--base",
        default="origin/main",
        help="Base ref for the commit range (default: origin/main, falls back to main).",
    )
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    args = parser.parse_args(argv)

    base = args.base
    try:
        _git(args.repo, "rev-parse", "--verify", base)
    except subprocess.CalledProcessError:
        if base != "origin/main":
            print(f"bot-pr-check: base ref {base!r} not found", file=sys.stderr)
            return 2
        base = "main"
        try:
            _git(args.repo, "rev-parse", "--verify", base)
        except subprocess.CalledProcessError:
            print("bot-pr-check: neither origin/main nor main found", file=sys.stderr)
            return 2

    if not _git(args.repo, "rev-list", "--no-merges", f"{base}..HEAD").split():
        print("bot-pr-check: no commits in range; nothing to check")
        return 0

    violations = find_violations(args.repo, base)
    if violations:
        print("bot-pr-check: bot PR hygiene violations (AGENTS.md non-negotiable #11):")
        for violation in violations:
            print(f"  {violation}")
        print(
            "Push commits whose diff matches their message and addresses review feedback — or push nothing."
        )
        return 1
    print("bot-pr-check: no bot-commit hygiene violations in range")
    return 0


if __name__ == "__main__":
    sys.exit(main())
