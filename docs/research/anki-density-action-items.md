# Anki Density Gate: Action Items for Implementation

Spec: `docs/research/anki-information-density.md` (read §2–§3 first).
Target: a deterministic, report-only density gate for the 金融 deck.

Rules for the implementer:

- One concern per PR/commit. Keep diffs small.
- All new runtime behavior must have a pytest unit test that fails before and passes after.
- Use `python3`, never `python`.
- Run `make precommit` before opening a PR.
- Do not add dependencies without noting it in the PR body.
- Do not read live Anki SQLite files; use AnkiConnect or staged exports only.

---

## Phase 0 — Environment validation (do these first; they gate later work)

### A0.1 Add jieba dependency

- **File:** `requirements-dev.txt`
- **Change:** add `jieba==<latest-stable>` (pin exact version).
- **Test:** `python3 -c "import jieba; print(jieba.__version__)"` succeeds.
- **Note in PR body:** dependency added per design doc §2.1.

### A0.2 Verify AnkiConnect `notesInfo` schema (spec T1)

- **File:** `tools/research/__tests__/test_anki_connect_schema.py` (new)
- **What:** integration test, marked `@pytest.mark.skipif(not_anki_running)`.
  - POST `{"action": "notesInfo", "version": 6, "params": {"notes": [<nid>]}}` to `http://127.0.0.1:8765`.
  - Assert response has `result[0]["fields"]` with `Front` and `Back` keys.
  - Assert whether `result[0]` contains `guid` (record finding in docstring).
- **Acceptance:** test passes locally with Anki running; skipped in CI.
- **Output:** update `docs/research/anki-information-density.md` §5 notesInfo bullet with result.

### A0.3 Verify jieba determinism (spec T5)

- **File:** `tools/research/__tests__/test_jieba_determinism.py` (new)
- **What:**
  - Tokenize 5 fixed CJK strings with `jieba.cut(text, HMM=False)`.
  - Assert identical output across two runs.
  - Assert `jieba.dt.initialized` is True after first cut.
- **Acceptance:** passes consistently.

---

## Phase 1 — Core metric module (`tools/research/anki_density.py`)

### A1.1 Text normalization

- **Function:** `normalize_text(front_html: str, back_html: str) -> str`
- **Steps:**
  1. Concatenate `front_html + " " + back_html`.
  2. Strip HTML tags with `html.parser` (stdlib); unescape entities.
  3. Normalize to NFC (`unicodedata.normalize`).
  4. Collapse whitespace (`" ".join(text.split())`).
  5. Lowercase.
- **Test:** `tools/research/__tests__/test_anki_density.py`
  - HTML input becomes plain text.
  - NFC normalization applied.
  - Empty input returns `""`.

### A1.2 Tokenizer

- **Function:** `tokenize(text: str) -> list[str]`
- **Steps:**
  1. Extract CJK runs with regex `[\u4e00-\u9fff\u3040-\u30ff]+`.
  2. Segment each CJK run with `jieba.cut(run, HMM=False)`.
  3. Extract Latin/digit tokens with regex `[a-z0-9]+`.
  4. Return combined list in original order.
- **Test:**
  - Mixed CJK/Latin string tokenizes correctly.
  - Empty string returns `[]`.
  - Deterministic: same input → same output.

### A1.3 Compression density

- **Function:** `compression_density(text: str) -> float`
- **Formula:** `1 - (len(zlib.compress(text.encode("utf-8"), 9)) - len(zlib.compress(b"", 9))) / len(text.encode("utf-8"))`
- **Edge case:** if `len(text.encode("utf-8")) == 0`, return `0.0`.
- **Test:**
  - Known string produces expected value (compute manually once, then pin).
  - Empty string returns `0.0`.
  - Deterministic across runs.

### A1.4 MTLD lexical diversity

- **Function:** `mtld(tokens: list[str], threshold: float = 0.72) -> float`
- **Algorithm (McCarthy & Jarvis 2010):**
  1. If `len(tokens) < 50`, return `0.0` (guard; caller must handle).
  2. Forward pass: walk tokens, count "factors". A factor ends when TTR drops below `threshold`. TTR = unique tokens so far / total tokens so far.
  3. Backward pass: same on reversed list.
  4. Return `(len(tokens) / factors_forward + len(tokens) / factors_backward) / 2`.
- **Test:**
  - 100 unique tokens → high MTLD.
  - 100 repeated tokens → low MTLD.
  - `<50` tokens → `0.0`.

### A1.5 Technical-form proxy

