---
description: Scaffold a new Chrome MV3 extension subproject in this repo (manifest, content script, tests) with the repo's lint/test/git conventions already baked in
argument-hint: '<extension-dir-name>'
---

# Add a new Chrome extension subproject

Scaffold `<extension-dir-name>/` as an MV3 extension that passes this repo's
gates on the first try. Hard-won gotchas are listed first — they all cost a
failed attempt before they were understood.

## Naming and directory gotchas (do these right the first time)

- **No underscore-prefixed dirs inside the extension folder.** Chrome refuses
  to load an extension containing `_anything` ("Filenames starting with '_' are
  reserved"; `_locales` is the one allowed exception). So the repo's usual
  `__tests__/` convention is **not** usable here — put tests in `tests/`
  (plain). Jest finds them by the `*.test.js` filename pattern regardless of
  directory name. If the subproject already contains `__tests__/` (e.g.
  `clean_adblock`) or a stray `_metadata/`, do **not** load the checkout
  directly — run `bin/pack-extension <dir>` and load `<dir>/dist` instead
  (generated, git- and prettier-ignored).
- **`.gitignore` ignores bare build-artifact names** (`tests`, `lan_scanner`,
  ...). `tests` is scoped to `/nas_proxy/tests`, so `tests/` directories are
  trackable — but if you add a file that shares a name with a C binary target,
  check `git check-ignore -v <path>` before wondering why `git add` fails.
- New subprojects are independent: keep everything inside the one directory,
  no imports from other subprojects (`make depcheck` enforces this for the
  dirs it covers).

## Scaffold

1. `manifest.json` — MV3.
2. **Icons: always default to the shared set.** Every new extension in this
   repo uses the same icons as `stall_guard`/`clean_adblock` unless the user
   explicitly asks for different artwork: copy
   `clean_adblock/assets/icon{16,48,128}.png` into `<dir>/assets/` and declare
   both `icons` and `action.default_icon` in the manifest (see
   `clean_adblock/manifest.json` or `stall_guard/manifest.json` for the exact
   wiring). Do not ship a new extension without icons, and do not invent new
   ones.
3. Content script — write the logic as pure, testable functions and expose
   them for Jest with a CommonJS guard that returns before touching the page:

   ```js
   /* global module */
   (function () {
     'use strict';
     // ... pure functions ...
     const api = {/* exported internals */};
     if (typeof module !== 'undefined' && module.exports) {
       module.exports = api;
       return; // unit-test context: do not touch the page
     }
     // ... content-script runtime (observers, intervals) ...
   })();
   ```

   If the script registers a `MutationObserver`, the callback must start with
   the `typeof document === 'undefined' || !document` guard (see AGENTS.md —
   observers fire after jsdom teardown).

4. `tests/<name>.test.js` — `require('../<script>.js')` and drive the exported
   functions with plain fake objects (e.g. a fake `video` element literal).
   Coverage gate is unaffected: `collectCoverageFrom` only covers
   `clean_adblock/*.js`, so a new subproject's tests never trip the global
   `coverageThreshold`.

## Code style (matches what eslint/prettier enforce here)

- `const`/`let`, never `var` (`no-var` is on; clean_adblock is warning-free —
  keep new code the same).
- Browser globals come from the limited `eslint.config.cjs` set; anything else
  (`module`, extra DOM constructors) needs an inline `/* global ... */`.
- Run prettier before declaring done.

## Verify (scoped, fast — full `make precommit` only before a PR)

```
npx jest <dir>
npx eslint <dir>
npx prettier --check <dir>
python3 -m json.tool <dir>/manifest.json >/dev/null
```

Then have the user load it: `chrome://extensions` → Developer mode → Load
unpacked → select the dir. Per repo policy, never claim it "works in Chrome" —
only the user can observe that. If the payoff is browser-visible only, note it.

## Commit

Single-concern Conventional Commit, e.g.
`feat(<scope>): add MV3 extension to <do the thing>`. Include every file —
manifest, script, tests, assets — and any `.gitignore` fix that was needed to
make them trackable.
