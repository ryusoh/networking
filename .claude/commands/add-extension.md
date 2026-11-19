---
description: Scaffold a new Chrome MV3 extension subproject in this repo (manifest, content script, tests) with the repo's lint/test/git conventions already baked in
argument-hint: '<extension-dir-name>'
---

# Add a new Chrome extension subproject

Scaffold `<extension-dir-name>/` as a self-contained Chrome MV3 extension that
passes this repo's gates on the first try.

## Directory and git conventions

- **Plain directory names only inside the extension folder:** Chrome reserves
  leading underscores (`_locales` is the sole exception), so put tests in
  `tests/` rather than `__tests__/` (Jest matches `*.test.js` in any dir). For
  an existing extension that contains `__tests__/` (e.g. `adblock`) or
  `_metadata/`, build a clean package with `bin/pack-extension <dir>` and load
  `<dir>/dist` (git- and prettier-ignored).
- **`.gitignore` collision check:** `.gitignore` ignores bare C-binary names
  (`lan_scanner`, etc.; `/nas_proxy/tests` is scoped so `tests/` is trackable).
  If `git add` rejects a new file, inspect with `git check-ignore -v <path>`.
- **Subproject isolation:** keep everything inside `<extension-dir-name>/` with
  zero cross-subproject imports (`make depcheck` enforces isolation).

## Scaffold

1. `manifest.json` — Manifest V3.
2. **Shared icons by default:** copy `adblock/assets/icon{16,48,128}.png` into
   `<dir>/assets/` and wire both `icons` and `action.default_icon` in
   `manifest.json` (match `adblock/manifest.json`) unless the user requests
   custom artwork.
3. **Content script:** keep logic in pure, testable functions and export them
   behind a CommonJS guard that returns early in Jest before touching the DOM:

   ```js
   /* global module */
   (function () {
     'use strict';
     // ... pure functions ...
     const api = {/* exported internals */};
     if (typeof module !== 'undefined' && module.exports) {
       module.exports = api;
       return; // unit-test context
     }
     // ... content-script runtime (observers, intervals) ...
   })();
   ```

   Start any `MutationObserver` callback touching `document` with
   `if (typeof document === 'undefined' || !document) { return; }`
   (`AGENTS.md`).

4. `tests/<name>.test.js` — `require('../<script>.js')` and exercise exported
   functions with plain fake objects.
5. **Register coverage:** add `"<dir>/*.js"` to `collectCoverageFrom` in
   `package.json` so `bin/coverage_rank.py` tracks gaps while the aggregate
   `coverageThreshold` absorbs the new extension.

## Code style

- Use `const`/`let` (`no-var` is enabled; keep new code warning-free).
- `eslint.config.cjs` defines a limited browser-global set; declare extras
  (`module`, DOM constructors) with inline `/* global ... */` or `window.<Name>`.
- Format with Prettier before finishing.

## Verify (scoped; run `make precommit` before a PR)

```bash
npx jest <dir>
npx eslint <dir>
npx prettier --check <dir>
python3 -m json.tool <dir>/manifest.json >/dev/null
```

Hand off to the user to load via `chrome://extensions` → Developer mode → Load
unpacked → select `<dir>`. Report objectively verifiable test/lint results and
flag browser-visible behaviour for human verification.

## Commit

Single-concern Conventional Commit — e.g.
`feat(<scope>): add MV3 extension to <do the thing>` — including manifest,
script, tests, assets, `package.json`, and any `.gitignore` adjustment.
