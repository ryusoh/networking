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

This workspace uses two separate systems for custom commands and agent behavior:

1. **Gemini CLI Custom Slash Commands:**
   - TOML files placed in `.gemini/commands/` (e.g., `retro.toml`, `ship.toml`) are automatically loaded by the Gemini CLI as interactive slash commands (e.g., `/retro`, `/ship`).
   - **Do not** add `plugin.json` to `.gemini/` — it is not needed and will cause the CLI configuration directory to be mistakenly loaded as an agent plugin.
2. **Agent Skills (Workspace Customizations):**
   - If you want the AI agent (me) to be able to execute these workflows during a chat session, define them as **Skills** under the workspace customizations directory: `.agents/skills/<skill_name>/SKILL.md`.
   - Each skill requires a `SKILL.md` file with a YAML frontmatter declaring `name` and `description` (used for triggering) and instructions in the markdown body.

## Python Test Environment Setup

- If python tests (`make test-py`) fail because of unrecognized coverage arguments (e.g., `--cov`), install the required development dependencies (pytest and pytest-cov):

  ```bash
  python3 -m pip install -r requirements-dev.txt --break-system-packages
  ```
