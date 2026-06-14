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

- `make precommit-fix` — fmt (Prettier write) + lint-fix (ESLint) + Jest + eBPF + NAS C tests.
- `make precommit` — same but check-only (`fmt:check`, no writes). Use before committing.
- `npm test` — Jest only. `npm run lint` / `npm run fmt:check` — JS lint/format.

### Reading `make precommit-fix` output (important)

- **It exits `0` even when the output looks alarming.** Don't judge it by eyeballing
  the log — check the exit code and the `Tests: N passed` / `ALL C TESTS PASSED` lines.
- **The eBPF step is intentionally ignored** (`-@docker ...` in the Makefile). If
  Docker/Colima isn't running you'll see `Error 1 (ignored)` — that is expected, not a
  failure. Start Colima only if you specifically need the eBPF kernel tests.
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
