# AGENTS.md

Canonical agent guidance for this repo — edit this file (`CLAUDE.md` only
imports it). Slash-command skills live in `.agents/skills/<name>/SKILL.md`;
`.claude/skills` symlinks to `.agents/skills`, `.claude/commands/` is generated
by `tools/sync_commands.py`, and `make sync-check` catches drift.

## Context

This repo (`net-tools`) is a collection of **independent networking and browser
tooling subprojects**: a Chrome MV3 extension (`adblock/`, JS, Jest + jsdom),
Python packages (`nas_proxy/`, `retriever/`, `vps_kernel_proxy/`, `nas_tools/`,
pytest), C tooling (`nas_proxy/`, `nas_tools/`, `bin/*.c`, compiled with
`-lcurl`), and eBPF (`vps_kernel_proxy/`, Docker-only).

Guidance here is for **interactive coding agents** working with the user in
chat. The Jules routines (`.jules/`) were retired in November 2026
(`docs/gates.md`); unattended automation is limited to GitHub Actions workflows.
Edit build files, Makefiles, configs, and dependencies whenever the task calls
for it.

## How the user works

- The user reviews diffs in VSCode and commits accepted work themselves. If your
  edits vanish from `git status` between turns, run `git log --oneline -3` once
  — a fresh user commit means the work was accepted; continue from HEAD.
- On multi-step workflows (action-item sweeps, TDD loops, bug diagnosis), treat
  disk-backed state (`.agents/state/` via `tools/task_harness.py` or the
  governing findings doc) plus `git status` and `git log` as the execution
  ledger. Re-anchor from them at each commit boundary and after compaction via
  the skill's `## Resume protocol`.

## Non-negotiables (apply to every change and PR)

1. **Open a PR only when `make precommit` is green.** `.github/workflows/ci.yml`
   runs `make precommit` (check-only) on `ubuntu-latest`, and `Makefile` is the
   single source of truth for checks. Iterate with `make precommit-fix`, then
   verify with `make precommit` (`make precommit-docker` on macOS for Linux/CI
   parity). Change the tree before retrying a red gate
   (`python3 tools/gate_guard.py snapshot`, then `check <hash>`).
2. **One concern, one subproject, smallest diff.** Subprojects are independent;
   scope each PR to one subproject and one concern.
3. **Keep file sets disjoint** across concurrent agents and workflows.
4. **Branch off `main` for PRs.** Push directly to `main` only when the user
   directs it.
5. **Keep `jest` and `jest-environment-jsdom` pinned to v29 (`29.7.0`).**
   v30/v26 break the `window.location` mocking used across `adblock`
   (`docs/ci-gotchas.md`); leave them pinned unless executing a repo-wide mock
   migration.
6. **Dependency and build-config discipline.** Add npm/pip packages or edit
   `package.json` scripts, `eslint.config.cjs`, `pyproject.toml`, or `Makefile`
   only when explicitly required by the task.
7. **Write down only commands and examples run this session.** Verify behaviour
   rather than inferring from a target name.
8. **Check open and recently closed PRs before self-chosen work.** Run
   `python3 tools/prior_prs.py` (`--stats` for accept rates) so you pick work
   unclaimed by open PRs and unrejected by closed ones.
9. **Code comments state facts about behaviour.** Keep reasoning trails and
   abandoned empty tests out of diffs. Enforced by `make thinking-check`
   (`tools/check_thinking_comments.py`) across all tracked py/js/css/c/h/sh
   files.
10. **Real diff per PR.** A zero-file diff or an already-satisfied goal is a
    no-op, not a PR (`ci.yml` rejects empty PRs).
