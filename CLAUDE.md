# CLAUDE.md

Guidance for working in this repo (net-tools): a collection of independent
networking / browser tooling subprojects.

**See GEMINI.md for AI-specific workflows, dependency constraints (Jest pin), and multi-PR shipping strategies.**

## Layout

- `clean_adblock/` — Chrome extension (Manifest V3). Per-site content scripts +
  background service worker. Jest + jsdom tests in `clean_adblock/__tests__/`.
- `nas_proxy/`, `nas_tools/` — C-based NAS tooling (built/tested via `make -C nas_proxy`).
- `retriever/` — `pull` script (`make pull ID=<extension_id>`).
- `vps_kernel_proxy/`, `vps_user_proxy/`, `vps_kernel_proxy` eBPF — kernel/user proxies.
- `tianditu_bypass/`, `vmware/`, `bin/` — misc tools and build accelerators.
- `docs/` — `EBPF_RESEARCH.md`, `NAS_STRATEGY.md`.

## Commands

- `make precommit-fix` — fmt (Prettier write) + lint-fix (ESLint) + type + Jest + Python + eBPF + NAS C tests.
- `make precommit` — same but check-only (`fmt:check`, no writes). Use before committing.
- `npm test` — Jest only (no coverage). `npm run test:coverage` — Jest with the
  per-file coverage report (`text` + `text-summary`); this is what `make test` runs.
- `make test-py` — pytest + coverage (`--cov-report=term-missing`) for the Python
  packages. `npm run lint` / `npm run fmt:check` — JS lint/format.
- `make type` — JS type-check of `clean_adblock/*.js` via JSDoc against
  `jsconfig.json` (`checkJs`, `@types/chrome`). **Non-blocking** (`|| echo`), so it
  reports type errors without gating; it's part of `make precommit`. This is the
  Typist routine's harness — see "Automated agents" below.

### Coverage reports

- Both `make precommit` and `precommit-fix` print a coverage table after the tests:
  Jest (`clean_adblock/*.js`, scoped via `collectCoverageFrom` in `package.json`) and
  pytest (source modules only; test files/`__init__.py` omitted via the
  `[tool.coverage.run]` section in `pyproject.toml`).
  Neither enforces a threshold — they report, they don't gate.
- **`make precommit` runs `fmt-check` (`prettier --check .`) first, and it scans the
  whole tree.** Generated output dirs are excluded via `.prettierignore` (`coverage/`,
  `.pytest_cache/`, `nas_proxy/out/`). If you add a reporter that writes files to disk
  (e.g. an html/lcov coverage reporter) or any new generated dir, add it to
  `.prettierignore` or the gate fails on a non-source file — a confusing
  `fmt-check Error 1` that looks like a formatting bug but isn't.

### System dependencies

- The NAS C tests (`make -C nas_proxy test`, run by both precommit targets) compile
  with `-lcurl`, so a fresh machine or CI runner needs the libcurl dev headers
  (`libcurl4-openssl-dev` on Debian/Ubuntu). The same applies to `make build-nas-tools`
  and several `bin/*.c` accelerators. macOS dev boxes already have it via the SDK.

### CI

- `.github/workflows/ci.yml` runs on push/PR to `main` and is just `make precommit`
  (check-only) on `ubuntu-latest` — **the Makefile is the single source of truth**, so
  add new checks to the `precommit`/`precommit-fix` targets, not to the workflow.
- CI installs `libcurl4-openssl-dev` (see above) plus Python deps from
  `requirements-dev.txt` (pytest + pytest-cov); gcc/make come with the runner.
- The eBPF step is a no-op in CI (no `ebpf-builder` Docker image) and stays green
  because the Makefile ignores it (`-@`, see below).
- **Python tests:** `make test-py` runs `nas_proxy`, `retriever`, `vps_kernel_proxy`,
  and `nas_tools`. The target first runs `make -C nas_tools all` to build the C
  binaries (`wol`, `netmon`, `lan_scanner`, `speedtest`) the tests shell out to.
- **`nas_tools` privileged tests self-skip** via `skipUnless` guards in
  `test_tools.py`: `test_netmon_run` needs ICMP sockets (unprivileged ICMP or root),
  `test_lan_scanner_run` needs an `eth0` interface. They run on Linux/CI and skip on
  macOS (no `eth0`) without failing the suite. If you add another binary that needs
  raw sockets or a specific interface, guard it the same way rather than excluding it.
