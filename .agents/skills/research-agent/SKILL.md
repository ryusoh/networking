---
name: research-agent
description: Search, parse, and assemble structured study context from research/ courseware (cs231, cs232, cs233, cs234) with exact line-anchored citations. Use when researching networking or distributed systems concepts in this repository.
argument-hint: '[query or topic to study]'
---

# Research Agent

Systematically query and assemble context from courseware in `research/` (`cs231`, `cs232`, `cs233`, `cs234`) using the Phase 1-3 Research Agent tools.

{{args}} — the query or topic to investigate.

## Quick Tool Workflows

### 1. BM25 Lexical Search over Chunks

To find relevant slide sections, paper excerpts, or code blocks matching a query:

```bash
python3 tools/research/search_chunks.py "{{args}}" --limit 5
```

### 2. Assemble Bounded Study Scene Payload

To build a token-bounded prompt context with mandatory line-anchored Markdown citations (`[path#Lstart-Lend](file://...)`) for an LLM session:

```bash
python3 tools/research/scene_builder.py "{{args}}" --max-tokens 8192
```

### 3. Verify Generated Citations

To validate line-anchored citations in generated Markdown answers:

```bash
python3 tools/research/citation_engine.py "{{args}}"
```

### 4. Re-index Courseware Chunks (if files changed)

If Markdown sidecars, slides, or code files in `research/` have been updated:

```bash
python3 tools/research/parse_chunks.py
```

## Citation Requirement

All answers, protocol explanations, and code breakdowns derived from `research/` materials MUST include line-anchored Markdown citations formatted as:
`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`
