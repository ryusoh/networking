---
description: Investigate a question against primary sources and write a cited Markdown findings doc. Use when the user asks you to research, investigate, or gather authoritative background on a topic.
argument-hint: "[question to investigate]"
---

# Research

Investigate a question thoroughly against **primary sources** and capture the
findings as a single cited Markdown file, so the answer is durable and
re-checkable instead of living only in chat.

$ARGUMENTS — the question to investigate.

## Run it in the background

Delegate the investigation to a background agent (Agent tool, `run_in_background:
true`) so you can keep working while it runs. Give the agent the question, the
primary sources to prefer, and the output location decided below.

## Investigate

- Consult **official documentation, source code, specifications, and first-party
  APIs** — not secondary interpretations, blog posts, or Q&A sites. Trace every
  claim to its authoritative origin.
- For questions about this repo's own subsystems, the primary source is the code
  under the relevant subproject (`clean_adblock/`, `nas_proxy/`, `nas_tools/`,
  `retriever/`, `vps_kernel_proxy/`, `vps_user_proxy/`, `tianditu_bypass/`, etc.)
  plus the governing doc under `docs/` (`EBPF_RESEARCH.md`, `NAS_STRATEGY.md`) —
  see `CLAUDE.md` and `GEMINI.md` for the full layout and conventions.
- For anything about Claude / the Anthropic API, the `claude-api` skill is the
  primary source — use it rather than answering from memory.

## Document

Compile findings into **one Markdown file** with a source citation for each
claim (URL, file path, or spec section). Structure: the question, the answer,
then claim-by-claim evidence with citations, and an explicit "open questions /
what I couldn't verify" section.

## Store

Save following this repo's convention: durable subsystem knowledge lives under
`docs/` (the same place `EBPF_RESEARCH.md` and `NAS_STRATEGY.md` live). If the
finding maps to an existing doc, extend it rather than creating a duplicate; if
it's a genuinely new area, add a new `docs/<topic>.md` and note the location in
your reply. For throwaway investigation that doesn't belong in version control,
use the session scratchpad instead.

## Output constraints

- Quote verbatim source language sparingly — **max ~125 characters** per quote,
  in quotation marks; paraphrase otherwise.
- Respect open-source licenses; don't reproduce whole files or long passages.
- Report what you found and what you couldn't verify — no legal interpretation,
  no filling gaps with plausible-sounding guesses.
