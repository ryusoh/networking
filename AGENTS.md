# AGENTS.md

Single source of truth for agent guidance on this repo — **edit this file, not
`CLAUDE.md`** (that is a stub that imports this one). Slash-command workflows
live in `.agents/skills/<name>/SKILL.md` (canonical — the open Agent Skills
format); `.claude/commands/` is generated from it by `tools/sync_commands.py`,
`.claude/skills` is symlinked to `.agents/skills`, and the gate drift-checks it via `make sync-check`.

## Two audiences (do not mix these up)

- **Unattended Jules routines** (`.jules/` personas): these bots run without a
  human in the loop and open PRs. A human only does a binary approve/close on the
  result — they will **not** leave review comments or iterate with you. So every
  PR must be self-evidently correct and approvable at a glance. Optimize for
  **approve rate**, not for volume. The sections from "Non-negotiables" through
  "Lanes" are binding on Jules routines.
- **Interactive coding agents** (Claude Code, Kimi, Cursor, etc.): you work
  directly with the user in a chat session. The project conventions below still
  apply, but the Jules-only **PR/branch/lane restrictions do not**. You may edit
  build files, Makefiles, configs, dependencies, and even `.jules/` persona files
  (no explicit permission needed — the user reviews the result; see the editing
  rules below). You may commit to `main` or open PRs as directed by the user.
  Do not invent Jules-style lane boundaries for normal interactive
  work — if the user asks you to change something, change it.

This repo (net-tools) is a collection of **independent networking and browser
tooling subprojects** spanning several languages: a Chrome MV3 extension
(`adblock/`, JavaScript, Jest + jsdom), Python packages
(`nas_proxy/`, `retriever/`, `vps_kernel_proxy/`, `nas_tools/`, pytest), C
tooling (`nas_proxy/`, `nas_tools/`, `bin/*.c`, compiled with `-lcurl`), and
eBPF (`vps_kernel_proxy/`, Docker-only).

## Non-negotiables (a PR that violates any of these will be closed)

1. **Open a PR only if `make precommit` is green.** That is the exact CI gate
   (`.github/workflows/ci.yml` runs `make precommit` on `ubuntu-latest`), and the
   **Makefile is the single source of truth** — never add a check to the workflow
   instead of the Makefile. Use `make precommit-fix` while iterating (it writes
   fixes); run `make precommit` (check-only) before opening the PR. And don't
   rerun a red gate on an unchanged tree — a failed gate over an untouched
   worktree cannot go green, so edit something first. The gate guard
   (`python3 tools/gate_guard.py`) enforces this: `snapshot` before the run,
   `check <hash>` before a retry (exit 1 = unchanged).
2. **One concern, one subproject, smallest possible diff.** These subprojects are
   independent; do not span more than one in a single PR, and no drive-by edits.
   Diff size is inversely proportional to approval.
3. **Stay in your lane** (see "Lanes"). If two routines touch the same files, one
   PR gets closed. Don't fix something another lane owns.
4. **Don't commit to `main`.** Branch off `main`, open a PR.
5. **Do not upgrade `jest` or `jest-environment-jsdom`.** They are pinned to v29
   on purpose; v30/v26 break the `window.location` mocking used across the
   `adblock` suite (rationale in "Jest & jsdom version pin" below). A
   dependency bump that touches these will be closed.
6. **Don't add dependencies or change build/lint/test config** unless your lane
   explicitly allows it. No new npm or pip packages, no edits to `package.json`
   scripts, `eslint.config.cjs`, `pyproject.toml`, or the Makefile, except where a
   lane names them.
7. **Don't write a command/example you haven't actually run this session.** Verify
   behaviour; don't infer it from a name or a target label.
8. **Check open and recently-closed PRs before you start, and don't repeat them.**
   Run `python3 tools/prior_prs.py` (lists number, state, labels, title;
   `--stats` prints per-lane accept rates). A closed PR
   was closed for a reason; an open one already claims that work. Pick something new.
9. **No stream-of-consciousness in the diff.** Your reasoning stays out of
   committed code: no thinking-out-loud comments ("Wait, ...", "Ah, ..."), no
   abandoned `pass`-only or empty test bodies. If an approach fails mid-write,
   delete the attempt — don't commit the trail. Code comments state facts about
   behaviour. Enforced deterministically by `make thinking-check`
   (`tools/check_thinking_comments.py`) over all tracked py/js/css/c/h/sh
   sources.
