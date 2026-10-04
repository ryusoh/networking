"""Tests for tools.task_harness state ledger in networking."""

from __future__ import annotations

import json
from pathlib import Path

from tools.task_harness import (
    GateItem,
    TaskState,
    load_state,
    main,
    parse_work_orders,
    save_state,
)

SAMPLE_MARKDOWN = """
# Action Items

### Work Order 1: First item
- **File**: `src/first.py`
- **Tag**: `[trivial]`
- **Find**: `old_func()`
- **Change**: Replace with `new_func()`
- **Verify**: `pytest tests/test_first.py`

### Work Order 2: Second item to skip
- **Files**: `src/second.py`, `src/helper.py`
- **Tag**: `[skip]`
- **Find**: `complex_logic()`
- **Change**: Hand off to human
- **Verify**: `make verify`

### Work Order 3: Third item
- **File**: `src/third.py`
- **Tag**: `[low]`
- **Find**: `target_line`
- **Change**: Update target line
- **Verify**: `pytest tests/test_third.py`
"""


def test_parse_work_orders() -> None:
    state = parse_work_orders(SAMPLE_MARKDOWN, source_doc="docs/task.md")
    assert state.total_gates == 3
    assert state.task_id == "task"
    _assert_gate_1(state.gates[0])
    _assert_gate_2(state.gates[1])
    assert state.mounts is not None
    assert "src" in state.mounts
    assert "src/first.py" in state.mounts["src"]


def test_save_and_load_state(tmp_path: Path) -> None:
    state_file = tmp_path / "state.json"
    state = TaskState(
        task_id="test-task",
        source_doc="test.md",
        total_gates=1,
        current_gate_index=0,
        gates=[
            GateItem(
                id="gate-1",
                number=1,
                title="Title",
                tag="low",
                file="test.py",
                status="PENDING",
            )
        ],
        mounts={"root": ["test.py"]},
    )
    save_state(state, state_file)
    assert state_file.is_file()

    loaded = load_state(state_file)
    assert loaded.task_id == "test-task"
    assert len(loaded.gates) == 1
    assert loaded.gates[0].title == "Title"
    assert loaded.mounts == {"root": ["test.py"]}


def test_cli_lifecycle(tmp_path: Path, capsys) -> None:
    doc_path = tmp_path / "orders.md"
    doc_path.write_text(SAMPLE_MARKDOWN, encoding="utf-8")
    state_file = tmp_path / "state.json"

    # 1. init
    _step_init(tmp_path, state_file, doc_path)
    capsys.readouterr()  # Clear capsys since main writes to sys.stdout internally

    # 2. current
    _step_current(tmp_path, state_file, 1, "PENDING")

    # 3. record-commit for gate 1
    _step_record_commit(tmp_path, state_file, "1", "abc1234")

    # 4. current should now be gate 3 (since gate 2 is SKIPPED)
    _step_current(tmp_path, state_file, 3)

    # 5. verify-all should fail before gate 3 is done
    _step_verify_all(tmp_path, state_file, 1)

    # 6. record-commit for gate 3
    _step_record_commit(tmp_path, state_file, "3", "def5678")

    # 7. verify-all should now pass
    _step_verify_all(tmp_path, state_file, 0)

    # 8. status check
    _step_status(tmp_path, state_file, "2/3 done, 1 skipped, 0 pending")

#


def test_render_worker_prompt(tmp_path: Path, capsys) -> None:
    doc_path = tmp_path / "orders.md"
    doc_path.write_text(SAMPLE_MARKDOWN, encoding="utf-8")
    state_file = tmp_path / "state.json"

    main(["--repo", str(tmp_path), "--state-file", str(state_file), "init", str(doc_path)])
    capsys.readouterr()

    ret = main(
        ["--repo", str(tmp_path), "--state-file", str(state_file), "render-worker-prompt", "1"]
    )
    assert ret == 0
    prompt = capsys.readouterr().out
    assert "Work Order Execution Task: Gate 1" in prompt
    assert "src/first.py" in prompt
    assert "pytest tests/test_first.py" in prompt
    assert "Scoped Toolset (OCS Routing)" in prompt
    assert "ruff (lint)" in prompt


