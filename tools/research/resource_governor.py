#!/usr/bin/env python3
"""Phase 3 ResourceGovernor: token budgets and execution timeouts for research CLIs.

This is intentionally lightweight: no filesystem sandboxing, no process limits,
just the two bounded resources the research-agent specs call out.
"""

from __future__ import annotations

import math
import signal
from contextlib import contextmanager
from typing import Any, Generator

from tools.research.parse_chunks import estimate_tokens


class BudgetExceededError(Exception):
    """Raised when a requested allocation exceeds the remaining token budget."""


class TimeoutError(Exception):  # noqa: A001
    """Raised when a governed operation exceeds its allotted wall-clock time."""


class ResourceGovernor:
    """Owns a token budget and exposes timeout enforcement.

    Args:
        max_tokens: Total token budget (including base overhead).
        base_tokens: Tokens reserved for instructions/prompt framing. The
            remaining budget is available for source chunks.
    """

    def __init__(self, max_tokens: int, base_tokens: int = 200):
        self.max_tokens = max_tokens
        self.base_tokens = base_tokens
        self.used_tokens = base_tokens

    @property
    def remaining_tokens(self) -> int:
        return max(0, self.max_tokens - self.used_tokens)

    def can_fit(self, tokens: int) -> bool:
        """Return True if ``tokens`` fit in the remaining budget."""
        return self.used_tokens + tokens <= self.max_tokens

    def allocate(self, tokens: int) -> None:
        """Reserve ``tokens`` from the budget, raising if they do not fit."""
        if not self.can_fit(tokens):
            raise BudgetExceededError(
                f"Requested {tokens} tokens but only {self.remaining_tokens} remain"
            )
        self.used_tokens += tokens

    def try_allocate(self, tokens: int) -> bool:
        """Reserve ``tokens`` if they fit; return whether allocation succeeded."""
        if self.can_fit(tokens):
            self.used_tokens += tokens
            return True
        return False

    def truncate_content_to_fit(self, content: str, min_tokens: int = 100) -> tuple[str, int]:
        """Truncate ``content`` to the remaining budget.

        Returns the truncated text and the token count it was truncated to.
        """
        allowed_tokens = max(min_tokens, self.remaining_tokens)
        allowed_chars = allowed_tokens * 4
        truncated = content[:allowed_chars] + "\n... [Truncated for token budget]"
        return truncated, allowed_tokens

    @contextmanager
    def timeout(self, seconds: float | None) -> Generator[None, None, None]:
        """Context manager that raises TimeoutError after ``seconds`` wall time.

        A ``seconds`` value of ``None`` or ``0`` disables the timeout.
        """
        if not seconds:
            yield
            return

        if not hasattr(signal, "SIGALRM"):
            # signal.SIGALRM is unavailable on Windows; skip timeout enforcement there.
            yield
            return

        def _handler(signum: int, frame: Any) -> None:  # noqa: ARG001
            raise TimeoutError(f"Operation exceeded {seconds} second timeout")

        old_handler = signal.signal(signal.SIGALRM, _handler)
        old_seconds = signal.alarm(max(1, math.ceil(seconds)))
        try:
            yield
        finally:
            signal.alarm(0)
            signal.signal(signal.SIGALRM, old_handler)
            if old_seconds:
                signal.alarm(old_seconds)
