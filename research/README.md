# Research / Courseware Data Directory

This directory holds the raw courseware and runtime artifacts for the
networking/distributed-systems research pipeline. It is **data only**; the code
that processes it lives elsewhere.

## What lives where

| Kind | Location | Purpose |
| :--- | :--- | :--- |
| Courseware data | `research/cs231-distributed-systems/`, `research/cs232-computer-networks/`, `research/cs233-networking-laboratory/`, `research/cs234-advanced-networks/` | Markdown sidecars, slides, readings, and source files consumed by the pipeline. |
| Chunk manifest | `research/.chunks_manifest.json` | Parsed chunk metadata produced by `tools/research/parse_chunks.py`. |
| Anki pipeline artifacts | `research/anki_candidates.jsonl`, `research/anki_cards.jsonl`, `research/anki_review.jsonl`, `research/.anki_coverage.json` | Candidate chunks, agent-authored cards, review log, and coverage state. |
| Durable memory | `research/.durable_memory.json` | Student mastery records produced by `tools/research/memory_host.py`. |
| Implementation | `tools/research/` | All Python scripts: parser, indexer, scene builder, citation engine, memory host, Anki generator/validator, etc. Scripts that import sibling modules under `tools.research` add the repo root to `sys.path` so they can be invoked directly as `python3 tools/research/<script>.py` from the repository root. |
| Specifications | `../docs/research/anki-card-pipeline-spec.md`, `../docs/research/research-agent-spec.md` | Canonical architecture and data-contract specs. |
| User manual | `../docs/research/research-anki-skills-usage-guide.md` | Step-by-step usage of the `research-agent` and `anki` slash-command skills. |
| Skills | `.agents/skills/research-agent/SKILL.md`, `.agents/skills/anki/SKILL.md` | Interactive agent skill definitions. |

## Entry points

- Search / scene assembly / citation verification:
  `tools/research/search_chunks.py`, `tools/research/scene_builder.py`,
  `tools/research/citation_engine.py`
- Anki card generation and import:
  `tools/research/anki_generator.py`, `tools/research/anki_card_validator.py`
- Curriculum graph and cross-course synthesis:
  `tools/research/curriculum_service.py`, `tools/research/synthesis_service.py`

See `../docs/research/research-agent-spec.md` and `../docs/research/anki-card-pipeline-spec.md` for the
authoritative descriptions of each subsystem and how they interact.

## Safety rules

- **Never execute raw SQLite `INSERT`/`UPDATE` mutations directly on live Anki
  collections** (`collection.anki2` / `collection.anki21b`); use the
  AnkiConnect REST API or TSV/APKG package export (`open -a Anki`) to prevent
  database lock collisions and collation errors.
- **Testing hygiene:** commands like `anki_generator.py --count/--import`,
  `anki_density_baseline.py`, and `memory_host.py --record*` mutate
  `research/.anki_coverage.json`, `research/.anki_density_baseline.json`, and
  `research/.durable_memory.json`. Tests must use temp paths (monkeypatch
  `DEFAULT_MEMORY_PATH` / `DEFAULT_COVERAGE_PATH` / `DEFAULT_BASELINE_CACHE_PATH`
  or pass explicit paths); when testing manually, back up these files first and
  restore them afterward.
