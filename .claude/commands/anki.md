---
description: Automatically generates and ingests 5 high-quality, Chinese-primary flashcards into the Anki '金融' deck using the research agent pipeline.
---

# Autonomous Anki Flashcard Ingestion Skill (/anki)

Generate and import up to 5 high-density, deduplicated, citation-anchored
Chinese-primary flashcards from `research/` courseware into the **金融** deck.

## Core contract

**LLM authors card prose; code retrieves, validates, tracks, and imports.**
`anki_generator.py` emits candidate chunks to `research/anki_candidates.jsonl`,
you author `research/anki_cards.jsonl`, and the validator, density gate, and
`--import` command gate what enters Anki.

## Pipeline commands

```bash
# 1. Emit candidate chunks (marks chunks "candidate"; checks .anki_coverage.json + AnkiConnect/SQLite dedup)
python3 tools/research/anki_generator.py --count 5 --deck "金融"

# 2. Read research/anki_candidates.jsonl in full and overwrite research/anki_cards.jsonl
#    Schema per line: {chunk_id, front, back, tags, citation}

# 3. Structural validation (hard gate — --import refuses while issues exist)
python3 tools/research/anki_card_validator.py research/anki_cards.jsonl

# 4. Density gate against deck baseline (emits research/anki_density_verdicts.jsonl)
python3 tools/research/anki_density_gate.py --cards research/anki_cards.jsonl

# 5. Reject junk chunks in batch (requires --reason CATEGORY)
python3 tools/research/anki_generator.py --reject-chunk <id1> <id2> --reason <CATEGORY>

# 6. Import reviewed, density-accepted cards via AnkiConnect (pass --auto-launch if Anki is closed)
python3 tools/research/anki_generator.py --import --deck "金融"

# 7. Verify imported notes
python3 tools/research/anki_import_verifier.py
```

Valid `--reason` categories:
`title-slide | metadata-dump | author-block | diagram | ocr-fragment | date-stamp | outline | qa-mismatch | duplicate | other`.

## Authoring and batch-loop workflow

1. **Read every candidate in full** (`content` and `citation`). Reject
   unrescuable junk chunks (`--reject-chunk id1 id2 ... --reason <CATEGORY>` in
   one call) instead of authoring thin cards.
2. **Budget regeneration to at most 2 rounds per run.** If round 2 still yields
   no usable candidates, author cards from the best candidates seen (fewer than
   5 is fine) or report the region exhausted.
3. **Mixed keep/reject batches are two-phase:** `--count` refuses while any
   chunk stays in `"candidate"` or `"pending_import"` status. Author, validate,
   and `--import` the keepers first, then request `--count <remaining>` for
   replacements in a fresh batch.
4. **Enrich brief high-density concepts** with `search_web` when textbook/RFC
   specifics add concrete mechanism detail.

## Card format and substance contract

Enforced by `anki_card_validator.py` and `anki_density_gate.py`:

- **Mechanism-first technical substance:** explain concrete engineering
  mechanisms — state transitions, message flows, packet headers/bitfields,
  algorithm steps, LaTeX formulas (`\(...\)`), complexity `O(...)`, hardware
  architectures, or quantitative trade-offs. Skip definitional fluff, survey
  bullets, or open-ended taxonomy prompts ("什么是上下文感知？"); reject
  shallow outline chunks (`--reason outline`) or enrich with primary specs.
- **Front:** `<strong>中文概念</strong>: 具体机制问题？` — Chinese concept title
  plus a concrete mechanism question (e.g.
  `<strong>TCP 拥塞控制</strong>: TCP Reno 在快速恢复阶段收到重复 ACK 时如何调整 \(cwnd\)？`).
  English in the title is restricted to acronyms, single-token standard names
  (`FFT`, `CSMA/CD`, `Dijkstra`), or acronym expansions
  (`WSN (Wireless Sensor Network)`). Multi-word translated glosses
  (`(Analytic Deployment Problem)`) fail validation; default to pure Chinese.
- **Back:** at least 2 dense sections (ideally 3+), each headed by
  `<b>section name:</b>`, in Chinese prose with `<b>` highlighting key Chinese
  terms.
