#!/usr/bin/env python3
"""Rank source files by test coverage, lowest first.

Reads either a Jest ``coverage-summary.json`` (produced by
``jest --coverage --coverageReporters=json-summary``) or a coverage.py JSON
report (produced by ``coverage json``) and prints the least-covered files. This
exists to kill a real routine bug: reading a truncated coverage table from the
terminal, seeing only the bottom rows, and re-testing files already at 100
percent while the worst files at the top are ignored every run.

Usage::

    # JavaScript (clean_adblock)
    npx jest --coverage --coverageReporters=json-summary --coverageReporters=text
    python3 bin/coverage_rank.py --summary coverage/coverage-summary.json --limit 5

    # Python (nas_proxy / retriever / vps_kernel_proxy)
    python3 -m coverage json -o coverage.json
    python3 bin/coverage_rank.py --summary coverage.json --limit 5

The report format (Jest vs coverage.py) is detected automatically.
"""

from __future__ import annotations

import argparse
import json
import os
from typing import Any

METRICS = ("lines", "statements", "branches", "functions")
DEFAULT_SUMMARY = os.path.join("coverage", "coverage-summary.json")


def load_summary(path: str) -> dict[str, Any]:
    """Load a coverage report (Jest json-summary or coverage.py JSON)."""
    with open(path, encoding="utf-8") as handle:
        data: dict[str, Any] = json.load(handle)
    return data


def is_coverage_py(summary: dict[str, Any]) -> bool:
    """coverage.py reports nest per-file data under a top-level ``files`` key."""
    return isinstance(summary.get("files"), dict)


def rank(summary: dict[str, Any], metric: str = "lines") -> list[tuple[str, float]]:
    """Return ``(file, pct)`` pairs sorted ascending, lowest coverage first."""
    rows: list[tuple[str, float]] = []
    if is_coverage_py(summary):
        # coverage.py: {"files": {path: {"summary": {"percent_covered": N}}}}.
        # The metric argument does not apply; coverage.py reports one percent.
        for path, entry in summary["files"].items():
            section = entry.get("summary", {}) if isinstance(entry, dict) else {}
            value = section.get("percent_covered")
            rows.append((path, float(value) if isinstance(value, (int, float)) else 0.0))
    else:
        # Jest json-summary: {path: {metric: {"pct": N}}, "total": {...}}.
        for path, entry in summary.items():
            if path == "total" or not isinstance(entry, dict):
                continue
            section = entry.get(metric)
            value = section.get("pct") if isinstance(section, dict) else None
            rows.append((path, float(value) if isinstance(value, (int, float)) else 0.0))
    rows.sort(key=lambda row: row[1])
    return rows


def relativize(path: str) -> str:
    try:
        return os.path.relpath(path, os.getcwd())
    except ValueError:
        return path


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Rank files by coverage, lowest first.")
    parser.add_argument("--summary", default=DEFAULT_SUMMARY, help="Path to the coverage JSON report.")
    parser.add_argument("--metric", choices=METRICS, default="lines", help="Jest metric (ignored for coverage.py).")
    parser.add_argument("--limit", type=int, default=5, help="Max files to print (0 = all).")
    parser.add_argument(
        "--max-pct",
        type=float,
        default=100.0,
        help="Skip files whose coverage is at or above this percent.",
    )
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of text.")
    args = parser.parse_args(argv)

    try:
        summary = load_summary(args.summary)
    except FileNotFoundError:
        parser.error(
            f"{args.summary} not found. Generate it first with "
            "'jest --coverageReporters=json-summary' or 'coverage json'."
        )

    rows = [row for row in rank(summary, args.metric) if row[1] < args.max_pct]
    selected = rows[: args.limit] if args.limit > 0 else rows

    if args.json:
        payload = [{"file": relativize(path), "pct": pct} for path, pct in selected]
        print(json.dumps(payload, indent=2))
    else:
        for path, pct in selected:
            print(f"{pct:6.2f}  {relativize(path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
