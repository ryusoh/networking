# Anki / Research-Agent Pipeline: Implementation Status vs. Specs

Gap analysis of `docs/anki-card-pipeline-spec.md` and `docs/research-agent-spec.md`
against the code in `tools/research/`, the artifacts in `research/`, and the skills in
`.agents/skills/{anki,research-agent}/`. Read-only investigation; all claims traced to
code, not to comments or docstrings. Date: 2026-08-18.

> **Snapshot notice:** this report describes the state as of 2026-08-18. The two
> specs were subsequently updated to match the code, and the open questions in §4
> were resolved — see §5 for the decisions. The specs, not this report, are the
> living source of truth.

## 1. The question

Both specs describe a courseware-research / Anki-card pipeline over `research/`
courseware. Which specified requirements are not yet implemented, and which
implemented pieces diverge from what the specs say?

## 2. Short answer

The **Anki card pipeline spec is mostly implemented** — the full CLI workflow,
coverage state machine, selection/ranking, dedup, validator, and verifier all exist.
Its gaps are drift, not absence: a few validator rules contradict the spec, and the
citation-section contract is unenforced.

The **research-agent spec has large unimplemented sections**: of its four layers,
Layer 1 is CLI-only (no dashboard, no batch runner), Layer 2 has only CitationEngine
(no Curriculum/Quiz/Synthesis services), Layer 3 lacks ResourceGovernor and the
vector half of the hybrid indexer, and Layer 4 is almost entirely missing (no prompt
assembler, no LLM driver, no retry loop) — by design, the interactive agent plays
that role via the skill.

| Feature (spec ref)                                   | Status  |
| ---------------------------------------------------- | ------- |
| Pipeline: candidate CLI (`--count` / `--candidates`) | done    |
| Pipeline: `--import` via AnkiConnect                 | done    |
| Pipeline: TSV fallback on import                     | partial |
| Pipeline: `--reject-chunk` + 10 reason categories    | done    |
| Pipeline: `--front`/`--back` one-off cards           | done    |
| Pipeline: coverage state machine                     | partial |
| Pipeline: selection lockout (candidate/pending)      | done    |
| Pipeline: quality filter + reject-rate ranking       | done    |
| Pipeline: directory weighting                        | done    |
| Pipeline: selection-time title dedup                 | done    |
| Pipeline: import-time front-hash dedup               | done    |
| Pipeline: AnkiGraphBridge PageRank                   | done    |
| Validator: 16 detectors (spec §9)                    | partial |
| Validator: hard gate + `--force`                     | done    |
| Card format contract (bilingual front, ≥3 sections)  | partial |
| Citation section enforced on cards                   | missing |
| Import verifier                                      | done    |
| Agent: Layer 1 CLI tooling                           | done    |
| Agent: Web Dashboard / IDE                           | missing |
| Agent: Automated Batch Runner                        | missing |
| Agent: CurriculumService                             | missing |
| Agent: QuizService                                   | missing |
| Agent: SynthesisService                              | missing |
| Agent: CitationEngine (existence + line bounds)      | partial |
| Agent: SceneBuilder                                  | partial |
| Agent: MemoryHost durable store                      | partial |
| Agent: Working Memory buffer                         | missing |
| Agent: ResourceGovernor                              | missing |
| Agent: Hybrid indexer (BM25 + vectors + RRF)         | partial |
| Agent: Prompt Assembler                              | missing |
| Agent: LLM Execution Driver                          | missing |
| Agent: Output & citation parser                      | partial |
| Agent: citation auto-retry loop                      | missing |
| Agent: Phase 1 parser (headers/slides/offsets)       | done    |
| Agent: mastery-score updating engine                 | missing |

## 3. Claim-by-claim evidence

### 3.1 Anki card pipeline spec (`docs/anki-card-pipeline-spec.md`)

**CLI workflow (spec §2) — done.**

- `--count N --deck "金融"` produces `research/anki_candidates.jsonl`: bare
  invocation falls through to `emit_candidates` (`tools/research/anki_generator.py:1387-1394`,
  definition at `:1094`, written at `:1130-1145`). A literal `--candidates` flag also
  exists (`:1200-1203`, dispatched `:1297-1304`).
