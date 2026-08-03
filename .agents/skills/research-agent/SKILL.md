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

#### Query tactics (BM25 is lexical, not semantic)

- **Query with keywords, not the user's natural-language question.** A question
  like "what are PHB and IntServ" ranks chunks for whichever term has the most
  source coverage and can bury the other. Run one keyword query per concept
  (e.g. `"IntServ integrated services RSVP"`) instead of one query for the
  whole question.
- **Expand terminology aliases when a term misses.** The textbooks use
  different names for the same concept — e.g. Kurose Ch. 7 never says
  "IntServ"; it covers it as "Per-Connection QoS Guarantees / Resource
  Reservation and Call Admission". If BM25 returns nothing for a known term,
  retry with the concept's alias or mechanism names (RSVP, admission control).
- **Fall back to Grep for exact terms.** When BM25 scores bury the section you
  know exists, `Grep` the `research/` tree directly for the term
  (e.g. `Integrated Services|RSVP`) — an exact-string hit beats a ranking.

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

### 4. Track Student Durable Memory & Mastery Matrix

To record topic mastery scores or view student progress reports:

```bash
# View student mastery report:
python3 tools/research/memory_host.py --student "default_user"

# Record a topic mastery score:
python3 tools/research/memory_host.py --student "default_user" --record --module "cs234" --topic "b4_traffic_engineering" --score 0.95
```

### 5. Generate & Ingest Anki Flashcards

To generate high-quality, bilingual (Chinese primary with English technical terminology) Anki cards from unvisited `research/` courseware:

```bash
python3 tools/research/anki_generator.py --count 5 --deck "<target_deck>"
```

#### Agent Judgment & Internet Enhancement Protocol:

When invoking the Anki pipeline or reviewing candidate flashcards:

1. **Non-Deterministic Quality Gate:** Use agent judgment to reject any trivial slides, administrative text, course schedule outlines, or low-value notes.
2. **Web Search Enhancement:** For brief or high-density technical concepts (e.g., `B4 WAN`, `Paxos Consensus`, `NAPI`, `Clos Topology`), perform a targeted web search (`search_web`) to retrieve production engineering context, RFC specs, or practical pain points.
3. **Card Enhancement:** Enrich the Back field with synthesized web search insights under **背景与痛点 (Motivation & Pain Points)** and **核心机制 (Core Mechanism)** alongside the primary courseware line citations.

### 6. Re-index Courseware Chunks (if files changed)

If Markdown sidecars, slides, or code files in `research/` have been updated:

```bash
python3 tools/research/parse_chunks.py
```

### 7. Post-Answer Interactive Anki Export Protocol

After delivering a synthesized, citation-anchored answer to a user's research request, the agent MUST append an interactive export offer at the end of the response:

> 💡 **Export Answer to Anki Flashcard?**
> Would you like to organize and export this response into a structured, bilingual Anki flashcard for your **`金融`** deck?
> _(Reply **"yes"**, **"export to Anki"**, or **"import card"** to auto-import)._

When the user confirms or requests export:

1. **Format Front HTML:** `<strong>[Concept Title (English & Chinese)]</strong>: [Core Engineering Question]`
2. **Format Back HTML:** Structure into 4 standard sections:
   - **定义与物理意义 (Definition & Physical Meaning)**
   - **核心工作机制 (Core Mechanism & Flow)**
   - **架构对比与工程权衡 (Trade-offs Table)**
   - **源码与文档引用 (Source Citation):** Bounded line-anchored Markdown links.
3. **Execute Auto-Ingestion Command:**
   ```bash
   python3 tools/research/anki_generator.py --front "<front_html>" --back "<back_html>" --deck "金融" --tags "research networking <module_name>" --auto-launch
   ```
4. **Append Progress Report:** Always capture and append the **📊 Anki Courseware Memorization Progress Report** printed by `anki_generator.py` at the end of your response to the user.

## Citation Requirement

All answers, protocol explanations, and code breakdowns derived from `research/` materials MUST include line-anchored Markdown citations formatted as:
`[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`
