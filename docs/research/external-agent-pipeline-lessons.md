# Lessons from an External Agentic Research Pipeline — Applied to `tools/research/`

## The question

What concrete lessons from a studied external agentic research pipeline can
enhance the research-agent pipeline in this repo (`tools/research/`)?

## Short answer

The external system is a much larger, generational, multi-agent research
control plane; ours is a single-agent courseware retrieval/citation/Anki
pipeline. Despite the scale gap, five ideas transfer cleanly:

1. **Typed evidence roles for every artifact** (canonical state vs. validation
   signal vs. derived view vs. audit snapshot) — would have caught our dead
   `pending_import` status and stale `anki_import.chunks.json` by construction.
2. **Structured session memory instead of raw transcript replay** — a compact
   state card + append-only ledger + bounded prompt block + anti-anchoring
   questions, where our `memory_host.py` currently stores and replays full
   query/response text verbatim.
3. **A generation-commit marker with an evidence cutoff** — an atomic
   "this batch is closed" fact, which our Anki import flow lacks, leaving
   interrupted batches in an ambiguous `candidate` state.
4. **Negative results as first-class durable evidence** — record what was
   searched and not found, with coverage limits, instead of silently retrying.
5. **Preregistered acceptance contracts per unit of work** — metrics and
   pass thresholds declared before execution; our closest analog (the density
   baseline) exists only for Anki cards, not for research answers.

---

## What the external system is (evidence base)

Claims in this section trace to material actually fetched during this study:

