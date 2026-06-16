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
