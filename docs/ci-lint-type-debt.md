# Why CI's ESLint warnings and `make type` errors never block the build

## The question

CI consistently prints two categories of persistent problems that never fail the
build and never seem to get fixed:

1. Four ESLint `no-unused-vars` **warnings** (not errors) in two test files:
   `cookie-banner-blocker-skip.test.js` (`fs` line 1, `originalQuery` line 85, `sel`
   line 86) and `forum-ad-blocker-more.test.js` (`fs` line 1) — ending in
   `✖ 4 problems (0 errors, 4 warnings)`.
2. Dozens of `make type` (JSDoc/TypeScript) errors in six `clean_adblock/*.js`
   files, ending in `make type: non-blocking JS type errors remain (Typist lane)`.

Why do neither fail CI, and why hasn't the automated Typist routine burned the
type backlog down to zero?

## The answer

Both are non-blocking **by design**, not by accident, and both are documented as
such in the repo's own operating contracts. ESLint's `no-unused-vars` rule (and
nearly every style rule in `eslint.config.cjs`) is configured at severity `'warn'`,
and the `lint` npm script/Makefile target invoke plain `eslint .` with no
`--max-warnings` flag anywhere in the repo — ESLint only exits non-zero on
**errors**, so warnings are cosmetic noise that CI (which just runs `make
precommit` → `make lint` → `npm run lint`) silently tolerates. `make type` is
separately wired with a shell `|| echo` fallback, so a non-zero `tsc` exit is
swallowed and replaced with an always-succeeding `echo`, making the target exit 0
regardless of how many type errors JSDoc-checking finds.

The type backlog isn't being burned down blindly — it _is_ being worked, just
slowly and by design. `.jules/typist.md` defines Typist's mandate as exactly
**one file per run**, selecting the `clean_adblock/*.js` file with the _fewest_
remaining errors each time, explicitly prohibited from batching or from touching
`jsconfig.json`/the Makefile to flip the gate early — that only happens once the
entire repo-wide backlog hits zero. Git history confirms Typist is real and
active: 11 "annotate ... for type-checking" commits/PRs from 2026-06-26 (harness
bootstrap) through 2026-07-08 (`picker.js`, the most recent, `#53`), landing at
roughly one file every 1-2 days. The six files still failing `make type`
(`gurufocus-unlocked.js` with 19 errors, `background.js` 17, `video-stream-ad-
blocker.js` 15, `twitch-ad-blocker.js` 13, `popup.js` 12, `forum-ad-blocker.js`
12 — 88 errors total, verified by running `npx tsc -p jsconfig.json --noEmit`
directly) simply haven't come up in file-selection order yet; Typist works
lowest-error-count-first, so these larger files are queued last by its own
"fewest remaining errors" tie-break rule.

The ESLint warnings, by contrast, are nobody's job. No Jules lane in `AGENTS.md`'s
lane table owns "clean up lint warnings in test files" — Testpilot only _adds_
test coverage, Janitor owns dead code/stale deps but not lint warnings, and no
routine is chartered to touch `.test.js` files for style reasons. `AGENTS.md`
explicitly forbids routines from changing lint config, but nothing forbids fixing
an actual unused-var warning in a test file — it's just outside every existing
lane's defined scope, so it sits untouched indefinitely.

## Claim-by-claim evidence

### 1. `no-unused-vars` is `warn`, not `error`

- `eslint.config.cjs:54`: `'no-unused-vars': ['warn', { args: 'after-used', ignoreRestSiblings: true }],`
- Nearly every other stylistic rule in the same block is also `'warn'` (e.g.
  `eslint.config.cjs:57` `eqeqeq: ['warn', ...]`, `:58` `'no-var': 'warn'`) — only
  `no-undef`, `no-unreachable`, `no-constant-binary-expression`, and `curly` are
  `'error'` (`eslint.config.cjs:53,55,56,65`).
- Verified live: running `npx eslint .` in the repo reproduces exactly the four
  warnings named in the question, at the exact lines named, ending in
  `✖ 4 problems (0 errors, 4 warnings)`.
