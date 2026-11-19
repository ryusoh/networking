---
description: Turn a findings/analysis doc into mechanical, anchor-verified work orders that a cheaper implementation agent can execute without interpretation. Use when the user asks to compile, distill, or convert findings/recommendations into action items for later implementation.
argument-hint: '[path/to/findings.md]'
---

# Action items

Convert the improvements in **$ARGUMENTS** (or the findings doc from this
conversation) into implementation-ready work orders **in place** inside that
same doc, written so a cheaper implementation model can execute them
mechanically via `/implement-action-items`.

## Verify every anchor first

Read every target file right now and confirm every `Find` string, path, and
snippet against current file contents — spend authoring tokens up front so
the implementer pastes instead of searching or guessing.

## Format

Replace or extend the doc's action-items section with:

1. **Preamble for the implementer:** one work order per change; `Find` strings
   are unique anchors (report mismatches rather than improvising); line numbers
   may drift; exact format/lint commands (`npx prettier --write <file>`,
   `npx eslint <file>`); generated outputs (`coverage/`, `adblock/dist/`,
   `nas_proxy/out/`) and command logs stay out of edits and commits; commit
   locally after each item and leave pushing to the user.
2. **Numbered work orders**, ranked by impact, each tagged:
   - `[trivial]` — markup, config, or deletion only (include paste-ready
     snippets)
   - `[low]` — small logic change
   - `[visual]` — rendered extension UI or live network/hardware behaviour
     requiring human review afterward
   - `[skip]` — needs design judgment or new tests (two-line pointer only;
     routed to a stronger model)

   Each order specifies **File**, **Find** (exact unique anchor), **Change**,
   **Verify** (scoped commands like `npx jest adblock/__tests__/<file>`,
   `python3 -m pytest <package>/__tests__/<file> -q`, or
   `make -C nas_proxy test`), and a one-line guardrail for any verified trap
   (jsdom teardown hazards, tests shelling out to C binaries, privileged
   self-skipping tests). Keep Jest pinned at v29 and omit unrequested
   dependency/config changes (`AGENTS.md` #5, #6).

## Finish

Format the doc (`npx prettier --write <doc>`) and tell the user where the work
orders live and which items are tagged `[skip]`.