- **Function:** `concept_density(tokens: list[str]) -> float`
- **Rules:** count distinct tokens that match any:
  - Contains a digit.
  - Is all-caps acronym (`len >= 2`, `str.isupper()`).
  - Contains mixed case (`any(c.isupper() for c in token[1:])`).
  - Is CJK run segmented by jieba (length >= 2 characters).
- **Return:** `count / len(tokens) * 100` if tokens else `0.0`.
- **Test:**
  - Tokens with digits/acronyms score > 0.
  - Plain lowercase tokens score `0.0`.

### A1.6 Domain-lexicon coverage

- **Function:** `domain_density(tokens: list[str], lexicon: set[str]) -> float`
- **Return:** `len([t for t in tokens if t in lexicon]) / len(tokens) * 100` if tokens else `0.0`.
- **Test:** tokens in lexicon score > 0; tokens outside score `0.0`.

### A1.7 Composite density

- **Dataclass:** `DensityReport` with fields:
  `d_comp: float, d_lex: float, d_concept: float, d_domain: float, composite: float, token_count: int, lex_fallback: bool`
- **Function:** `card_density(front_html: str, back_html: str, lexicon: set[str]) -> DensityReport`
- **Logic:**
  - If `token_count < 50`, set `lex_fallback = True` and composite = `0.4*d_comp + 0.3*d_concept/100 + 0.3*d_domain/100`.
  - Else composite = `0.4*d_comp + 0.2*d_lex/100 + 0.2*d_concept/100 + 0.2*d_domain/100`.
- **Test:**
  - Fallback triggers at `<50` tokens.
  - Weights sum to 1.0 in both branches.
  - Composite is in `[0, 1]`.

---

## Phase 2 — Baseline builder (`tools/research/anki_density_baseline.py`)

### A2.1 Top-k hub GUIDs

- **Function:** `top_k_hub_guids(deck: str, k: int = 10) -> list[str]`
- **How:** reuse `tools/research/anki_graph_bridge.py` to load `graph_data.json`, filter to `deck`, sort by `pagerank` descending, return top `k` GUIDs.
- **Test:** mocked graph JSON returns correct GUID order.

### A2.2 Note text fetch (live + staged)

- **Function:** `fetch_note_texts(guids: list[str], mode: str = "live") -> dict[str, dict[str, str]]`
- **Live path:**
  1. Load `guid → nid` map from `/Users/lz/dev/anki/data/anki/notes.json.gz`.
  2. Call AnkiConnect `notesInfo` with the nids.
  3. Return `{guid: {"front": ..., "back": ...}}`.
- **Staged path:**
  1. Load `/Users/lz/dev/anki/data/cloudflare/collection/notes.json.gz`.
  2. Match by `guid`, split `flds` on `\x1f`, return first two fields as front/back.
- **Error handling:** raise `RuntimeError` with clear message if file missing or GUID not found.
- **Test:**
  - Mock AnkiConnect HTTP response for live path.
  - Mock gzip JSON for staged path.

### A2.3 Domain lexicon builder

- **Function:** `build_domain_lexicon(deck: str, k: int = 10, max_terms: int = 500) -> set[str]`
- **Steps:**
  1. Get top-k hub GUIDs.
  2. Fetch their texts.
  3. Normalize and tokenize each.
  4. Remove stopwords (use a small hardcoded list: English `{"the","a","an","is","are","of","to","in","and","or","for","on","at","by","with","from","as","it","this","that"}`, Chinese `{"的","了","在","是","我","有","和","就","不","人","都","一","一个","上","也","很","到","说","要","去","你","会","着","没有","看","好","自己","这"}`).
  5. Remove single-character CJK tokens.
  6. Count frequencies, keep top `max_terms`.
- **Test:** mocked hub texts produce expected lexicon size and content.

### A2.4 Baseline report

- **Dataclass:** `BaselineReport` with fields:
  `deck: str, top_guids: list[str], mean_density: float, per_card: list[DensityReport], lexicon: set[str], zlib_version: str, jieba_version: str, graph_hash: str`
- **Function:** `compute_baseline(deck: str = "金融", k: int = 10, mode: str = "live") -> BaselineReport`
- **Steps:**
  1. `top_k_hub_guids`.
  2. `fetch_note_texts`.
  3. `build_domain_lexicon`.
  4. Compute `card_density` for each hub card.
  5. `mean_density = mean(composite)`.
  6. `graph_hash` = SHA256 of `graph_data.json` first 1MB.
- **Caching:** write to `research/.anki_density_baseline.json`; load if graph hash unchanged.
- **Test:**
  - Mocked inputs produce expected `BaselineReport`.
  - Cache hit skips recomputation.
  - Cache invalidates on hash change.

