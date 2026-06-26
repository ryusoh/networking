# AGENTS.md

Shared operating contract for **automated agents** (Jules scheduled routines) on
this repo. You run unattended and open PRs. A human only does a binary
approve/close on the result — they will **not** leave review comments or iterate
with you. So every PR must be self-evidently correct and approvable at a glance.
Optimize for **approve rate**, not for volume.

This repo (net-tools) is a collection of **independent networking and browser
tooling subprojects** spanning several languages: a Chrome MV3 extension
(`clean_adblock/`, JavaScript, Jest + jsdom), Python packages
(`nas_proxy/`, `retriever/`, `vps_kernel_proxy/`, `nas_tools/`, pytest), C tooling
(`nas_proxy/`, `nas_tools/`, `bin/*.c`, compiled with `-lcurl`), and eBPF
(`vps_kernel_proxy/`, Docker-only). Human-facing detail lives in `CLAUDE.md` and
`GEMINI.md`; read them before deep work.

## Non-negotiables (a PR that violates any of these will be closed)

1. **Open a PR only if `make precommit` is green.** That is the exact CI gate
   (`.github/workflows/ci.yml` runs `make precommit` on `ubuntu-latest`), and the
   **Makefile is the single source of truth** — never add a check to the workflow
   instead of the Makefile. Use `make precommit-fix` while iterating (it writes
   fixes); run `make precommit` (check-only) before opening the PR.
2. **One concern, one subproject, smallest possible diff.** These subprojects are
   independent; do not span more than one in a single PR, and no drive-by edits.
   Diff size is inversely proportional to approval.
3. **Stay in your lane** (see "Lanes"). If two routines touch the same files, one
   PR gets closed. Don't fix something another lane owns.
4. **Don't commit to `main`.** Branch off `main`, open a PR.
5. **Do not upgrade `jest` or `jest-environment-jsdom`.** They are pinned to v29
   on purpose; v30/v26 break the `window.location` mocking used across the
   `clean_adblock` suite (see `GEMINI.md`). A dependency bump that touches these
   will be closed.
6. **Don't add dependencies or change build/lint/test config** unless your lane
   explicitly allows it. No new npm or pip packages, no edits to `package.json`
   scripts, `eslint.config.cjs`, `pyproject.toml`, or the Makefile, except where a
   lane names them.
7. **Don't write a command/example you haven't actually run this session.** Verify
   behaviour; don't infer it from a name or a target label.
8. **Check open and recently-closed PRs before you start, and don't repeat them.**
   Run `gh pr list --state all --limit 30` and read the recent ones. A closed PR
   was closed for a reason; an open one already claims that work. Pick something new.

## Reading the gate output (this repo is noisy on purpose)

`make precommit` and `precommit-fix` **exit 0 even when the log looks alarming.**
Judge by the exit code and the summary lines, not by eyeballing the stream. Known
expected noise (all documented in `CLAUDE.md`):

- **eBPF is intentionally ignored** (`-@docker ...` in the Makefile). Without
  Docker/Colima you will see `test-ebpf ... Error N (ignored)` — expected, not a
  failure. Any `(ignored)` is fine.
- **`curl_easy_perform() failed: Unsupported protocol`** in the nas_proxy run is a
  test deliberately exercising the error path (`invalid://schema`), not a failure.
- **`nas_tools` privileged tests (ICMP / `eth0`) and the `vps_kernel_proxy` eBPF
  compile test self-skip** when the host lacks prerequisites (e.g. macOS, bare CI
  runner). Do not "fix" a skip by apt-installing a BPF toolchain or removing a
  `skipUnless` guard.
