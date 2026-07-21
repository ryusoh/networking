---
name: ship
description: Ship a branch — check quality, merge to main, and clean up the branch
argument-hint: '<branch_name>'
---

# Ship Branch

Ship a completed branch, or ship uncommitted changes from the primary branch.

## Audience check (read `AGENTS.md` first)

- **Unattended Jules routines** must branch off the primary branch, open a PR,
  and never push to the primary branch directly.
- **Interactive coding agents** (Claude Code, Kimi, etc.) work with the user.
  If the user says "ship it" while you are on the primary branch with
  uncommitted changes, commit and push directly. Do not force a branch/PR
  workflow unless the user asks for one.

## Branch mode (when `<branch_name>` is given)

1. **Checkout and Sync:**
   - Fetch all branches: `git fetch origin`
   - Checkout the target branch.
   - Ensure it's up to date: `git pull origin <branch_name>`

2. **Fix Quality and CI Failures:**
   - Run checks: `make lint`.
   - If it fails due to formatting, fix it: `make fmt`.
   - Run all tests: `make test`.
   - Verify everything is clean: `make precommit`.
   - If changes were made, commit them: `git commit -am "style: fix quality failures"`.

3. **Merge into the primary branch:**
   - Switch to the primary branch (usually `main` or `master`).
   - Pull latest: `git pull origin <primary-branch>`
   - Merge the branch: `git merge <branch_name>`
   - **Conflict Resolution:** If conflicts occur:
     - List conflicted files: `git status`.
     - Read and resolve each conflict manually or using tools.
     - Add resolved files: `git add <file>`.
     - Complete the merge: `git commit`.

4. **Final Verification:**
   - Run `make precommit` on the merged primary branch to ensure no regressions.

5. **Cleanup:**
   - **Ask for acknowledgement before pushing changes.**
   - Push the primary branch: `git push origin <primary-branch>`.
   - Delete the local branch: `git branch -d <branch_name>`.
   - Delete the remote branch: `git push origin --delete <branch_name>`.

## Direct-push mode (when on the primary branch with uncommitted changes)

Use this when no `<branch_name>` is given and the user has told you to ship.

1. Stage and commit the changes with a Conventional Commit message.
2. Run `make lint`, `make fmt` (if needed), and `make precommit`.
   - If `make precommit` fails on macOS due to `nas_tools`-style privileged
     socket tests (`Operation not permitted`), use `make precommit-docker`
     instead for Linux-container parity with CI.
3. **Ask for acknowledgement before pushing.**
4. Push: `git push origin <primary-branch>`.

## Report

- Summarize the actions taken, including any conflicts resolved.
