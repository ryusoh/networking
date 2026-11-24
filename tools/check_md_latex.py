#!/usr/bin/env python3
"""Check and optionally auto-fix GitHub Markdown LaTeX formatting errors.

GitHub's GFM math parser (cmark-gfm) silently fails to render math when:
1. Display math ``$$ ... $$`` is written inline on a single line with leading
   whitespace or mixed with text, instead of standalone ``$$`` fence lines
   separated by blank lines.
2. Stray/unclosed ``$$`` lines remain in a document, inverting block parity.
3. ``^*`` inside inline ``$...$`` or display ``$$...$$`` math is paired by
   CommonMark as italic ``*...*`` emphasis, turning ``$f^*$ ... $f^*$`` into
   ``$f^$ ... $f^$``. Writing ``f^{\\ast}`` avoids ``*`` completely.

Fenced code blocks and inline code spans are left untouched.
Stdlib only (AGENTS.md non-negotiable #6: no new dependencies).
"""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

EXCLUDED_PREFIXES = (
    "node_modules/",
    "venv/",
    ".venv/",
    ".claude/",
    ".qwen/",
    "mutants/",
    "reports/",
    ".stryker-tmp/",
    "coverage/",
    ".pytest_cache/",
    "adblock/dist/",
    "nas_proxy/out/",
    "research/",
)

FENCE_OPEN_RE = re.compile(r"^(\s*)(`{3,}|~{3,})(.*)$")
INDENT_PREFIX_RE = re.compile(r"^(\s*(?:>\s*)*)(.*)$")
DOUBLE_DOLLAR_RE = re.compile(r"(?<!\\)\$\$")
CARET_STAR_RE = re.compile(r"\^(?:\{\*|\*)")
INLINE_CODE_RE = re.compile(r"(`+)(?:(?!\1).)*?\1")
HEADING_OR_RULE_RE = re.compile(r"^\s*(?:#{1,6}\s|[-*_]{3,}\s*$)")
LIST_ITEM_RE = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s")
UNFIXABLE_CODES = ("unmatched-display-math", "indented-display-math")


@dataclass(frozen=True)
class LatexViolation:
    """Single Markdown LaTeX formatting violation."""

    path: Path
    line_no: int
    code: str
    message: str


def _mask_inline_code(line: str) -> tuple[str, list[str]]:
    """Replace inline code spans with null-byte placeholders."""
    spans: list[str] = []

    def _repl(match: re.Match[str]) -> str:
        idx = len(spans)
        spans.append(match.group(0))
        return f"\x00CODE{idx}\x00"

    return INLINE_CODE_RE.sub(_repl, line), spans


def _unmask_inline_code(line: str, spans: list[str]) -> str:
    """Restore inline code placeholders back into the line."""
    for idx, span in enumerate(spans):
        line = line.replace(f"\x00CODE{idx}\x00", span)
    return line


def _fenced_line_flags(lines: list[str]) -> list[bool]:
    """Return a boolean mask marking lines inside fenced code blocks."""
    flags = [False] * len(lines)
    open_char = ""
    open_len = 0
    in_fence = False

    for idx, line in enumerate(lines):
        if not in_fence:
            match = FENCE_OPEN_RE.match(line)
            if match:
                fence = match.group(2)
                open_char = fence[0]
                open_len = len(fence)
                in_fence = True
                flags[idx] = True
            continue

        flags[idx] = True
        stripped = line.lstrip()
        if stripped.startswith(open_char * open_len):
            if stripped.lstrip(open_char).strip() == "":
                in_fence = False
    return flags


def _is_blank_in_container(line: str) -> bool:
    """Return True if line is blank or contains only blockquote markers."""
    _, body = _split_container_prefix(line)
    return body.strip() == ""


def _split_container_prefix(line: str) -> tuple[str, str]:
    """Split leading whitespace / blockquote prefix from line content."""
    match = INDENT_PREFIX_RE.match(line)
    if not match:
        return "", line
    return match.group(1), match.group(2)


def _blank_container_line(prefix: str) -> str:
    """Return a blank line matching the blockquote prefix (empty outside blockquotes)."""
    if ">" in prefix:
        return prefix.rstrip()
    return ""


