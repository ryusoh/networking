"""Unit tests for Phase 1 Anki Density Metric module (tools/research/anki_density.py)."""

import unicodedata
from tools.research.anki_density import (
    DensityReport,
    card_density,
    compression_density,
    concept_density,
    domain_density,
    mtld,
    normalize_text,
    tokenize,
)


def test_normalize_text_basic():
    """Verify HTML stripping, entity decoding, whitespace collapse, and lowercasing."""
    front = "<h1>BBR &amp; CUBIC</h1>\n<p>拥塞 控制</p>"
    back = "<div>Bandwidth-Delay &gt; 100ms</div>"
    normalized = normalize_text(front, back)

    assert "<h1>" not in normalized
    assert "<p>" not in normalized
    assert "&amp;" not in normalized
    assert "&gt;" not in normalized
    assert normalized == "bbr & cubic 拥塞 控制 bandwidth-delay > 100ms"


def test_normalize_text_nfc():
    """Verify NFC unicode normalization is applied."""
    # NFD decomposed character 'e\u0301' (é)
    nfd_front = "e\u0301"
    normalized = normalize_text(nfd_front, "")
    assert normalized == "\u00e9"
    assert unicodedata.is_normalized("NFC", normalized)


def test_normalize_text_empty():
    """Verify empty or None inputs return empty string."""
    assert normalize_text("", "") == ""
    assert normalize_text(None, "") == ""
    assert normalize_text("", None) == ""


def test_tokenize_mixed():
    """Verify mixed CJK, English, and digit tokenization preserving linear order."""
    text = "bbr 拥塞控制 2024 fast retransmit"
    tokens = tokenize(text)
    assert tokens == ["bbr", "拥塞", "控制", "2024", "fast", "retransmit"]


def test_tokenize_empty():
    """Verify empty string returns empty list."""
    assert tokenize("") == []


def test_tokenize_deterministic():
    """Verify tokenizer is deterministic across multiple invocations."""
    text = "分布式共识系统通过 Paxos 与 Raft 算法维护高可用状态机复制"
    run1 = tokenize(text)
    run2 = tokenize(text)
    assert run1 == run2
    assert len(run1) > 0


def test_compression_density_empty():
    """Verify empty input returns 0.0."""
    assert compression_density("") == 0.0


def test_compression_density_deterministic():
    """Verify compression density returns stable value for known text."""
    sample = "拜占庭将军问题在分布式系统中的经典解决方案及安全性证明"
    val1 = compression_density(sample)
    val2 = compression_density(sample)
    assert val1 == val2
    assert isinstance(val1, float)


def test_mtld_threshold_guard():
    """Verify mtld returns 0.0 when token count is less than 50."""
    tokens = ["token"] * 49
    assert mtld(tokens) == 0.0


def test_mtld_diversity_contrast():
    """Verify high lexical diversity yields high MTLD and repetitive yields low."""
    diverse_tokens = [f"word_{i}" for i in range(100)]
    repetitive_tokens = ["same_word"] * 100

    diverse_mtld = mtld(diverse_tokens)
    repetitive_mtld = mtld(repetitive_tokens)

    assert diverse_mtld > 50.0
    assert repetitive_mtld < 5.0


def test_concept_density():
    """Verify technical-form proxy scores tokens with digits, acronyms, mixed case, or CJK."""
    tech_tokens = ["tcp", "bbr", "2024", "算法", "tlv", "packet"]
    score = concept_density(tech_tokens)
    assert score > 0.0

    plain_tokens = ["a", "b", "c", "d"]
    assert concept_density(plain_tokens) == 0.0


def test_domain_density():
    """Verify domain lexicon coverage percentage calculation."""
    lexicon = {"tcp", "congestion", "bandwidth", "拥塞"}
    tokens = ["tcp", "packet", "congestion", "loss", "拥塞"]

    score = domain_density(tokens, lexicon)
    # 3 out of 5 tokens in lexicon => 60%
    assert abs(score - 60.0) < 1e-6

    # Empty lexicon returns 0.0
    assert domain_density(tokens, set()) == 0.0


def test_card_density_composite_and_fallback():
    """Verify card_density report fields, fallback logic, and bounded composite."""
    lexicon = {"tcp", "bbr", "congestion", "network"}

    # Short card (< 50 tokens) -> triggers fallback
    short_front = "<p>What is BBR?</p>"
    short_back = "<p>BBR is a TCP congestion control algorithm developed by Google.</p>"
    short_report = card_density(short_front, short_back, lexicon)

    assert isinstance(short_report, DensityReport)
    assert short_report.token_count < 50
    assert short_report.lex_fallback is True
    assert 0.0 <= short_report.composite <= 1.0

    # Long card (>= 50 tokens) -> standard weights
    long_text = "tcp congestion control algorithm " * 15
    long_report = card_density(long_text, long_text, lexicon)

    assert long_report.token_count >= 50
    assert long_report.lex_fallback is False
    assert 0.0 <= long_report.composite <= 1.0