- **External repo README (public source-available repository; URL withheld per
  request).** The system is described as an "autonomous research system for
  measurable, computer-executable research" that "coordinates parallel research
  peers, task-owned evaluation, durable evidence, and generation-to-generation
  synthesis." It ships as a Python package with a CLI, bundled agent skills,
  runnable examples, and a task-template scaffold. The README FAQ documents
  three trust safeguards: preregistration ("Metrics, evaluation protocols,
  baselines, and acceptance thresholds are defined before the run"),
  consistent evaluation, and end-to-end provenance. It also states the license
  is source-available rather than OSI open source (stated as fact; no legal
  interpretation here).
- **External docs: architecture page (URL withheld).** Defines an ownership
  boundary (core owns protocols/storage/replay; the task project owns
  objective/evaluator/metrics) and a five-role artifact taxonomy:
  `canonical_state`, `validation_signal`, `derived_view`, `audit_snapshot`,
  `partial_output`. Stated retention rule: "capture first, label uncertainty,
  continue when safe."
- **External docs: research-loop page (URL withheld).** Describes the
  generation lifecycle: freeze run configuration → build generation context →
  execute peer work → materialize evidence → close with a
  `generation_boundary.json` commit marker and a recorded evidence cutoff →
  synthesize the next agenda. Separates a "result summary" ("what the
  evaluator measured") from a "finding" ("how later research may interpret and
  use that result").
- **External docs: peer-memory page (URL withheld).** Describes per-peer
  structured memory: a `peer_state.yaml` state card (current hypothesis, open
  questions, known dead ends), an append-only `experiment_ledger.jsonl`, a
  session handoff note, a seen-shared-findings tracker, and a character-bounded
  injected memory block that ends with three anti-anchoring questions
  (paraphrased: what evidence supports continuing, what suggests pivoting,
  what is the cheapest falsification). Raw transcripts are deliberately not
  replayed.
- **External docs: literature-lookup page (URL withheld).** Prescribes
  provenance records for external sources (title, authors, year, stable
  identifier, retrieval time, the exact claim supported, uncertainty) and
  states "A negative lookup result is also evidence" — "not found in searched
  sources" must not be rewritten as "does not exist."
- **External preprint abstract on a public preprint server (identifier
  withheld).** Frames the system as "lineage-centered": a "typed evidence
  graph of findings, lane-structured frontiers, and agendas" so later attempts
  inherit validated mechanisms and unresolved claims. Reports benchmark results
  on a 75-task ML-engineering suite (medal counts and cost figures) — noted
  here as the authors' own claims, not independently verified.

## What our pipeline does today (local evidence base)

- **Architecture & status ledger:** `docs/research/research-agent-spec.md` —
  four-layer design; Layer 4 (LLM invocation, auto-retry) deliberately
  descoped to the interactive host agent (§1, §2.4).
- **Scene assembly:** `tools/research/scene_builder.py` — token-bounded scenes
  with primary/prereq/code slots; optional durable-memory injection via
  `MemoryHost.render_memory_context` (`scene_builder.py:50-55`, `:122-133`).
- **Memory:** `tools/research/memory_host.py` — `record_turn` stores full
  `query` and `response` text per turn (`memory_host.py:53-78`);
  `flush_working_memory` copies them verbatim into `session_history`
  (`memory_host.py:80-115`); `render_memory_context` injects only weak/strong
  topic lists (`memory_host.py:239-257`). Corrupt JSON already degrades
  gracefully to a fresh store (`memory_host.py:32-46`).
- **Citation verification:** `tools/research/citation_engine.py` — validates
  file existence, line bounds, and fuzzy text alignment; the rejection/retry
  loop is descoped to the host agent (research-agent-spec.md §5.2).
- **Anki pipeline state machine:** `docs/research/anki-card-pipeline-spec.md`
  §2–§4 — `--candidates` refuses to run while chunks are in `candidate` or
  `pending_import` status; `pending_import` is "never set by current production
  code", making `tools/research/anki_import_verifier.py` a practical no-op;
  `research/anki_import.chunks.json` is a stale artifact nothing regenerates.
- **Negative-evidence handling today:** `research/anki_review.jsonl` is an
  append-only reject log, and candidate selection ranks high-reject-rate
  course directories later (anki-card-pipeline-spec.md §5) — a partial form of
  durable negative evidence, limited to chunk quality.
- **Web-search enhancement:** `.agents/skills/research-agent/SKILL.md` §5
  ("Agent Judgment & Internet Enhancement Protocol") instructs the agent to
  enrich card backs with web-search context but prescribes no provenance
  record format for those claims.
- **Existing analog of preregistration:** `tools/research/anki_density_baseline.py`
  pins a deck baseline that `anki_density_gate.py` measures cards against
  (anki-card-pipeline-spec.md §2–§3) — declared-before-execution, but only for
  card density.

## Claim-by-claim lessons

### L1 — Give every persisted artifact an explicit role

**External evidence (docs: architecture page, URL withheld):** every run
artifact carries one of five roles; planning reads canonical state plus
explicitly eligible signals, and "derived views and audit snapshots explain
decisions but never override their sources." Auto-materialized projections are
"idempotent, rebuildable" views, "not a second result owner."

**Local evidence:** our pipeline has no role taxonomy. Consequences already
documented in `docs/research/anki-card-pipeline-spec.md`:

- `anki_import_verifier.py` is a no-op because the `pending_import` status it
  verifies is never set (§2) — a validation-signal state with no producer.
- `anki_import.chunks.json` is a stale artifact only read by a legacy fallback
  (§3) — an unlabeled derived view that masquerades as state.
- The verifier "rewrites `.anki_coverage.json` directly, an exception to the
  single-writer rule" (§2) — two writers for one canonical store.

**Lesson:** a one-line `role:` field (or a documented role per file in the
spec) for each artifact under `research/` would make dead states and dual
writers detectable by inspection rather than by audit.

### L2 — Structured session memory beats raw transcript accumulation

**External evidence (docs: peer-memory page, URL withheld):** continuity is
carried by a compact state card (hypothesis, open questions, known dead ends),
an append-only experiment ledger, a handoff summary, and a bounded injected
block — explicitly "It deliberately does not preserve raw message transcripts
in the prompt." Each block ends with anti-anchoring questions to force
reconsideration before repeating work. Broken memory files degrade to a
minimal state card rather than blocking.

**Local evidence:** `memory_host.py:53-78` stores each turn's full `query` and
`response` strings; `flush_working_memory` (`memory_host.py:80-115`) appends
them verbatim to `session_history`, which therefore grows without bound as raw
transcript. The injected context (`render_memory_context`,
`memory_host.py:239-257`) carries only aggregate mastery lists — no open
questions, no dead ends, no anti-anchoring check. Graceful degradation on
corrupt JSON already exists (`memory_host.py:37-39`), matching the external
failure behavior.

**Lesson:** add a compact state-card layer (current focus topic, open
questions, known dead ends per module) alongside the verbatim log, and bound
what `render_memory_context` injects. Our current design silently accumulates
the exact failure mode — unbounded raw history — that the external design
documents against.

### L3 — An atomic commit marker with an evidence cutoff for batch close

**External evidence (docs: research-loop page, URL withheld):** a generation
closes with one ordered commit whose last step writes
`gen_N/generation_boundary.json`; "Results without a contiguous boundary
remain pending work." A recorded evidence cutoff "makes retries
deterministic" — late results stay visible as follow-up signals but cannot
rewrite a closed generation.

**Local evidence:** the Anki batch flow (anki-card-pipeline-spec.md §2, §4)
closes a batch only implicitly: `--import` marks chunks `imported` one at a
time, and `--candidates` refuses a new batch while any chunk is `candidate`.
An interrupted import leaves a batch half-`imported`, half-`candidate`, with
no single fact recording whether the batch closed and no cutoff separating
"in this batch" from "late arrival."

**Lesson:** a small `batch_boundary.json`-style marker written after a
successful import sweep (recording batch id, card count, timestamp, cutoff)
would give resume/verify logic a single completion fact, mirroring the
external generation boundary at our scale.

### L4 — Negative results are durable evidence, not silence

**External evidence (docs: literature-lookup page, URL withheld):** "A
negative lookup result is also evidence. Report the query, sources attempted,
warnings, and coverage limits." The architecture page adds: weak provenance is
labeled, and missing data is recorded as unknown, "never silently zero."

**Local evidence:** we have this half-built. Chunk-level rejects are durably
logged with reasons in `research/anki_review.jsonl` and feed back into
candidate ranking (anki-card-pipeline-spec.md §5). But search-level negatives
are ephemeral: the research-agent SKILL.md tells the agent to retry with
aliases or fall back to `Grep` when BM25 misses (SKILL.md "Query tactics"),
and nothing records that the first query failed — so the next session re-runs
the same doomed query. The external preprint abstract makes the same point at
system scale: without recorded lineage, "long campaigns keep re-learning the
same lessons" (paraphrased).

**Lesson:** persist failed/empty search queries (query text, index mode,
timestamp, hit count) as negative evidence, and surface "previously empty for
this topic" in `scene_builder` output so the agent skips straight to alias
expansion.

### L5 — Preregister the acceptance contract before generating

**External evidence (repo README FAQ, URL withheld):** the first listed trust
safeguard is preregistration — metrics, evaluation protocols, baselines, and
acceptance thresholds fixed before the run; every candidate is then measured
through the same evaluator and suspicious results excluded.

**Local evidence:** we preregister exactly one thing: the Anki density
baseline (`anki_density_baseline.py` pins the deck metrics that
`anki_density_gate.py` enforces; anki-card-pipeline-spec.md §2–§3). Research
*answers* have no equivalent: the citation contract is embedded in every scene
(`scene_builder.py:142-144`), but the pass threshold (must verify, minimum
citation count, retry policy) is implicit in the host agent's judgment because
the auto-retry loop is descoped (research-agent-spec.md §5.2).

**Lesson:** declare the acceptance contract for a study answer in the scene
itself (e.g. "answer must contain ≥ N citations and `citation_engine.py` must
exit 0 before delivery"), so the host agent's verification step is a check
against a written contract rather than an unwritten convention.

### L6 — Provenance records for externally retrieved claims

**External evidence (docs: literature-lookup page, URL withheld):** records
for outside sources preserve title/authors/identifier/retrieval time, the
"exact claim supported by the source", and uncertainty; retrieved material is
kept separate from evaluator evidence.

**Local evidence:** our SKILL.md §5 web-search enhancement protocol enriches
card backs with web context alongside the mandatory local citation section,
but neither `anki_card_validator.py`'s detectors (anki-card-pipeline-spec.md
§9) nor the card JSONL schema (§3) require any provenance field for the
web-derived claims — a reader cannot tell which sentence came from courseware
(verifiable via `citation_engine.py`) and which came from an unrecorded web
search.

**Lesson:** extend the card contract with an optional `external_sources` list
(source URL, retrieval date, claim supported) that the validator checks for
shape when present — keeping web context clearly segregated from line-anchored
courseware citations, as the external system segregates literature from
measured evidence.

## Candidate enhancements (mapped to modules)

| # | Enhancement | Files touched | Expected benefit | Rough effort |
| --- | --- | --- | --- | --- |
| 1 | Artifact-role table for `research/` files (canonical / validation / derived / audit), plus deleting or reviving the dead `pending_import` state | `docs/research/anki-card-pipeline-spec.md` §3–§4; optionally `tools/research/anki_import_verifier.py`, `tools/research/anki_generator.py` | Dead states and dual writers become visible by inspection; resolves two documented spec exceptions | Small (doc + one decision) |
| 2 | Compact state card + bounded injection in durable memory: add `open_questions` / `dead_ends` per topic, cap `session_history` replay, inject a 2–3 line anti-anchoring check | `tools/research/memory_host.py` (`record_turn`, `flush_working_memory`, `render_memory_context`); `tools/research/scene_builder.py` `_render_memory_section` | Stops unbounded transcript growth; agent stops re-treading known dead ends | Medium |
| 3 | Batch-commit marker + evidence cutoff for the Anki import flow | `tools/research/anki_generator.py` (`--import`); `docs/research/anki-card-pipeline-spec.md` §4 | Interrupted batches become resumable from a single completion fact instead of inferred state | Small–medium |
| 4 | Negative-search ledger: log empty/failed queries; surface prior misses in scene output | `tools/research/search_chunks.py`; `tools/research/scene_builder.py`; new `research/.search_log.jsonl` (gitignored) | No repeated doomed queries; alias-expansion kicks in immediately | Small |
| 5 | Scene-level acceptance contract: declare required citation count + verification pass in the scene payload; document the retry loop in the skill | `tools/research/scene_builder.py` `_render_markdown_scene`; `.agents/skills/research-agent/SKILL.md`; `docs/research/research-agent-spec.md` §5.2 | Verification becomes a written contract check, not host-agent convention | Small |
| 6 | `external_sources` provenance field for web-enriched cards, shape-checked when present | `tools/research/anki_card_validator.py`; `.agents/skills/research-agent/SKILL.md` §5; `docs/research/anki-card-pipeline-spec.md` §8–§9 | Web-derived claims become auditable and segregated from courseware citations | Small |

Suggested order: 1 and 5 first (small, resolve documented spec gaps), then 2
(the largest architectural delta), then 3, 4, 6 as budget allows.

## Open questions / what I couldn't verify

- **External benchmark claims are self-reported.** The preprint abstract's
  medal counts and ~12× cost advantage over the baseline agent are the
  authors' own numbers on one suite; I found no independent replication and
  did not attempt one.
- **I read the external system's docs, README, and paper abstract — not its
  implementation.** The repo's core module (one source file alone is ~91 KB)
  and plugin tree were inventoried via the repository file listing but not
  read line-by-line, so the docs' descriptions of mechanism (e.g. the exact
  truncation behavior of the memory block, the graph-maintainer internals) are
  taken at doc face value.
- **Generational machinery deliberately not recommended.** The external
  system's parallel peers, quality-diversity allocation, and multi-generation
  synthesis address autonomous multi-week research campaigns; our pipeline is
  an interactive single-agent study tool, and none of the six enhancements
  above requires adopting that machinery. Whether we ever need it is an open
  question tied to the Layer-4 unblock condition in
  `docs/research/research-agent-spec.md` §1.
- **The external system is very young** (preprint first submitted days before
  this writing, per the abstract page's submission history), so its documented
  designs have little third-party scrutiny yet.
- **License noted but not interpreted.** The README FAQ states the project is
  source-available under a non-OSI license with revenue-based commercial
  terms; per task constraints this doc records that fact without legal
  analysis. These lessons are re-implementations of general design ideas, not
  copied code.

## Action items

Work orders for the enhancements above, ranked by expected impact, written
for mechanical execution.

### Rules for the implementer

- One work order per change. Work one item at a time; **commit after each
  item but never push**.
- `Find` strings are exact anchors quoted from the current file contents. If
  a `Find` string does not match exactly once, STOP and report — do not
  improvise.
- Line numbers are dated and may drift; trust the `Find` text, not the
  numbers.
- Never name the external pipeline (project, org, URLs, preprint identifier,
  authors) in any file you touch — refer to it only as "the external
  pipeline".
- After editing Python: run the item's scoped pytest. After editing Markdown:
  `npx prettier --write <file>`.
- Do not use `make test-py` for scoped verification (it builds C binaries
  first); it is the full-gate fallback only.
- Never hand-edit generated output (`coverage/`, `adblock/dist/`,
  `nas_proxy/out/`) and never commit command-output logs.
- Tags: `[trivial]` = markup/config/deletion only · `[low]` = small logic
  change · `[visual]` = rendered/live behaviour, human must review ·
  `[skip]` = needs a design decision or new tests; route to a stronger model.
  `[skip]` items are pointers only — do not attempt them.

### 1. `[trivial]` Artifact-role taxonomy in the pipeline spec

Resolves the two documented spec exceptions (dead `pending_import` state,
stale `anki_import.chunks.json`) by making roles visible by inspection.

- **File:** `docs/research/anki-card-pipeline-spec.md`
- **Find:** ``All JSONL files above are ignored by `.gitignore`.``
- **Change:** immediately after that line, insert a blank line and this block:

  ```text
  Artifact roles (one per file; planning reads canonical state, derived views
  and audit snapshots explain decisions but never override their sources):

  - `research/.anki_coverage.json` — canonical_state (single writer:
    `CoverageTracker`; the import-verifier rewrite in §4 is a documented
    exception)
  - `research/.anki_density_baseline.json` — canonical_state (preregistered
    baseline, written only by `anki_density_baseline.py`)
  - `research/anki_cards.jsonl` — canonical_state for the batch under review
    (writer: the LLM agent)
  - `research/anki_density_verdicts.jsonl` — validation_signal
  - `research/anki_candidates.jsonl` — derived_view (rebuildable via
    `--candidates`; never edit by hand)
  - `research/anki_review.jsonl` — audit_snapshot (append-only)
  - `research/anki_import.txt` + `research/anki_import.chunks.json` —
    partial_output (legacy; stale, nothing regenerates them)
  ```

- **Verify:** `npx prettier --check docs/research/anki-card-pipeline-spec.md`

### 2. `[low]` Scene-level acceptance contract (enhancement 5)

- **File:** `tools/research/scene_builder.py`
- **Find:**

  ```python
              "## MANDATORY CITATION CONTRACT",
  ```

- **Change:** in `_render_markdown_scene`, immediately after the list entry
  `` `[file_path#Lstart-Lend](file:///absolute_path#Lstart-Lend)`", ``
  insert these entries (same indentation, trailing commas):

  ```python
              "",
              "## ACCEPTANCE CONTRACT",
              "Before delivering the answer: (1) every claim from these blocks carries a citation in the format above; (2) the answer contains at least 3 citations; (3) `python3 tools/research/citation_engine.py <answer_file>` exits 0. Fix and re-verify on any failure.",
  ```

- **Verify:** `python3 -m pytest tools/research/__tests__/test_scene_builder.py -q`
- **Guardrail:** the scene tests assert substrings (`in`), so adding lines is
  safe, but do not reword or reorder any existing payload line.

### 3. `[low]` Batch-commit marker with evidence cutoff (enhancement 3)

- **Files:** `tools/research/anki_generator.py`, `.gitignore`
- **Find (anki_generator.py):**

  ```python
      imported = _record_import_coverage(anki_cards, note_ids, deck_name, coverage_path, review_path)
  ```

- **Change:** immediately after that line in `import_reviewed_cards`, insert:

  ```python
      marker_path = cards_path.parent / "anki_import_batch.json"
      marker_path.write_text(
          json.dumps(
              {
                  "closed_at": datetime.now(timezone.utc).isoformat(),
                  "deck": deck_name,
                  "source": source_path.name,
                  "imported": imported,
                  "attempted": len(anki_cards),
                  "note_ids": note_ids,
              },
              indent=2,
              ensure_ascii=False,
          ),
          encoding="utf-8",
      )
  ```

  Then in `.gitignore`: **Find** `research/anki_density_verdicts.jsonl` and
  insert a new line after it: `research/anki_import_batch.json`
- **Verify:** `python3 -m pytest tools/research/__tests__/test_anki_generator.py -q`
- **Guardrail:** place the snippet after the `_record_import_coverage` call,
  not before the early returns, so the marker only records a completed import
  sweep; `json`, `datetime`, and `timezone` are already imported at the top of
  the file — add no imports.
- **Test obligation (AGENTS.md changed-lines rule):** add one test in
  `tools/research/__tests__/test_anki_generator.py` modeled on
  `test_import_marks_reviewed_chunks_imported` asserting the marker file
  exists under the tmp cards dir and parses as JSON. Append only — never edit
  or delete existing tests. If you cannot make it pass, stop and report.

### 4. `[low]` Negative-search ledger: log empty queries (enhancement 4, write half)

- **Files:** `tools/research/search_chunks.py`, `.gitignore`
- **Find (search_chunks.py):**

  ```python
          if not ranked_results:
              print(f"No results found for query: '{args.query}'")
              return 0
  ```

- **Change:** insert before the `return 0`:

  ```python
              log_path = manifest_path.parent / ".search_log.jsonl"
              with log_path.open("a", encoding="utf-8") as fh:
                  fh.write(
                      json.dumps(
                          {
                              "ts": datetime.now(timezone.utc).isoformat(),
                              "query": args.query,
                              "mode": "rrf" if args.rrf else "bm25",
                              "hits": 0,
                          }
                      )
                      + "\n"
                  )
  ```

  And add the missing import — **Find:**

  ```python
  import sys
  from pathlib import Path
  ```

  insert between them: `from datetime import datetime, timezone`

  Then in `.gitignore`: **Find** `research/.dense_vectors.json` and insert a
  new line after it: `research/.search_log.jsonl`
- **Verify:** `python3 -m pytest tools/research/__tests__/test_search_chunks.py -q`
- **Guardrail 1:** `datetime` is NOT currently imported in
  `search_chunks.py` — without the import line the change crashes on the
  no-results path.
- **Guardrail 2:** `research/.search_log.jsonl` is NOT currently covered by
  `.gitignore` (the enhancements table's "gitignored" note is aspirational) —
  skipping the `.gitignore` line commits state debris.

### 5. `[low]` `external_sources` shape check in the validator (enhancement 6, code half)

- **File:** `tools/research/anki_card_validator.py`
- **Find:** `def validate_cards(cards: list[dict[str, Any]]) -> dict[str, list[str]]:`
- **Change:** immediately BEFORE that line, insert:

  ```python
  def _external_source_issues(sources: Any) -> list[str]:
      """Shape-check the optional external_sources provenance list when present."""
      if sources is None:
          return []
      if not isinstance(sources, list):
          return ["external_sources must be a list of {url, retrieved, claim} objects"]
      issues: list[str] = []
      for i, src in enumerate(sources):
          if not isinstance(src, dict) or not all(
              k in src for k in ("url", "retrieved", "claim")
          ):
              issues.append(
                  f"external_sources[{i}] must be an object with url, retrieved, claim"
              )
      return issues


  ```

  Then — **Find:**

  ```python
          card_issues = _validate_card(front, back) + _tag_issues(card.get("tags"))
  ```

  — replace with:

  ```python
          card_issues = _validate_card(front, back) + _tag_issues(card.get("tags")) + _external_source_issues(card.get("external_sources"))
  ```

- **Verify:** `python3 -m pytest tools/research/__tests__/test_anki_card_validator.py -q`
- **Guardrail:** the field is optional — a card without `external_sources`
  must produce zero issues, so keep the `sources is None` early return.

### 6. `[trivial]` `external_sources` contract in skill and spec (enhancement 6, docs half)

Do this only after work order 5 lands.

- **File:** `.agents/skills/research-agent/SKILL.md`
- **Find:**

  ```text
  5. **Card Enhancement:** Enrich the Back field with synthesized web search
     insights under **背景与痛点 (Motivation & Pain Points)** and **核心机制
     (Core Mechanism)** alongside the primary courseware line citations.
  ```

- **Change:** immediately after that block, insert:

  ```text
  6. **External-source provenance:** when a web search informs a card, add an
     `external_sources` list to the card's JSONL object:
     `[{"url": ..., "retrieved": "YYYY-MM-DD", "claim": "exact claim the source supports"}]`.
     The validator shape-checks it when present; web-derived claims stay out of
     the line-anchored courseware citation section.
  ```

  Then run `python3 tools/sync_commands.py` to regenerate
  `.claude/commands/research-agent.md` and include it in the same commit.
- **File:** `docs/research/anki-card-pipeline-spec.md`
- **Find:** ``does not strip or require `citation` in the raw JSONL loader.``
- **Change:** immediately after that bullet, insert:

  ```text
  - **External sources (optional):** cards enriched via web search may carry an
    `external_sources` list in the JSONL — objects with `url`, `retrieved` (ISO
    date), and `claim` (the exact claim the source supports). The validator
    shape-checks it when present (§9); absence is not an error.
  ```

- **Verify:** `make sync-check && npx prettier --check .agents/skills/research-agent/SKILL.md docs/research/anki-card-pipeline-spec.md`
- **Guardrail:** editing `SKILL.md` without running `tools/sync_commands.py`
  leaves generated `.claude/commands/` stale and fails `make sync-check` in
  the gate.

### 7. `[skip]` Structured session memory in `memory_host.py` (enhancement 2)

State-card schema (open questions, dead ends), bounded `session_history`
replay, and anti-anchoring injection span `record_turn`,
`flush_working_memory`, `render_memory_context`, and
`scene_builder._render_memory_section` — a schema design decision plus new
tests. Route to a stronger model.

### 8. `[skip]` Surface prior search misses in scene output (enhancement 4, read half)

Matching a new query against logged misses needs a semantics decision (exact
string vs. token overlap vs. per-topic) before any code is written. Route to
a stronger model.

### 9. `[skip]` Delete-or-revive the dead `pending_import` state (enhancement 1, decision half)

Removing `pending_import` retires `anki_import_verifier.py` and the §4
single-writer exception; reviving it means wiring the TSV fallback to set it.
A product decision about the legacy path — route to a stronger model.
