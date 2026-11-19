---
description: Fully diagnose and repair a failed GitHub Actions workflow run, then automatically verify, commit, push, open and merge a PR, trigger or observe a fresh run, and verify workflow outputs. Use when the user names or links a failed workflow run, reports a failing scheduled/manual workflow, or asks for end-to-end Actions recovery without further confirmation.
argument-hint: '[workflow run number, run URL, or workflow name]'
---

Rescue this failed GitHub Actions workflow end to end: **$ARGUMENTS**

Invocation explicitly authorizes edits, tests, commits, pushes, PR creation,
squash merges, workflow dispatches/reruns, and cleanup. Do not ask for further
confirmation. Stop only for a real blocker such as unavailable authentication,
missing required secrets, or an upstream outage/vulnerability with no safe
automated remediation; report that blocker precisely.

## 1. Anchor the target and current state

Re-resolve the run from GitHub rather than trusting a stale page or run title.
A workflow `run_number` (for example #523) is not the API `run.id`.

```bash
git status --short
git branch --show-current
git log --oneline -3
```

- Record the workflow name/path, run number and ID, head SHA/branch, failing
  jobs/steps, conclusion, and HTML URL.
- Check recent runs to find the last success and first consecutive failure.
  Compare dependency/runtime versions and error signatures across that boundary.
- Read the workflow YAML and the docs governing its gates and runtime
  constraints (`AGENTS.md`, `docs/gates.md`, `docs/ci-gotchas.md`) before
  editing.
- Check open/recently closed PRs for overlapping work. Use
  `python3 tools/prior_prs.py`; if unauthenticated `gh` makes it fail, query the
  public pulls API instead.
- Create a todo list covering diagnosis, fix/regression tests, shipping, fresh
  workflow execution, and output/state verification. Keep exactly one item in
  progress.

Use authenticated `gh` when available. Otherwise use public GitHub APIs for run
metadata and an authenticated browser for logs, PR creation/merge, and manual
dispatch. Never print credentials or place API keys in URLs.

## 2. Establish the failure before theorizing

Read the actual failing step log bottom-up. Capture the first actionable error,
final exit status, runtime/dependency versions, and whether the step started
producing output. Do not mistake echoed shell text or annotations for the root
error (Actions echoes `run:` lines in cyan, including `echo "::error::..."`
branches that did not execute). Also check `docs/ci-gotchas.md` for known
benign noise in `make precommit` (such as ignored `test-ebpf` errors or expected
`curl_easy_perform()` negative-path output) and judge by step exit codes. A
fast failure in `ci.yml` usually hits the PR guards (`Reject empty pull
request`, `Reject bot PR hygiene violations`) before `make precommit`; a segfault
or binary error before the first test print points to native C builds (`-lcurl`,
architecture mismatch) or imports rather than test logic.

Build the tightest deterministic loop that exercises this exact symptom:

1. scoped regression test at the real call site (`npx jest <path>`,
   `python3 -m pytest <path>`, or `make -C nas_proxy test`);
2. direct gate, audit, or tool invocation (`make lint`, `make type`,
   `pip-audit -r requirements-dev.txt`, `python3 tools/check_bot_pr_hygiene.py`);
3. clean isolated environment reproducing resolved Node/Python dependency
   versions (`requirements-dev.txt`, `package-lock.json`);
4. Linux/CI-parity reproduction via `make precommit-docker` when macOS host
   constraints (raw-socket permissions, `SIGALRM` timing, Linux headers) differ
   from `ubuntu-latest`;
5. workflow rerun only when no local seam exists.

Watch the loop fail before the fix and pass afterward. Keep temporary virtual
environments, logs, and diagnostic outputs out of git (delete them afterward or
write logs under `.gitignore`'d `coverage/`). For a difficult diagnosis, rank
3–5 falsifiable hypotheses before probing; for Linux/CI-only failures, check
`docs/ci-gotchas.md` and reproduce in `make precommit-docker`.

Classify the result before changing files:

- **Repository defect:** fix the smallest root cause and add a regression test.
- **Runtime/dependency rollover:** correlate the first failure with resolved
  versions; pin a supported runtime/action or upgrade/replace the incompatible
  dependency rather than hiding the error. Respect `AGENTS.md` pins (never
  upgrade `jest` or `jest-environment-jsdom` past v29, and verify action major
  tags via `gh api` before bumping `uses:`).
- **Upstream advisory or external service rollover:** for `pip-audit.yml`
  advisories, update `requirements-dev.txt` safely and verify tests/gates; for
  transient GitHub/registry outages, rerun without inventing code edits.
- **Transient GitHub/infrastructure failure with no code defect:** rerun the
  failed jobs; do not invent a code change or open an empty PR.
- **Validation rejection:** preserve the gate. Never weaken coverage floors,
  complexity ceilings (ESLint/`xenon`), `depcheck`, `thinking-check`,
  `bot-pr-check`, or `pip-audit` checks to obtain green.

## 3. Fix and prove it

Make one concern-sized change (scoped to one subproject when applicable) on a
branch off current `main`. Stage only files owned by this rescue; concurrent
agents and the user may share the worktree. Never discard foreign changes or use
destructive git cleanup.

For each behavior fix, include a test that fails before and passes after.
Prefer structural prevention over prose: runtime/action pins, dependency fixes,
schema checks, or Makefile gate validation (keep checks in `Makefile`, not
duplicated solely in `.github/workflows/ci.yml`). Avoid global version pins when
a workflow-local pin fixes the incompatibility with less collateral risk.

Exercise the real recovery path, not just mocks (for example, run the actual
`make` target, `pip-audit -r requirements-dev.txt`, or `make precommit-docker`
when credentials/network/Docker allow). Clearly distinguish mocked test coverage
from live or container execution evidence.

If the fix touches `.agents/skills/`, run `python3 tools/sync_commands.py` so
`.claude/commands/` stays in sync.

Run `make precommit` (check-only, matching `ci.yml` — use `make precommit-fix`
while iterating, then re-verify with `make precommit`; on macOS use
`make precommit-docker` for Linux/CI parity) on the finished tree before opening
a PR. Remember `python3 tools/gate_guard.py` when retrying a failed gate: do not
rerun a red gate on an unchanged tree. If a local command exceeds its execution
cap, complete every remaining phase separately and report exactly that — never
claim a capped command returned green. Check the final diff for formatter
damage, scratch artifacts, and unrelated edits.

## 4. Ship without pausing

- Create one real Conventional Commit (no emoji, `<= 72` chars, lower-case
  scope, no conversational wrappers); do not push empty or no-op commits.
- Push the branch and open a non-draft PR unless live browser or real hardware
  review is required.
- Use a valid Conventional Commit PR title and include **What & why**,
  **Subproject**, **Verification** (exact commands and results pasted), and
  **Live/hardware?** status in the body.
- Wait for all required PR checks (`ci.yml` guards + `make precommit`, and
  `pip-audit.yml` when triggered). If red, inspect logs, fix on the same branch,
  rerun `make precommit`, amend/squash into one commit, and force-push with
  lease.
- Squash-merge only after required checks pass. Confirm the merged SHA through
  GitHub rather than inferring success from a button click.
- Confirm the local tree is clean, switch to `main`, and run:

```bash
git pull --rebase origin main
```

Do not delete branches or worktrees while they contain unshipped or foreign work.

## 5. Execute the fixed workflow

Trigger or observe the fixed workflow on merged `main` (or on the target PR
event for PR-only workflows such as `dependabot-auto-merge.yml` or
`claude*.yml`); do not treat rerunning the old failed SHA as proof of the fix.

- For `push`-triggered workflows (`ci.yml`, `pip-audit.yml`), locate the run
  spawned by the merge commit SHA on `main` and record its run number and ID.
- For `workflow_dispatch` workflows (such as `mutation.yml`), dispatch on
  `main` and resolve the new run number and ID from its head SHA.
- Monitor every material stage: checkout/guards, dependency installation,
  gate/audit/mutation execution, and any automated follow-up action (such as
  Dependabot formatting pushes or auto-merge). Remember `mutation.yml` sets
  `continue-on-error: true`, so inspect individual step conclusions rather than
  trusting overall job status alone.

If this run fails, return to step 2 with its new logs and continue automatically.
Respect GitHub/registry rate limits and use bounded backoff rather than tight
polling or retry loops. Do not weaken checks or manually mark a run successful.

## 6. Verify post-fix workflow state and downstream impact

Verify that the workflow's expected outputs and repository invariants hold on
`main`:

- Confirm `ci.yml` and `pip-audit.yml` are green on the merge commit on `main`.
- For non-blocking scheduled workflows (`mutation.yml`), confirm both
  `make mutate-js` and `make mutate-py` steps succeeded and produced valid
  mutation summaries without unexpected crashes.
- If the outage blocked open PRs (such as Dependabot PRs waiting on `ci.yml` or
  `pip-audit.yml`), verify whether affected PR checks recover on rerun/rebase
  or report which PRs remain blocked.
- Never hand-edit or commit generated outputs (`.claude/commands/` is generated
  only by `python3 tools/sync_commands.py`; `coverage/`, `adblock/dist/`,
  `nas_proxy/out/`, `.stryker-tmp/`, `reports/`, `mutants/`, `.mutmut-cache/`,
  and compiled C binaries stay untracked/ignored).

## 7. Finish only with evidence

The rescue is incomplete until the fixed workflow has actually succeeded on the
merged fix (or target PR event) and its step-level outcomes are verified. If an
external registry, advisory database, or runner limitation prevents full
recovery, report the exact failing check and remaining blocker rather than
claiming resolution.

Respond with:

1. root cause and failing step;
2. code/config fix and regression evidence;
3. PR number and merge commit;
4. fresh run number, ID, head SHA, and step-level results;
5. verified post-fix state or unblocked PRs/outputs;
6. any external limitation or remaining risk, without guarantees that future
   third-party outages cannot recur.

Clean up temporary environments and diagnostic files (if `make precommit-docker`
left Linux C binaries in the tree, run
`make -C nas_tools clean && make -C nas_proxy clean` before host tests). Update
the todo list and re-anchor from `git status` and `git log` before reporting
completion.
