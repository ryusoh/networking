---
name: anki
description: Automatically generates and ingests 5 high-quality, Chinese-primary flashcards into the Anki '金融' deck using the research agent pipeline.
---

# Autonomous Anki Flashcard Ingestion Skill (/anki)

Executes the complete Anki card generation and ingestion pipeline over
`research/` courseware, generating 5 high-density, non-duplicate,
citation-anchored flashcards into the target Anki deck (**金融**).

## Core rule

**Code never writes card prose. The LLM authors cards; code only retrieves,
validates, tracks, and imports.** The generator emits candidate chunks; the
agent reads them and writes `research/anki_cards.jsonl`; the validator and
`--import` gate imports.

## Quick execution command

```bash
# 1. Emit candidate chunks (JSONL) — marks chunks as "candidate"
python3 tools/research/anki_generator.py --count 5 --deck "金融"

# 2. Read research/anki_candidates.jsonl and author cards to research/anki_cards.jsonl
#    One JSON object per line: {chunk_id, front, back, tags, citation}

# 3. Validate the authored cards (hard gate — --import refuses while issues exist)
python3 tools/research/anki_card_validator.py research/anki_cards.jsonl

# 4. Reject junk chunks by id (requires --reason CATEGORY)
python3 tools/research/anki_generator.py --reject-chunk <chunk_id> --reason <CATEGORY>

# 5. Import reviewed cards via AnkiConnect (marks chunks "imported")
python3 tools/research/anki_generator.py --import --deck "金融"
```

`--reason` must be one of:
`title-slide | metadata-dump | author-block | diagram | ocr-fragment |
date-stamp | outline | qa-mismatch | duplicate | other`.

## Workflow execution protocol

### 1. Quality & deduplication check

- Select unvisited chunks using `research/.anki_coverage.json`.
- Inspect local SQLite `collection.anki2` and active AnkiConnect
  (`http://127.0.0.1:8765`) to ensure zero title collision.
  - Enforce the **Quality Gate** (`is_high_quality_chunk`) to reject
    zero-info outlines, TOC dots, presenter lists, build/test instructions,
    figure captions, or low-density metadata.

### 2. Agent authoring (the only card-writing step)

- Read every candidate in `research/anki_candidates.jsonl` in full,
  including its `content` and `citation`.
  - Author each card as one JSON line in `research/anki_cards.jsonl` with
    fields: `chunk_id`, `front`, `back`, `tags`, `citation`.
  - Front must be a real question (not a topic label or paper title). Back
    must be Chinese-primary HTML with LaTeX `\(...\)` where useful and a
    line-anchored citation (`[path#Lstart-Lend](file://...)`).
  - If a candidate is too fragmented to rescue, **reject it** with
    `--reject-chunk <chunk_id> --reason <CATEGORY>` instead of writing a bad
    card.

#### Card format contract (enforce on every card)

The validator enforces these rules; the import refuses cards that violate
them. Author cards to this density target:

- **Front:** bilingual title + concrete question. Use either
  `<strong>中文概念 (English Term)</strong>: 具体问题？` or
  `<strong>English Term</strong>: 中文具体问题？`.
  Never a bare Chinese question without an English term annotation.
- **Back:** at least 3 dense sections, each introduced by a `<b>section
name:</b>` header. Write the body in Chinese prose; use `<b>` to emphasize
  key **Chinese** terms. Do not append English glosses.
- **English annotations (machine-gated, cap = 2 per back):** annotate a term
  in English ONLY if a domain reader would not already know it — i.e.
  acronym expansions on first use (exempt from the cap) and rare specialized
  nomenclature with no settled Chinese rendering (e.g. `时谐场 (time-harmonic
field)`). Basic vocabulary — `latency`, `deadline`, `aggregation`,
  `overhead`, `real-time system` — needs no annotation; the reader is a
  networking professional. The validator rejects any back with more than 2
  non-acronym English parentheticals (`Back sprinkles N English
annotations`). When in doubt, do NOT annotate.
- **Acronyms:** expand every acronym on first use, in the front or in the
  back (e.g. `NITRD (Networking and Information Technology Research and
Development)`). An acronym that appears in the front but is never expanded
  anywhere is a reject.
