# Gate Internals

Implementation detail and day-one measurements for the repository's preventive
gates. This used to live in `AGENTS.md`; the binding rules still live there —
this doc is the reference for how each gate works and why it was wired.

## Dependency-structure gate (`make depcheck`)

`make depcheck` (wired into `make lint`, hence into `make precommit`) runs
dependency-cruiser over `adblock gov_bypass jest.setup.js` with the
rules in `.dependency-cruiser.cjs`: no circular deps, no cross-subproject
imports (mirrors non-negotiable #2), production source never imports
`__tests__`. Measured **zero violations** on day one (56 modules, 51
dependencies, fully resolved — no `couldNotResolve`), so no baseline was
needed; the gate is purely preventive. Probe-tested: a cross-subproject import
and a prod→test import each fail the gate; `git restore` returns green. This
wiring was done by an interactive agent explicitly directed to change
build/lint config (non-negotiable #6 binds Jules routines, not interactive
agents).

- **No alias config, on purpose:** this repo has no path aliases (no import
  map, no `jsconfig.json` `paths`, no bare specifiers). If aliases are ever
  added, resolve them via a webpack-config stub — **never** `options.tsConfig`,
  which makes dependency-cruiser look for a typescript <7 compiler (this repo
  has v7) and print a spurious "missing-typescript-transpiler" warning.
- **Python import-linter: deliberately skipped after measuring.** The
  `test-py` scope (`nas_proxy`, `retriever`, `vps_kernel_proxy` are real
  packages with `__init__.py`; `nas_tools`, `bin` are PEP 420 namespace dirs)
  was graphed with grimp (import-linter's builder): **zero** cross-top-level
  import edges across all five dirs — every package imports only itself and
  the stdlib. A `layers`/`independence` contract would gate an empty relation,
  so nothing was wired and import-linter was not added to
  `requirements-dev.txt`. Unblock condition: if real cross-package imports
  appear, revisit with a minimal contract.
- **grimp measurement gotcha:** running grimp/import-linter in the repo root
  writes a `.grimp_cache/` dir that fails `fmt-check` — measure in a venv and
  delete the cache afterwards.

## Stream-of-consciousness gate (`make thinking-check`)

`make thinking-check` (wired into `make precommit`) runs
`tools/check_thinking_comments.py`, a stdlib-only deterministic scan of all
git-tracked sources (py/js/css/c/h/sh) enforcing non-negotiable #9: Python
comments matched via `tokenize` (strings never match), JS/CSS/C via a
block-comment-aware line scan that ignores URL schemes, shell via full-line
`#` comments only, plus abandoned-test detection (pytest-collectable
`pass`/`...`/docstring-only bodies, JS `it()`/`test()` with empty callbacks).
Measured **8 violations** on day one (all in test files: coverage-chasing
"to hit line N" notes, "Let's mock ..." reasoning, one abandoned `pass`-only
test) — fixed in place, no baseline needed; the gate is purely preventive.
Probe-tested: a thinking comment plus an abandoned `pass`-only test appended
to a tracked file fails the gate; `git restore` returns green. This wiring was
done by an interactive agent explicitly directed to change
build/lint config (non-negotiable #6 binds Jules routines, not interactive
agents).

## Bot PR hygiene gate (`make bot-pr-check`)

`make bot-pr-check` (wired into `make precommit` and `precommit-fix`) runs
`tools/check_bot_pr_hygiene.py`, a stdlib-only deterministic check over every
commit authored by `google-labs-jules[bot]` in `origin/main..HEAD` (falls back
to `main`), enforcing non-negotiable #11. Wording alone did not stop the empty
Typist PRs (#75, #78) here or the anki repo's PR #494 (existing tests deleted
in a coverage PR, then five empty/no-op commits including an add-then-remove
`dummy_file.txt`), so the gate fails on bot commits that: change no files
(empty commit), touch a file with zero content lines (the placeholder/dummy
pattern), or delete lines from a test file — test paths are `__tests__/` and
`tests/` dirs, `test_*.py`, and `*.test.js`; bot lanes are append-only in
tests (Testpilot owns them). Human-authored commits are skipped: interactive
agents may legitimately rewrite tests on request. CI runs the same check on
every PR (the "Reject bot PR hygiene violations" step in `ci.yml`, next to the
empty-PR guard; the checkout uses `fetch-depth: 0` so the branch commits are
visible behind the merge commit — a shallow checkout would silently no-op the
check). Tests live in `tools/__tests__/test_check_bot_pr_hygiene.py` (real git
repos in `tmp_path`, run by `make test-py`). Probe-tested: a bot-authored
empty commit fails the wired gate and a clean range passes it, with exit-code
propagation through `make` verified on a synthetic fixture repo. This wiring
was done by an interactive agent explicitly directed to change
build/lint config (non-negotiable #6 binds Jules routines, not interactive
agents).

## Mutation testing (NON-BLOCKING scaffold)

`make mutate-js` (StrykerJS, `stryker.config.mjs`) and `make mutate-py`
(mutmut, `[tool.mutmut]` in `pyproject.toml`) are **informational only** —
deliberately not wired into `make precommit`, and the weekly
`.github/workflows/mutation.yml` runs them `continue-on-error`. Mutation
scores are signal for humans, not thresholds.

- **JS scope:** `adblock/picker.js` only (small, 100% statement
  coverage), incremental mode. Day-one smoke: 146 mutants, 61 killed, 85
  survived, score **41.78%** in ~9 s. Widen `mutate` one file at a time.
- **Python scope:** the three `test-py` source packages, `*/__tests__/*`
  excluded via `do_not_mutate` (mutmut otherwise mutates the test files
  themselves — day one that produced 1602 mutants with hundreds of noise
  "survived" results in `test_ebpf`). Source-only smoke: 1012 mutants, 292
  killed, 575 survived, 143 no-tests, 2 timeouts (~25 s).
- **mutmut vs. `os.getcwd` mocks:** 8 retriever tests patch `os.getcwd` on the
  shared os module; mutmut 3.6.0's `record_trampoline_hit` resolves its
  relative `source_paths` against that mocked cwd
  (`Path("retriever").resolve(strict=True)` → `FileNotFoundError`), crashing
  baseline stats collection. They are excluded via the `-k` filter in
  `pytest_add_cli_args` (they still run in `make test-py`).
- **Artifacts** (`.stryker-tmp/`, `reports/`, `mutants/`, `.mutmut-cache/`)
  are git- and prettier-ignored; delete them freely, they regenerate.
- `mutmut` is pinned in `requirements-dev.txt`, so it is also present in the
  `Dockerfile.precommit` image (installed, never run by the gate).
