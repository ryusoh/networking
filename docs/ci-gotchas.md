# CI / Local Gate Gotchas

Reference for interpreting `make precommit` output and JS-test harness
constraints. This used to live in `AGENTS.md`; the canonical project rules still
live there — this doc is just the detailed field guide.

## Reading the gate output

`make precommit` and `precommit-fix` **exit 0 even when the log looks alarming.**
Judge by the exit code and the summary lines, not by eyeballing the stream. Known
expected noise:

- **eBPF is intentionally ignored** (`-@docker ...` in the Makefile). Without
  Docker/Colima you will see `test-ebpf ... Error N (ignored)` — expected, not a
  failure. The exit code varies by cause (`Error 1` when the build fails,
  `Error 125` when Docker itself is absent in CI); any `(ignored)` is fine.
  Start Colima only if you specifically need the eBPF kernel tests.
- **`curl_easy_perform() failed: Unsupported protocol`** in the nas_proxy run is a
  test deliberately exercising the error path (`invalid://schema`), not a failure.
- **The nas_proxy C tests are smoke tests, not assertion suites.** `[PASS]` /
  `ALL C TESTS PASSED` are `printf`'d after each `test_*()` returns, so "PASS"
  mostly means "didn't crash." Only a few cases actually `assert` (e.g. the
  `get_tile` round-trip in `test_tile_storage`); `test_tile_fetcher` asserts
  nothing. When you touch nas_proxy logic, add real `assert(...)`s — a green line
  alone won't catch a regression.
- **`nas_tools` privileged tests (ICMP / `eth0`) and the `vps_kernel_proxy` eBPF
  compile test self-skip** when the host lacks prerequisites (e.g. macOS, bare CI
  runner). Do not "fix" a skip by apt-installing a BPF toolchain or removing a
  `skipUnless` guard.
- **On macOS, `nas_tools` raw-socket tests may fail with `Operation not permitted`.**
  This is a host sandbox limitation, not a code bug. Run `make precommit-docker`
  to execute the full gate inside an Ubuntu container (auto-starts Colima if
  needed).
- **`Exec format error` or `cannot execute binary file` after Docker runs:**
  When `nas_tools` or `nas_proxy` binaries were compiled inside a Linux container,
  local macOS test runners fail with an architecture mismatch because `make`
  skips rebuilding existing files. Run `make -C nas_tools clean && make -C nas_proxy clean`
  to rebuild native macOS binaries.
- **jsdom prints async `unhandled exception` stack traces** for errors thrown
  inside content-script code even when the test passes. These are real bugs to fix
  (Sentinel's lane), but they do not fail the suite by themselves.
- **SIGALRM-based timeout tests can be flaky on macOS.** Tests that use
  `signal.SIGALRM` to enforce a timeout (e.g. `resource_governor.py`) may
  escape `pytest.raises` when the suite runs under heavy load. Prefer
  `time.sleep` over tight busy-loops so the signal interrupts a blocking
  syscall, and avoid relying on sub-second alarm precision.

## System dependency

The C tests link `-lcurl`, so a runner needs `libcurl4-openssl-dev` (CI installs
it; macOS has it via the SDK).

## Jest & jsdom version pin (v29)

- **Status:** pinned to `jest@29.7.0` and `jest-environment-jsdom@29.7.0`.
- **Rationale:** upgrading to v30/v26 (jsdom) breaks existing `window.location`
  mocking strategies used across the `clean_adblock` test suite. Newer jsdom
  versions make `window.location` non-configurable/non-writable, triggering
  "Not implemented: navigation" errors and preventing property deletion.
- **Action:** do **not** upgrade these dependencies without a verified,
  repo-wide migration of the location-mocking pattern.

The established pattern (compatible with v29) is the "delete and assign"
approach in `beforeEach`:

```js
beforeEach(() => {
  delete window.location;
  window.location = {
    hostname: 'example.com',
    pathname: '/test',
    href: 'https://example.com/test',
    // ... other properties
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  };
});
```

Avoid creating external helpers for this unless they are tested against the
specific jsdom version constraints.

### Teardown hygiene

Some code under test modifies the DOM or keeps references, causing Jest/jsdom
side effects on subsequent tests (unhandled timer/MutationObserver updates). Best
practice for such tests, especially for modules like `xhs-keepalive.js` and
`cookie-banner-blocker.js`: always manually clear `document.body.innerHTML` in
`beforeEach` or properly clean up inserted nodes when faking timers.