def _replace_caret_star(expr: str) -> tuple[str, bool]:
    """Replace ^* and ^{* with ^{\\ast} and ^{\\ast inside math text."""
    changed = False

    def _repl(match: re.Match[str]) -> str:
        nonlocal changed
        changed = True
        token = match.group(0)
        return r"^{\ast" if token == "^{*" else r"^{\ast}"

    return CARET_STAR_RE.sub(_repl, expr), changed


def _find_inline_math_spans(masked_line: str) -> list[tuple[int, int]]:
    """Locate single-$ inline math spans (start_idx, end_idx inclusive) on a masked line."""
    spans: list[tuple[int, int]] = []
    n = len(masked_line)
    i = 0
    while i < n:
        ch = masked_line[i]
        if ch == "\\":
            i += 2
            continue
        if ch != "$":
            i += 1
            continue
        if i + 1 < n and masked_line[i + 1] == "$":
            i += 2
            continue
        if i + 1 >= n or masked_line[i + 1] in (" ", "\t"):
            i += 1
            continue
        close_idx = _find_inline_math_close(masked_line, i + 1)
        if close_idx != -1:
            spans.append((i, close_idx))
            i = close_idx + 1
            continue
        i += 1
    return spans


def _find_inline_math_close(line: str, start: int) -> int:
    """Find matching closing $ for an inline math opening $ at start-1."""
    n = len(line)
    j = start
    while j < n:
        ch = line[j]
        if ch == "\\":
            j += 2
            continue
        if ch == "$":
            if j + 1 < n and line[j + 1] == "$":
                return -1
            if line[j - 1] not in (" ", "\t") and (
                j + 1 >= n or not line[j + 1].isdigit()
            ):
                return j
            return -1
        j += 1
    return -1


def _fix_inline_caret_star(
    line: str, line_no: int, path: Path, violations: list[LatexViolation]
) -> str:
    """Normalize ^* inside inline $...$ spans on a single non-math-block line."""
    masked, code_spans = _mask_inline_code(line)
    math_spans = _find_inline_math_spans(masked)
    if not math_spans:
        return line

    parts: list[str] = []
    cursor = 0
    line_changed = False
    for start, end in math_spans:
        parts.append(masked[cursor : start + 1])
        inner = masked[start + 1 : end]
        fixed_inner, changed = _replace_caret_star(inner)
        if changed:
            line_changed = True
            violations.append(
                LatexViolation(
                    path=path,
                    line_no=line_no,
                    code="caret-star-in-math",
                    message="use ^{\\ast} instead of ^* inside inline math",
                )
            )
        parts.append(fixed_inner)
        parts.append("$")
        cursor = end + 1

    if not line_changed:
        return line
    parts.append(masked[cursor:])
    return _unmask_inline_code("".join(parts), code_spans)


def _is_stray_bare_dd(masked_lines: list[str], fenced: list[bool], start: int) -> bool:
    """Return True if the next non-blank line after a bare $$ is EOF, a heading, or a list item."""
    for idx in range(start, len(masked_lines)):
        if fenced[idx]:
            return False
        stripped = masked_lines[idx].strip()
        if not stripped:
            continue
        return bool(
            HEADING_OR_RULE_RE.match(stripped) or LIST_ITEM_RE.match(masked_lines[idx])
        )
    return True


def _collect_stray_dd_indices(
    masked_lines: list[str],
    counts: list[int],
    fenced: list[bool],
    path: Path,
    violations: list[LatexViolation],
) -> set[int]:
    """Identify stray bare $$ line indices when overall $$ count is odd."""
    drop_indices: set[int] = set()
    in_math = False
    for idx, count in enumerate(counts):
        if fenced[idx] or count == 0:
            continue
        is_bare_dd = _split_container_prefix(masked_lines[idx])[1].strip() == "$$"
        is_stray = (
            count == 1
            and is_bare_dd
            and not in_math
            and _is_stray_bare_dd(masked_lines, fenced, idx + 1)
        )
        if is_stray:
            drop_indices.add(idx)
            violations.append(
                LatexViolation(
                    path=path,
                    line_no=idx + 1,
                    code="unmatched-display-math",
                    message="stray unmatched $$ delimiter",
                )
            )
            continue
        if count % 2 == 1:
            in_math = not in_math
    return drop_indices


