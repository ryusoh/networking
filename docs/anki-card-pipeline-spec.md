# Autonomous Anki Flashcard Pipeline (`tools/research/`)

Canonical architecture spec for turning `research/` courseware into high-density,
bilingual Anki notes in the `金融` deck.

This spec describes the pipeline **as implemented**. Where a component is legacy,
effectively inert, or enforced more loosely than the prose contract suggests, that
status is stated explicitly.

## 1. Core principle: LLM authors, code gates

Deterministic code **never writes card prose**. The pipeline does four things:

1. **Retrieve** unvisited, high-quality chunks.
2. **Validate** candidate cards before they reach Anki.
3. **Track** state in `research/.anki_coverage.json`.
4. **Import** reviewed cards via AnkiConnect. If no cards JSONL exists, `--import`
   falls back to _reading_ the legacy TSV package (`anki_import.txt` +
   `anki_import.chunks.json`); writing TSV happens only in the `--front/--back`
   path when AnkiConnect is unreachable.

The creative step — turning a chunk into a question/answer — is performed by the
LLM agent that reads `research/anki_candidates.jsonl` and writes
`research/anki_cards.jsonl`.

## 2. CLI workflow

```text
python3 tools/research/anki_generator.py --count 5 --deck "金融"
    ↓  research/anki_candidates.jsonl
LLM authors cards
    ↓  research/anki_cards.jsonl
python3 tools/research/anki_card_validator.py research/anki_cards.jsonl
    ↓
python3 tools/research/anki_generator.py --import --deck "金融"
    ↓
python3 tools/research/anki_import_verifier.py
```

Candidate selection is the default verb-less path (`--count`); a literal
`--candidates` flag also exists and behaves identically.

Bad candidates should be rejected instead of turned into bad cards:

```bash
python3 tools/research/anki_generator.py \
  --reject-chunk <chunk_id> \
  --reason title-slide
```

`--reason` is one of:
`title-slide | metadata-dump | author-block | diagram | ocr-fragment |
date-stamp | outline | qa-mismatch | duplicate | other`.

Additional verbs beyond the core workflow:

- `--status` — progress report plus a rolling approve rate over the last 100
  review-log entries.
- `--auto-launch` — with `--front/--back`, open Anki (`open -a Anki`) and poll
  until AnkiConnect responds before importing.
- `--force` — with `--import`, override the validator gate (see §9).
- `--tsv` — deprecated no-op kept for CLI compatibility.

**Verifier status:** `anki_import_verifier.py` is currently **a no-op in
practice**. It verifies chunks in `pending_import` status against the local
`collection.anki2` (read via a temporary SQLite copy, not AnkiConnect), but
`--import` writes `imported` directly and no production code path sets
`pending_import`, so the verifier prints "No pending imports to verify." It also
rewrites `.anki_coverage.json` directly, an exception to the single-writer rule
in §4.

## 3. File artifacts

| Path                             | Purpose                                                                                                  | Written by                      |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `research/anki_candidates.jsonl` | Selected chunks with `chunk_id`, `file_path`, `heading`, `start_line`, `end_line`, `content`, `citation` | `--candidates`                  |
| `research/anki_cards.jsonl`      | Agent-authored cards: `{chunk_id, front, back, tags, citation}`                                          | LLM agent                       |
| `research/anki_review.jsonl`     | Append-only audit log: `{ts, chunk_id, verdict, reason?, note_id?}`                                      | `--reject-chunk`, `--import`    |
| `research/.anki_coverage.json`   | Coverage state (see §4 for writers)                                                                      | CLI verbs + import verifier     |
| `research/anki_import.txt`       | Legacy TSV package (fallback)                                                                            | `--front/--back` or legacy path |

All JSONL files above are ignored by `.gitignore`.

Notes:

- The card loader requires only `chunk_id`, `front`, and `back` (tags are
  normalized/defaulted); `citation` is an authoring convention the code neither
  requires nor strips.
- `research/anki_import.chunks.json` is a **stale artifact**: its writer was
  removed in the pipeline rework. It is only _read_ by the legacy TSV fallback
  path; nothing regenerates it. Do not rely on its contents being current.

