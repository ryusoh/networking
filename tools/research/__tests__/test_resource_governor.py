"""Unit tests for tools/research/resource_governor.py."""

import time

import pytest

from tools.research.resource_governor import (
    BudgetExceededError,
    ResourceGovernor,
    TimeoutError,
)


def test_resource_governor_tracks_remaining_tokens():
    gov = ResourceGovernor(max_tokens=1000, base_tokens=100)
    assert gov.remaining_tokens == 900
    assert gov.try_allocate(400) is True
    assert gov.remaining_tokens == 500


def test_resource_governor_refuses_over_budget():
    gov = ResourceGovernor(max_tokens=1000, base_tokens=100)
    assert gov.try_allocate(901) is False
    assert gov.used_tokens == 100


def test_resource_governor_allocate_raises_when_over_budget():
    gov = ResourceGovernor(max_tokens=1000, base_tokens=100)
    with pytest.raises(BudgetExceededError):
        gov.allocate(901)


def test_resource_governor_truncate_returns_minimum():
    gov = ResourceGovernor(max_tokens=1000, base_tokens=950)
    text = "x" * 4000
    truncated, tokens = gov.truncate_content_to_fit(text)
    assert tokens == 100
    assert "Truncated for token budget" in truncated


def test_resource_governor_timeout_raises_on_slow_operation():
    gov = ResourceGovernor(max_tokens=1000)
    with pytest.raises(TimeoutError):
        with gov.timeout(0.5):
            deadline = time.time() + 2.0
            while time.time() < deadline:
                pass


def test_resource_governor_timeout_disabled_with_zero():
    gov = ResourceGovernor(max_tokens=1000)
    with gov.timeout(0):
        time.sleep(0.01)
