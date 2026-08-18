"""Deterministic Information Density Metric for Anki Flashcards.

Pure metric module implementing compression density (zlib), lexical diversity
(MTLD), technical-form proxy, domain-lexicon coverage, and composite scoring.
"""

from __future__ import annotations

import html
from html.parser import HTMLParser
import re
import unicodedata
import zlib
from dataclasses import dataclass

import jieba


class _HTMLTextExtractor(HTMLParser):
    """HTML parser that extracts plain text data, ignoring tags."""

    def __init__(self) -> None:
        super().__init__()
        self.pieces: list[str] = []

    def handle_data(self, data: str) -> None:
        self.pieces.append(data)

    def get_text(self) -> str:
        return "".join(self.pieces)


def normalize_text(front_html: str, back_html: str) -> str:
    """Normalize front and back card HTML into plain text.

    Steps:
    1. Concatenate front and back with a space.
    2. Strip HTML tags and unescape entities.
    3. Normalize unicode to NFC form.
    4. Collapse whitespace.
    5. Lowercase text.
    """
    raw_html = f"{front_html or ''} {back_html or ''}".strip()
    if not raw_html:
        return ""

    parser = _HTMLTextExtractor()
    parser.feed(raw_html)
    text = parser.get_text()
    text = html.unescape(text)
    text = unicodedata.normalize("NFC", text)
    text = " ".join(text.split())
    return text.lower()


_CJK_REGEX = re.compile(r"[\u4e00-\u9fff\u3040-\u30ff]+")
_TOKEN_SPLIT_REGEX = re.compile(r"[\u4e00-\u9fff\u3040-\u30ff]+|[a-z0-9]+")


def tokenize(text: str) -> list[str]:
    """Tokenize normalized text into CJK segments and alphanumeric tokens.

    Preserves original linear sequence order.
    """
    if not text:
        return []

    tokens: list[str] = []
    for match in _TOKEN_SPLIT_REGEX.finditer(text):
        token_str = match.group()
        if _CJK_REGEX.match(token_str):
            cjk_cut = jieba.cut(token_str, HMM=False)
            for seg in cjk_cut:
                seg_stripped = seg.strip()
                if seg_stripped:
                    tokens.append(seg_stripped)
        else:
            tokens.append(token_str)
    return tokens


def compression_density(text: str) -> float:
    """Compute zlib compression density with stream overhead subtracted.

    Formula: 1 - (|zlib9(utf8(text))| - |zlib9("")|) / |utf8(text)|
    Returns 0.0 for empty input.
    """
    utf8_bytes = text.encode("utf-8")
    if not utf8_bytes:
        return 0.0

    empty_overhead = len(zlib.compress(b"", 9))
    comp_len = len(zlib.compress(utf8_bytes, 9))
    ratio = 1.0 - (comp_len - empty_overhead) / len(utf8_bytes)
    return float(ratio)


def _calc_mtld_factors(tokens: list[str], threshold: float) -> float:
    """Calculate MTLD factors for a token sequence."""
    if not tokens:
        return 1.0

    factor_count = 0.0
    current_tokens = 0
    current_types: set[str] = set()

    for token in tokens:
        current_tokens += 1
        current_types.add(token)
        ttr = len(current_types) / current_tokens
        if ttr <= threshold:
            factor_count += 1.0
            current_tokens = 0
            current_types = set()

    if current_tokens > 0:
        ttr = len(current_types) / current_tokens
        if ttr < 1.0:
            factor_count += (1.0 - ttr) / (1.0 - threshold)
        elif factor_count == 0.0:
            factor_count = 1.0

    if factor_count == 0.0:
        factor_count = 1.0

    return len(tokens) / factor_count


def mtld(tokens: list[str], threshold: float = 0.72) -> float:
    """Compute McCarthy & Jarvis (2010) bidirectional MTLD lexical diversity.

    Guards: returns 0.0 if token count < 50.
    """
    if len(tokens) < 50:
        return 0.0

    fwd = _calc_mtld_factors(tokens, threshold)
    bwd = _calc_mtld_factors(list(reversed(tokens)), threshold)
    return (fwd + bwd) / 2.0


def _is_technical_token(token: str) -> bool:
    """Check if token matches technical-form criteria."""
    if not token:
        return False
    # Digit presence (e.g. '3g', '2004', '802.11', '100ms')
    if any(c.isdigit() for c in token):
        return True
    # All-caps acronym (length >= 2, e.g. 'GPS', 'BBR', 'TLB')
    if len(token) >= 2 and token.isupper():
        return True
    # Mixed-case identifier (e.g. 'PageRank', 'zkSNARK')
    if len(token) >= 2 and any(c.isupper() for c in token[1:]):
        return True
    # Mathematical / technical syntax symbols
    if any(sym in token for sym in ("\\", "_", "^", "=", "<", ">", "+", "-", "*", "/")):
        return True
    return False


def concept_density(tokens: list[str]) -> float:
    """Calculate technical-form proxy density (% of tokens matching technical patterns)."""
    if not tokens:
        return 0.0
    distinct_technical = {t for t in tokens if _is_technical_token(t)}
    return (len(distinct_technical) / len(tokens)) * 100.0


def domain_density(tokens: list[str], lexicon: set[str]) -> float:
    """Calculate domain-lexicon coverage percentage."""
    if not tokens or not lexicon:
        return 0.0
    covered = sum(1 for t in tokens if t in lexicon)
    return (covered / len(tokens)) * 100.0


@dataclass(frozen=True)
class DensityReport:
    """Structured report of card density metrics."""

    d_comp: float
    d_lex: float
    d_concept: float
    d_domain: float
    composite: float
    token_count: int
    lex_fallback: bool


def card_density(front_html: str, back_html: str, lexicon: set[str]) -> DensityReport:
    """Compute full composite density report for an Anki card."""
    text = normalize_text(front_html, back_html)
    tokens = tokenize(text)
    token_count = len(tokens)

    d_comp = compression_density(text)
    d_lex = mtld(tokens, threshold=0.72)
    d_concept = concept_density(tokens)
    d_domain = domain_density(tokens, lexicon)

    norm_lex = min(1.0, d_lex / 100.0)

    if token_count < 50:
        lex_fallback = True
        composite = 0.4 * d_comp + 0.3 * (d_concept / 100.0) + 0.3 * (d_domain / 100.0)
    else:
        lex_fallback = False
        composite = (
            0.4 * d_comp
            + 0.2 * norm_lex
            + 0.2 * (d_concept / 100.0)
            + 0.2 * (d_domain / 100.0)
        )

    # Bound composite to [0.0, 1.0]
    composite = max(0.0, min(1.0, composite))

    return DensityReport(
        d_comp=d_comp,
        d_lex=d_lex,
        d_concept=d_concept,
        d_domain=d_domain,
        composite=composite,
        token_count=token_count,
        lex_fallback=lex_fallback,
    )
