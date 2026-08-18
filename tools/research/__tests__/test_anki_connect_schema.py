"""Integration test for AnkiConnect notesInfo response schema (spec T1).

Finding: notesInfo returns note metadata including 'fields' with 'Front' and 'Back'
(each holding 'value' and 'order'), but does NOT return the note 'guid'.
Therefore, a guid->nid mapping lookup is required when querying by note GUID.
"""

import json
import urllib.request
import pytest
from tools.research.anki_generator import AnkiConnectChecker


def is_anki_running() -> bool:
    """Check if AnkiConnect is reachable on local port 8765."""
    return AnkiConnectChecker().is_available()


@pytest.mark.skipif(not is_anki_running(), reason="AnkiConnect not reachable at 127.0.0.1:8765")
def test_anki_connect_notes_info_schema():
    """Verify notesInfo response contains fields with Front and Back."""
    url = "http://127.0.0.1:8765"
    find_payload = json.dumps(
        {"action": "findNotes", "version": 6, "params": {"query": "deck:金融"}}
    ).encode("utf-8")
    req = urllib.request.Request(
        url, data=find_payload, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=5.0) as resp:
            find_res = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        pytest.skip(f"AnkiConnect request timed out or failed: {e}")

    note_ids = find_res.get("result", [])
    if not note_ids:
        find_payload_all = json.dumps(
            {"action": "findNotes", "version": 6, "params": {"query": ""}}
        ).encode("utf-8")
        req_all = urllib.request.Request(
            url, data=find_payload_all, headers={"Content-Type": "application/json"}
        )
        try:
            with urllib.request.urlopen(req_all, timeout=5.0) as resp_all:
                note_ids = json.loads(resp_all.read().decode("utf-8")).get("result", [])
        except Exception as e:
            pytest.skip(f"AnkiConnect request timed out or failed: {e}")

    assert len(note_ids) > 0, "No notes found in Anki collection for schema test"
    nid = note_ids[0]

    info_payload = json.dumps(
        {"action": "notesInfo", "version": 6, "params": {"notes": [nid]}}
    ).encode("utf-8")
    info_req = urllib.request.Request(
        url, data=info_payload, headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(info_req, timeout=5.0) as resp:
            info_res = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        pytest.skip(f"AnkiConnect request timed out or failed: {e}")

    assert info_res.get("error") is None
    result = info_res.get("result", [])
    assert len(result) == 1
    note_info = result[0]

    assert "fields" in note_info
    fields = note_info["fields"]
    assert "Front" in fields
    assert "Back" in fields
    assert "value" in fields["Front"]
    assert "value" in fields["Back"]

    assert "guid" not in note_info
