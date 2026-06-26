# Gemini Workspace Guide: networking

## Dependency Management & Constraints

### Jest & jsdom Version Pin (v29)

- **Status:** Pinned to `jest@29.7.0` and `jest-environment-jsdom@29.7.0`.
- **Rationale:** Upgrading to v30/v26 (jsdom) breaks existing `window.location` mocking strategies used across the `clean_adblock` test suite. Newer jsdom versions make `window.location` non-configurable/non-writable, triggering "Not implemented: navigation" errors and preventing property deletion.
- **Action:** Do **not** upgrade these dependencies without a verified, repo-wide migration of the location-mocking pattern.

## Workflow: Shipping Multiple PRs

When tasked with "shipping all open PRs", follow this consolidation strategy to minimize conflicts:

1. **Discovery:** Use `mcp_github-blog_search_issues` with `q="is:pr is:open repo:ryusoh/networking"` to identify all open branches.
2. **Consolidation:**
   - Create a temporary integration branch: `git checkout -b ship-all-prs`.
   - Merge each PR branch into it one-by-one: `git merge <branch>`.
3. **Conflict Resolution (Massive Lockfile Conflicts):**
   - If `package-lock.json` has massive conflicts, do not resolve them manually.
   - Manually edit `package.json` to include the target versions from all branches.
   - Run `npm install` to regenerate a clean lockfile.
   - `git add package.json package-lock.json && git commit`.
4. **Verification:** Run `make precommit` on the integration branch.
5. **Final Merge:** Merge the integration branch into `main` using `--no-ff`.

## Testing Conventions

### window.location Mocking

The established pattern (compatible with v29) is the "delete and assign" approach in `beforeEach`:

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

Avoid creating external helpers for this unless they are tested against the specific jsdom version constraints.

## Agent Customizations vs. CLI Commands

This workspace uses three separate systems for custom commands and agent behavior:

1. **Gemini CLI Custom Slash Commands:**
   - TOML files placed in `.gemini/commands/` (e.g., `retro.toml`, `ship.toml`) are automatically loaded by the Gemini CLI as interactive slash commands (e.g., `/retro`, `/ship`).
   - **Do not** add `plugin.json` to `.gemini/` — it is not needed and will cause the CLI configuration directory to be mistakenly loaded as an agent plugin.
2. **Agent Skills (Workspace Customizations):**
   - If you want the AI agent (me) to be able to execute these workflows during a chat session, define them as **Skills** under the workspace customizations directory: `.agents/skills/<skill_name>/SKILL.md`.
   - Each skill requires a `SKILL.md` file with a YAML frontmatter declaring `name` and `description` (used for triggering) and instructions in the markdown body.
3. **Jules scheduled routines (unattended):**
   - Separate from the two interactive systems above. These run unattended and open PRs; their shared contract is `AGENTS.md` (repo root) and their per-routine personas live in `.jules/<name>.md` (e.g. `testpilot`, `typist`).
   - These persona files are **human-maintained, not logs** — the routines must never write to `.jules/`. See `CLAUDE.md` ("Automated agents") for the full picture.

## Python Test Environment Setup

- If python tests (`make test-py`) fail because of unrecognized coverage arguments (e.g., `--cov`), install the required development dependencies (pytest and pytest-cov):

  ```bash
  python3 -m pip install -r requirements-dev.txt --break-system-packages
  ```

## JavaScript Type-Checking (`make type`) vs Linting (`npm run lint`)

- **Separation of Concerns:** ESLint (`npm run lint`) and TypeScript (`make type`) are distinct verification gates. ESLint checks syntax, styles, and defined globals. `make type` runs type-checking over `clean_adblock/*.js` utilizing JSDoc annotations and the TypeScript compiler (configured via `jsconfig.json`).
- **Developer Error Context:** When asked to "fix lint errors", developers or tools may refer to either ESLint output or the TypeScript compilation errors. Verify both gates are green.
- **ESLint Undefined Globals (HTMLElement, HTMLLinkElement, etc.):**
  `eslint.config.cjs` defines a limited subset of browser globals. When performing type checks using JSDoc type-guards (such as `instanceof HTMLLinkElement`), ESLint will raise `no-undef` warnings if the constructor is not in the config globals. To resolve this:
  - Reference the constructor via `window` (e.g., `link instanceof window.HTMLLinkElement`), or
  - Add inline `/* global ... */` declarations at the top of the file.
- **Dynamic Globals and Element Access:**
  Bracket notation (e.g., `window['__NUXT__']`, `this['_url']`) should be preferred over dot notation when assigning or retrieving dynamic, un-typed properties. This satisfies both ESLint and `make type` without requiring verbose casting.

## Automated Commit Message Squash Merges

- **Single-Commit PR Caveat:** When a Pull Request contains exactly one commit, GitHub defaults squash merges to the first commit's message (subject + body) instead of the PR title.
- **No Conversational Wrappers:** Ensure all commits and final agent outputs contain no conversational greetings, sign-offs, or friendly wrappers (like "Hello! Jules here" or "Let me know if you need anything else"). The final response must start directly with the Conventional Commit subject line and proceed to the structured markdown summary.