- **`vps_kernel_proxy` eBPF compile test self-skips** too: `test_ebpf.py`'s
  `test_compilation_success` only `make`s the `.bpf.o` objects when a real BPF
  toolchain is present (Linux + `clang` + libbpf's `<bpf/bpf_helpers.h>`). A bare
  `ubuntu-latest` runner has clang but **not** libbpf-dev, so it skips there rather
  than failing — matching the "eBPF is Docker-only / intentionally ignored" stance.
  Don't "fix" it by apt-installing a BPF toolchain in CI; the map-content tests
  (which just read the `.bpf.c` source) still run everywhere.

### Reading `make precommit-fix` output (important)

- **It exits `0` even when the output looks alarming.** Don't judge it by eyeballing
  the log — check the exit code and the `Tests: N passed` / `ALL C TESTS PASSED` lines.
- **The eBPF step is intentionally ignored** (`-@docker ...` in the Makefile). If
  Docker/Colima isn't running you'll see `test-ebpf ... Error N (ignored)` — that is
  expected, not a failure. The exit code varies by cause (`Error 1` when the build
  fails, `Error 125` when Docker itself is absent in CI); any `(ignored)` is fine.
  Start Colima only if you specifically need the eBPF kernel tests.
- **`curl_easy_perform() failed: Unsupported protocol`** in the nas_proxy run is
  expected: `tests.c` deliberately feeds `fetch_tile_to_mmap` an `invalid://schema`
  URL. curl rejecting it is the test exercising the error path, not a failure.
- **The nas_proxy C tests are smoke tests, not assertion suites.** `[PASS]` /
  `ALL C TESTS PASSED` are `printf`'d after each `test_*()` returns, so "PASS" mostly
  means "didn't crash." Only a few cases actually `assert` (e.g. the `get_tile`
  round-trip in `test_tile_storage`); `test_tile_fetcher` asserts nothing. When you
  touch nas_proxy logic, add real `assert(...)`s — a green line alone won't catch a
  regression.
- jsdom prints **async `unhandled exception` stack traces** for errors thrown inside
  content-script code, even when the test that triggered them passes. Treat these as
  real bugs to fix (see below), but know they do not fail the suite by themselves.

## clean_adblock conventions

### MutationObserver callbacks must guard against a missing `document`

Content scripts register `new MutationObserver(cb)` on `document.documentElement` and
usually never disconnect it. The callback runs asynchronously as a microtask, so it can
fire **after** the page (or the jsdom test environment) has torn down `document`. When
the callback then calls `document.querySelectorAll(...)`, it throws
`TypeError: Cannot read properties of undefined (reading 'querySelectorAll')`.

Any observer callback that touches `document` directly must start with:

```js
if (typeof document === 'undefined' || !document) {
  return;
}
```

Already applied in `linkedin-unlocked.js` (`proactivelyCleanLinks`) and
`linkedin-hide-promoted.js` (`hidePromoted`). If you add a new content script with a
top-level observer, add the same guard.

### Tests

- jsdom environment (configured in `package.json` jest config + `jest.setup.js`).
- Tests load scripts via `require('../<script>.js')` or by `eval`-ing the source
  inside `jest.isolateModules` / `jest.resetModules`. Each load creates a fresh
  observer that is never disconnected — hence the teardown guard above matters.
- **Coverage for `eval`'d scripts:** plain `eval(fs.readFileSync(...))` runs
  uninstrumented, so those files report **0%** even though the test exercises them
  (Jest only instruments code that goes through its `require`/transform pipeline).
  To get real numbers, instrument first:

  ```js
  const { instrumentFile } = require('./helpers/instrument');
  const code = instrumentFile(require('path').join(__dirname, '..', 'foo.js'));
  eval(code); // keep the eval in the test so the jsdom scope is unchanged
  ```

  `instrumentFile` (in `clean_adblock/__tests__/helpers/instrument.js`) instruments
  with the same `__coverage__` global Jest's `babel` provider collects. Pass an
  **absolute** path so the key matches `collectCoverageFrom`. Don't use it on a file
  that's also `require`d elsewhere (double instrumentation). The `helpers/` dir is
  excluded from test discovery via `testPathIgnorePatterns` and gets CommonJS globals
  via an `eslint.config.cjs` override.

## Automated agents (Jules routines)

This repo is also worked by **Jules scheduled routines** (the
`google-labs-jules[bot]` author on coverage PRs). Their contract and personas are
version-controlled:

- **`AGENTS.md`** (repo root) — the shared operating contract: non-negotiables,
  the per-subproject lane table, how to read the noisy gate output, and commit
  conventions. Read it to understand what those automated PRs are held to.
- **`.jules/<name>.md`** — one **persona definition** per routine (currently
  `testpilot`, `typist`): identity, lane, constraints. These are
  **human-maintained, not logs** — we edit them to tune a routine; the routines
  themselves must never write to `.jules/` (`AGENTS.md` forbids it). They're
  excluded from the Prettier gate (`.prettierignore`).
- **Testpilot** ranks least-covered files with `python3 bin/coverage_rank.py`
  (auto-detects Jest `coverage-summary.json` vs coverage.py JSON; tested in
  `bin/__tests__/test_coverage_rank.py`, run by `make test-py`).
- **Typist** drives `make type` toward zero errors via JSDoc on
  `clean_adblock/*.js`. The harness — `typescript` + `@types/chrome` dev-deps and
  `jsconfig.json` — is bootstrapped and non-blocking; when the backlog reaches
  zero, the finalize step makes it gate (see `.jules/typist.md`).

These are separate from the Gemini/Claude **slash commands and skills** described
in `GEMINI.md` ("Agent Customizations vs. CLI Commands"); that interactive layer is
unrelated to the unattended Jules routines.