- Source lines confirmed by reading the files directly:
  `clean_adblock/__tests__/cookie-banner-blocker-skip.test.js:1` (`const fs = require('fs');`),
  `:85` (`const originalQuery = banner.querySelectorAll.bind(banner);`),
  `:86` (`.mockImplementation((sel) => {`); and
  `clean_adblock/__tests__/forum-ad-blocker-more.test.js:1` (`const fs = require('fs');`).

### 2. Nothing turns warnings into failures

- `package.json:6`: `"lint": "eslint ."` — no `--max-warnings 0` or similar flag.
- `Makefile:23-24`: `lint:` target just runs `@npm run lint`, adding nothing.
- `.github/workflows/ci.yml`'s only CI step is `run: make precommit` (final step,
  labeled "Run precommit (single source of truth)"), which chains to `lint` via
  `Makefile:13` (`precommit: fmt-check lint type test test-py test-ebpf test-nas`).
- A repo-wide `grep -rn max-warnings` (json/yml/Makefile/cjs) found zero matches —
  confirmed no warnings-as-errors switch exists anywhere in the repo.
- By ESLint's own semantics, a non-zero process exit only occurs when at least
  one **error**-severity result exists (or `--max-warnings` is set and exceeded);
  since all 4 findings here are `warn` and no such flag exists, `eslint .` exits 0
  and `make lint`/`make precommit` proceed.

### 3. `make type` is explicitly non-blocking via `|| echo`

- `Makefile:33-34`:
  ```
  type:
      @npx tsc -p jsconfig.json --noEmit || echo "make type: non-blocking JS type errors remain (Typist lane)"
  ```
- Mechanism: `tsc --noEmit` exits non-zero when type errors exist; the shell `||`
  operator only runs the right-hand side when the left-hand side fails, and — key
  point — the **overall exit status of the compound command becomes the exit
  status of the `echo`**, which is always `0`. So `make type` (and therefore
  `precommit`/`precommit-fix`, which both list `type` as a prerequisite at
  `Makefile:13,15`) always reports success to `make` and to CI, no matter how many
  `tsc` errors are printed to the log first.
- `Makefile:29-32` comment (paraphrased): explains this is intentional so the
  Typist backlog stays visible in logs without breaking CI, and that dropping the
  `|| echo` is the intended way to flip it to blocking once the backlog hits zero.
- Confirmed live: `npx tsc -p jsconfig.json --noEmit` run directly in the repo
  currently reports errors in exactly the six files named in the question:
  `gurufocus-unlocked.js` (19), `background.js` (17), `video-stream-ad-
blocker.js` (15), `twitch-ad-blocker.js` (13), `popup.js` (12),
  `forum-ad-blocker.js` (12) — 88 total.

### 4. `jsconfig.json` has `strict: true`, consistent with TS7006-style errors

- `jsconfig.json:3-6`: `"checkJs": true, "allowJs": true, "noEmit": true, "strict": true,`
- `jsconfig.json:13-14`: scoped to `"include": ["clean_adblock/*.js"]`, explicitly
  `"exclude": [..., "clean_adblock/__tests__"]` — type-checking never touches test
  files, only production `clean_adblock/*.js` sources, matching the six files in
  the question.
- `strict: true` enables `noImplicitAny` among other checks, which is exactly what
  produces TS7006 ("implicit any") errors — consistent with the question's
  description of the error style, and consistent with `.jules/typist.md:19`
  describing the remaining backlog as "genuine DOM typing gaps (mostly `Property …