11. **One clean commit per PR with real content.** Stage by name
    (`git add <file>`), confirm `git show --stat HEAD` matches the message, and
    amend or squash (`git reset --soft $(git merge-base origin/main HEAD) && git commit`)
    on revisions. Keep command logs out of git (delete before committing or
    write under gitignored `coverage/`). `make bot-pr-check`
    (`tools/check_bot_pr_hygiene.py`, per-commit on `origin/main..HEAD`, also in
    `ci.yml`) enforces real commits, append-only test diffs, stray-artifact
    hygiene, and complexity-ratchet integrity on bot-authored commits (human
    commits are skipped).
12. **Shared checkout safety.** Concurrent agents and the user share this tree:
    stage only files you own, leave foreign edits untouched, and get explicit
    user confirmation before destructive git commands (`git checkout -- <file>`,
    `git restore`, `git reset --hard`, `git clean`, `git stash`, `--no-verify`).

## Visual/hardware changes, PR bodies, and commits

- **Objective claims only:** unit tests observe assertions and exit codes, not
  live browser rendering or real hardware. Open PRs whose payoff is only
  observable in Chrome or on real hardware as **draft** and state that clearly.
- **PR body:** include **What & why** (1–2 sentences), **Subproject**,
  **Verification** (exact commands and pasted output), and **Live/hardware?**
  ("fully covered by tests" or "needs human/hardware review (draft)").
- **Conventional Commits:** `type(scope): summary` with `type` ∈ `feat`, `fix`,
  `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`; lower-case scope
  (`adblock`, `nas_proxy`, `retriever`, `vps_kernel_proxy`, `nas_tools`,
  `types`, `deps`); imperative lower-case summary ≤ 72 chars, no trailing period
  or emoji. Wrap body at ~72 cols with what, why, and metrics. GitHub squash
  merges use the PR title — or the commit message on single-commit PRs — so keep
  both compliant, starting directly with the subject and structured body.

## Commands — prefer `make` (matches CI)

| Need                                     | Command                                  |
| ---------------------------------------- | ---------------------------------------- |
| Full gate, check-only (what CI runs)     | `make precommit`                         |
| Full gate, auto-fixing format and lint   | `make precommit-fix`                     |
| Full gate in Docker (macOS/CI parity)    | `make precommit-docker`                  |
| JS lint / format                         | `make lint` / `make fmt-check`           |
| Dependency-structure gate (JS)           | `make depcheck`                          |
| Stream-of-consciousness gate             | `make thinking-check`                    |
| Bot PR hygiene gate (bot commits)        | `make bot-pr-check`                      |
| Jest with coverage (floor-gated)         | `make test`                              |
| Python tests + coverage (floor-gated)    | `make test-py`                           |
| JS type-check (JSDoc, blocking)          | `make type`                              |
| Mutation smoke, JS / Python (non-gated)  | `make mutate-js` / `make mutate-py`      |
| Rank least-covered files                 | `python3 bin/coverage_rank.py --limit 5` |
| Worktree snapshot guard (unchanged tree) | `python3 tools/gate_guard.py snapshot`   |
| Prior PRs / accept rates                 | `python3 tools/prior_prs.py [--stats]`   |
| Scoped Jest while iterating              | `npx jest <path>`                        |
| Pull an extension (retriever)            | `make pull ID=<extension_id>`            |
| Regenerate / drift-check Claude commands | `python3 tools/sync_commands.py`         |

- **Gate noise:** `make precommit` and `precommit-fix` exit 0 amid expected
  stderr noise; judge by exit code and summary lines. See `docs/ci-gotchas.md`
  for expected noise, macOS sandbox limits, `SIGALRM`, `-lcurl`, and the Jest
  v29 mock recipe.
- **`make test-py`** builds `nas_tools` C binaries (`wol`, `netmon`,
  `lan_scanner`, `speedtest`) first, then runs pytest over `nas_proxy`,
  `retriever`, `vps_kernel_proxy`, `nas_tools`, `bin`, and `tools`. Pass
  `PY=/Users/lz/dev/.venv/bin/python3` on macOS if system `python3` lacks
  `pytest`/`xenon` (or install `requirements-dev.txt`).

