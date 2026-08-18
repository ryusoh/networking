#!/usr/bin/env python3
"""Phase 1.5 Automated Batch Runner for research courseware CLIs.

Runs a JSON manifest of research-agent CLI jobs sequentially, capturing
per-job status without spawning a daemon or external queue.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

DEFAULT_SPEC_PATH = REPO_ROOT / "research" / "batch_spec.json"

# Map logical command names to the existing research-agent CLIs.
BATCH_COMMANDS: dict[str, list[str]] = {
    "parse": ["python3", "tools/research/parse_chunks.py"],
    "search": ["python3", "tools/research/search_chunks.py"],
    "scene": ["python3", "tools/research/scene_builder.py"],
    "synthesis": ["python3", "tools/research/synthesis_service.py"],
    "citation": ["python3", "tools/research/citation_engine.py"],
    "memory": ["python3", "tools/research/memory_host.py"],
}


def run_batch(
    spec: dict[str, Any],
    repo_root: Path = REPO_ROOT,
    dry_run: bool = False,
    runner: Any = subprocess,
) -> list[dict[str, Any]]:
    """Execute jobs from a batch spec and return a status report.

    Args:
        spec: Batch specification dict with a ``jobs`` list. Each job has
            ``command`` (a key in ``BATCH_COMMANDS``) and optional ``args``.
        repo_root: Working directory for subprocess execution.
        dry_run: If True, report the commands that would run without running them.
        runner: Subprocess module (or test stub) providing ``run``.
    """
    results: list[dict[str, Any]] = []
    for idx, job in enumerate(spec.get("jobs", []), start=1):
        command_key = job.get("command")
        if command_key not in BATCH_COMMANDS:
            results.append(
                {
                    "job_index": idx,
                    "command": command_key,
                    "status": "unknown_command",
                    "returncode": None,
                }
            )
            continue

        cmd = BATCH_COMMANDS[command_key] + job.get("args", [])
        record: dict[str, Any] = {
            "job_index": idx,
            "command": command_key,
            "cmd": cmd,
        }

        if dry_run:
            record["status"] = "dry_run"
            record["returncode"] = None
            results.append(record)
            continue

        result = runner.run(
            cmd,
            cwd=str(repo_root),
            capture_output=True,
            text=True,
        )
        record["returncode"] = result.returncode
        record["stdout"] = result.stdout
        record["stderr"] = result.stderr
        record["status"] = "success" if result.returncode == 0 else "failure"
        results.append(record)

    return results


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run a batch of research-agent CLI jobs.")
    parser.add_argument("--spec", default=str(DEFAULT_SPEC_PATH), help="Path to batch spec JSON.")
    parser.add_argument("--dry-run", action="store_true", help="List planned commands without executing.")
    parser.add_argument("--output", type=Path, help="Write status JSON to this path.")
    args = parser.parse_args(argv)

    spec_path = Path(args.spec).resolve()
    if not spec_path.exists():
        print(f"Batch spec not found: {spec_path}", file=sys.stderr)
        return 1

    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    results = run_batch(spec, dry_run=args.dry_run)

    if args.output:
        args.output.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")

    any_failed = any(r.get("status") == "failure" for r in results)
    unknown = [r for r in results if r.get("status") == "unknown_command"]

    print(f"Batch finished: {len(results)} job(s)")
    for r in results:
        status = r.get("status")
        idx = r["job_index"]
        cmd = r.get("command")
        if status == "failure":
            print(f"  {idx}. {cmd}: FAILED (return code {r['returncode']})")
        elif status == "unknown_command":
            print(f"  {idx}. {cmd}: UNKNOWN COMMAND")
        else:
            print(f"  {idx}. {cmd}: {status}")

    if unknown:
        return 2
    if any_failed:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