def test_reconcile_state(tmp_path: Path, capsys) -> None:
    doc_path = tmp_path / "orders.md"
    doc_path.write_text(SAMPLE_MARKDOWN, encoding="utf-8")
    state_file = tmp_path / "state.json"

    main(["--repo", str(tmp_path), "--state-file", str(state_file), "init", str(doc_path)])
    capsys.readouterr()

    # Reconcile when uncommitted
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "reconcile"])
    assert ret == 0
    summary = capsys.readouterr().out
    assert "0/3 DONE, 1 SKIPPED, 2 PENDING" in summary
    assert "Program Counter -> Gate 1" in summary


def _assert_gate_1(gate):
    assert gate.number == 1
    assert gate.title == "First item"
    assert gate.tag == "trivial"
    assert gate.file == "src/first.py"
    assert gate.status == "PENDING"
    assert gate.verification == "pytest tests/test_first.py"

def _assert_gate_2(gate):
    assert gate.number == 2
    assert gate.tag == "skip"
    assert gate.status == "SKIPPED"

def _run_cli(args):
    import sys
    from io import StringIO
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    try:
        ret = main(args)
        out = sys.stdout.getvalue()
    finally:
        sys.stdout = old_stdout
    return ret, out

def _step_init(tmp_path, state_file, doc_path):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "init", str(doc_path)])
    assert ret == 0

def _step_current(tmp_path, state_file, expected_number, expected_status=None):
    ret, out = _run_cli(["--repo", str(tmp_path), "--state-file", str(state_file), "current"])
    assert ret == 0
    current_json = json.loads(out)
    assert current_json["number"] == expected_number
    if expected_status:
        assert current_json["status"] == expected_status

def _step_record_commit(tmp_path, state_file, gate_num, commit_hash):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "record-commit", gate_num, commit_hash])
    assert ret == 0

def _step_verify_all(tmp_path, state_file, expected_ret):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "verify-all"])
    assert ret == expected_ret

def _step_status(tmp_path, state_file, expected_substring):
    ret, out = _run_cli(["--repo", str(tmp_path), "--state-file", str(state_file), "status"])
    assert ret == 0
    assert expected_substring in out



def _assert_gate_1(gate):
    assert gate.number == 1
    assert gate.title == "First item"
    assert gate.tag == "trivial"
    assert gate.file == "src/first.py"
    assert gate.status == "PENDING"
    assert gate.verification == "pytest tests/test_first.py"

def _assert_gate_2(gate):
    assert gate.number == 2
    assert gate.tag == "skip"
    assert gate.status == "SKIPPED"

def _run_cli(args):
    import sys
    from io import StringIO
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    try:
        ret = main(args)
        out = sys.stdout.getvalue()
    finally:
        sys.stdout = old_stdout
    return ret, out

def _step_init(tmp_path, state_file, doc_path):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "init", str(doc_path)])
    assert ret == 0

def _step_current(tmp_path, state_file, expected_number, expected_status=None):
    ret, out = _run_cli(["--repo", str(tmp_path), "--state-file", str(state_file), "current"])
    assert ret == 0
    current_json = json.loads(out)
    assert current_json["number"] == expected_number
    if expected_status:
        assert current_json["status"] == expected_status

def _step_record_commit(tmp_path, state_file, gate_num, commit_hash):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "record-commit", gate_num, commit_hash])
    assert ret == 0

def _step_verify_all(tmp_path, state_file, expected_ret):
    ret = main(["--repo", str(tmp_path), "--state-file", str(state_file), "verify-all"])
    assert ret == expected_ret

def _step_status(tmp_path, state_file, expected_substring):
    ret, out = _run_cli(["--repo", str(tmp_path), "--state-file", str(state_file), "status"])
    assert ret == 0
    assert expected_substring in out

#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#
#