## Quality gates and CI environment

Full gate internals live in `docs/gates.md`. Key invariants:

- **Coverage:** ship a fail-before/pass-after test for runtime behaviour changes
  (diff coverage is honour-based; refactors/typing need none). Whole-suite
  coverage floors are blocking: Jest `coverageThreshold` in `package.json`
  (statements/lines 86, branches 80, functions 85) and pytest
  `--cov-fail-under=94` in `make test-py`. Register new JS extensions in
  `collectCoverageFrom` (`package.json`) so `bin/coverage_rank.py` sees them
  (generate machine-readable reports with
  `npx jest --coverage --coverageReporters=json-summary --coverageReporters=text`
  or `python3 -m coverage json -o coverage/coverage.json`).
- **Formatter scope:** `fmt-check` (`prettier --check .`) scans the whole tree;
  add any new generated or reporter output dir to `.prettierignore` (alongside
  `coverage/`, `.pytest_cache/`, `nas_proxy/out/`).
- **Complexity ratchet:** `make lint` enforces ESLint `complexity` ≤ 20 with
  `eslint-suppressions.json` frozen at `{}` (0 legacy suppressions) and `xenon`
  (`--max-average A --max-modules C --max-absolute C`) over Python source dirs.
  Survey targets with
  `python3 -m radon cc nas_proxy retriever vps_kernel_proxy nas_tools bin -s -n B`
  and `npx eslint . --rule '{"complexity": ["warn", 10]}'`.
- **Dependency structure, typing, mutation:** `make depcheck` (in `make lint`)
  enforces `.dependency-cruiser.cjs` (acyclic JS, production code separate from
  `__tests__`). `make type` is blocking JSDoc strict type-checking
  (`jsconfig.json` + `@types/chrome`). `make mutate-js` (StrykerJS) and
  `make mutate-py` (mutmut) are informational only.
- **CI and self-skipping tests:** `ci.yml` installs `libcurl4-openssl-dev` and
  `requirements-dev.txt`; `test-ebpf` is ignored (`-@`) without `ebpf-builder`.
  Privileged `nas_tools` tests (`test_netmon_run` ICMP, `test_lan_scanner_run`
  `eth0`) and `vps_kernel_proxy` `test_ebpf.py`'s `test_compilation_success`
  (needs Linux + `clang` + `<bpf/bpf_helpers.h>`) self-skip via `skipUnless` —
  guard new raw-socket or toolchain-dependent tests the same way. Before bumping
  a workflow `uses:` major tag, verify it exists via
  `gh api repos/<owner>/<repo>/git/refs/tags/v<N>`.
- **Acceptance tests:** `nas_proxy/__tests__/test_socks5_bridge_acceptance.py`
  tests `cache_proxy.socks5_connect`/`relay` against a real loopback TCP server
  with hand-computed RFC 1928 bytes; keep mocked unit tests in
  `test_cache_proxy.py`.

## Layout

- `adblock/` — Chrome MV3 extension; per-site content scripts + service worker;
  jsdom tests in `adblock/__tests__/`.
- `nas_proxy/`, `nas_tools/` — C tooling (`make -C <dir> test`) and Python
  wrappers (`nas_tools` includes self-skipping privileged tests).
- `retriever/` — extension `pull` script. `vps_kernel_proxy/` — kernel/user
  proxy + eBPF. `vps_user_proxy/` — userspace proxy variant.
- `vmware/`, `bin/` — misc tools, `bin/coverage_rank.py`, C accelerators, and
  `bin/*.sh` scripts running on macOS `/bin/bash` 3.2: expand possibly-empty
  arrays as `${arr[@]+"${arr[@]}"}` under `set -u`, use BSD `stat -f%z <file>`,
  and note macOS `ping` uses `-t <seconds>` and `-W <milliseconds>`.
