---
name: anki
description: Automatically generates and ingests 5 high-quality, bilingual (Chinese/English) flashcards into the Anki '金融' deck using the research agent pipeline.
---

# Autonomous Anki Flashcard Ingestion Skill (/anki)

Executes the complete Anki card generation and ingestion pipeline over `research/` courseware, generating 5 high-density, non-duplicate, citation-anchored flashcards directly into the target Anki deck (**金融**).

## Quick Execution Command

Run the candidate generator script to output a draft package for agentic review, then validate it before import:

```bash
python3 tools/research/anki_generator.py --count 5 --deck "金融" --tsv
python3 tools/research/anki_card_validator.py research/anki_import.txt
```

## Workflow Execution Protocol

1. **Quality & Deduplication Check:**
   - Select unvisited chunks using `research/.anki_coverage.json`.
   - Inspect local SQLite `collection.anki2` and active AnkiConnect (`http://127.0.0.1:8765`) to ensure zero title collision.
   - Enforce the **Quality Gate** (`is_high_quality_chunk`) to reject zero-info outlines, TOC dots, presenter lists, build/test instructions, figure captions, or low-density metadata.

2. **Agent Quality Review, Candidate Rejection & Web Enhancement Loop (MANDATORY BEFORE IMPORT):**
   - Immediately inspect the generated candidate draft batch (`research/anki_import.txt`).
   - Run the automated validator first: `python3 tools/research/anki_card_validator.py research/anki_import.txt`. Any reported issue is a hard reject unless you can manually rewrite the card.
   - Apply LLM judgment to reject any cards containing:
     - **Presentation titles / slide numbers** (e.g., `Network Layer 4-107`, `Wireless, Mobile Networks 6-58`, `BGP basics`, `LSA Updates`).
     - **Generic outline summaries** (e.g., topic labels without a concrete question, table of contents dots).
     - **Slide date stamps** (e.g., `8/13/2008`, `Winter 2001 ICS 243E`).
     - **PDF extraction artifacts**: control characters (`peers`, `path vector`, `route` with box glyphs), router ID lists (`1b 1d 1c 1a...`), slide footer text (`5-59 Network Layer: Control Plane`).
     - **ASCII diagrams / tables** (e.g., bit-field layouts `0 8 16 24`, `type = 9 code = 0 checksum`).
     - **OCR fragments** (`limi e due to the`, `q frequent`, `Ø Dynamics`).
     - **C/Go code fragments without context**, build instructions, or boilerplate fallback text.
     - **Question/answer mismatch** (e.g., front asks for "4 级选路优先级决策链" but back only lists AS-PATH/NEXT-HOP).
   - **Never import to Anki without completing this Agentic Review step.**
   - If any junk cards are detected, mark their chunk IDs as `skipped_low_quality` in `research/.anki_coverage.json` and re-run candidate selection until 5 high-value technical cards pass inspection.
   - For brief or high-density technical concepts, execute `search_web` to retrieve production engineering context, RFC standards, or practical pain points to enrich the card's explanation.

3. **Bilingual Card Formatting & Automatic Execution:**
   - Render bilingual Chinese-primary HTML cards with English technical terms, LaTeX delimiters (`\(...\)`), and line-anchored citations (`[path#Lstart-Lend](file://...)`).
   - **Preferred:** Inject directly into the **`金融`** deck via AnkiConnect REST API (`http://127.0.0.1:8765`) if the AnkiConnect add-on is installed. AnkiConnect gives immediate confirmation, so the chunk status becomes `imported`.
   - **Fallback (no AnkiConnect):** Automatically launch Anki with the TSV file via `open -a Anki research/anki_import.txt`. Never ask the user to manually run the launch command. The user must click **Import** in the Anki import dialog. The chunk status stays `pending_import` until verified.
   - **Verify the import immediately:** Run `python3 tools/research/anki_import_verifier.py`. It reads the local `collection.anki2`, matches the generated fronts, and flips `pending_import` → `imported`.
   - **Do not generate a new batch while any `pending_import` chunks exist.** If verification still shows missing cards, the previous TSV import was not completed; resolve it before continuing.

4. **Database Safety Non-Negotiable:**
   - **NEVER attempt raw SQLite `INSERT`/`UPDATE` mutations directly on live `collection.anki2` or `collection.anki21b` files.** Raw direct SQLite writes cause database lock collisions, corrupt index collations (`unicase`), and disrupt Anki's V3 scheduler database.
   - **Always use safe ingestion mechanisms:**
     1. AnkiConnect REST API (`http://127.0.0.1:8765`) via `addNotes`.
     2. TSV Package Export (`research/anki_import.txt`) with `#separator:Tab` and `#html:true`, launched via `open -a Anki research/anki_import.txt`.
   - **Automatic Backups Location:** Profile backups are safely stored at `~/Library/Application Support/Anki2/<profile>/backups/*.colpkg`.
