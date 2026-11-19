---
name: research
description: Investigate a question against primary sources and write a cited Markdown findings doc. Use when the user asks you to research, investigate, or gather authoritative background on a topic.
argument-hint: '[question to investigate]'
---

# Research

Investigate **{{args}}** against **primary sources** and capture the findings
as a single cited Markdown file so the answer stays durable and re-checkable.

## Run it in the background

Delegate the investigation to a background subagent so you can keep working
while it runs. Provide the question, preferred primary sources, and target
output location.

## Investigate

- Consult **official documentation, source code, specifications, and first-party
  APIs**, tracing every claim to its authoritative origin rather than secondary
  write-ups.
- For this repo's own subsystems, read the code under the relevant subproject
  (`adblock/`, `nas_proxy/`, `nas_tools/`, `retriever/`, `vps_kernel_proxy/`,
  `vps_user_proxy/`, `tools/`) plus the governing doc in `docs/`
  (`ebpf-research.md`, `nas-strategy.md`, `gates.md`, `ci-gotchas.md`).

## Document and store

Compile findings into **one Markdown file** with a source citation per claim
(URL, file path, or spec section): question, answer, claim-by-claim evidence,
and an explicit "open questions / unverified" section.

- Save durable subsystem knowledge under `docs/` using lower-kebab-case
  filenames (`tools/__tests__/test_docs_naming.py`). Extend an existing doc when
  the topic fits; otherwise add `docs/<topic>.md` and report its path.
- If ranked action items are requested, add an `## Action items` section inside
  the same doc rather than spawning a second file. Use the session scratchpad
  for throwaway notes.
- Format with `npx prettier --write <doc>` and verify any `tools/` or `bin/`
  script references exist (`tools/__tests__/test_doc_tool_references.py`).

## Output constraints

- Quote verbatim source text sparingly (**max ~125 characters** per quote, in
  quotation marks); paraphrase otherwise and respect open-source licenses.
- Report verified findings and explicit gaps, omitting legal interpretation or
  unverified speculation.
