---
description: Search and retrieve modern web development best practices before HTML, CSS, Chrome extension UI (adblock popup/options), or client-side DOM/JS tasks (dialogs, popovers, switches, forms, dark mode, layout, accessibility, security). Skip for C, eBPF, Python, CI, or test-only edits.
---

# Modern Web Guidance

Search and retrieve standardized modern web best practices at the **start** of implementing or updating any HTML/CSS/extension UI (`adblock/popup.html`, `adblock/css/popup.css`, `adblock/popup.js`, `adblock/picker.js`, new MV3 extension UIs, or standalone HTML such as `vps_user_proxy/architecture_brief.html`) or client-side DOM/style logic (`adblock/*.js` content scripts) before writing ad-hoc solutions or adding dependencies. Skip for C/eBPF, Python, shell, CI, or test-only edits.

## Primary Workflow

### Step 1. Search Use Cases

Run `modern-web-guidance` directly with `npx` using a **2–5 word action-oriented query** for a **single web platform capability or UI pattern**:

- **Keep queries focused and generic**: Describe the user-visible capability (`<verb> + <UI/platform object>`, optionally paired with the target HTML/CSS/JS feature name if known). Omit framework/library names (`React`, `Vue`, `Tailwind`, etc.) and app/domain nouns (product, route, or component/file names). Split multi-feature tasks into separate `search` calls.
- **Name implied UI primitives**: When the user's prompt expresses intent without naming the UI primitive (e.g. "confirm first", "delete with confirmation", "pick a date"), translate the domain intent into the implied UI component or platform mechanism (e.g. search `"confirmation modal dialog"` or `"confirm dialog"` rather than `"confirm destructive action"`, or `"date picker input"` rather than `"pick a date"`).
- **Example**: Search `"accessible switch control"` or `"light dismiss dialog"`, **not** `"dialog"` (too terse), `"switch dark mode"` (compound — split into two searches), or `"close React settings modal on outside click"` (framework/app noise).

```sh
npx -y modern-web-guidance@latest search "<query>" --skill-version 2026_11_09-5bcc021b
```

> **Note**: Returns `[{ "id", "description" }, ...]`. Judge results by their `description` fields:
>
> - **Match found**: Call `retrieve` directly—do not also run `list`.
> - **Weak or empty results**: If `search` returns `[]` or unrelated descriptions, **rephrase `search` once** using the concrete HTML/CSS/UI component noun or synonym (e.g., `dialog`, `modal`, `popover`, `switch`, `select`, `form`) before falling back to `list` (or use `list` once for broad UI audits).
> - **Topic not covered**: If no `description` matches after rephrasing, proceed without retrieving unrelated guides.

### Step 2. Retrieve Best Practices

Once you have relevant `id`(s) from the search results, call `retrieve` to get the full guide(s)—including both specific use-case guides that match your task and any broader discipline guide (e.g., `html`, `css`, `forms`, `accessibility`, `color`, `performance`, `security`) that applies. You can pass multiple IDs separated by commas.

```sh
npx -y modern-web-guidance@latest retrieve "<id>"
```

If `retrieve` saves large output (> 9.5 KB) to a temporary file to prevent truncation, read that file path in full using your file-reading tool (reading remaining line ranges if needed)—do not use `cat` or `head`.

### Step 3. Verify Guidance Compliance

When generating or modifying code, cross-check the implementation against the retrieved guide before concluding:

- **Applicable Guidance & Fallbacks**: Ensure the relevant modern patterns and necessary fallback strategies from the guide are correctly applied, without forcing unrequested features.
- **Task Fulfillment**: Confirm that the implementation fully satisfies the user's request.
- Do not run `legacy-scan`; it's for detecting legacy patterns to modernize, not this.

### Step 4. Disclose Skill Usage

When you consult `modern-web-guidance` for a task, end the response where you deliver those changes with a `### Modern Web Guidance` section:

