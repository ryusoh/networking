---
name: anki
description: Automatically generates and ingests 5 high-quality, bilingual (Chinese/English) flashcards into the Anki '金融' deck using the research agent pipeline.
---

# Autonomous Anki Flashcard Ingestion Skill (/anki)

Executes the complete Anki card generation and ingestion pipeline over `research/` courseware, generating 5 high-density, non-duplicate, citation-anchored flashcards directly into the target Anki deck (**金融**).

## Quick Execution Command

Run the following one-liner command:

```bash
python3 tools/research/anki_generator.py --count 5 --deck "金融" --auto-launch
```

## Workflow Execution Protocol

1. **Quality & Deduplication Check:**
   - Select unvisited chunks using `research/.anki_coverage.json`.
   - Inspect local SQLite `collection.anki2` and active AnkiConnect (`http://127.0.0.1:8765`) to ensure zero title collision.
   - Enforce the **Quality Gate** (`is_high_quality_chunk`) to reject zero-info outlines, TOC dots, presenter lists, or low-density metadata.

2. **Agent Quality Review, Candidate Rejection & Web Enhancement Loop:**
   - Immediately inspect the generated card batch (`research/anki_import.txt`).
   - Apply LLM judgment to reject any cards containing presentation titles, generic outline summaries, slide date stamps (e.g., `8/13/2008`), or boilerplate fallback text.
   - If any junk cards are detected, mark their chunk IDs as `skipped_low_quality` in `research/.anki_coverage.json` and re-run candidate selection until 5 high-value technical cards pass inspection.
   - For brief or high-density technical concepts, execute `search_web` to retrieve production engineering context, RFC standards, or practical pain points to enrich the card's explanation.

3. **Bilingual Card Formatting & Automatic Execution:**
   - Render bilingual Chinese-primary HTML cards with English technical terms, LaTeX delimiters (`\(...\)`), and line-anchored citations (`[path#Lstart-Lend](file://...)`).
   - Inject directly into the **`金融`** deck via AnkiConnect REST API or automatically launch Anki via `open -a Anki research/anki_import.txt`. Never ask the user to manually run the launch command.