- `--import` (`:1210-1214`) → `import_reviewed_cards` (`:983`) loads
  `anki_cards.jsonl` (`:998-1000`) and pushes per-card `addNotes` (`:1057-1065`).
- `--reject-chunk` (`:1221-1226`, `nargs="+"`) with `--reason` choices
  `REJECT_REASONS` (`:80-91`) — exactly the spec's 10 categories.
- `--front`/`--back` with `--tags` (`:1243-1257`, handler `:1322-1385`); requires both
  (`:1323`); this path never touches coverage tracking.

**File artifacts (spec §3) — done, with a stale-artifact note.**

- Candidates JSONL has the specced 7 fields (`:1136-1144`; on-disk first line
  confirms). Cards JSONL loader requires `chunk_id, front, back`, normalizes `tags`
  (`:948-963`); `citation` is agent-authored, present on disk, but neither required
  nor stripped by code.
- `anki_review.jsonl` is append-only `{ts, chunk_id, verdict, reason?, note_id?}`
  (`_append_review_log`, `:94-113`), written by `--reject-chunk` (`:1289`) and
  `--import` (`:1085`).
- `.gitignore:11-18` ignores all the JSONL/state artifacts as specced;
  `git ls-files research` shows none tracked.
- `research/anki_import.chunks.json` is a **stale artifact**: its writer was removed
  in the pipeline rework; it is only _read_ by the legacy TSV path
  (`_load_tsv_cards`, `:926-980`). Nothing regenerates it.

**Coverage state machine (spec §4) — partial.**

- Statuses `generated, candidate, pending_import, imported, skipped_low_quality`
  exist (`is_chunk_visited` `:531-537`). `imported` stores
  `note_id, front_hash, front_html, imported_at` (`:1075-1084`).
- Divergence 1: the spec says `CoverageTracker` is the only writer of
  `.anki_coverage.json`, but `tools/research/anki_import_verifier.py:120` rewrites it
  directly (transitions `pending_import → imported`, `:108-120`).
- Divergence 2: `pending_import` is never set by production code —
  `mark_chunks_visited`'s only caller passes `status="candidate"` (`:1147-1151`);
  only tests set `pending_import`. The on-disk file (7650 chunks) has
  `generated:85, skipped_low_quality:7507, imported:58`, zero `pending_import`.
  `generated` is a legacy status the spec's state machine doesn't mention.
- Selection lockout works: `emit_candidates` refuses while chunks are `candidate` or
  `pending_import` (`:1110-1118`; tested at `test_anki_generator.py:745`).

**Selection and ranking (spec §5) — done.**

`select_unvisited_chunks` skips visited (`:640`), gates on `is_high_quality_chunk`
(`:483-491`, applied `:643`, skipped recorded as `skipped_low_quality` `:649-650`),
loads per-directory reject rates from the review log (`_load_reject_rates`
`:123-145`, consulted `:652-656`), and sorts by `(rate, -priority)` (`:654-660`)
with priority = directory weight + PageRank (`_calculate_chunk_priority`
`:602-620`). Weights (`:611-617`): +10 for `01-slides`/`00-materials`/review
folders, +5 for `01-readings`/`lecture-notes`, −10 for homework/lab/`related-work`.

**Deduplication (spec §6) — done.**

- Selection-time: `filter_duplicate_chunks` (`:850-877`) unions titles from a
  temp-copy SQLite read (`:686-701`) and AnkiConnect `findNotes` (`:742-764`).
  Minor divergences: the AnkiConnect query is full-text, not Front-field-scoped;
  matching is chunk _heading_ vs note Front; plus an extra in-batch heading dedup
  (`:866-876`) the spec doesn't mention.
- Import-time: SHA-1 of normalized front (`_front_hash` `:116-120`) compared against
  stored hashes (`:931-945`); matches dropped before `addNotes` (`:1016-1028`).

**Graph bridge (spec §7) — done, one portability caveat.**

`anki_graph_bridge.py` filters nodes by `node["deck"] == target_deck` (`:92`,
`:112-115`), provides `score_chunk_pagerank` (`:206-215`) and
`get_related_hubs(text, top_n, domain_prefix)` with the specced course-field /
label-prefix filter (`:194-199`). Caveat: the repo root is a hardcoded absolute
`/Users/lz/dev/anki` (`:16`), not a portable `~` expansion. Its module docstring
(`:3-4`) advertises Aho-Corasick matching and re-export triggers that do not exist.