- `docs/` — lower-kebab-case subsystem docs (`tools/__tests__/test_docs_naming.py`):
  `gates.md`, `ci-gotchas.md`, `ebpf-research.md`, `nas-strategy.md`, and
  `docs/research/*.md`.
- `tools/` — shared repo tooling (`gate_guard.py`, `check_thinking_comments.py`,
  `check_bot_pr_hygiene.py`, `sync_commands.py`, `prior_prs.py`,
  `task_harness.py`, `tools/research/`). Script paths in `AGENTS.md` and skills
  are verified by `tools/__tests__/test_doc_tool_references.py`.
- `research/` — courseware data, chunk manifests, Anki pipeline state, and
  durable memory. DB safety and state hygiene rules live in `research/README.md`.

## Subproject and code conventions

- **`adblock` MutationObserver guard:** content scripts attach persistent
  observers that can fire asynchronously after jsdom tears down `document`. Any
  observer callback touching `document` starts with:

  ```js
  if (typeof document === 'undefined' || !document) {
    return;
  }
  ```

  (Already applied in `linkedin-unlocked.js` and `linkedin-hide-promoted.js`.)

- **`adblock` `eval` coverage:** plain `eval(fs.readFileSync(...))` skips Jest
  instrumentation and reports 0%. Instrument first via
  `adblock/__tests__/helpers/instrument.js` (pass an absolute path; use only on
  files un-`require`d elsewhere):

  ```js
  const { instrumentFile } = require('./helpers/instrument');
  const code = instrumentFile(require('path').join(__dirname, '..', 'foo.js'));
  eval(code);
  ```

  `helpers/` is excluded from test discovery (`testPathIgnorePatterns`) and gets
  CommonJS globals in `eslint.config.cjs`.

- **Type-check (`make type`) vs lint (`npm run lint`):** separate gates — verify
  both when resolving lint/type issues. For browser constructors outside
  `eslint.config.cjs` globals (e.g. `HTMLLinkElement`), qualify via
  `window.HTMLLinkElement` or add inline `/* global ... */`. Use bracket
  notation (`window['__NUXT__']`, `this['_url']`) for dynamic properties.
- **Performance and stack reality:** no bundler, JS build step, SQL DB, or
  pandas. Hot surfaces: reuse pooled structures in `nas_proxy` C (`conn_pool.c`)
  to avoid per-request `malloc`/`memcpy`; hoist invariant `querySelector` and
  `RegExp`, early-return, and debounce in `adblock/*.js` observers; cache
  repeated I/O or subprocess calls with `functools.lru_cache` and prefer
  set/dict lookups in Python. Keep `.forEach` helpers small rather than inlining
  into monolithic `for` loops (trips complexity > 20), and keep tiny DOM loops
  readable.
- **Dead-code removal:** search `git grep -n <target>` across all tracked files
  (`.md`, `.sh`, `.yml`, `Makefile`, `.agents/`, source) before deleting.
  Symbols or scripts referenced in docs, skills, shell scripts, CI configs,
  re-exports, `background.js` listeners, or CLI entry points are live callers.
- **Shipping multiple open PRs:** see the consolidation workflow in the `ship`
  skill.

## Skills and slash commands

- `.agents/skills/<name>/SKILL.md` is canonical: YAML frontmatter (`name` +
  discriminative `description` trigger, the only always-loaded surface) and
  on-demand body. Keep skill-specific helpers inside the skill directory
  (`scripts/`, `references/`).
- Omit `---` horizontal rules inside skill bodies: `tools/sync_commands.py`
  parses frontmatter with `content.split("---", 2)`.
- `.claude/skills` symlinks to `../.agents/skills`. `.claude/commands/<name>.md`
  is generated by `python3 tools/sync_commands.py` (`make sync-check` gates
  freshness).
- `tools/__tests__/test_skills.py` validates frontmatter schema, directory name
  match, `{{args}}` placeholders, and symlink resolution.
