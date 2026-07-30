"""Tests for tools/check_thinking_comments.py (the thinking-check gate).

Sample violations live in string literals, never in real comments, so this
file stays clean under the gate itself.
"""

import importlib.util
import os

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(TOOLS_DIR, "check_thinking_comments.py")

_spec = importlib.util.spec_from_file_location("check_thinking_comments", SCRIPT)
check_thinking_comments = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(check_thinking_comments)

find_violations = check_thinking_comments.find_violations
iter_tracked_sources = check_thinking_comments.iter_tracked_sources
scan_abandoned_tests = check_thinking_comments.scan_abandoned_tests
scan_c_style_comments = check_thinking_comments.scan_c_style_comments
scan_js_empty_tests = check_thinking_comments.scan_js_empty_tests
scan_python_comments = check_thinking_comments.scan_python_comments
scan_shell_comments = check_thinking_comments.scan_shell_comments
thinking_in_comment = check_thinking_comments.thinking_in_comment

FLAGGED_COMMENTS = [
    "Wait, if core is empty",
    "wait! that breaks",
    "Ah, that explains it",
    "Hmm this is odd",
    "huh",
    "Oh wait, no",
    "oh no this cannot be",
    "Oops wrong branch",
    "Nope, try again",
    "Hold on, is this right",
    "Actually, just pass empty string",
    "How about a command in the trie",
    "Let's check `handleCommand`",
    "lets look at what's in the map",
    "Let's mock the internal methods",
    "Let me think about this",
    "Let's assume the user provides an rgba string",
    "for simplicity let's rely on globalAlpha",
    "If we just use globalAlpha, it might be easier.",
    "This is tricky without a full color parser.",
    "To hit line 238, core must be empty",
    "blocks to reach line 746.",  # mid-comment coverage note
    "it hits line 246 early return",
]

CLEAN_COMMENTS = [
    "Retry after the backoff interval",
    "wait for the DOM before binding",  # "wait" without trailing punctuation is prose
    "It groups by table, so counting works",
    "Expands to 'due' via the switchShortcuts map",
    "Matches the legacy behaviour of upstream",
    "Mock the internal methods called by the server instead.",
    "Assume the API returns JSON",
    "It lets the caller decide",
]


def test_flagged_comments_detected():
    for text in FLAGGED_COMMENTS:
        assert thinking_in_comment(text), f"should flag: {text!r}"


def test_clean_comments_not_flagged():
    for text in CLEAN_COMMENTS:
        assert not thinking_in_comment(text), f"false positive: {text!r}"


def test_python_comment_flagged_with_lineno():
    src = "x = 1\n# Wait, this cannot be right\ny = 2\n"
    assert list(scan_python_comments(src)) == [(2, "Wait, this cannot be right")]


def test_python_string_contents_are_not_comments():
    src = 'MSG = "Wait, if core is empty"\n'
    assert list(scan_python_comments(src)) == []


def test_python_unparseable_source_skipped():
    assert list(scan_python_comments("def broken(:\n")) == []


def test_abandoned_module_level_test_flagged():
    src = "def test_nothing():\n    pass\n"
    assert list(scan_abandoned_tests(src)) == [(1, "test_nothing")]


def test_abandoned_docstring_only_test_flagged():
    src = 'def test_nothing():\n    """TODO: write this."""\n'
    assert list(scan_abandoned_tests(src)) == [(1, "test_nothing")]


def test_abandoned_ellipsis_test_flagged():
    src = "def test_nothing():\n    ...\n"
    assert list(scan_abandoned_tests(src)) == [(1, "test_nothing")]


def test_abandoned_method_in_test_class_flagged():
    src = "class TestThing:\n    def test_nothing(self):\n        pass\n"
    assert list(scan_abandoned_tests(src)) == [(2, "test_nothing")]


def test_nested_helper_not_flagged():
    # pytest never collects closures; a `test_func` helper exercising a
    # decorator is legitimate.
    src = "def test_real():\n    def test_func():\n        pass\n    assert test_func() is None\n"
    assert list(scan_abandoned_tests(src)) == []


def test_real_test_not_flagged():
    src = "def test_real():\n    assert 1 + 1 == 2\n"
    assert list(scan_abandoned_tests(src)) == []


def test_non_collectable_pass_bodies_not_flagged():
    src = "def helper():\n    pass\n\n\nclass Plain:\n    def test_x(self):\n        pass\n"
    assert list(scan_abandoned_tests(src)) == []


def test_js_line_comment_flagged():
    hits = list(scan_c_style_comments("const x = 1;\n// Wait, is this right?\n"))
    assert hits == [(2, "Wait, is this right?")]


def test_js_block_comment_and_interior_flagged():
    src = "/* Ah, now I see */\n/*\n * Hmm not sure\n */\n"
    hits = list(scan_c_style_comments(src))
    assert [line for line, _ in hits] == [1, 3]


def test_js_url_not_treated_as_comment():
    src = 'const u = "https://example.com/wait,x";\n'
    assert list(scan_c_style_comments(src)) == []


def test_js_clean_comment_not_flagged():
    src = "// Retry after the backoff interval\n"
    assert list(scan_c_style_comments(src)) == []


def test_c_line_comment_flagged():
    src = "int x = 1;\n// Actually, the buffer is fine\n"
    assert list(scan_c_style_comments(src)) == [(2, "Actually, the buffer is fine")]


def test_c_block_comment_flagged():
    src = "/*\n * Hmm not sure about this\n */\nint x;\n"
    hits = list(scan_c_style_comments(src))
    assert [line for line, _ in hits] == [2]


def test_shell_full_line_comment_flagged():
    src = "#!/bin/sh\n# Wait, is this right?\necho ok\n"
    assert list(scan_shell_comments(src)) == [(2, "Wait, is this right?")]


def test_shell_inline_comment_not_scanned():
    # Inline `#` in shell is too ambiguous (${var#prefix}); only full-line
    # comments are scanned.
    src = 'echo ok # Actually, fine\nx="${v#pre}"\n'
    assert list(scan_shell_comments(src)) == []


def test_js_empty_arrow_test_flagged():
    src = "it('does nothing', () => {});\n"
    assert list(scan_js_empty_tests(src)) == [(1, "does nothing")]


def test_js_empty_function_test_flagged():
    src = 'test("nothing", function () {\n});\n'
    assert list(scan_js_empty_tests(src)) == [(1, "nothing")]


def test_js_comment_only_body_flagged():
    src = "it('planned', () => {\n  // cover the edge case later\n});\n"
    assert list(scan_js_empty_tests(src)) == [(1, "planned")]


def test_js_real_test_not_flagged():
    src = "it('works', () => { assert.ok(true); });\n"
    assert list(scan_js_empty_tests(src)) == []


def test_js_multiline_title_and_async_flagged():
    src = "it(`async\nnothing`, async () => {\n});\n"
    assert list(scan_js_empty_tests(src)) == [(1, "async\nnothing")]


def test_repo_tree_is_clean():
    # The gate is also exercised here so a violation fails the test suite even
    # when someone runs pytest without the make target.
    assert list(find_violations(iter_tracked_sources())) == []
