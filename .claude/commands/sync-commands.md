---
description: Regenerate .claude/commands (Claude Code) from the canonical .agents/skills sources
---

Edit canonical skills in `.agents/skills/<name>/SKILL.md`, regenerate
`.claude/commands/` with `python3 tools/sync_commands.py`, and confirm freshness
with `make sync-check`.