def _strip_stray_double_dollars(
    lines: list[str], fenced: list[bool], path: Path, violations: list[LatexViolation]
) -> list[str]:
    """Remove unambiguous stray standalone $$ lines when document $$ count is odd."""
    masked_lines = [
        _mask_inline_code(ln)[0] if not fenced[i] else "" for i, ln in enumerate(lines)
    ]
    counts = [len(DOUBLE_DOLLAR_RE.findall(m)) for m in masked_lines]
    if sum(counts) % 2 == 0:
        return lines

    drop_indices = _collect_stray_dd_indices(
        masked_lines, counts, fenced, path, violations
    )
    if not drop_indices:
        return lines
    return [ln for idx, ln in enumerate(lines) if idx not in drop_indices]


def _append_caret_star_if_changed(
    expr: str, line_no: int, path: Path, violations: list[LatexViolation]
) -> str:
    """Replace ^* in display math text and record a violation when modified."""
    fixed, star_changed = _replace_caret_star(expr)
    if star_changed:
        violations.append(
            LatexViolation(
                path=path,
                line_no=line_no,
                code="caret-star-in-math",
                message="use ^{\\ast} instead of ^* inside display math",
            )
        )
    return fixed


def _normalize_single_line_display_math(
    line: str, line_no: int, path: Path, violations: list[LatexViolation]
) -> list[str]:
    """Expand column-0 single-line $$expr$$ into standalone $$ fence lines."""
    masked, code_spans = _mask_inline_code(line)
    if len(DOUBLE_DOLLAR_RE.findall(masked)) != 2:
        return [line]

    prefix, body = _split_container_prefix(masked)
    if prefix != _strip_list_indent(prefix):
        violations.append(
            LatexViolation(
                path=path,
                line_no=line_no,
                code="indented-display-math",
                message="display math $$ inside an indented list fails on GitHub; move to column 0 or use inline $...$",
            )
        )
        return [line]

    body_matches = list(DOUBLE_DOLLAR_RE.finditer(body))
    if len(body_matches) != 2:
        return [line]

    first, second = body_matches
    before = body[: first.start()].strip()
    expr = _append_caret_star_if_changed(
        body[first.end() : second.start()].strip(), line_no, path, violations
    )
    after = body[second.end() :].strip()

    violations.append(
        LatexViolation(
            path=path,
            line_no=line_no,
            code="display-math-fence",
            message="place display math $$ delimiters on their own lines",
        )
    )

    out: list[str] = []
    if before:
        out.append(_unmask_inline_code(f"{prefix}{before}", code_spans))
        out.append(_blank_container_line(prefix))
    out.append(f"{prefix}$$")
    out.append(_unmask_inline_code(f"{prefix}{expr}", code_spans))
    out.append(f"{prefix}$$")
    if after:
        out.append(_blank_container_line(prefix))
        out.append(_unmask_inline_code(f"{prefix}{after}", code_spans))
    return out


def _append_blank_if_needed(out: list[str], prefix: str) -> bool:
    """Append a blank line before opening $$ when the previous line is non-blank."""
    if not out or _is_blank_in_container(out[-1]):
        return False
    out.append(_blank_container_line(prefix))
    return True


def _strip_list_indent(prefix: str) -> str:
    """Keep only blockquote '>' markers so display math delimiters sit at column 0."""
    return prefix.lstrip(" \t")


