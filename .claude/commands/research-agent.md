---
description: Search, parse, and assemble structured study context from research/ courseware (cs231, cs232, cs233, cs234) with exact line-anchored citations. Use when researching networking or distributed systems concepts in this repository.
argument-hint: '[query or topic to study]'
---

# Research Agent

Query and assemble cited study context from `research/` courseware (`cs231`,
`cs232`, `cs233`, `cs234`) using `tools/research/`. Target: **$ARGUMENTS**.

## Tool workflows

### 1. Lexical and hybrid search over chunks

```bash
python3 tools/research/search_chunks.py "$ARGUMENTS" --limit 5
python3 tools/research/search_chunks.py "$ARGUMENTS" --rrf --limit 5   # BM25 + dense RRF
```

**BM25 query tactics:**

- Query with focused keywords per concept (`"IntServ integrated services RSVP"`)
  rather than one multi-concept natural-language sentence that buries the
  lower-coverage term.
- Expand textbook aliases when a term misses (e.g. Kurose Ch. 7 uses
  "Per-Connection QoS Guarantees / Resource Reservation and Call Admission"
  instead of "IntServ"; retry with mechanism names like `RSVP`, `admission control`).
- Fall back to `Grep` over `research/` (`Integrated Services|RSVP`) for exact
  strings buried by BM25 ranking.

### 2. Bounded study scene, citations, and curriculum

```bash
# Token-bounded context payload with line-anchored citations
python3 tools/research/scene_builder.py "$ARGUMENTS" --max-tokens 8192

# Cross-course comparison scene
python3 tools/research/synthesis_service.py "Paxos consensus" "SDN controller consistency" --max-tokens 8192

# Validate line-anchored citations in Markdown answers
python3 tools/research/citation_engine.py "$ARGUMENTS"

# Query prerequisite graph
python3 tools/research/curriculum_service.py --before "paxos_consensus" --transitive

# Re-index chunks after research/ files change
python3 tools/research/parse_chunks.py
```

### 3. Student durable memory and mastery matrix

```bash
python3 tools/research/memory_host.py --student "default_user"
python3 tools/research/memory_host.py --student "default_user" --record \
  --module "cs234" --topic "b4_traffic_engineering" --score 0.95
```

### 4. Generate and ingest Anki flashcards

Follow `/anki` for the full card-format contract, rejection categories, and DB
safety rules. Core commands:

```bash
python3 tools/research/anki_generator.py --count 5 --deck "金融"
python3 tools/research/anki_card_validator.py research/anki_cards.jsonl
python3 tools/research/anki_generator.py --import --deck "金融"
python3 tools/research/anki_generator.py --reject-chunk <chunk_id> --reason <CATEGORY>
python3 tools/research/anki_generator.py --status
```

When enriching brief or high-density concepts (`B4 WAN`, `Paxos Consensus`,
`NAPI`, `Clos Topology`) via `search_web`:

- Author cards yourself in `research/anki_cards.jsonl` (avoid boilerplate
  template fronts) and read every front and back in full before import.
- Add synthesized production/RFC context under **背景与痛点 (Motivation & Pain
  Points)** and **核心机制 (Core Mechanism)** alongside courseware citations.
- Record provenance in the card's `external_sources` JSONL field:
  `[{"url": ..., "retrieved": "YYYY-MM-DD", "claim": "exact claim supported"}]`,
  keeping web-derived claims separate from the courseware citation section.

### 5. Post-answer interactive Anki export protocol

At the end of every synthesized, citation-anchored research answer, append:

> 💡 **Export Answer to Anki Flashcard?**
> Would you like to organize and export this response into a structured, bilingual Anki flashcard for your **`金融`** deck?
> _(Reply **"yes"**, **"export to Anki"**, or **"import card"** to auto-import)._

When the user confirms:

1. **Front HTML:** `<strong>[Concept Title (English & Chinese)]</strong>: [Core Engineering Question]`
2. **Back HTML:** 4 sections — **定义与物理意义 (Definition & Physical
   Meaning)**, **核心工作机制 (Core Mechanism & Flow)**, **架构对比与工程权衡
   (Trade-offs Table)**, and **源码与文档引用 (Source Citation)** with
   line-anchored Markdown links.
3. **Import using canonical tags** (`CANONICAL_TAGS` in
   `tools/research/anki_card_validator.py`: `research`, `networking`, flat
   course code `cs231`–`cs234`, and listed concept tags):

   ```bash
   python3 tools/research/anki_generator.py --front "<front_html>" --back "<back_html>" --deck "金融" --tags "research networking <module_name>" --auto-launch
   ```

4. **Append the `📊 Anki Courseware Memorization Progress Report`** printed by
   `anki_generator.py` to your reply.

## Citation requirement

Every answer, protocol explanation, and code breakdown derived from `research/`
includes line-anchored Markdown citations:
`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`.
