"""Validation tests for MTLD short-text fallback (spec T4)."""

from tools.research.anki_density import card_density


def test_mtld_fallback_across_token_lengths():
    """Verify fallback activates strictly below 50 tokens without degenerate composites."""
    lexicon = {"tcp", "bbr", "congestion", "bandwidth", "rtt", "network", "packet"}

    # Test token lengths from 10 to 100 in steps
    token_lengths = [10, 20, 35, 48, 49, 50, 55, 75, 100]

    for n in token_lengths:
        # Construct synthetic bilingual technical card with n tokens
        cjk_part = "拥塞控制 算法 " * (n // 4)
        en_part = "tcp bbr congestion bandwidth " * (n // 4 + 1)
        front = f"<p>Topic length {n}</p>"
        back = f"<div>{cjk_part} {en_part}</div>"

        report = card_density(front, back, lexicon)

        # Check fallback flag matches token threshold
        if report.token_count < 50:
            assert report.lex_fallback is True
            # MTLD component must be 0.0 (guarded)
            assert report.d_lex == 0.0
            # Composite must not be degenerate (should have contribution from compression, concept, domain)
            assert report.composite > 0.0
            assert report.composite <= 1.0
        else:
            assert report.lex_fallback is False
            # MTLD component should be positive for diverse tokens
            assert report.d_lex > 0.0
            assert report.composite > 0.0
            assert report.composite <= 1.0


def test_fallback_stability_on_short_dense_cards():
    """Verify short dense cards (<50 tokens) achieve reasonable composite scores."""
    lexicon = {"bbr", "tcp", "rtt", "bandwidth"}
    front = "BBR Algorithm"
    back = "BBR estimates bottleneck bandwidth and min RTT to prevent bufferbloat in TCP."

    report = card_density(front, back, lexicon)
    assert report.token_count < 50
    assert report.lex_fallback is True
    # Should have a solid composite score (> 0.15)
    assert report.composite >= 0.15