10. **Never open an empty PR.** If the run produces no diff (zero changed
    files), end the run with no PR — an empty PR can't be merged and costs the
    reviewer a manual close. This includes when your task's goal turns out to be
    already satisfied by the current repo state (e.g. a stale task description):
    a satisfied goal is a no-op, not a PR. (Typist opened empty PRs like #75 and
    #78 this way; CI now hard-fails empty PRs — see the "Reject empty pull
    request" step in `ci.yml` — but don't rely on the backstop.)
11. **Never push an empty or no-op commit** — including add-then-remove
    placeholder files (`dummy_file.txt`). Before every push,
    `git show --stat HEAD` must show a real diff that matches the commit
    message and, when responding to review feedback, actually addresses it.
    If you have nothing real to push, push nothing. (The sibling anki repo's
    PR #494: five churn/empty commits pushed after review questions, none
    answering them — closed unmerged.) Machine-enforced for bot-authored
    commits by `tools/check_bot_pr_hygiene.py` (`make bot-pr-check`, part of
    `make precommit`, plus the "Reject bot PR hygiene violations" step in
    `ci.yml`): the gate fails on bot commits that are empty, add zero-content
    files, or delete lines from test files — bot lanes are append-only in
    tests (Testpilot owns `__tests__/` and `tests/`).

## Reading the gate output (this repo is noisy on purpose)

`make precommit` and `precommit-fix` **exit 0 even when the log looks alarming.**
Judge by the exit code and the summary lines, not by eyeballing the stream. The
full field guide to expected noise, macOS sandbox limits, SIGALRM flakiness, the
`-lcurl` system dependency, and the Jest/jsdom version pin lives in
`docs/ci-gotchas.md`.

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
adblock/*.js`; pytest `--cov` on the three Python packages; neither enforces
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
  (`adblock`, `nas_proxy`, `retriever`, `vps_kernel_proxy`, `nas_tools`,
  `types`, `deps`); summary imperative, lower-case, no trailing period, ≤ 72 chars.
- **No emoji, and no routine-name prefix in the subject.** Routine attribution
  rides on the `Co-authored-by: google-labs-jules[bot]` trailer.
- **Body**: wrap at ~72 cols; explain what and why. State severity, metrics, or
  measurements here, not in the subject.

## Command interface — prefer `make` (matches CI)

| Need                                     | Command                                  |
| ---------------------------------------- | ---------------------------------------- |
| Full gate, check-only (what CI runs)     | `make precommit`                         |
| Full gate, auto-fixing format and lint   | `make precommit-fix`                     |
| Full gate in Docker (macOS/CI parity)    | `make precommit-docker`                  |
| JS lint / format                         | `make lint` / `make fmt-check`           |
| Dependency-structure gate (JS)           | `make depcheck`                          |
| Stream-of-consciousness gate             | `make thinking-check`                    |
| Bot PR hygiene gate (Jules commits)      | `make bot-pr-check`                      |
| Jest with coverage (floor-gated)         | `make test`                              |
| Python tests + coverage (floor-gated)    | `make test-py`                           |
| JS type-check (JSDoc, non-blocking)      | `make type`                              |
| Mutation smoke, JS / Python (non-gated)  | `make mutate-js` / `make mutate-py`      |
| Rank least-covered files (Testpilot)     | `python3 bin/coverage_rank.py --limit 5` |
| Worktree snapshot guard (unchanged tree) | `python3 tools/gate_guard.py snapshot`   |
| Prior PRs / Jules lane accept rates      | `python3 tools/prior_prs.py [--stats]`   |
| Scoped Jest while iterating              | `npx jest <path>`                        |
| Pull an extension (retriever)            | `make pull ID=<extension_id>`            |
| Regenerate / drift-check Claude commands | `python3 tools/sync_commands.py`         |

- **Jest is pinned to v29.** The established `window.location` mock is the
  "delete and reassign in `beforeEach`" pattern (code in "Jest & jsdom version
  pin" below); do not port the v30 pattern.
- `make test-py` first builds the `nas_tools` C binaries the tests shell out to,
  then runs pytest. If `--cov` is unrecognized, install dev deps:
  `python3 -m pip install -r requirements-dev.txt --break-system-packages`.
- **Complexity ratchet** — `make lint` also gates cyclomatic complexity: ESLint
  `complexity` errors above 20 with `eslint-suppressions.json` baselining legacy
  violations. All legacy violations have been eliminated (`{}`); the baseline is
  now frozen at 0. Any new suppression or count increase fails `bot-pr-check`.
  `xenon` freezes Python's complexity ranks (`--max-average A --max-modules C
--max-absolute C` over the `make test-py` source dirs). Never raise the
  ceilings or hand-edit the suppressions file.

## Layout

- `adblock/` — Chrome MV3 extension; per-site content scripts + background
  service worker; tests in `adblock/__tests__/` (jsdom).
- `nas_proxy/`, `nas_tools/` — C tooling (`make -C <dir> test`); `nas_tools` also
  has Python wrappers with privileged, self-skipping tests.
- `retriever/` — the `pull` script. `vps_kernel_proxy/` — kernel/user proxy +
  eBPF. `vps_user_proxy/` — userspace proxy variant.
- `gov_bypass/`, `vmware/`, `bin/` — misc tools and C build accelerators.
- `stall_guard/` — Chrome MV3 extension that auto-recovers HTML5 video stalls:
  seek-back-and-resume, escalating to a page reload (via postMessage from the
  player iframe to the top frame) when repeated recoveries make no progress.
  Tests in `stall_guard/tests/` — **not** `__tests__/`,
  because Chrome refuses to load extensions containing `_`-prefixed dirs. See
  the `add-extension` skill for the full new-extension checklist.
- `docs/` — subsystem specs and research notes: `gates.md` (gate internals),
  `ci-gotchas.md` (gate-output field guide), `ebpf-research.md`,
  `nas-strategy.md`, `docs/research/anki-card-pipeline-spec.md`,
  `docs/research/research-agent-spec.md`,
  `docs/research/research-anki-skills-usage-guide.md`.
  `bin/coverage_rank.py` — the coverage ranking helper.
- `tools/` — shared repository tooling (`gate_guard.py`, `check_thinking_comments.py`,
  `sync_commands.py`, `prior_prs.py`, `tools/research/`). Scripts referenced across agent docs and
  skills are verified by `tools/__tests__/test_doc_tool_references.py`.
- `tools/research/` — courseware research agent pipeline (parser, indexer, scene
  builder, citation engine, memory host, Anki generator/validator, etc.).
  Safety rules (no raw SQLite mutations on live Anki collections; testing
  hygiene for pipeline state files) live in `research/README.md`.
- `research/` — courseware data, chunk manifests, Anki pipeline state files, and
  durable memory. See `research/README.md` for a map of where data, code, specs,
  and skills live.

### Shell scripts in `bin/` (macOS bash 3.2 gotchas)

macOS ships `/bin/bash` 3.2, and the `bin/*.sh` tools run on it:

- Under `set -u`, expanding an empty array (`"${arr[@]}"`) is a fatal
  "unbound variable" error. Use `${arr[@]+"${arr[@]}"}` for arrays that may
  be empty.
- `stat` is BSD-flavored: `stat -f%z <file>` for size, not GNU's `stat -c%s`.
- `ping` timeout is `-t <seconds>` (TTL flag on Linux); per-packet wait is
  `-W <milliseconds>`, not seconds.

## Repo conventions

### Dependency-structure gate (`make depcheck`)

`make depcheck` (wired into `make lint`, hence into `make precommit`) runs
dependency-cruiser over `adblock gov_bypass jest.setup.js` with the
rules in `.dependency-cruiser.cjs`: no circular deps, no cross-subproject
imports (mirrors non-negotiable #2), production source never imports
`__tests__`. Zero-baseline and purely preventive. Alias/import-linter/grimp
rationale and gotchas: `docs/gates.md`.

### Stream-of-consciousness gate (`make thinking-check`)

`make thinking-check` (wired into `make precommit`) runs
`tools/check_thinking_comments.py`, a deterministic scan of all git-tracked
py/js/css/c/h/sh sources enforcing non-negotiable #9, including abandoned-test
detection. Zero-baseline and purely preventive. Detector mechanics:
`docs/gates.md`.

### Bot PR hygiene gate (`make bot-pr-check`)

`make bot-pr-check` (wired into `make precommit` and `precommit-fix`, plus the
"Reject bot PR hygiene violations" CI step) runs
`tools/check_bot_pr_hygiene.py` over bot-authored commits in
`origin/main..HEAD`, enforcing non-negotiable #11: no empty commits, no
zero-content files, no deleted test lines (`__tests__/`, `tests/`,
`test_*.py`, `*.test.js` — bot lanes are append-only in tests), no stray
bot artifacts (`pr_body.txt`, scratch files), and no complexity ratchet
violations (no added suppressions in `eslint-suppressions.json`; only Architect
may touch it to prune). Human-authored commits are skipped. Full rules and
history: `docs/gates.md`.

### Mutation testing (NON-BLOCKING scaffold)

`make mutate-js` (StrykerJS) and `make mutate-py` (mutmut) are
**informational only** — deliberately not wired into `make precommit`;
mutation scores are signal for humans, not thresholds. Scopes, day-one
numbers, and the mutmut `os.getcwd` gotcha: `docs/gates.md`.

### Acceptance tests

`nas_proxy/__tests__/test_socks5_bridge_acceptance.py` is the first
acceptance-layer stream: behaviour-level tests for the SOCKS5-to-HTTP bridge
(`cache_proxy.socks5_connect` / `relay`) against a **real** loopback TCP
server and real socketpairs — no mocks. The RFC 1928 byte strings are
hand-computed and the test names use the bridge's domain language ("the
bridge delegates DNS to the proxy", "the relay carries bytes in both
directions until a side hangs up"). Keep the split: unit tests
(`test_cache_proxy.py`) mock internals; acceptance tests use real I/O and
hand-computed expectations.

### Coverage reports and the fmt-check gotcha

Both `make precommit` and `precommit-fix` print a coverage table after the tests:
Jest (all three JS extensions — `adblock`, `stall_guard`,
`gov_bypass` — scoped via `collectCoverageFrom` in `package.json`)
and pytest (source modules only; test files/`__init__.py` omitted via the
`[tool.coverage.run]` section in `pyproject.toml`).

**Whole-suite coverage floor (blocking):** Jest enforces a global
`coverageThreshold` in `package.json` (statements/lines 86, branches 80,
functions 85) and pytest enforces `--cov-fail-under=94` in `make test-py`
(day-one measurement 95.47%). The
Jest floor sits ~1 point under the day-one measurement over the widened
three-extension set (87.42/81.18/85.96/87.35; adblock alone measured
95.08/86.27/95.61/95.04 when the scope was adblock-only), so the gate is
a ratchet against regression, not a target — raising a floor is a deliberate
Testpilot PR, lowering one is a red flag. New JS extensions are added to
`collectCoverageFrom` when created so their gaps stay visible to
`bin/coverage_rank.py` (and therefore to Testpilot); the floor absorbs them
because it is set on the aggregate.

**`make precommit` runs `fmt-check` (`prettier --check .`) first, and it scans
the whole tree.** Generated output dirs are excluded via `.prettierignore`
(`coverage/`, `.pytest_cache/`, `nas_proxy/out/`, `.jules/`). If you add a
reporter that writes files to disk (e.g. an html/lcov coverage reporter) or any
new generated dir, add it to `.prettierignore` or the gate fails on a non-source
file — a confusing `fmt-check Error 1` that looks like a formatting bug but
isn't.

### System dependencies and CI

- `.github/workflows/ci.yml` runs on push/PR to `main` and is `make precommit`
  (check-only) on `ubuntu-latest`, plus two PR-only hard guards that must run
  against the base ref before the gate: "Reject empty pull request" and
  "Reject bot PR hygiene violations" (see "Bot PR hygiene gate" above). Add
  new checks to the `precommit`/`precommit-fix` targets, not to the workflow.
- CI installs `libcurl4-openssl-dev` (the NAS C tests and several `bin/*.c`
  accelerators compile with `-lcurl`) plus Python deps from
  `requirements-dev.txt` (pytest + pytest-cov); gcc/make come with the runner.
- The eBPF step is a no-op in CI (no `ebpf-builder` Docker image) and stays green
  because the Makefile ignores it (`-@`).
- `make test-py` runs `nas_proxy`, `retriever`, `vps_kernel_proxy`, `nas_tools`,
  `bin`, and `tools` (the last two contribute tests only, no coverage scope —
  `tools/__tests__/` is the thinking-check detector's suite). The target first
  runs `make -C nas_tools all` to build the C
  binaries (`wol`, `netmon`, `lan_scanner`, `speedtest`) the tests shell out to.
- **`nas_tools` privileged tests self-skip** via `skipUnless` guards in
  `nas_tools/__tests__/test_tools.py`: `test_netmon_run` needs ICMP sockets
  (unprivileged ICMP or root), `test_lan_scanner_run` needs an `eth0` interface.
  They run on Linux/CI and skip on macOS without failing the suite. If you add
  another binary that needs raw sockets or a specific interface, guard it the
  same way rather than excluding it.
- **`vps_kernel_proxy` eBPF compile test self-skips** too: `test_ebpf.py`'s
  `test_compilation_success` only `make`s the `.bpf.o` objects when a real BPF
  toolchain is present (Linux + `clang` + libbpf's `<bpf/bpf_helpers.h>`). A bare
  `ubuntu-latest` runner has clang but **not** libbpf-dev, so it skips there
  rather than failing. The map-content tests (which just read the `.bpf.c`
  source) still run everywhere.
- **Action-version hygiene:** before bumping a workflow `uses:` pin to a new
  major version (e.g. `actions/checkout@v8`), verify the tag actually exists
  (`gh api repos/<owner>/<repo>/git/refs/tags/v<N>`). Major-version floating
  tags are created by action maintainers at different cadences; an assumed
  version will fail the runner with "unable to find version".

### adblock conventions

#### MutationObserver callbacks must guard against a missing `document`

Content scripts register `new MutationObserver(cb)` on `document.documentElement`
and usually never disconnect it. The callback runs asynchronously as a microtask,
so it can fire **after** the page (or the jsdom test environment) has torn down
`document`. When the callback then calls `document.querySelectorAll(...)`, it
throws `TypeError: Cannot read properties of undefined (reading 'querySelectorAll')`.

Any observer callback that touches `document` directly must start with:

```js
if (typeof document === 'undefined' || !document) {
  return;
}
```

Already applied in `linkedin-unlocked.js` (`proactivelyCleanLinks`) and
`linkedin-hide-promoted.js` (`hidePromoted`). If you add a new content script
with a top-level observer, add the same guard.

#### Tests and eval coverage

- jsdom environment (configured in `package.json` jest config + `jest.setup.js`).
- Tests load scripts via `require('../<script>.js')` or by `eval`-ing the source
  inside `jest.isolateModules` / `jest.resetModules`. Each load creates a fresh
  observer that is never disconnected — hence the teardown guard above matters.
- **Coverage for `eval`'d scripts:** plain `eval(fs.readFileSync(...))` runs
  uninstrumented, so those files report **0%** even though the test exercises
  them (Jest only instruments code that goes through its `require`/transform
  pipeline). To get real numbers, instrument first:

  ```js
  const { instrumentFile } = require('./helpers/instrument');
  const code = instrumentFile(require('path').join(__dirname, '..', 'foo.js'));
  eval(code); // keep the eval in the test so the jsdom scope is unchanged
  ```

  `instrumentFile` (in `adblock/__tests__/helpers/instrument.js`)
  instruments with the same `__coverage__` global Jest's `babel` provider
  collects. Pass an **absolute** path so the key matches `collectCoverageFrom`.
  Don't use it on a file that's also `require`d elsewhere (double
  instrumentation). The `helpers/` dir is excluded from test discovery via
  `testPathIgnorePatterns` and gets CommonJS globals via an `eslint.config.cjs`
  override.

### Jest & jsdom version pin (v29)

Pinned to `jest@29.7.0` / `jest-environment-jsdom@29.7.0`. Do **not** upgrade
without a repo-wide migration of the `window.location` mock pattern. The full
rationale, the v29-compatible `delete window.location` recipe, and teardown
hygiene notes live in `docs/ci-gotchas.md`.

### Type-check (`make type`) vs lint (`npm run lint`)

- **Separation of concerns:** ESLint (`npm run lint`) and TypeScript
  (`make type`) are distinct verification gates. ESLint checks syntax, styles,
  and defined globals. `make type` runs type-checking over `adblock/*.js`
  utilizing JSDoc annotations and the TypeScript compiler (configured via
  `jsconfig.json`). When asked to "fix lint errors", developers or tools may
  refer to either ESLint output or the TypeScript compilation errors — verify
  both gates are green.
- **ESLint undefined globals (`HTMLElement`, `HTMLLinkElement`, etc.):**
  `eslint.config.cjs` defines a limited subset of browser globals. When
  performing type checks using JSDoc type-guards (such as
  `instanceof HTMLLinkElement`), ESLint will raise `no-undef` warnings if the
  constructor is not in the config globals. To resolve this:
  - Reference the constructor via `window` (e.g.,
    `link instanceof window.HTMLLinkElement`), or
  - Add inline `/* global ... */` declarations at the top of the file.
- **Dynamic globals and element access:** bracket notation (e.g.,
  `window['__NUXT__']`, `this['_url']`) should be preferred over dot notation
  when assigning or retrieving dynamic, un-typed properties. This satisfies both
  ESLint and `make type` without requiring verbose casting.

### Jules routine harnesses

- **Testpilot** ranks least-covered files with `python3 bin/coverage_rank.py`
  (auto-detects Jest `coverage-summary.json` vs coverage.py JSON; tested in
  `bin/__tests__/test_coverage_rank.py`, run by `make test-py`).
- **Typist** drives `make type` toward zero errors via JSDoc on
  `adblock/*.js`. The harness — `typescript` + `@types/chrome` dev-deps
  and `jsconfig.json` — is bootstrapped and non-blocking; when the backlog
  reaches zero, the finalize step makes it gate (see `.jules/typist.md`).

### Shipping multiple open PRs

The consolidation strategy (integration branch, lockfile regeneration, merge
order) lives in the `ship` skill under "Shipping multiple open PRs".

### Output logs stay out of git

Any command output logs (e.g. `jest_coverage_output.txt`,
`precommit_output.txt`) MUST be either explicitly removed before committing, or
placed within the `.gitignore`'d `coverage/` directory. Do not commit command
logs to the repository.

### The user commits reviewed changes themselves

The user's work pattern is: back-and-forth in chat → they review the diff in
VSCode → they commit it themselves and move on. So if your edits vanish from
`git status` between turns, run `git log --oneline -3` FIRST — a fresh user
commit containing them means the work was accepted. Don't re-verify,
re-explain, or dig into "where did my changes go"; check the log once and
continue from HEAD.

### Concurrent agents sharing one worktree

When you run parallel subagents (swarms, background agents) in this checkout:
stage only files you changed (`git add <specific-files>`, never `git add -A`),
never `git stash`, `git reset --hard`, or `git commit --no-verify` — a sibling
agent's work may be sitting in the same tree. Keep concurrent agents on
disjoint file sets; if a rebase/conflict lands mid-run, resolve only files
your task owns.

### Externalized state & transaction boundaries (State-Oriented Architecture & SDN Control Plane)

On multi-step workflows (action-item sweeps, TDD loops, bug diagnosis), never
rely on conversation memory as an execution ledger ($P = p^N$ failure). Follow
Arista EOS's SysDB design and Google Orion's SDN control plane: the disk-backed
state ledger (`.agents/state/` via `tools/task_harness.py` or governing findings doc)
is the single source of truth; worker agents are ephemeral, stateless transforms
($O(1)$ context) reading only their active gate slice with dynamically routed
toolsets (Jupiter OCS model). At each transaction boundary (after commits or gate
checks) and on session resumption, follow the skill's `## Resume protocol`:
re-anchor working memory directly from authoritative ground truth (`git status`,
`git log`, state file) before dispatching tools.

## Skills and slash commands

- **`.agents/skills/<name>/SKILL.md` is canonical** — the open Agent Skills
  format: YAML frontmatter declaring `name` and `description` (used for
  triggering), instructions in the markdown body. Edit skills there.
- **Self-contained skill bundles:** Each skill is a directory containing its
  `SKILL.md`, plus any skill-scoped helper scripts (`scripts/`) or prompt/data
  references (`references/`). Keep skill-specific logic bundled within its skill
  directory rather than placing one-off scripts in global `tools/` or `bin/`.
- **Progressive disclosure:** only the frontmatter `name` + `description` enter
  an agent's system prompt; the body is read on demand once the skill triggers.
  So the `description` is the only always-loaded surface — write it as a
  discriminative trigger ("Use when ..."), and don't contort the body to save
  prompt space; length there is free until the skill fires.
- **Never put a `---` horizontal rule in a skill body** — the generator's
  frontmatter parser is a naive `content.split("---", 2)`, so a `---` line in
  the body mangles the generated command.
- **`.claude/skills` is symlinked to `../.agents/skills`** for autonomous agent
  discovery across tools (Claude Code, DeepSeek Harness, etc.).
- **`.claude/commands/<name>.md` is generated** from the skills by
  `tools/sync_commands.py` for Claude Code interactive slash commands. Never edit
  the generated files by hand — run `python3 tools/sync_commands.py` after editing
  a skill, and note that `make sync-check` (wired into `make precommit`) fails if
  regeneration is not a no-op.
- **Skill schema validation:** `tools/__tests__/test_skills.py` (run by `make test-py`)
  enforces schema validity, non-empty descriptions, directory-name matching, and
  symlink resolution across all skills.
- **Jules scheduled routines (unattended)** are a separate system from the
  interactive skills above: their shared contract is this file and their
  per-routine personas live in `.jules/<name>.md` (currently `testpilot`,
  `typist`, `janitor`, `architect`, `bolt`).
- **Keep the scheduled-task UI prompt generic.** A stale task-specific prompt is
  worse than the generic one: Typist's schedule once kept an old goal after it
  was done and produced zero-file PRs the owner had to close by hand (#75, #78).
  With a generic invocation the persona decides what work exists; with a stale
  goal the routine satisfies it vacuously and still publishes the empty PR. If a
  lane is finished, pause its schedule — don't leave a satisfied goal running.

## Lanes (keep PRs disjoint to avoid collisions)

| Routine   | Owns                                                                                                         | Must NOT touch                                    |
| --------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Sentinel  | security + error-handling (proxy/SSRF, C memory safety, secrets, silent catches, jsdom unhandled exceptions) | complexity refactors, perf, tests as a feature    |
| Testpilot | test-only additions/coverage across Jest and pytest                                                          | production source under any subproject            |
| Architect | behaviour-preserving complexity/readability refactors                                                        | error-handling, security, tests, features         |
| Janitor   | dead code, stale deps, real TODOs within subprojects                                                         | tools/, bin/, docs, .jules/, complexity, Jest pin |
| Bolt      | one measurable performance/efficiency win per run                                                            | complexity-only refactors, security, dead code    |
| Typist    | incremental JS strict-typing via JSDoc on `adblock/*.js`                                                     | runtime logic, tests, Python, C                   |

If your finding belongs to another lane, **skip it** — that lane will get it.

> **Enforcement note:** cyclomatic complexity **is** machine-gated — ESLint
> `complexity: ['error', { max: 20 }]` with the legacy violations baselined in
> `eslint-suppressions.json`, and `xenon` freezing Python's ranks in `make lint`
> (see "Complexity ratchet" above). So is the JS dependency-structure gate
> (`make depcheck`, wired into `make lint` — see "Dependency-structure gate"
> above). Whole-suite coverage **is** gated — a global Jest
> `coverageThreshold` (94/85/94/94) and pytest `--cov-fail-under=94`, both
> ~1 point under the day-one measurement (see "Coverage reports" above).
> Bot-authored commit hygiene **is** machine-gated too (`make bot-pr-check`,
> in `make precommit` and CI — see "Bot PR hygiene gate" above). Only
> the JS type-check (`make type`) is **non-blocking**. The Testpilot and
> Typist targets are therefore judgment-guided, not machine-gated. Your real
> gate is a green `make precommit` plus the scoped proof your lane requires.

## `.jules/` personas — editing rules

The files in `.jules/<name>.md` are **persona definitions** for the unattended
Jules routines: they encode identity, lane, and constraints, read at the start of
an unattended run. They are **not logs**.

- **Unattended Jules routines** must treat `.jules/` as read-only. They may **not**
  append to, modify, or create files under `.jules/`. A PR from a Jules routine
  that changes a `.jules/` file is out of scope and will be closed.
- **Interactive coding agents** (Claude Code, Kimi, etc.) **may** edit `.jules/`
  persona files whenever they spot a harness bug or unclear guidance — no
  explicit user direction needed; the user reviews the result. The change must
  still be a single-concern PR with a green `make precommit`, and the agent must
  note in the PR body that the edit is to a persona file.

Capture durable learnings in this file or `docs/` instead of leaving the persona
files as the only source of truth.