**Card format contract (spec §8) — partial; the spec is stale in places.**

- Front shape `<strong>中文 (English)</strong>: 问题？` is **not enforced**: nothing
  requires the `<strong>` wrapper or a bilingual title. Worse, the validator does the
  opposite of spec §9's "missing bilingual front annotation" bullet —
  `_front_gloss_violations` (`anki_card_validator.py:362-380`, applied `:418-424`)
  **bans** multi-word English glosses in the front. `.agents/skills/anki/SKILL.md:88-92`
  confirms this is deliberate ("Multi-word English glosses are machine-banned").
- Back "at least 3 dense sections": validator requires only **≥2** section headers
  (`_count_section_headers(back) < 2` at `anki_card_validator.py:426-427`; header
  regex `:70`, `:288-290`). The `(English Term)` part of the header is not required.
- The mandatory final `源码与文档引用 (Source Citation):` section has **no machine
  gate**: the string appears only in tests/docs; `MARKDOWN_LINK_RE` (`:72`) is used
  solely to exclude citation links from the English-annotation cap (`:298`, `:352`).

**Validator detectors (spec §9) — 13 of 16 done; details:**

Done: control chars (`:20`, `:387-389`); slide titles/page numbers (`:21-26`,
`:391-392`); ASCII diagrams/tables/router-ID lists (`:27-33`, `:394-395`); generic
topic labels (`:34-45`, `:237-247`, `:397-398`); OCR fragments incl. `limi e` /
`q frequent` (`:46-50`, `:400-401`); paper metadata dumps (`:51-57`, `:403-404`);
author blocks (`:58-61`, `:271-274`, `:406-407`); date stamps (`:62`, `:409-410`);
generator fallback template front (`:63`, `:412-413`); batch duplicate titles
(`:475-484`, `:509-516`); unexpanded acronyms (`:169-220`, `:314-359`,
`:438-442`).

Partial / missing:

- Question/answer mismatch — **partial**: `_question_matches_answer` (`:255-263`) is
  a single hardcoded heuristic for one specific card; all other fronts return True.
- Missing bilingual front annotation — **contradicted** (see above; code bans
  glosses instead).
- Missing inline English annotations in back — **missing**: there is a _maximum_
  (`MAX_ENGLISH_ANNOTATIONS = 2`, `:69`, enforced `:429-436`), no minimum; zero
  annotations passes (test `test_anki_card_validator.py:253`).
- Ordinary-word translation blocklist — **partial**: no named-word list (`decades`,
  `trivial`, …); only the generic cap of 2 non-acronym parentheticals (`:293-311`).

**Hard gate on import (spec §9) — done.** Enforcement lives in the generator's
import path, not the validator's main: `import_reviewed_cards` runs
`validate_cards`/`validate_tsv` (`anki_generator.py:1030`) and exits 2 unless
`--force` (`:1031-1038`; flag `:1215-1219`, threaded `:1272`). Validator `main`
(`anki_card_validator.py:521-549`) is advisory only.

**Verifier — done, with caveats.** `anki_import_verifier.py` runs standalone
(`:125-141`), reads the newest local `collection.anki2` via a temp copy (`:36-50`)
— direct SQLite, not AnkiConnect — matches `pending_import` chunks by normalized
front text (`:28-33`, `:89-118`), flips them to `imported`, and rewrites coverage
(`:120`). It depends on the `pending_import` status that production import never
sets (see state-machine divergence above), so in the current flow it likely finds
nothing to verify.

**Citation format on cards — not enforced in the card pipeline.** Neither the
validator nor the generator checks the `[path#Ls-Le](file://...)` format on card
citations. `CitationEngine` (`citation_engine.py`) knows the format but is never
wired into import.