does not exist on type 'Element'/'Node'`)".

### 5. Typist's actual mandate: one file per run, ordered by fewest errors, gate flips only at zero backlog

- `.jules/typist.md:24-26` (Mandate): "Each run, bring exactly **one**
  `clean_adblock/*.js` file to type-clean... No runtime behavior change."
- `.jules/typist.md:37-38` (Method): "Select TARGET = the `clean_adblock/*.js`
  file with the **fewest** remaining `make type` errors (ties → smallest line
  count)."
- `.jules/typist.md:51-56` (Finalize): the `|| echo` fallback is only removed
  "only when zero errors remain repo-wide" — i.e., the gate cannot flip to
  blocking piecemeal; it's all-or-nothing at the very end of the backlog.
- `.jules/typist.md:30-33` (Lane): Typist owns only JSDoc annotations on
  `clean_adblock/*.js` and `.d.ts` type declarations; explicitly "must NOT touch
  ... runtime logic, tests, CSS, Python, or C" — so it structurally cannot be the
  one fixing the ESLint warnings living in `__tests__/*.test.js` files.
- `AGENTS.md:159-163` ("Enforcement note"): states plainly that "the JS
  type-check (`make type`) is **non-blocking**" and that Typist's target is
  "judgment-guided, not machine-gated" — the repo's own contract acknowledges
  this is a slow, voluntary burn-down, not an enforced one.

### 6. Typist is active, not dormant — cadence confirmed via `git log`

- Bootstrap: `2b209f6` (2026-06-26) `build(types): bootstrap JS type-check
harness and Typist persona`.
- First real annotation: `301f924` (2026-06-26) `Hello! Jules here. I have
successfully annotated clean_adblock/cookie-popup-blocker-main.js for
type-checking.` (pre-dates the current commit-message conventions in
  `AGENTS.md`, hence the conversational text `AGENTS.md` now explicitly forbids).
- Subsequent commits, in order, one file each: `6319477` (06-27, `xhs-
keepalive.js`), `72552ba` (06-28, `nytimes-unlocked.js`), `afea7fd` (06-30,
  `youtube-ad-blocker.js`), `3bbb240` (07-02, `nytimes-unlocked.js` again),
  `cd7ad76` (07-03, `x-unlocked.js`), `4e6d232` (07-04, `linkedin-unlocked.js`),
  `03ea57b` (07-05, `content.js`), `096d0ff` (07-06, `social-media-blocker.js`),
  `bff7c66` (07-07, `cookie-banner-blocker.js`), `0b13688` (07-08, `picker.js`,
  the most recent commit on `main` as of this writing, PR #53).
- Cadence: roughly one file per day since 2026-06-26 (13 days, 11 annotation
  commits — one gap and one repeat on `nytimes-unlocked.js`), consistent with a
  routine actually running on a near-daily schedule, not one that's stalled or
  disabled.
- All Typist PRs use the exact commit-subject pattern mandated in
  `.jules/typist.md:70`: `refactor(types): annotate <file> for type-checking`.

## Open questions / what couldn't be verified

- **Exact scheduling mechanism/cron for Typist is not in this repo.** `AGENTS.md`
  and `.jules/typist.md` describe _behavior_ but neither file, nor anything else
  in the checked-out tree, specifies a cron expression, GitHub Action, or external
  scheduler that triggers Jules runs. The near-daily cadence in git log is
  circumstantial evidence of an external (Google Labs Jules platform-side)
  schedule, not something this repo's config confirms directly.
- **Why `nytimes-unlocked.js` was annotated twice** (`72552ba` on 06-28 and
  `3bbb240` on 07-02) isn't explained by any file read — possibly a second pass
  after new code was added to that file, or Typist re-selecting it because it
  still had errors after PR #38 was merged. Not confirmed from primary sources.
- **Whether the six remaining files' error counts (88 total) are current at the
  moment CI runs vs. a slightly stale earlier CI log** — the counts in this doc
  were captured by running `npx tsc -p jsconfig.json --noEmit` locally in this
  worktree at investigation time and may drift slightly commit-to-commit as
  Typist lands more PRs beyond `0b13688`.
- **No lane owns the ESLint test-file warnings** — confirmed by reading the full
  lane table in `AGENTS.md:146-157`; none of Sentinel/Testpilot/Architect/
  Janitor/Bolt/Typist's scopes cover "fix unused-var lint warnings in test
  files." This is a real gap in coverage, not something resolved by evidence
  found — noting it here rather than guessing at an intended owner.
