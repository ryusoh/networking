---
name: ship
description: Ship a branch — check quality, merge to main, and clean up the branch
argument-hint: '<branch_name>'
---

# Ship Branch

You are tasked with shipping a branch. Follow these steps precisely:

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

3. **Merge into Main:**
   - Switch to main: `git checkout main`
   - Pull latest: `git pull origin main`
   - Merge the branch: `git merge <branch_name>`
   - **Conflict Resolution:** If conflicts occur:
     - List conflicted files: `git status`.
     - Read and resolve each conflict manually or using tools.
     - Add resolved files: `git add <file>`.
     - Complete the merge: `git commit`.

4. **Final Verification:**
   - Run `make precommit` on the merged `main` branch to ensure no regressions.

5. **Cleanup:**
   - **Ask for acknowledgement before pushing changes.**
   - Push main: `git push origin main`.
   - Delete the local branch: `git branch -d <branch_name>`.
   - Delete the remote branch: `git push origin --delete <branch_name>`.

6. **Report:**
   - Summarize the actions taken, including any conflicts resolved.
