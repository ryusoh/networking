# Anki Pipeline Redesign: LLM-Authoring Inversion Spec

**Audience:** the implementing agent. This document is self-contained — you do
not need any chat history. Follow Part B step by step.

**Motivation (2026-08-03 incident, already fixed at the gate level):** ~80% of
generator-produced candidate cards were rejected at review; 4 of 5 accepted
cards were agent-authored rewrites. Root cause: the pipeline uses deterministic
code (`AnkiCardFormatter`) for the creative step and the LLM for gatekeeping.
This spec inverts that: **the LLM authors cards; code only retrieves,
validates, tracks, and imports.**

---

## Part A — Design

### Principles

1. LLM authors, code gates. Deterministic code never writes card prose.
2. Every step leaves an artifact on disk (candidates → JSONL, review →
   `anki_review.jsonl`, import → coverage entries with `note_id`).
3. Single-writer state: `.anki_coverage.json` is mutated ONLY by CLI verbs of
   `tools/research/anki_generator.py`. Never hand-edit it (same discipline as
   the Anki `collection.anki2` rule in the skill).
4. Rejection data feeds candidate ranking.
5. North-star metric: approve rate = imported cards / generated candidates.

### Target flow

```text
anki_generator.py --candidates N   → research/anki_candidates.jsonl
LLM agent reads candidates, writes → research/anki_cards.jsonl
anki_card_validator.py             → gates cards (TSV and JSONL inputs)
anki_generator.py --import         → validator-gated import, stores note_id
anki_generator.py --reject-chunk … --reason CAT  → skips + review log
anki_generator.py --status         → progress + rolling approve rate
```

`AnkiCardFormatter` and its template front
(`【X】的核心技术机制、计算公式与工程应用是什么？`) are **deleted**, not deprecated.

---

## Part B — Implementation Playbook

### Step 0 — Orient (do not skip)

- Uncommitted work from 2026-08-03 is in the working tree. **Do not discard
  it.** Run `git status --porcelain`; expected modified files:
  `.agents/skills/anki/SKILL.md`, `.claude/commands/anki.md`, `.gitignore`,
  `tools/research/anki_generator.py`, `tools/research/anki_card_validator.py`,
  `tools/research/__tests__/test_anki_generator.py`,
  `tools/research/__tests__/test_anki_card_validator.py`, plus this spec.
- Already implemented (do NOT redo):
  - `AnkiConnectChecker.resolve_model_name` (maps "Basic" → localized note
    type, e.g. Japanese profiles).
  - Draft-first generation: generation writes `research/anki_import.txt` +
    sidecar `research/anki_import.chunks.json`; NO auto-import exists.
  - `--import` (validator-gated, row-by-row, refuses junk) and `--force`.
  - `--reject-chunk <id>...` (marks `skipped_low_quality`).
  - Generation refuses to run while any `pending_import` chunks exist.
  - Validator detectors: paper metadata, author/affiliation block, template
    front, date stamps (plus pre-existing control-char/slide-title/diagram/
    OCR/duplicate detectors).
- Key files:
  - `tools/research/anki_generator.py` (~1265 lines) — CLI + coverage +
    selection + import.
  - `tools/research/anki_card_validator.py` (~211 lines) — `validate_tsv()`.
  - `tools/research/anki_graph_bridge.py` — related-concepts hub.
  - Tests: `tools/research/__tests__/test_anki_generator.py`,
    `tools/research/__tests__/test_anki_card_validator.py`.
  - Skill: `.agents/skills/anki/SKILL.md` (canonical); regenerate
    `.claude/commands/anki.md` with `python3 tools/sync_commands.py`.

### P0 — Invert authoring