**Implemented but not in the pipeline spec:** `--status` progress report with
rolling approve rate (`anki_generator.py:1306-1320`, `:148-162`); `--auto-launch`
(`:1238-1242`, `:1343-1351`); canonical tag vocabulary gate (`anki_card_validator.py:79-166`,
`:447-460`); localized Anki model-name resolution (`anki_generator.py:782-817`);
progress-bar reporter (`:165-257`); legacy TSV read path (`:912-980`) and deprecated
`--tsv`/path-override flags; extra quality filters (ROT-1 artifacts `:362-366`,
bibliography sections `:416-423`, junk paths `:272-286`).

### 3.2 Research-agent spec (`docs/research-agent-spec.md`)

**Layer 1 — Interface: CLI done; dashboard and batch runner missing.**

- Every Phase 1–5 module ships an argparse CLI: `parse_chunks.py:185`,
  `search_chunks.py:157`, `scene_builder.py:108`, `citation_engine.py:150`,
  `memory_host.py:139`. The research-agent skill drives them as agent commands.
- Web Dashboard / IDE: **missing** — no HTML/JS dashboard, concept-graph viewer, or
  Markdown renderer anywhere in the repo.
- Automated Batch Runner: **missing** — no async job scheduler; `parse_chunks.py`
  and the Anki `--count` flow are one-shot synchronous invocations.

**Layer 2 — Services: three of four missing.**

- `CurriculumService` (prerequisite graphs across cs231–cs234): **missing**; name
  appears only in the spec.
- `QuizService`: **missing**.
- `SynthesisService` (cross-course analyses): **missing**.
- `CitationEngine`: **partial** — class at `citation_engine.py:29` validates file
  existence (`:86`) and line-range bounds against real line counts (`:93-115`), but
  the third specced check, **text content alignment** (quoted text vs. source
  lines), is not implemented: the link label is captured (`:53-71`) and never
  compared to file content. The module docstring (`:7`) claims it anyway.

**Layer 3 — Host: all four components partial or missing.**

- `SceneBuilder` (`scene_builder.py:26`): assembles ranked BM25 chunks with a real
  token budget (`build_scene` `:34-62`, truncation `:47-53`) — covers R_primary and
  B_token of the scene formula. **Missing:** primary-vs-prerequisite distinction
  (C_prereq), an explicit lab-code slot (A_code), and **memory injection
  (M_episode)** — `scene_builder.py` never imports `memory_host`, so
  `MemoryHost.render_memory_context` (`memory_host.py:118`), built explicitly for
  scene injection, is dead in the production flow.
- `MemoryHost`: durable store done (`:32-81`), but schema deviates: spec §4.2 has
  top-level `student_id`/`last_updated`/`modules`; the live
  `research/.durable_memory.json` nests under `students{}` and adds a
  `session_history` log. **Working Memory is missing** — no active-turn buffer and
  no session-end summarization path.
- `ResourceGovernor`: **missing** as a component. Token budgeting exists inline in
  `scene_builder.py:34-62`, but execution timeouts and read-only-FS enforcement
  exist nowhere (the CLIs freely write files).
- Hybrid Search & RAG Indexer: **partial, BM25-only.** `search_chunks.py` implements
  BM25 Okapi (`:30-123`) with heading/path boost (`:91-101`) and a
  `reciprocal_rank_fusion` function (`:126-141`, k=60). **No dense vector embedding
  index exists anywhere.** The `--rrf` mode (`:198-202`) fuses multiple BM25
  per-token passes, not BM25+vector lists — a degenerate use of RRF relative to the
  spec. File-type coverage matches spec (manifest holds md/c/h/py/gns3/p4 chunks).

**Layer 4 — Agent: essentially missing (by design, but unspecified).**

- Prompt Assembler: **missing** — nearest thing is hardcoded prompt text in
  `SceneBuilder._render_markdown_scene` (`scene_builder.py:78-88`).
- LLM Execution Driver: **missing** — no inference-API dispatch, timeouts, or token
  constraints in `tools/research/`; the "LLM" is the interactive agent reading the
  skill.
- Structured Output & Citation Parser: **partial** — citation extraction exists
  (`citation_engine.py:53-71`); no general Markdown/JSON-schema output parser.
- Auto-retry loop (spec §8.4: reject unverified references and return to Layer 3):
  **missing** — `verify_text` (`:132-147`) returns a report; nothing rejects or
  re-parses.