- **End with** a `源码与文档引用 (Source Citation):` section containing the
  line-anchored Markdown link.

Example (good):

```json
{
  "chunk_id": "research/cs231/parallel-fft.md:chunk-1",
  "front": "并行二维 FFT 的块转置 (Parallel 2D-FFT Block Transpose): 处理器 \\(P_i\\) 需要把块 \\(B_{ij}\\) 发送给谁？",
  "back": "<div><b>通信模式:</b></div><div>\\(P_i\\) 将块 \\(B_{ij}\\) 发送给 \\(P_j\\)（\\(j \\neq i\\)），实现<b>按行分布到按列分布</b>的切换。</div><div><b>复杂度:</b></div><div>基本顺序循环需要 \\(O(k^2)\\) 次块传输；按 \\(i\\) 或 \\(j\\) 并行化仅改变启动维度，<b>不减少总传输量</b>。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs231/parallel-fft.md#L103-L167](file:///.../parallel-fft.md#L103-L167)</div>",
  "tags": ["research", "cs231"],
  "citation": "research/cs231/parallel-fft.md#L103-L167"
}
```

Example (bad — low density, no sections, English summary paragraph):

```json
{
  "front": "并行二维 FFT 中，如何将矩阵分配给多个处理器？",
  "back": "将矩阵划分为方块，每个处理器负责一行。Data Distribution: an n×n matrix is partitioned into blocks.<br><br>来源：[...](file://...)"
}
```

### 3. Agent quality review (mandatory before import)

- Immediately inspect the authored `research/anki_cards.jsonl`. **Read every
  card's front AND back in full — never approve from a truncated print.**
  - Run the automated validator:
    `python3 tools/research/anki_card_validator.py research/anki_cards.jsonl`.
    Any reported issue is a hard reject unless you rewrite the card.
  - `--import` re-runs the validator, so "validator green" is necessary, not
    sufficient — your full-text judgment is the second gate.
  - Reject a card for a **bad artifact, not a bad topic**: a famous concept
    does not redeem a card whose front is a raw title or whose back is an
    abstract/metadata dump. Judge the last card of the batch as strictly as
    the first.
  - Reject categories include:
    - Presentation titles / slide numbers
      (`Network Layer 4-107`, `Wireless, Mobile Networks 6-58`, `BGP basics`).
    - Generic outline summaries or topic labels without a concrete question.
    - Slide date stamps (`8/13/2008`, `Winter 2001 ICS 243E`).
    - PDF extraction artifacts: control characters, router ID lists
      (`1b 1d 1c 1a...`), slide footer text.
    - ASCII diagrams / tables.
    - OCR fragments (`limi e due to the`, `q frequent`, `Ø Dynamics`).
    - Paper metadata dumps: author/affiliation blocks,
      `Categories and Subject Descriptors`, `General Terms:`,
      `1. INTRODUCTION` spilling into the back.
    - Code fragments without context, build instructions, boilerplate fallback.
    - Question/answer mismatch.
  - **Never import to Anki without completing this review step.**
  - For brief or high-density concepts, use `search_web` to enrich the card.

### 4. Import & state hygiene

- Import only with `python3 tools/research/anki_generator.py --import --deck "金融"`.
- The generator refuses to emit new candidates while any chunks are in
  `"candidate"` or `"pending_import"` status. Resolve the current batch
  first.
  - **Never hand-edit `research/.anki_coverage.json`.** Use CLI verbs only
    (`--import`, `--reject-chunk`, verifier). This is the same discipline as
    never writing raw SQLite to `collection.anki2`.
  - Verify imports with `python3 tools/research/anki_import_verifier.py`.
  - If AnkiConnect is unavailable, `--import` falls back to launching Anki
    with the legacy TSV file (`research/anki_import.txt`). Do not ask the user
    to run the launch command manually.

### 5. Database safety non-negotiable

- **Never** run raw SQLite `INSERT`/`UPDATE` on live
  `collection.anki2` / `collection.anki21b` files.
  - Use only AnkiConnect `addNotes` or the TSV package export path.
  - Profile backups live at
    `~/Library/Application Support/Anki2/<profile>/backups/*.colpkg`.