def _process_multiline_block(
    lines: list[str],
    start: int,
    end: int,
    path: Path,
    violations: list[LatexViolation],
    out: list[str],
) -> None:
    """Check and normalize a multi-line $$...$$ block spanning lines[start..end]."""
    open_prefix, open_body = _split_container_prefix(lines[start])
    close_prefix, close_body = _split_container_prefix(lines[end])
    bq_open = _strip_list_indent(open_prefix)
    bq_close = _strip_list_indent(close_prefix)

    if open_prefix != bq_open or close_prefix != bq_close:
        violations.append(
            LatexViolation(
                path=path,
                line_no=start + 1,
                code="indented-display-math",
                message="display math $$ inside an indented list fails on GitHub; move to column 0 or use inline $...$",
            )
        )
        out.extend(lines[start : end + 1])
        return

    if _append_blank_if_needed(out, bq_open):
        violations.append(
            LatexViolation(
                path=path,
                line_no=start + 1,
                code="display-math-blank-line",
                message="add blank line before display math $$ block",
            )
        )

    open_after = DOUBLE_DOLLAR_RE.sub("", open_body, count=1).strip()
    if open_body.strip() != "$$":
        violations.append(
            LatexViolation(
                path=path,
                line_no=start + 1,
                code="display-math-fence",
                message="place opening $$ delimiter on its own line",
            )
        )
    out.append(f"{bq_open}$$")
    if open_after:
        fixed_after = _append_caret_star_if_changed(
            open_after, start + 1, path, violations
        )
        out.append(f"{bq_open}{fixed_after}")

    for idx in range(start + 1, end):
        out.append(_append_caret_star_if_changed(lines[idx], idx + 1, path, violations))

    close_before = DOUBLE_DOLLAR_RE.sub("", close_body, count=1).rstrip()
    if close_body.strip() != "$$":
        violations.append(
            LatexViolation(
                path=path,
                line_no=end + 1,
                code="display-math-fence",
                message="place closing $$ delimiter on its own line",
            )
        )
    if close_before:
        fixed_before = _append_caret_star_if_changed(
            close_before, end + 1, path, violations
        )
        out.append(f"{bq_close}{fixed_before}")
    out.append(f"{bq_close}$$")


def _emit_single_line_block(
    lines: list[str],
    idx: int,
    path: Path,
    violations: list[LatexViolation],
    out: list[str],
) -> None:
    """Process a single-line $$expr$$ line and ensure surrounding blank lines."""
    prefix, _ = _split_container_prefix(lines[idx])
    bq_prefix = _strip_list_indent(prefix)
    is_col0 = prefix == bq_prefix
    if is_col0 and _append_blank_if_needed(out, bq_prefix):
        violations.append(
            LatexViolation(
                path=path,
                line_no=idx + 1,
                code="display-math-blank-line",
                message="add blank line before display math $$ block",
            )
        )
    out.extend(
        _normalize_single_line_display_math(lines[idx], idx + 1, path, violations)
    )
    if is_col0 and idx + 1 < len(lines) and not _is_blank_in_container(lines[idx + 1]):
        out.append(_blank_container_line(bq_prefix))
        violations.append(
            LatexViolation(
                path=path,
                line_no=idx + 1,
                code="display-math-blank-line",
                message="add blank line after display math $$ block",
            )
        )


def _emit_multiline_block_at(
    lines: list[str],
    fenced: list[bool],
    idx: int,
    path: Path,
    violations: list[LatexViolation],
    out: list[str],
) -> int:
    """Process an opening $$ line, returning the next line index to inspect."""
    end_idx = _find_closing_dd(lines, fenced, idx + 1)
    if end_idx == -1:
        violations.append(
            LatexViolation(
                path=path,
                line_no=idx + 1,
                code="unmatched-display-math",
                message="unclosed $$ display math block",
            )
        )
        out.append(lines[idx])
        return idx + 1

    _process_multiline_block(lines, idx, end_idx, path, violations, out)
    open_prefix, _ = _split_container_prefix(lines[idx])
    close_prefix, _ = _split_container_prefix(lines[end_idx])
    bq_close = _strip_list_indent(close_prefix)
    both_col0 = (
        open_prefix == _strip_list_indent(open_prefix) and close_prefix == bq_close
    )
    if (
        both_col0
        and end_idx + 1 < len(lines)
        and not _is_blank_in_container(lines[end_idx + 1])
    ):
        out.append(_blank_container_line(bq_close))
        violations.append(
            LatexViolation(
                path=path,
                line_no=end_idx + 1,
                code="display-math-blank-line",
                message="add blank line after display math $$ block",
            )
        )
    return end_idx + 1


def check_text(text: str, path: Path) -> tuple[str, list[LatexViolation]]:
    """Check Markdown text for LaTeX formatting errors and return (fixed_text, violations)."""
    has_trailing_nl = text.endswith("\n")
    lines = text.splitlines()
    violations: list[LatexViolation] = []

    fenced = _fenced_line_flags(lines)
    lines = _strip_stray_double_dollars(lines, fenced, path, violations)
    fenced = _fenced_line_flags(lines)

    out: list[str] = []
    idx = 0
    n = len(lines)
    while idx < n:
        if fenced[idx]:
            out.append(lines[idx])
            idx += 1
            continue

        masked, _ = _mask_inline_code(lines[idx])
        dd_count = len(DOUBLE_DOLLAR_RE.findall(masked))

        if dd_count == 2:
            _emit_single_line_block(lines, idx, path, violations, out)
            idx += 1
        elif dd_count == 1:
            idx = _emit_multiline_block_at(lines, fenced, idx, path, violations, out)
        else:
            out.append(_fix_inline_caret_star(lines[idx], idx + 1, path, violations))
            idx += 1

    fixed_text = "\n".join(out)
    if has_trailing_nl and fixed_text:
        fixed_text += "\n"
    elif has_trailing_nl and text == "\n":
        fixed_text = "\n"
    return fixed_text, violations


