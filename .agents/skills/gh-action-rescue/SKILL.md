---
name: gh-action-rescue
description: Fully diagnose and repair a failed GitHub Actions workflow run, then automatically verify, commit, push, open and merge a PR, trigger or observe a fresh run, and verify workflow outputs. Use when the user names or links a failed workflow run, reports a failing scheduled/manual workflow, or asks for end-to-end Actions recovery without further confirmation.
argument-hint: '[workflow run number, run URL, or workflow name]'
---

Rescue this failed GitHub Actions workflow end to end: **{{args}}**

Invocation authorizes the full loop — edits, tests, commits, pushes, PR
creation, squash merge, workflow dispatch/rerun, and cleanup — without pausing
for confirmation. Stop only on a real blocker (missing auth/secrets or an
upstream outage/vulnerability with no safe automated fix) and report it
precisely.

## 1. Anchor target and state

Resolve the run live from GitHub (`run_number` like `#523` differs from the API
`run.id`). Use authenticated `gh` when available, or public GitHub APIs for
metadata plus an authenticated browser for logs, PRs, and manual dispatch; keep
credentials out of command output and URLs.

- Run `git status --short`, `git branch --show-current`, and
  `git log --oneline -3`.
- Record workflow path, run number/ID, head SHA/branch, failing jobs/steps, and
  URL. Compare recent runs across the last-success → first-failure boundary
  (runtime/dependency versions and error signatures).
- Read the workflow YAML and governing docs (`AGENTS.md`, `docs/gates.md`,
  `docs/ci-gotchas.md`).
- Check overlapping PRs with `python3 tools/prior_prs.py` (or the public pulls
  API if `gh` is unauthenticated).

## 2. Reproduce before theorizing

Read the failing step log bottom-up: Actions echoes every shell line in cyan
(including untaken `if` branches with `echo "::error::..."`), so anchor on the
step ending in `##[error]Process completed with exit code 1`. Check
`docs/ci-gotchas.md` for expected benign noise in `make precommit` (such as
ignored `test-ebpf` or negative-path `curl_easy_perform()` output) and judge by
exit codes. A fast failure in `ci.yml` usually hits `Reject empty pull request`
or `Reject bot PR hygiene violations` before `make precommit`; a segfault or
binary error before the first test print points to native C builds (`-lcurl`,
architecture mismatch) or imports.

Build the tightest deterministic local loop (watch it fail before the fix, pass
after):

1. Scoped regression test (`npx jest <path>`, `python3 -m pytest <path>`, or
   `make -C nas_proxy test`).
2. Direct gate or tool invocation (`make lint`, `make type`,
   `pip-audit -r requirements-dev.txt`, `python3 tools/check_bot_pr_hygiene.py`).
3. Clean isolated env matching `requirements-dev.txt` / `package-lock.json`.
4. Linux/CI-parity container via `make precommit-docker` when macOS host limits
   (raw-socket permissions, `SIGALRM` timing, Linux headers) diverge from
   `ubuntu-latest`.
5. Workflow rerun only when no local seam exists.

Keep temp venvs and diagnostic logs out of git (delete afterward or write under
gitignored `coverage/`).

Classify before editing:

- **Repository defect:** minimal root-cause fix + regression test.
- **Runtime/dependency rollover:** correlate versions at the failure boundary;
  pin a supported runtime (workflow-local over global when sufficient) or
  upgrade/replace the incompatible dependency. Keep `jest` and
  `jest-environment-jsdom` pinned at v29 (`AGENTS.md` #5), and verify action
  major tags via `gh api` before bumping `uses:`.
- **Upstream advisory (`pip-audit.yml`):** update `requirements-dev.txt` safely
  and verify tests/gates; for transient registry/GitHub outages, rerun without
  inventing code changes or empty PRs.
- **Validation rejection:** keep coverage floors, complexity ceilings
  (ESLint/`xenon`), `depcheck`, `thinking-check`, `bot-pr-check`, and
  `pip-audit` intact; fix the underlying cause.
- **Red Dependabot/PR check:** reproduce with `npm ci` on the PR lockfile in a
  worktree (respecting `AGENTS.md` #5), then accept fixer output or exclude the
  file citing the upstream issue; push an additive commit so Dependabot's
  signed commit stays intact. When `gh pr edit` hits GraphQL `read:org` scope
  errors, patch the PR title via
  `gh api -X PATCH repos/<owner>/<repo>/pulls/<N> -f title="..."`.

## 3. Fix, prove, and ship

Follow `AGENTS.md` (shared checkout, one concern/subproject on a branch off
`main`, one Conventional Commit ≤ 72 chars, PR body with What & why /
Subproject / Verification / Live/hardware?).

- Prefer structural prevention over prose: runtime/action pins, `.gitignore` +
  `tools/check_bot_pr_hygiene.py`, or `Makefile` gate checks (keep checks in
  `Makefile`, not solely in `ci.yml`).
- Exercise the real recovery path (`make` target, `pip-audit`, or
  `make precommit-docker` when network/Docker allow), distinguishing mocked
  tests from live/container evidence.
- If edits touch `.agents/skills/`, run `python3 tools/sync_commands.py`.
- Verify the finished tree with `make precommit` (iterate with
  `make precommit-fix`; use `make precommit-docker` on macOS for CI parity;
  change something before retrying per `python3 tools/gate_guard.py`). If a
  local command hits a timeout, finish remaining phases separately and report
  that explicitly.
- Push, open a PR (draft only if live browser/hardware review is needed), wait
  for required checks (`ci.yml`, plus `pip-audit.yml` when triggered; amend and
  `--force-with-lease` on fixes), then squash-merge and confirm the merged SHA
  on GitHub.
- Return to a clean `main` (`git pull --rebase origin main`), keeping any
  branch or worktree holding unshipped or foreign work.

## 4. Execute on merged `main` and verify post-fix state

Observe or dispatch the fixed workflow on merged `main` (or the target PR event
for PR-only workflows like `dependabot-auto-merge.yml` or `claude*.yml` —
rerunning the old failed SHA only replays the broken state):

- **`push` workflows (`ci.yml`, `pip-audit.yml`):** locate the run for the
  merge commit SHA on `main` and confirm green.
- **`workflow_dispatch` / scheduled (`mutation.yml`):** dispatch on `main`,
  resolve the new run from its head SHA, and inspect individual step conclusions
  for `make mutate-js` and `make mutate-py` (`mutation.yml` sets
  `continue-on-error: true`, so job status alone is insufficient).
- Monitor every material stage with bounded backoff; if it fails, loop back to
  step 2 automatically.
- Confirm any blocked open PRs (e.g. Dependabot) recover on rerun/rebase, and
  keep generated outputs (`coverage/`, `adblock/dist/`, `nas_proxy/out/`,
  `.stryker-tmp/`, `reports/`, `mutants/`, `.mutmut-cache/`, C binaries)
  untracked.

## 5. Evidence report

The rescue finishes only when the fixed workflow succeeds on the merged fix (or
target PR event) and step-level outcomes are verified. Clean up temp files — if
`make precommit-docker` left Linux C binaries in the tree, run
`make -C nas_tools clean && make -C nas_proxy clean` before host tests —
re-anchor from `git status` and `git log`, and report:

1. Root cause and failing step.
2. Code/config fix and regression evidence.
3. PR number and merge commit.
4. Fresh run number, ID, head SHA, and step-level results.
5. Verified post-fix state and unblocked PRs/outputs.
6. Any external limitation or remaining risk.