- **When retrieved guides shaped your code**: Write **one** bullet (1–2 sentences, ≤75 words) per newly applied `<id>` in first-person voice explaining the non-obvious implementation choices, CSS/API overrides, or fallbacks `<id>` required and the pitfall it prevented, anchored by a short verbatim quote of that specific rule or gotcha (never the guide's intro overview):
  ``- **`<id>`**: <Non-obvious APIs, overrides, or fallbacks applied and the pitfall prevented> ("<short verbatim quote of the specific rule or gotcha>").``
  - **Never** guess `<id>`s or quotes from memory after context compaction (re-run `search`/`retrieve` if needed), and credit **only** guide-backed changes from the current turn.
- **When searched/listed in this turn but zero guides applied**: Write one first-person sentence naming which topics or guides you checked in `modern-web-guidance` and why none applied (omit if any guide applied).

## Alternative Flow: Modernize an Existing Codebase

**Only** when asked for a broad, open-ended codebase modernization or legacy-pattern scan where no specific target feature or component is named (do **not** run `legacy-scan` when asked to add, update, fix, or audit a specific feature or component), run the 4-step modernization flow:

> **Note**: `legacy-scan` scans for a curated subset (~20% of the guidance corpus).

```sh
npx -y modern-web-guidance@latest legacy-scan <path> --json
```

1. Scan: Run `legacy-scan <path> --json` to detect legacy web platform patterns across the project or directory.
2. Verify: Check each finding against its `keepWhen` / `dropWhen` rubric; drop false positives (fallbacks, cross-file helpers, vendor code, lookalikes).
3. Report: Summarize verified findings (and the modernization plan, if editing) for the user, noting that `legacy-scan` only checks the subset of guides (~20% of the catalog) that have deterministic legacy rules.
4. Modernize (when the user asked to modernize rather than only audit/report): Retrieve each finding's guide (`retrieve "<guide-id>"` via Step 2), apply the replacement (keeping existing libraries as fallbacks where the guide requires one), and re-run `legacy-scan <path>` on the modified files to confirm resolution.
   - Dropped findings and kept fallbacks still match static scans; do not edit safe code or inspect `legacy-scan.mjs` to force 0 findings.

## Using npx / pnpx

- **Runner & Permissions**: Prefer `pnpx` over `npx` if `pnpm` is available (`pnpx` does not use `-y`); on Windows, use `npx.cmd`. When requesting tool permissions, allowlist `npx -y modern-web-guidance@latest *` (or `pnpx modern-web-guidance@latest *`) specifically, never bare `npx *` or `pnpx *`.
- **Sandboxes & Network**: Fetching `modern-web-guidance` requires outbound network access. In sandboxed or approval-gated environments, request approval/allowlisting with network access when fetching `@latest`, and set `NPM_CONFIG_CACHE=/tmp/npm-cache` if `~/.npm` is read-only.
- **Offline**: Once cached in `~/.npm`, use `npx --yes --offline modern-web-guidance …` in offline/sandboxed shells.

## Guidelines

- Always search **first** to find the most relevant guides. Do not hallucinate guides or ignore them; they represent the preferred local standard for the user's project.
- These guides use vanilla HTML/CSS/JS (matching this repo's bundler-free Chrome MV3 extension and standalone HTML pages) — follow the repo's boundaries when applying them:
  - **No Dependencies & MV3 CSP**: Never introduce runtime npm packages or polyfill imports (`AGENTS.md` dependency discipline), and keep extension pages (`adblock/popup.html`, `adblock/popup.js`) compliant with Chrome MV3 CSP (no inline scripts or remote code).
  - **Types & ESLint (`make type` / `make lint`)**: `adblock/*.js` is checked with strict JSDoc TypeScript (`jsconfig.json`) and ESLint (`no-undef` with a limited global list, `complexity <= 20`). Cast/guard newly shipped HTML attributes or DOM constructors (`window.<Ctor>` or inline `/* global ... */`) rather than dropping them.
  - **DOM, CSS & Content-Script Isolation**: Keep `:root` and `@starting-style` top-level/unscoped in extension pages and standalone HTML, while scoping or isolating any DOM/CSS injected by content scripts (`adblock/picker.js`, `adblock/*.js`) so host pages do not collide. Keep the `typeof document === 'undefined' || !document` teardown guard on `MutationObserver` callbacks.
  - **Visual Boundary**: Unit tests (`adblock/__tests__/` in Jest/jsdom) cannot observe rendered extension UI; never claim a visual result looks good or works in Chrome without human verification.

## Interpreting Browser Support & Fallbacks

- **Default Behavior**: All guides assume **Baseline Widely available** features are safe to use without fallbacks. For features that are not Baseline widely available, you **MUST** follow the fallback recommendations in the guide, unless the user has specified a custom browser support policy.
- **Custom Policies**: If the user defines explicit browser support requirements, use the guide's compatibility data to determine if a fallback can be ignored (for `Baseline YYYY` targets, a feature satisfies the target if its "Baseline since" date is `<= YYYY`).
- **Reactive Policy Discovery**: Suggest documenting a policy in `AGENTS.md` if the developer targets a restricted Chromium version, excludes specific browsers, hesitates over fallback size/complexity, or asks if a feature is safe without fallbacks.