## 4. Coverage state machine

`CoverageTracker` in `tools/research/anki_generator.py` is the primary writer of
`research/.anki_coverage.json`. The one exception is `anki_import_verifier.py`,
which rewrites the file directly when transitioning `pending_import → imported`
(see §2 — currently inert, since nothing sets `pending_import`).

```text
unvisited
    ↓ --candidates
candidate
    ↓ --import
imported   (stores note_id, front_hash, front_html)
    ↑
    ↓ --reject-chunk --reason
skipped_low_quality
```

Statuses present in the schema: `candidate`, `pending_import`, `imported`,
`skipped_low_quality`, and `generated` (a legacy status from the pre-rework
pipeline; ~85 chunks on disk still carry it). `pending_import` exists in the
schema and in the selection lockout below, but is **never set by current
production code** — only tests use it.

`--candidates` refuses to run while any chunks are in `candidate` or
`pending_import` status. Resolve the current batch before starting a new one.

**Never hand-edit `research/.anki_coverage.json`.** Use CLI verbs only, just as
you never run raw SQLite writes against `collection.anki2`.

## 5. Selection and ranking

`CoverageTracker.select_unvisited_chunks` performs:

1. Skip visited chunks (any terminal status).
2. Run `is_high_quality_chunk` to filter outlines, TOC dots, logistics,
   date-stamped metadata, figure captions, and low-density fragments.
   Skipped chunks are recorded as `skipped_low_quality`.
3. Compute a reject rate per course directory from `anki_review.jsonl`.
   Sources with a higher historical reject rate are ranked later.
4. Sort by `(reject_rate, -priority)`, where `priority` combines directory
   weighting and an optional `AnkiGraphBridge` PageRank score.

Directory weighting currently prefers `01-slides`, `00-materials`, and review
folders (`+10`), gives `01-readings`/`lecture-notes` a smaller boost (`+5`), and
penalizes homework and lab directories (`−10`).

The quality filter also rejects some categories not enumerated above: ROT-1 /
Caesar-shifted PDF artifacts, bibliography sections, junk file paths, and
PPT/presenter metadata. Selection-time dedup additionally drops duplicate
headings within the batch itself.

## 6. Deduplication

Two layers prevent duplicate cards:

1. **Selection-time title dedup.** `filter_duplicate_chunks` checks existing
   Front titles against a temporary copy of `collection.anki2` and via
   AnkiConnect `findNotes`. Caveats: the `findNotes` query is full-text within
   the deck (not restricted to the Front field), and matching compares the
   chunk's Markdown heading against note fronts.
2. **Import-time content-hash dedup.** On `--import`, a SHA-1 hash of the
   normalized front text is compared against `front_hash` values already stored
   in coverage. Matching cards are silently dropped before validation and
   before `addNotes` is called.

## 7. Graph bridge (`AnkiGraphBridge`)

`tools/research/anki_graph_bridge.py` reads `graph/graph_data.json` from the
sibling Anki repo and filters nodes strictly to the target deck (`金融`). It
provides:

- `score_chunk_pagerank(chunk)`: aggregate PageRank of hub labels matching the
  chunk text, used during candidate ranking.
- `get_related_hubs(text, domain_prefix=None)`: top-N matching concept labels.

If `domain_prefix` is supplied (e.g. `cs231`), only hubs whose node carries a
matching `course` field or whose label starts with the prefix are returned. The
production graph does not currently include per-node course metadata, so the
same-domain filter returns empty and ranking falls back to directory weighting.
Adding a `course` field to graph nodes will re-enable cross-course PageRank
filtering without code changes.

Caveats:

- The Anki repo path is a hardcoded absolute path (`/Users/lz/dev/anki`), not a
  portable `~` expansion — the bridge only works on this machine.
- The module docstring advertises Aho-Corasick subphrase matching and automated
  graph re-export triggers; neither is implemented. Actual matching is a term
  index plus post-filtering, and the bridge is strictly read-only.

## 8. Card format contract

Cards are Chinese-primary bilingual HTML with English technical terminology.
The authoring conventions below are enforced **only partially** by the
validator — see §9 for exactly which rules are mechanical.