def _find_closing_dd(lines: list[str], fenced: list[bool], start: int) -> int:
    """Find the index of the next line containing a closing $$ outside code blocks."""
    for idx in range(start, len(lines)):
        if fenced[idx]:
            continue
        masked, _ = _mask_inline_code(lines[idx])
        if len(DOUBLE_DOLLAR_RE.findall(masked)) >= 1:
            return idx
    return -1


def _is_excluded_rel(rel_posix: str) -> bool:
    """Return True if a repo-relative POSIX path falls under an excluded prefix."""
    return any(rel_posix.startswith(pref) for pref in EXCLUDED_PREFIXES)


def _rglob_markdown_files() -> list[Path]:
    """Fallback Markdown file discovery using Path.rglob when git is unavailable."""
    return sorted(
        p
        for p in REPO_ROOT.rglob("*.md")
        if not _is_excluded_rel(p.relative_to(REPO_ROOT).as_posix())
    )


def iter_markdown_files(paths: list[str] | None = None) -> list[Path]:
    """Return Markdown files to inspect, either from explicit CLI args or git ls-files."""
    if paths:
        return sorted(Path(p) for p in paths if Path(p).is_file())

    try:
        out = subprocess.check_output(
            ["git", "ls-files", "--cached", "--others", "--exclude-standard", "*.md"],
            cwd=REPO_ROOT,
            text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return _rglob_markdown_files()

    result: list[Path] = []
    for rel in out.splitlines():
        rel_norm = rel.replace("\\", "/")
        if _is_excluded_rel(rel_norm):
            continue
        candidate = REPO_ROOT / rel_norm
        if candidate.is_file():
            result.append(candidate)
    return sorted(result)


def _process_file(md_file: Path, fix: bool) -> tuple[bool, list[LatexViolation]]:
    """Check one Markdown file and optionally rewrite it; return (was_fixed, remaining_violations)."""
    original = md_file.read_text(encoding="utf-8")
    fixed_text, violations = check_text(original, md_file)
    if not violations:
        return False, []

    was_fixed = False
    if fix and fixed_text != original:
        md_file.write_text(fixed_text, encoding="utf-8")
        was_fixed = True

    if not fix:
        return False, violations

    remaining = [
        v
        for v in violations
        if v.code in UNFIXABLE_CODES
        and (v.code != "unmatched-display-math" or fixed_text == original)
    ]
    return was_fixed, remaining


def _format_violation(v: LatexViolation) -> str:
    """Format a single violation relative to REPO_ROOT when possible."""
    try:
        rel = v.path.relative_to(REPO_ROOT)
    except ValueError:
        rel = v.path
    return f"{rel}:{v.line_no}: [{v.code}] {v.message}"


def main(argv: list[str] | None = None) -> int:
    """CLI entry point for checking or auto-fixing Markdown LaTeX formatting."""
    parser = argparse.ArgumentParser(
        description="Check and optionally auto-fix GitHub Markdown LaTeX formatting errors."
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Rewrite files in place to fix LaTeX formatting errors.",
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="Optional Markdown file paths (defaults to tracked/untracked repo .md files).",
    )
    args = parser.parse_args(argv)

    all_violations: list[LatexViolation] = []
    fixed_count = 0
    for md_file in iter_markdown_files(args.files):
        was_fixed, remaining = _process_file(md_file, args.fix)
        if was_fixed:
            fixed_count += 1
        all_violations.extend(remaining)

    if all_violations:
        for v in all_violations:
            print(_format_violation(v), file=sys.stderr)
        return 1

    if args.fix and fixed_count:
        print(f"md-latex-fix: fixed {fixed_count} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