---

## Phase 3 — Density gate (`tools/research/anki_density_gate.py`)

### A3.1 Verdict dataclass

- **Dataclass:** `Verdict` with fields:
  `chunk_id: str, density: float, threshold: float, decision: str, consolidation_group: list[str] | None, enrich_context: str | None`

### A3.2 Evaluate cards

- **Function:** `evaluate_cards(cards: list[dict], baseline: BaselineReport, config: dict) -> list[Verdict]`
- **Config defaults:**
  `threshold_scale=1.0, max_merge_chars=2000, max_enrich_attempts=2`
- **Steps:**
  1. `threshold = baseline.mean_density * threshold_scale`.
  2. For each card, compute `card_density(front, back, baseline.lexicon)`.
  3. If `density >= threshold` → `decision="accept"`.
  4. Else group with other below-threshold cards sharing same `chunk_id` or same `file_path` + shared tag.
  5. If group size >= 2 and total chars <= `max_merge_chars` → `decision="consolidate"`.
  6. Else → `decision="enrich"`.
- **Test:**
  - Card above threshold → accept.
  - Single card below threshold → enrich.
  - Two cards below threshold from same chunk → consolidate.
  - Threshold scaling works.

### A3.3 CLI entry point

- **Function:** `main()` with `argparse`
- **Arguments:**
  - `--cards PATH` (default `research/anki_cards.jsonl`)
  - `--candidates PATH` (default `research/anki_candidates.jsonl`)
  - `--baseline PATH` (default `research/.anki_density_baseline.json`)
  - `--output PATH` (default `research/anki_density_verdicts.jsonl`)
  - `--report-only` (flag; default true in Phase 3)
  - `--threshold-scale FLOAT` (default 1.0)
  - `--rebuild-baseline` (flag)
- **Behavior:**
  - Load or rebuild baseline.
  - Read cards JSONL.
  - `evaluate_cards`.
  - Write verdicts JSONL.
  - Print summary: accepted / enriched / consolidated counts.
- **Test:** CLI runs on temp JSONL files and writes expected output.

---

## Phase 4 — Pipeline integration

### A4.1 Wire gate into `anki_generator.py`

- **File:** `tools/research/anki_generator.py`
- **Change:** after `anki_card_validator.py` passes and before `import_reviewed_cards`, run density gate.
- **Behavior:**
  - If `research/anki_density_verdicts.jsonl` exists, only import cards with `decision == "accept"`.
  - If missing, import all (backward-compatible).
  - Log skipped cards to `research/anki_review.jsonl` with verdict `"density_skipped"`.
- **Test:**
  - With verdicts file, only accepted cards are imported.
  - Without verdicts file, all cards import.
  - Skipped cards appear in review log.

### A4.2 Update pipeline spec

- **File:** `docs/research/anki-card-pipeline-spec.md`
- **Change:** add density gate to §2 workflow diagram and §3 file-artifact table.
- **Test:** `make precommit` passes.

---

## Phase 5 — Validation experiments (after implementation)

### A5.1 T3 weight tuning

- **File:** `tools/research/experiments/tune_weights.py` (new)
- **What:** score all existing 金融 cards, grid-search weights and `threshold_scale` to maximize F1 against human labels.
- **Output:** JSON artifact `research/.anki_density_tuning.json` with best weights.
- **Acceptance:** F1 >= 0.8; update spec with tuned weights.

### A5.2 T4 MTLD fallback validation

- **File:** `tools/research/__tests__/test_anki_density_fallback.py` (new)
- **What:** synthetic cards 10–100 tokens; verify fallback behavior.
- **Acceptance:** no degenerate composite at <50 tokens.

### A5.3 T6 domain lexicon validation

- **File:** `tools/research/experiments/validate_lexicon.py` (new)
- **What:** score 20 real 金融 cards vs 20 generic cards; compare `D_domain` distributions.
- **Acceptance:** Mann-Whitney U p < 0.01; median 金融 >= 2x generic.

### A5.4 T7 end-to-end dry run

- **File:** `tools/research/experiments/dry_run.py` (new)
- **What:** generate 5 cards, run gate in report-only mode, inspect verdicts.
- **Acceptance:** human reviewer agreement >= 80%.

---

## Definition of done

- [x] All Phase 0–4 items implemented with tests.
- [x] `make precommit` green.
- [x] Baseline computed for 金融 deck and committed as `research/.anki_density_baseline.json`.
- [x] Gate runs in report-only mode on a real batch of 5 cards.
- [x] Spec `docs/research/anki-information-density.md` updated with implementation status.
