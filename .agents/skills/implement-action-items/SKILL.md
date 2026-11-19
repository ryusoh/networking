---
name: implement-action-items
description: Execute the work orders in an action-items doc one at a time, verifying and committing after each item without pushing. Use when the user points you at a doc containing tagged work orders (Find/Change/Verify) and asks you to implement them.
argument-hint: '[path/to/action-items.md]'
---

# Implement action items

Execute the work orders in **{{args}}** (or the doc from the conversation) in
order, one at a time. You are the implementer: the authoring agent verified
the anchors and snippets, so apply them literally and report anything that
mismatches rather than redesigning it.

Invoking this skill (including via `/goal`) authorizes a local commit per
verified work order. Pushing stays with the user.

## Per work order

1. **Tags.** `[skip]` → record as skipped (routed to a stronger model).
   `[visual]` → implement and flag "needs human/hardware review" in the report.
2. **Anchor.** Match the exact `Find` string in the named file. On any mismatch,
   stop that item, record the mismatch, and move to the next item — the author
   fixes work orders, not you.
3. **Change.** Make exactly the stated change within its single subproject
   (`AGENTS.md` #2), leaving generated outputs (`coverage/`, `adblock/dist/`,
   `nas_proxy/out/`) untouched.
4. **Verify.** Run the item's **Verify** commands plus the preamble's
   format/lint commands. On failure, apply the item's fallback once if provided;
   otherwise undo your own edits (confirming with `git diff <file>` that every
   hunk is yours), record the failure, and move on.
5. **Commit that item alone.** Stage only the files you changed
   (`git add <file>`), commit with a Conventional Commits subject
   (`type(scope): summary`, lower-case imperative, ≤ 72 chars, subproject
   scope) and the work-order number in the body. Leave earlier commits and the
   remote untouched.

## Final report

List each work order as done (commit hash) / skipped (`[skip]`) / failed
(anchor mismatch or red verification, with the failing command's output).
Report only what you verified this run.

## Resume protocol

After an interruption or compaction: inspect `git status --short`,
`git log -n 5 --oneline`, and the state ledger
(`python3 -m tools.task_harness status <task-id>`, or `.agents/state/<task>.json`
and the governing doc) to locate the first work order without a commit. State
its number, target file, and Verify command before calling tools.

## Unattended runs

The user may wrap this skill in `/goal` for a hands-off sweep (criterion: all
non-`[skip]` items committed with Verify commands green); keep this skill
harness-agnostic.