- **P0.1 Candidates mode.** Add `--candidates` (uses `--count`) to `main()`.
  It must:
  1. Load manifest + tracker, run `select_unvisited_chunks` and
     `filter_duplicate_chunks` (existing functions — reuse, don't rewrite).
  2. Write `research/anki_candidates.jsonl`, one JSON object per line:
     `{chunk_id, file_path, heading, start_line, end_line, content, citation}`
     where `citation` is `file_path#L<start>-L<end>`.
  3. Mark those chunks with a NEW status `"candidate"` via
     `tracker.mark_chunks_visited(..., status="candidate")`, and add
     `"candidate"` to the visited-status tuple in
     `CoverageTracker.is_chunk_visited` (currently
     `("generated", "pending_import", "imported", "skipped_low_quality")`).
  4. Print next-step instructions (author cards → validate → import).
  - The old draft path (TSV + sidecar + `pending_import`) is replaced by this;
    keep the "refuse to run while unresolved chunks exist" guard, now covering
    `"candidate"` and `"pending_import"` statuses.
- **P0.2 Cards contract.** The agent authors `research/anki_cards.jsonl`, one
  card per line: `{chunk_id, front, back, tags, citation}`. Extend
  `--import` to read this file by default (keep TSV reading as a legacy
  fallback if the JSONL is absent). Map rows to chunks by `chunk_id` (the
  JSONL carries it — no sidecar needed for the new path).
- **P0.3 Delete the formatter.** Remove `AnkiCardFormatter` and every call
  site in `anki_generator.py`; grep the repo for `AnkiCardFormatter`
  (including tests) and delete those tests. Keep the `--front`/`--back`
  custom-card path (it builds `AnkiCard` directly and IS the reviewed-author
  path).
- **P0.4 Skill rewrite.** Update `.agents/skills/anki/SKILL.md` workflow to:
  `--candidates` → agent reads JSONL, authors `anki_cards.jsonl` (bilingual
  Chinese-primary, English terms, LaTeX `\(...\)`, line-anchored citation) →
  `anki_card_validator.py` → `--import`. Then run
  `python3 tools/sync_commands.py` and confirm `make sync-check` passes.
- **P0.5 Tests.** Add tests: candidates mode writes valid JSONL and marks
  chunks `candidate`; `--import` from JSONL marks chunks `imported` with
  `note_id`; schema-invalid card lines are rejected. Delete formatter tests.

### P1 — Review artifact

- **P1.1** On `--reject-chunk` and on `--import`, append one JSON line per
  chunk to `research/anki_review.jsonl`:
  `{ts, chunk_id, verdict: "accept"|"reject", reason?, note_id?}`.
- **P1.2** `--reject-chunk` gains required `--reason` with enum:
  `title-slide | metadata-dump | author-block | diagram | ocr-fragment |
date-stamp | outline | qa-mismatch | duplicate | other`.
  Store the reason in the coverage entry too.
- **P1.3** `--status` prints rolling approve rate computed from
  `anki_review.jsonl` (accepts / (accepts+rejects), last 100 entries).

### P2 — State closure

- **P2.1** Ensure every needed coverage mutation has a CLI verb
  (`--import`, `--reject-chunk`, and the existing verifier
  `anki_import_verifier.py`). No new hand-edit paths.
- **P2.2** SKILL.md: add the rule "never hand-edit `.anki_coverage.json`".
- **P2.3** In `import_reviewed_tsv` (rename if you like), store `note_id` in
  each coverage entry on successful import.

### P3 — Feedback into ranking

- **P3.1** In candidate selection, read `anki_review.jsonl`; compute reject
  rate per `file_path` top-level directory (e.g.
  `research/cs233-networking-laboratory/04-finals/`); sort candidates so
  high-reject-rate sources come last. Keep it simple: a dict lookup + sort
  key, no ML.
- **P3.2** Content-hash dedup: on import, store
  `front_hash = sha1(normalized front text)` in coverage; skip candidates
  whose hash already exists.

### P4 — Golden corpus

- **P4.1** Create
  `tools/research/__tests__/fixtures/anki_golden.jsonl`: ~10 junk cards +
  ~5 good cards (reuse the real examples from this session's git history /
  validator tests: Byzantine abstract dump, presenter-name front, slide-number
  front, ASCII routing table, date-stamped NUMA fragment = junk; the rewritten
  NEXT-HOP / PIM / DiffServ / NUMA / Byzantine cards = good). Each line:
  `{front, back, expect: "flag"|"pass"}`.
- **P4.2** Test iterates the fixture: validator flags every `"flag"` card and
  passes every `"pass"` card. Validator needs a JSONL input mode (shared
  field-extraction helper) — add `validate_cards(cards: list[dict])` and make
  `validate_tsv` a thin adapter over it.

### P5 — Graph bridge decontamination

- **P5.1** In `anki_graph_bridge.py`, filter related-concepts candidates to
  the same course prefix as the source chunk (e.g.
  `research/cs232-computer-networks/…` only links within cs232). If no
  same-domain concepts exist, omit the hub section from the card back.

### Housekeeping

- Add to `.gitignore`: `research/anki_candidates.jsonl`,
  `research/anki_cards.jsonl`, `research/anki_review.jsonl`.

### Verification (all must be green before declaring done)

```bash
python3 -m pytest tools/research/__tests__/ -q
make test-py        # coverage floor 94%
make lint           # eslint + xenon (Python complexity max C — keep functions small)
make fmt-check      # run `npx prettier --write <edited md files>` if it fails
make thinking-check # no stream-of-consciousness comments in code
make sync-check     # after any SKILL.md edit: python3 tools/sync_commands.py
```

`make precommit` is the full CI gate. eBPF `Error N (ignored)` lines are
expected noise — judge by exit code.

### Pitfalls (learned the hard way)

- **Never** let generation import directly to Anki; `--import` is the only
  path and it must re-run the validator first.
- The validator is a floor, not a ceiling: the reviewing agent must still read
  every card front AND back in full (no truncated prints).
- A famous topic does not redeem a junk card; judge the artifact.
- Judge the last card of a batch as strictly as the first.
- Repo rules: Conventional Commits; do not commit unless the user asks;
  do not add dependencies; do not edit `package.json`/Makefile.

## Acceptance criteria

1. Generator emits zero card prose; cards exist only via agent-authored
   `anki_cards.jsonl` (or `--front`/`--back`).
2. All P0–P5 boxes above done; new behavior has tests.
3. `make precommit` green.
4. `--status` prints approve rate; coverage entries carry `note_id`.
5. Skill + generated command updated; `make sync-check` passes.
