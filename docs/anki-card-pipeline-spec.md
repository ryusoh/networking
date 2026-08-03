# Autonomous Anki Flashcard Pipeline (`tools/research/`)

Canonical architecture spec for turning `research/` courseware into high-density,
bilingual Anki notes in the `金融` deck.

## 1. Core principle: LLM authors, code gates

Deterministic code **never writes card prose**. The pipeline does four things:

1. **Retrieve** unvisited, high-quality chunks.
2. **Validate** candidate cards before they reach Anki.
3. **Track** state in `research/.anki_coverage.json`.
4. **Import** reviewed cards via AnkiConnect (with TSV fallback).

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

Bad candidates should be rejected instead of turned into bad cards:

```bash
python3 tools/research/anki_generator.py \
  --reject-chunk <chunk_id> \
  --reason title-slide
```

`--reason` is one of:
`title-slide | metadata-dump | author-block | diagram | ocr-fragment |
date-stamp | outline | qa-mismatch | duplicate | other`.

## 3. File artifacts

| Path                             | Purpose                                                                                                  | Written by                      |
| :------------------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `research/anki_candidates.jsonl` | Selected chunks with `chunk_id`, `file_path`, `heading`, `start_line`, `end_line`, `content`, `citation` | `--candidates`                  |
| `research/anki_cards.jsonl`      | Agent-authored cards: `{chunk_id, front, back, tags, citation}`                                          | LLM agent                       |
| `research/anki_review.jsonl`     | Append-only audit log: `{ts, chunk_id, verdict, reason?, note_id?}`                                      | `--reject-chunk`, `--import`    |
| `research/.anki_coverage.json`   | Single-writer coverage state                                                                             | CLI verbs only                  |
| `research/anki_import.txt`       | Legacy TSV package (fallback)                                                                            | `--front/--back` or legacy path |

All JSONL files above are ignored by `.gitignore`.

## 4. Coverage state machine

`CoverageTracker` in `tools/research/anki_generator.py` is the only writer of
`research/.anki_coverage.json`.

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
folders; it penalizes homework and lab directories.

## 6. Deduplication

Two layers prevent duplicate cards:

1. **Selection-time title dedup.** `filter_duplicate_chunks` checks existing
   Front titles against a temporary copy of `collection.anki2` and via
   AnkiConnect `findNotes`.
2. **Import-time content-hash dedup.** On `--import`, a SHA-1 hash of the
   normalized front text is compared against `front_hash` values already stored
   in coverage. Matching cards are skipped before `addNotes` is called.

## 7. Graph bridge (`AnkiGraphBridge`)

`tools/research/anki_graph_bridge.py` reads `~/dev/anki/graph/graph_data.json`
and filters nodes strictly to the target deck (`金融`). It provides:

- `score_chunk_pagerank(chunk)`: aggregate PageRank of hub labels matching the
  chunk text, used during candidate ranking.
- `get_related_hubs(text, domain_prefix=None)`: top-N matching concept labels.

If `domain_prefix` is supplied (e.g. `cs231`), only hubs whose node carries a
matching `course` field or whose label starts with the prefix are returned. The
production graph does not currently include per-node course metadata, so the
same-domain filter returns empty and ranking falls back to directory weighting.
Adding a `course` field to graph nodes will re-enable cross-course PageRank
filtering without code changes.

## 8. Card format contract

Cards are Chinese-primary bilingual HTML with English technical terminology.
Every card must satisfy:

- **Front:** bilingual title + concrete question, e.g.
  `<strong>中文概念 (English Term)</strong>: 具体问题？` or
  `<strong>English Term</strong>: 中文具体问题？`.
- **Back:** at least 3 dense sections introduced by
  `<b>section name (English Term):</b>` headers. English technical terms are
  inlined in `<b>`/`<strong>` throughout the explanation, not summarized in a
  single trailing English paragraph.
- **Translation scope:** annotate domain terminology only. Do not translate
  ordinary English words (`decades`, `invention or discovery`, `qualitative`,
  `trivial`, etc.). Expand every acronym on first use (e.g. `NITRD (Networking
and Information Technology Research and Development)`).
- **Citation:** a final `源码与文档引用 (Source Citation):` section with the
  line-anchored Markdown link.

The validator enforces these rules mechanically; `--import` refuses violating
cards unless `--force`.

## 9. Validator (`anki_card_validator.py`)

The validator is a hard gate. `--import` refuses to import while issues exist
(unless `--force`). Detectors include:

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
- Question/answer mismatch.
- Duplicate titles within the batch.
- Missing bilingual front annotation.
- Missing inline English term annotations in the back.
- Missing structured section headers in the back.
- Ordinary English words translated instead of domain terminology.
- Acronyms used but never expanded or explained.

## 10. Custom one-off cards

The `--front` and `--back` flags remain for ad-hoc ingestion:

```bash
python3 tools/research/anki_generator.py \
  --front "<strong>中文概念 (English Term)</strong>: 具体问题？" \
  --back "<div><b>核心机制 (Core Mechanism):</b></div><div>解释…</div><div><b>源码与文档引用 (Source Citation):</b> [path#L1-L5](file://...)</div>" \
  --deck "金融" --tags "research cs234"
```

## 10. Verification

The pipeline is gated by `make precommit`:

```bash
make precommit
```

This runs prettier, ESLint, dependency-cruiser, Python xenon, Jest, pytest,
thinking-check, C smoke tests, and `make sync-check`.