- **jsdom prints async `unhandled exception` stack traces** for errors thrown
  inside content-script code even when the test passes. These are real bugs to fix
  (Sentinel's lane), but they do not fail the suite by themselves.

System dependency: the C tests link `-lcurl`, so a runner needs
`libcurl4-openssl-dev` (CI installs it; macOS has it via the SDK).

## You cannot see anything visual

Unit tests cannot observe rendered extension UI or page behaviour in a real
browser. Never claim a visual result "looks good" or "works in Chrome." Restrict
claims to objectively verifiable facts (a passing test, a DOM assertion, an exit
code). If a change's payoff is only observable in a live browser or on real
hardware, open the PR as **draft** and say so.

## The PR body must carry its own proof

Make the approve decision take ten seconds. Every PR description must include:

- **What & why** — one or two sentences.
- **Lane & subproject** — which routine/lane, and which subproject.
- **Verification** — the exact command(s) you ran and their result, pasted:
  `make precommit` green, or the scoped proof for your lane (a before/after
  coverage number, a strict-error count, a measurement).
- **Live/hardware?** — "fully covered by tests" or "needs human/hardware review
  (draft)."

A PR with no pasted verification output reads as unverified and will be closed.

## Changed lines must be covered

Coverage is reported but **not gated** (Jest `collectCoverageFrom:
clean_adblock/*.js`; pytest `--cov` on the three Python packages; neither enforces
a threshold). This is on your honour:

- If your change adds or alters runtime behaviour (a bug fix, a security fix), ship
  a test that fails before and passes after, covering the changed lines.
- Behaviour-preserving changes (refactors, dead-code removal, pure typing) need no
  new test — keep the suite green.

## Commit and PR-title conventions

Use **Conventional Commits**. The squash-merge uses the PR title as the commit
subject, so the **PR title must be a valid Conventional Commit subject**.

- **Single-Commit Squash Merge Caveat**: If a PR contains exactly one commit, GitHub defaults the squash-merge commit message to that single commit's message (ignoring the PR title). Therefore, your commit message must be strictly formatted as a Conventional Commit.
- **No Conversational Wrappers**: The commit message and final output must contain no greetings (e.g., "Hello! Jules here"), no conversational sign-offs (e.g., "Let me know if you need anything else"), and no conversational preambles/suffixes. Start directly with the commit title and proceed directly to the structured body.
- Format: `type(scope): summary` — type ∈ `feat`, `fix`, `refactor`, `perf`,
  `test`, `docs`, `chore`, `build`, `ci`; scope is the subproject or area
  (`clean_adblock`, `nas_proxy`, `retriever`, `vps_kernel_proxy`, `nas_tools`,
  `types`, `deps`); summary imperative, lower-case, no trailing period, ≤ 72 chars.
- **No emoji, and no routine-name prefix in the subject.** Routine attribution
  rides on the `Co-authored-by: google-labs-jules[bot]` trailer.
- **Body**: wrap at ~72 cols; explain what and why. State severity, metrics, or
  measurements here, not in the subject.

## Command interface — prefer `make` (matches CI)

| Need                                   | Command                                  |
| -------------------------------------- | ---------------------------------------- |
| Full gate, check-only (what CI runs)   | `make precommit`                         |
| Full gate, auto-fixing format and lint | `make precommit-fix`                     |
| JS lint / format                       | `make lint` / `make fmt-check`           |
| Jest with coverage                     | `make test`                              |
| Python tests + coverage (term-missing) | `make test-py`                           |
| JS type-check (JSDoc, non-blocking)    | `make type`                              |
| Rank least-covered files (Testpilot)   | `python3 bin/coverage_rank.py --limit 5` |
| Scoped Jest while iterating            | `npx jest <path>`                        |

- **Jest is pinned to v29.** The established `window.location` mock is the
  "delete and reassign in `beforeEach`" pattern (see `GEMINI.md`); do not port the
  v30 pattern.
- `make test-py` first builds the `nas_tools` C binaries the tests shell out to,
  then runs pytest. If `--cov` is unrecognized, install dev deps:
  `python3 -m pip install -r requirements-dev.txt --break-system-packages`.

## Layout

- `clean_adblock/` — Chrome MV3 extension; per-site content scripts + background
  service worker; tests in `clean_adblock/__tests__/` (jsdom).
- `nas_proxy/`, `nas_tools/` — C tooling (`make -C <dir> test`); `nas_tools` also
  has Python wrappers with privileged, self-skipping tests.
- `retriever/` — the `pull` script. `vps_kernel_proxy/` — kernel/user proxy + eBPF.
- `tianditu_bypass/`, `vmware/`, `bin/` — misc tools and C build accelerators.
- `docs/` — `EBPF_RESEARCH.md`, `NAS_STRATEGY.md`. `bin/coverage_rank.py` — the
  coverage ranking helper.

## Lanes (keep PRs disjoint to avoid collisions)

| Routine   | Owns                                                                                                         | Must NOT touch                                 |
| --------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Sentinel  | security + error-handling (proxy/SSRF, C memory safety, secrets, silent catches, jsdom unhandled exceptions) | complexity refactors, perf, tests as a feature |
| Testpilot | test-only additions/coverage across Jest and pytest                                                          | production source under any subproject         |
| Architect | behaviour-preserving complexity/readability refactors                                                        | error-handling, security, tests, features      |
| Janitor   | dead code, stale deps, real TODOs                                                                            | complexity, error-handling, the Jest v29 pin   |
| Bolt      | one measurable performance/efficiency win per run                                                            | complexity-only refactors, security, dead code |
| Typist    | incremental JS strict-typing via JSDoc on `clean_adblock/*.js`                                               | runtime logic, tests, Python, C                |

If your finding belongs to another lane, **skip it** — that lane will get it.

> **Enforcement note:** this repo configures no ESLint `complexity` rule and no
> coverage threshold, and the JS type-check (`make type`) is **non-blocking**. The
> Architect, Testpilot, and Typist targets are therefore judgment-guided, not
> machine-gated. Your real gate is a green `make precommit` plus the scoped proof
> your lane requires.

## `.jules/` is read-only personas — never write to it

The files in `.jules/<name>.md` are **persona definitions**: your identity, lane,
and constraints, read in at the start of a run. They are **not logs**. **Never
append to, modify, or create files under `.jules/`.** A PR that changes a `.jules/`
file is out of scope and will be closed — those files are edited by a human, not by
routines. Capture durable learnings in `CLAUDE.md`/`GEMINI.md` or `docs/` instead.
