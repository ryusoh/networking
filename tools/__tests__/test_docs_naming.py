"""Enforce lower-kebab-case naming convention for all markdown files in docs/."""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DOCS_DIR = REPO_ROOT / "docs"

KEBAB_CASE_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*\.md$")


def test_docs_filenames_must_be_lower_kebab_case():
    assert DOCS_DIR.exists(), f"Docs directory not found at {DOCS_DIR}"

    invalid_files = []
    for file_path in DOCS_DIR.glob("*.md"):
        if not KEBAB_CASE_PATTERN.match(file_path.name):
            invalid_files.append(file_path.name)

    assert not invalid_files, (
        f"The following files in docs/ violate lower-kebab-case convention (e.g. ci-lint-type-debt.md): "
        f"{invalid_files}"
    )