- **English annotations (cap = 2 per back):** add English parentheticals only
  for acronym expansions (exempt from the cap) and rare specialized terms with
  no settled Chinese rendering (`时谐场 (time-harmonic field)`). Omit basic
  vocabulary (`latency`, `deadline`, `aggregation`, `overhead`).
- **Acronyms:** expand every acronym on first use anywhere on the card via an
  English parenthetical whose word initials subsequence-match
  (`GPS (Global Positioning System)` — Chinese parentheticals do not match).
  Only `COMMON_ACRONYMS` in `anki_card_validator.py` (TCP, DNS, GSM, LTE, WiFi,
  GPS, ...) are exempt; coinages like `LBS`, `LPWAN`, `DIKW` require expansion.
  Prefer Chinese over hyphenated Latin tokens (`cell-ID` extracts a bare `ID` →
  write `蜂窝小区标识`).
- **Citation:** end the back with `源码与文档引用 (Source Citation):` and a
  line-anchored link `[path#Lstart-Lend](file://...)`.
- **Tags (`CANONICAL_TAGS` in `tools/research/anki_card_validator.py`):**
  `research` + flat course code (`cs231`/`cs232`/`cs233`/`cs234`) + 0–2
  canonical concept tags (`tcp`, `routing`, `congestion_control`,
  `distributed_systems`, `consensus`, ...).

Example:

```json
{
  "chunk_id": "research/cs231/parallel-fft.md:chunk-1",
  "front": "<strong>并行二维 FFT 的块转置</strong>: 处理器 \\(P_i\\) 需要把块 \\(B_{ij}\\) 发送给谁？",
  "back": "<div><b>通信模式:</b></div><div>\\(P_i\\) 将块 \\(B_{ij}\\) 发送给 \\(P_j\\)（\\(j \\neq i\\)），实现<b>按行分布到按列分布</b>的切换。</div><div><b>复杂度:</b></div><div>基本顺序循环需要 \\(O(k^2)\\) 次块传输；按 \\(i\\) 或 \\(j\\) 并行化仅改变启动维度，<b>不减少总传输量</b>。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs231/parallel-fft.md#L103-L167](file:///.../parallel-fft.md#L103-L167)</div>",
  "tags": ["research", "cs231"],
  "citation": "research/cs231/parallel-fft.md#L103-L167"
}
```

## Pre-import review

Before running `--import`, read every card's front and back in full (skipping
truncated summaries), run both `anki_card_validator.py` and
`anki_density_gate.py`, and rewrite any card flagged `enrich`/`consolidate`.
Reject bad artifacts regardless of topic prestige, applying the same bar to the
last card as the first:

- Presentation titles/slide numbers (`Network Layer 4-107`, `BGP basics`),
  slide date stamps (`8/13/2008`), or topic labels without a concrete question.
- PDF/OCR artifacts (control chars, router ID dumps `1b 1d 1c 1a...`, garbled
  OCR like `limi e due to the`), ASCII diagrams/tables, slide footers.
- Paper metadata dumps (author blocks, `Categories and Subject Descriptors`,
  `General Terms:`, `1. INTRODUCTION` spillover), context-free code/build
  snippets, or Q/A mismatches.
- Invented multi-word English glosses or unexpanded acronyms.

## State and database safety

- **Overwrite `research/anki_cards.jsonl` fresh each run:** `--import` consumes
  every line in the file, so stale lines from prior runs would import as
  duplicates.
- **State mutations via CLI only:** mutate `research/.anki_coverage.json`
  exclusively through `anki_generator.py` (`--import`, `--reject-chunk`) and
  `anki_import_verifier.py`.
- **Database safety:** write to Anki exclusively via AnkiConnect `addNotes`
  (`--import`, with `--auto-launch` if Anki is closed) or the legacy TSV export
  fallback (`--front`/`--back`); keep live `collection.anki2` /
  `collection.anki21b` untouched by raw SQLite writes. Backups live at
  `~/Library/Application Support/Anki2/<profile>/backups/*.colpkg`.
