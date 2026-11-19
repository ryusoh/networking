---
name: ship
description: Ship a branch — check quality, merge to main, and clean up the branch
argument-hint: '<branch_name>'
---

# Ship Branch

Ship a completed `<branch_name>`, or ship uncommitted changes directly from
`<primary-branch>` (`main`).

## Working mode

Read `AGENTS.md` first. If the user says "ship it" while on `<primary-branch>`
with uncommitted changes and no `<branch_name>` argument, use Direct-push mode
rather than creating an unrequested branch/PR.

## Branch mode (when `<branch_name>` is given)

1. **Checkout and sync:**
   - `git fetch origin && git checkout <branch_name> && git pull origin <branch_name>`
2. **Verify and fix quality:**
   - Run `make lint`, `make fmt` (if formatting fails), `make test`, and
     `make precommit` (use `make precommit-docker` on macOS if privileged
     `nas_tools` socket tests fail).
   - Commit any quality fixes with a Conventional Commit message.
3. **Squash-merge into `<primary-branch>`** for one clean commit on `main`:
   - `git checkout <primary-branch> && git pull origin <primary-branch>`
   - `git merge --squash <branch_name>`
   - Resolve any conflicts (`git status`, edit, `git add <file>`), then commit
     with one Conventional Commit message describing the whole change.
4. **Final verification:** run `make precommit` (or `make precommit-docker` on
   macOS) on merged `<primary-branch>`.
5. **Push and clean up:**
   - **Ask for explicit user acknowledgement before pushing.**
   - `git push origin <primary-branch>`
   - Delete local branch: `git branch -d <branch_name>` (after a squash merge,
     confirm everything is pushed and use `git branch -D <branch_name>`).
   - Delete remote branch if it exists: `git push origin --delete <branch_name>`.

## Direct-push mode (on `<primary-branch>` with uncommitted changes)

1. Stage changed files by name (`git add <file>`) and commit with a
   Conventional Commit message.
2. Run `make precommit` (or `make precommit-docker` on macOS if `nas_tools`
   privileged socket tests fail with `Operation not permitted`).
3. **Ask for explicit user acknowledgement before pushing.**
4. Push: `git push origin <primary-branch>`.

## Shipping multiple open PRs

1. List open PR branches (`gh pr list --state open`).
2. Create an integration branch (`git checkout -b ship-all-prs`) and merge each
   PR branch one by one (`git merge <branch>`).
3. For heavy `package-lock.json` conflicts, reconcile `package.json` manually,
   regenerate the lockfile with `npm install`, and commit both files.
4. Verify with `make precommit` on the integration branch.
5. Merge into `main` with `--no-ff` after user acknowledgement.

## Report

Summarize the mode used, commits created, gate results, conflicts resolved, and
branches cleaned up.