- **Front:** bilingual title + concrete question, e.g.
  `<strong>中文概念 (English Term)</strong>: 具体问题？` or
  `<strong>English Term</strong>: 中文具体问题？`. Machine-enforced constraint:
  front English is limited to acronyms and single-token standard names —
  multi-word English glosses in the front are **rejected** (acronym expansions
  like `WSN (Wireless Sensor Network)` are exempt). The `<strong>` wrapper and
  bilingual title themselves are conventions, not machine checks.
- **Back:** dense sections introduced by `<b>section name:</b>` or
  `<strong>section name:</strong>` headers (the `(English Term)` suffix in the
  header is a convention, not enforced). The validator requires **at least 2**
  section headers — the "3 dense sections" figure is an authoring target, not
  the gate. English technical terms may be inlined in `<b>`/`<strong>`, but the
  validator **caps** non-acronym English parenthetical annotations at 2 per
  back — write the body in Chinese and annotate only terms a domain reader
  would not already know.
- **Translation scope:** annotate domain terminology only. Do not translate
  ordinary English words (`decades`, `invention or discovery`, `qualitative`,
  `trivial`, etc.). There is no named-word blocklist; the annotation cap above
  is the mechanism that discourages this. Expand every acronym on first use
  (e.g. `NITRD (Networking and Information Technology Research and
Development)`) — this one **is** machine-enforced.
- **Citation:** a final `源码与文档引用 (Source Citation):` section with the
  line-anchored Markdown link. This section is an authoring convention:
  **neither the validator nor `--import` checks for its presence or format.**

The validator enforces the mechanical subset of these rules; `--import` refuses
violating cards unless `--force`.

## 9. Validator (`anki_card_validator.py`)

The validator is a hard gate. The enforcement lives in the generator's
`--import` path: it runs the validator over the batch and refuses to import
while issues exist (unless `--force`). The validator's own CLI is advisory —
it reports issues and exits non-zero but blocks nothing by itself. Detectors:

- Control characters / PDF extraction artifacts.
- Slide titles / page numbers in the front.
- ASCII diagrams / tables / router-ID lists in the back.
- Generic topic labels without a concrete question.
- OCR fragments (`limi e`, `q frequent`).
- Paper metadata dumps (ACM categories, `1. INTRODUCTION`).
- Author/affiliation blocks.
- Date stamps.
- Generator fallback template front
  (`【X】的核心技术机制、计算公式与工程应用是什么？`).
- Question/answer mismatch — **limited**: a small set of hardcoded heuristics
  for specific known-bad cards, not a general mismatch checker; most fronts
  pass unconditionally.
- Duplicate titles within the batch.
- Multi-word English glosses in the front (banned, per §8).
- Fewer than 2 structured section headers in the back.
- More than 2 non-acronym English parenthetical annotations in the back.
- Acronyms used but never expanded or explained (both `ACR (Expansion)` and
  `Expansion (ACR)` orders recognized).
- Tags outside the canonical vocabulary (`CANONICAL_TAGS`); known aliases and
  separator variants are canonicalized by the importer, invented tags are
  rejected.

## 10. Custom one-off cards

The `--front` and `--back` flags remain for ad-hoc ingestion:

```bash
python3 tools/research/anki_generator.py \
  --front "<strong>中文概念 (English Term)</strong>: 具体问题？" \
  --back "<div><b>核心机制 (Core Mechanism):</b></div><div>解释…</div><div><b>源码与文档引用 (Source Citation):</b> [path#L1-L5](file://...)</div>" \
  --deck "金融" --tags "research cs234"
```

Both flags are required together. Tags are canonicalized against the validator's
vocabulary (unknown tags are dropped with a warning). This path tries
AnkiConnect first and falls back to writing the legacy TSV package when
AnkiConnect is unreachable; it does **not** touch coverage tracking.

## 11. Verification

The pipeline is gated by `make precommit`:

```bash
make precommit
```

This runs prettier, ESLint, dependency-cruiser, Python xenon, Jest, pytest,
thinking-check, C smoke tests, and `make sync-check`.
