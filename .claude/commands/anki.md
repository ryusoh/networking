---
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
   - Enforce the **Quality Gate** (`is_high_quality_chunk`) to reject zero-info outlines, TOC dots, or low-density metadata.

2. **Agent Quality Review & Web Enhancement:**
   - Apply non-deterministic LLM judgment to verify technical substance.
   - For brief or high-density technical concepts, execute `search_web` to retrieve production engineering context, RFC standards, or practical pain points.

3. **Bilingual Card Formatting & Direct Ingestion:**
   - Render bilingual Chinese-primary HTML cards with English technical terms, LaTeX delimiters (`\(...\)`), and line-anchored citations (`[path#Lstart-Lend](file://...)`).
   - Inject directly into the **`金融`** deck via AnkiConnect REST API (auto-launching `/Applications/Anki.app` if GUI is closed).