**Citation contract (spec §5) — partial.** `LINK_PATTERN` (`citation_engine.py:19-22`)
accepts the specced format but doesn't require it (`file://` optional, single-line
`#Ln` allowed, label unconstrained). `search_chunks.format_file_link` (`:151-154`)
generates exactly the spec format. Two of three validation checks exist; snippet
matching and the retry loop do not.

**Phase 1 parser (spec §8.1) — done.** `parse_chunks.py` splits at `#{1,6}` headers
(`:19`) and `<!-- slide -->` separators (`:20`), records `start_line`/`end_line`
(`:33-47`), and preserves code-block integrity via the `in_code_block` toggle
(`:69-90`); whole code files are emitted intact (`:119-145`). Note
`scene_builder.py:50` can still truncate content at display time for the token
budget.

**Phase 5 mastery engine (spec §8.5) — partial.** JSON serializer done; but
`record_mastery` (`memory_host.py:52-81`) stores a caller-supplied score verbatim
(clamped to [0,1]) — **no code computes proficiency from student performance**.
`get_student_report` (`:83-116`) only aggregates stored scores.

**E2E coverage.** `test_research_agent_e2e.py` (`:25-155`) exercises parse → BM25
search → scene assembly → citation verify → mastery record → the full Anki pipeline
with mocked LLM/AnkiConnect. The research-agent SKILL.md is fully code-backed —
every documented command and flag exists; it never claims the missing services or
dashboard exist.

**Implemented but not in this spec:** the entire Anki pipeline (spec §6 references
it but it post-dates the four-layer design), `anki_graph_bridge.py` PageRank
bridging, `session_history` in memory_host, heading/path score boost, and the
multi-pass BM25 `--rrf` mode.

**Incidental code issues spotted (not fixed, read-only task):** `scene_builder.py`
uses `Any`/`Sequence` without importing them (survives via
`from __future__ import annotations`); `memory_host.py:37-38` has a bare
`except Exception: pass`; `citation_engine.py:7` docstring advertises snippet
alignment the code never performs.

## 4. Open questions from the investigation

Resolved on 2026-08-18 — see §5. The genuinely still-open items:

- **AnkiConnect behaviors not exercised.** `addNotes`, `findNotes`, model-name
  resolution, and the verifier's SQLite reads were verified statically only; no live
  Anki instance was queried.
- **`~/dev/anki/graph/graph_data.json` presence and schema** were not checked (path
  is outside this repo); the PageRank ranking path was verified in code but not run.
- **`research/anki_import.chunks.json` staleness**: inferred from git history and the
  absence of a writer in current code; the exact commit that removed the writer was
  not bisected.

## 5. Decisions taken (2026-08-18)

- **Validator drift — spec was stale, spec updated.** The code is authoritative:
  `docs/anki-card-pipeline-spec.md` §8/§9 now describe the validator as implemented
  (front gloss ban, ≤2 back annotations, ≥2 dense sections, unenforced citation
  section). The spec now states it describes the pipeline as implemented.
- **`pending_import` — deliberately left inert.** No production path sets it and the
  AnkiConnect import already gets confirmation from `addNotes` note IDs. Marked as
  inert in `tools/research/anki_import_verifier.py` (module docstring) and
  `tools/research/anki_generator.py` (`mark_chunks_visited`,
  `pending_import_chunks`). Unblock condition: only implement if the TSV export
  path starts marking chunks `pending_import` at export time.
- **Layer 4 — stays descoped to the host agent.** Not implemented as code; the
  interactive agent is the prompt assembler, LLM driver, and output parser.
  `docs/research-agent-spec.md` §1 records the unblock condition: revisit only when
  an unattended/scheduled workflow needs LLM invocation without an interactive
  session.
- **Web Dashboard / IDE and QuizService — Backburner.** A fourth status level
  (Planned but explicitly deprioritized) was added to `docs/research-agent-spec.md`
  and applied to both components.
- **Both specs updated to match code.** Status labels (Implemented / Partially
  implemented / Planned / Backburner) applied throughout
  `docs/research-agent-spec.md`; `docs/anki-card-pipeline-spec.md` rewritten where
  it contradicted the implementation (state machine, verifier status, stale
  artifacts, graph-bridge caveats, validator contract).
