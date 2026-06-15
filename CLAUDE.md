# CLAUDE.md

Guidance for working in this repo (net-tools): a collection of independent
networking / browser tooling subprojects.

## Layout

- `clean_adblock/` — Chrome extension (Manifest V3). Per-site content scripts +
  background service worker. Jest + jsdom tests in `clean_adblock/__tests__/`.
- `nas_proxy/`, `nas_tools/` — C-based NAS tooling (built/tested via `make -C nas_proxy`).
- `retriever/` — `pull` script (`make pull ID=<extension_id>`).
- `vps_kernel_proxy/`, `vps_user_proxy/`, `vps_kernel_proxy` eBPF — kernel/user proxies.
- `tianditu_bypass/`, `vmware/`, `bin/` — misc tools and build accelerators.
- `docs/` — `EBPF_RESEARCH.md`, `NAS_STRATEGY.md`.

## Commands

- `make precommit-fix` — fmt (Prettier write) + lint-fix (ESLint) + Jest + Python + eBPF + NAS C tests.
- `make precommit` — same but check-only (`fmt:check`, no writes). Use before committing.
- `npm test` — Jest only (no coverage). `npm run test:coverage` — Jest with the
  per-file coverage report (`text` + `text-summary`); this is what `make test` runs.
- `make test-py` — pytest + coverage (`--cov-report=term-missing`) for the Python
  packages. `npm run lint` / `npm run fmt:check` — JS lint/format.

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
- Tests load scripts via `require('../<script>.js')` or `eval(fs.readFileSync(...))`
  inside `jest.isolateModules` / `jest.resetModules`. Each load creates a fresh
  observer that is never disconnected — hence the teardown guard above matters.
