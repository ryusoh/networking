---
name: anki
description: Automatically generates and ingests 5 high-quality, bilingual (Chinese/English) flashcards into the Anki '金融' deck using the research agent pipeline.
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

1. **Quality & deduplication check:**
   - Select unvisited chunks using `research/.anki_coverage.json`.
   - Inspect local SQLite `collection.anki2` and active AnkiConnect
     (`http://127.0.0.1:8765`) to ensure zero title collision.
   - Enforce the **Quality Gate** (`is_high_quality_chunk`) to reject
     zero-info outlines, TOC dots, presenter lists, build/test instructions,
     figure captions, or low-density metadata.

2. **Agent authoring (the only card-writing step):**
   - Read every candidate in `research/anki_candidates.jsonl` in full,
     including its `content` and `citation`.
   - Author each card as one JSON line in `research/anki_cards.jsonl` with
     fields: `chunk_id`, `front`, `back`, `tags`, `citation`.
   - Front must be a real question (not a topic label or paper title). Back
     must be Chinese-primary bilingual HTML with English technical terms, LaTeX
     `\(...\)` where useful, and a line-anchored citation
     (`[path#Lstart-Lend](file://...)`).
   - If a candidate is too fragmented to rescue, **reject it** with
     `--reject-chunk <chunk_id> --reason <CATEGORY>` instead of writing a bad
     card.

3. **Agent quality review (mandatory before import):**
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

4. **Import & state hygiene:**
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

5. **Database safety non-negotiable:**
   - **Never** run raw SQLite `INSERT`/`UPDATE` on live
     `collection.anki2` / `collection.anki21b` files.
   - Use only AnkiConnect `addNotes` or the TSV package export path.
   - Profile backups live at
     `~/Library/Application Support/Anki2/<profile>/backups/*.colpkg`.
