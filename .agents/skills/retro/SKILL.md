---
name: retro
description: Retrospective — turn this session's friction into durable repo improvements (the compounding loop)
argument-hint: "[optional focus area, e.g. 'test setup' or 'ad-blocker rules']"
---

# Retrospective

You just finished a task. Run a **compounding-loop retrospective** so the next
task in this repo is closer to one-shot. Be honest and concrete, and prefer
patching the repo over re-explaining things in chat.

Work through these steps:

1. **Diagnose the friction.** Look back over this session and name the specific
   things that cost tokens or back-and-forth: wrong guesses, missing context,
   repeated verification, commands you had to discover, or edits that missed
   the target. Quote concrete moments rather than generalizing. If `{{args}}`
   is non-empty, focus there.

2. **Map each friction point to a durable artifact:**
   - `AGENTS.md` for repo conventions, gotchas, commands, layout, and
     per-subproject notes (`adblock`, `nas_proxy`, `retriever`, `vps_*`, etc.).
   - `.agents/skills/<name>/SKILL.md` for reusable multi-step workflows
     (regenerate `.claude/commands/` via `python3 tools/sync_commands.py`).
   - `docs/<topic>.md` (lower-kebab-case) for domain/architecture knowledge.
   - `Makefile` targets, lint/type gates, test fixtures, or `jest.setup.js` for
     repeated checks and scaffolding.

3. **Check what already exists first.** Read the relevant `AGENTS.md` section,
   `Makefile`, `docs/`, `package.json`, and skills before adding anything so
   you patch real gaps instead of duplicating. Repo knowledge belongs in
   version-controlled files rather than chat or memory.

4. **Implement the safe, high-leverage fixes now.** Knowledge capture, scoped
   commands, deduplication, and tests/gates are usually safe to apply directly.
   Promote standards up the ratchet: prose → checklist → lint/type rule →
   CI-blocking check — a gate makes the prose redundant, so shrink the prose
   when you add one.

5. **Ask before anything heavy or hard to reverse** — new dependencies, CI
   changes, directory restructures, or anything outward-facing.

6. **Verify and report.** Run the relevant checks (`npx prettier --check`,
   `make lint`, `make sync-check`, `make test` / `make test-py` as applicable)
   and summarize what changed, where the knowledge lives, and what remains for
   the user to decide. Leave committing to the user.

7. **Distill the session into a skill delta (ACE step).** Ask: "what did this
   session teach about _how_ to do X?" If the answer generalizes beyond this
   task, edit the existing `.agents/skills/*/SKILL.md` or `AGENTS.md` it
   belongs to rather than spawning a near-duplicate skill. Every line in an
   auto-loaded file is paid for in every session, so a line earns its place
   only if it is a repo/environment fact a capable model cannot infer, a user
   preference, or cheaper than rediscovery. Write it as the fact or goal
   ("`jest` stays pinned to v29"), rather than a new prohibition or an incident
   story (dates and PR numbers belong in commit messages and docs). When the
   section you touch already covers the point, merge or replace instead of
   appending. Run `python3 tools/sync_commands.py` and `make sync-check` after
   any skill edit.

Guiding test: _a correction given today should be impossible to need next
month_ — because it now lives in the repo, not in this conversation.
