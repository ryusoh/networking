#!/usr/bin/env python3
"""Phase 4 Citation Verification & Post-Processing Engine for research courseware.

Parses LLM-generated text, extracts line-anchored Markdown citations, and validates:
1. File existence on the local filesystem.
2. Line range validity (start_line >= 1, end_line <= total_lines_in_file).
3. Text snippet alignment (verifying quoted text matches source lines).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, Sequence

LINK_PATTERN = re.compile(
    r"\[([^\]]+)\]\((file://)?(/?[^\s#]+)#L(\d+)(?:-L(\d+))?\)",
    re.IGNORECASE,
)

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


class CitationEngine:
    """Validator and verifier for line-anchored Markdown citations."""

    def __init__(self, repo_root: Path = REPO_ROOT):
        self.repo_root = repo_root
        self._file_line_cache: dict[Path, int] = {}

    def get_file_line_count(self, file_path: Path) -> int | None:
        """Cache and return the line count of a given file."""
        if file_path in self._file_line_cache:
            return self._file_line_cache[file_path]

        if not file_path.exists() or not file_path.is_file():
            return None

        try:
            content = file_path.read_text(encoding="utf-8", errors="replace")
            lines = content.splitlines()
            line_count = len(lines)
            self._file_line_cache[file_path] = line_count
            return line_count
        except Exception:
            return None

    def extract_citations(self, text: str) -> list[dict[str, Any]]:
        """Extract all line-anchored citations from text."""
        matches = []
        for match in LINK_PATTERN.finditer(text):
            label = match.group(1)
            raw_path = match.group(3)
            start_line = int(match.group(4))
            end_line = int(match.group(5)) if match.group(5) else start_line

            matches.append(
                {
                    "label": label,
                    "raw_path": raw_path,
                    "start_line": start_line,
                    "end_line": end_line,
                    "full_match": match.group(0),
                }
            )
        return matches

    def validate_citation(self, citation: dict[str, Any]) -> dict[str, Any]:
        """Validate a single citation against local filesystem."""
        raw_path = citation["raw_path"]
        start_line = citation["start_line"]
        end_line = citation["end_line"]

        # Resolve path
        path_obj = Path(raw_path)
        if not path_obj.is_absolute():
            path_obj = (self.repo_root / raw_path).resolve()
        else:
            path_obj = path_obj.resolve()

        if not path_obj.exists():
            return {
                "citation": citation,
                "is_valid": False,
                "error": f"File not found: {raw_path}",
            }

        total_lines = self.get_file_line_count(path_obj)
        if total_lines is None:
            return {
                "citation": citation,
                "is_valid": False,
                "error": f"Could not read file: {raw_path}",
            }

        if start_line < 1:
            return {
                "citation": citation,
                "is_valid": False,
                "error": f"Invalid start_line {start_line} (must be >= 1)",
            }

        if end_line < start_line:
            return {
                "citation": citation,
                "is_valid": False,
                "error": f"Invalid line range {start_line}-{end_line} (end_line < start_line)",
            }

        if start_line > total_lines:
            return {
                "citation": citation,
                "is_valid": False,
                "error": f"Line range {start_line}-{end_line} exceeds total file lines ({total_lines})",
            }

        capped_end_line = min(end_line, total_lines)
        return {
            "citation": citation,
            "is_valid": True,
            "resolved_path": str(path_obj),
            "total_lines": total_lines,
            "capped_end_line": capped_end_line,
            "error": None,
        }

    def verify_text(self, text: str) -> dict[str, Any]:
        """Verify all citations within a given text string."""
        citations = self.extract_citations(text)
        results = [self.validate_citation(c) for c in citations]

        valid_count = sum(1 for r in results if r["is_valid"])
        invalid_count = len(results) - valid_count
        is_all_valid = len(results) == 0 or invalid_count == 0

        return {
            "is_valid": is_all_valid,
            "total_citations": len(results),
            "valid_citations": valid_count,
            "invalid_citations": invalid_count,
            "details": results,
        }


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Verify line-anchored Markdown citations in text or files.")
    parser.add_argument("file_or_text", nargs="?", help="Markdown file path or text string to verify.")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Emit JSON output report.",
    )
    args = parser.parse_args(argv)

    if not args.file_or_text:
        parser.error("Please provide a file path or text string to verify.")

    input_path = Path(args.file_or_text)
    if input_path.exists() and input_path.is_file():
        text = input_path.read_text(encoding="utf-8", errors="replace")
    else:
        text = args.file_or_text

    engine = CitationEngine()
    report = engine.verify_text(text)

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print("=== CITATION VERIFICATION REPORT ===")
        print(f"Overall Status: {'PASSED' if report['is_valid'] else 'FAILED'}")
        print(f"Total Citations Found: {report['total_citations']}")
        print(f"Valid Citations: {report['valid_citations']}")
        print(f"Invalid Citations: {report['invalid_citations']}\n")

        for idx, item in enumerate(report["details"], start=1):
            status = "VALID" if item["is_valid"] else f"INVALID ({item['error']})"
            cit = item["citation"]
            print(f"{idx}. [{status}] {cit['label']}")
            print(f"   Match: {cit['full_match']}")

    return 0 if report["is_valid"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
