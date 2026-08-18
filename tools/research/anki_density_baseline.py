"""Baseline Density Builder for Anki Decks (tools/research/anki_density_baseline.py).

Computes deterministic baseline information density from top-PageRank hub cards
in the knowledge graph, constructs domain lexicons, and manages baseline cache.
"""

from __future__ import annotations

from collections import Counter
import gzip
import hashlib
import json
from dataclasses import asdict, dataclass
import os
from pathlib import Path
import urllib.request
import zlib
from typing import Any

import jieba

from tools.research.anki_density import (
    DensityReport,
    card_density,
    normalize_text,
    tokenize,
)
from tools.research.anki_graph_bridge import ANKI_REPO_ROOT, AnkiGraphBridge

DEFAULT_BASELINE_CACHE_PATH = (
    Path(__file__).resolve().parent.parent.parent / "research" / ".anki_density_baseline.json"
)

ENGLISH_STOPWORDS = {
    "the",
    "a",
    "an",
    "is",
    "are",
    "of",
    "to",
    "in",
    "and",
    "or",
    "for",
    "on",
    "at",
    "by",
    "with",
    "from",
    "as",
    "it",
    "this",
    "that",
}

CHINESE_STOPWORDS = {
    "的",
    "了",
    "在",
    "是",
    "我",
    "有",
    "和",
    "就",
    "不",
    "人",
    "都",
    "一",
    "一个",
    "上",
    "也",
    "很",
    "到",
    "说",
    "要",
    "去",
    "你",
    "会",
    "着",
    "没有",
    "看",
    "好",
    "自己",
    "这",
}

ALL_STOPWORDS = ENGLISH_STOPWORDS | CHINESE_STOPWORDS


def top_k_hub_guids(
    deck: str = "金融", k: int = 10, repo_root: Path = ANKI_REPO_ROOT
) -> list[str]:
    """Retrieve top-k PageRank note GUIDs for target deck from knowledge graph."""
    bridge = AnkiGraphBridge(target_deck=deck, repo_root=repo_root)
    if not bridge.nodes:
        return []

    # Sort nodes by PageRank descending
    sorted_nodes = sorted(
        bridge.nodes,
        key=lambda n: float(n.get("pagerank") or n.get("p") or 0.0),
        reverse=True,
    )
    guids: list[str] = []
    for node in sorted_nodes:
        nid = node.get("id") or node.get("l") or ""
        if nid and nid not in guids:
            guids.append(nid)
            if len(guids) >= k:
                break
    return guids


def fetch_note_texts(
    guids: list[str],
    mode: str = "live",
    repo_root: Path = ANKI_REPO_ROOT,
    anki_connect_url: str = "http://127.0.0.1:8765",
) -> dict[str, dict[str, str]]:
    """Fetch note front and back HTML texts for given GUIDs.

    Supports 'live' (AnkiConnect + notes.json.gz map) and 'staged' (R2 collection export).
    Raises RuntimeError if required files are missing or notes cannot be retrieved.
    """
    if not guids:
        return {}

    result: dict[str, dict[str, str]] = {}

    if mode == "live":
        map_path = repo_root / "data" / "anki" / "notes.json.gz"
        if not map_path.exists():
            raise RuntimeError(
                f"Notes GUID-to-NID mapping file not found at {map_path}"
            )

        try:
            with gzip.open(map_path, "rt", encoding="utf-8") as f:
                notes_data = json.load(f)
        except Exception as e:
            raise RuntimeError(f"Failed to read {map_path}: {e}") from e

        guid_to_nid: dict[str, int] = {}
        for item in notes_data:
            guid = item.get("guid")
            nid = item.get("id")
            if guid and nid:
                guid_to_nid[guid] = nid

        needed_nids = [guid_to_nid[g] for g in guids if g in guid_to_nid]
        if not needed_nids:
            raise RuntimeError(f"None of requested GUIDs found in {map_path}")

        payload = json.dumps(
            {"action": "notesInfo", "version": 6, "params": {"notes": needed_nids}}
        ).encode("utf-8")
        req = urllib.request.Request(
            anki_connect_url,
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                resp_data = json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            raise RuntimeError(
                f"AnkiConnect request failed at {anki_connect_url}: {e}"
            ) from e

        if resp_data.get("error"):
            raise RuntimeError(f"AnkiConnect error: {resp_data['error']}")

        notes_info_list = resp_data.get("result", [])
        nid_to_fields = {}
        for note_info in notes_info_list:
            if not note_info:
                continue
            nid = note_info.get("noteId")
            fields = note_info.get("fields", {})
            front_val = fields.get("Front", {}).get("value", "")
            back_val = fields.get("Back", {}).get("value", "")
            # Fallback if field names differ
            if not front_val and not back_val and fields:
                keys = list(fields.keys())
                front_val = fields.get(keys[0], {}).get("value", "") if len(keys) > 0 else ""
                back_val = fields.get(keys[1], {}).get("value", "") if len(keys) > 1 else ""
            nid_to_fields[nid] = {"front": front_val, "back": back_val}

        for guid in guids:
            if guid in guid_to_nid and guid_to_nid[guid] in nid_to_fields:
                result[guid] = nid_to_fields[guid_to_nid[guid]]
            else:
                raise RuntimeError(f"Note GUID {guid} could not be retrieved via live AnkiConnect")

    elif mode == "staged":
        staged_path = repo_root / "data" / "cloudflare" / "collection" / "notes.json.gz"
        if not staged_path.exists():
            raise RuntimeError(
                f"Staged collection export not found at {staged_path}"
            )

        try:
            with gzip.open(staged_path, "rt", encoding="utf-8") as f:
                staged_data = json.load(f)
        except Exception as e:
            raise RuntimeError(f"Failed to read {staged_path}: {e}") from e

        staged_guid_map: dict[str, dict[str, str]] = {}
        for item in staged_data:
            guid = item.get("guid")
            flds = item.get("flds", "")
            if guid:
                parts = flds.split("\x1f")
                front = parts[0] if len(parts) > 0 else ""
                back = parts[1] if len(parts) > 1 else ""
                staged_guid_map[guid] = {"front": front, "back": back}

        for guid in guids:
            if guid in staged_guid_map:
                result[guid] = staged_guid_map[guid]
            else:
                raise RuntimeError(f"Note GUID {guid} not found in staged export {staged_path}")
    else:
        raise ValueError(f"Invalid mode '{mode}', expected 'live' or 'staged'")

    return result


def _is_single_cjk_char(token: str) -> bool:
    """Check if token is a single CJK character."""
    if len(token) == 1 and ("\u4e00" <= token <= "\u9fff" or "\u3040" <= token <= "\u30ff"):
        return True
    return False


def build_domain_lexicon(
    deck: str = "金融",
    k: int = 10,
    max_terms: int = 500,
    mode: str = "live",
    repo_root: Path = ANKI_REPO_ROOT,
    anki_connect_url: str = "http://127.0.0.1:8765",
) -> set[str]:
    """Extract domain lexicon from top-k hub cards in the target deck."""
    guids = top_k_hub_guids(deck=deck, k=k, repo_root=repo_root)
    if not guids:
        return set()

    note_texts = fetch_note_texts(
        guids=guids, mode=mode, repo_root=repo_root, anki_connect_url=anki_connect_url
    )

    token_counts: Counter[str] = Counter()
    for item in note_texts.values():
        normalized = normalize_text(item.get("front", ""), item.get("back", ""))
        tokens = tokenize(normalized)
        for token in tokens:
            t = token.strip()
            if not t:
                continue
            if t in ALL_STOPWORDS:
                continue
            if _is_single_cjk_char(t):
                continue
            token_counts[t] += 1

    top_terms = [term for term, _ in token_counts.most_common(max_terms)]
    return set(top_terms)


def compute_graph_hash(graph_path: Path) -> str:
    """Calculate SHA256 hash of the first 1MB of graph_data.json."""
    if not graph_path.exists():
        return ""
    hasher = hashlib.sha256()
    with open(graph_path, "rb") as f:
        chunk = f.read(1024 * 1024)
        hasher.update(chunk)
    return hasher.hexdigest()


@dataclass(frozen=True)
class BaselineReport:
    """Report holding deck baseline information density and domain lexicon."""

    deck: str
    top_guids: list[str]
    mean_density: float
    per_card: list[DensityReport]
    lexicon: set[str]
    zlib_version: str
    jieba_version: str
    graph_hash: str


def compute_baseline(
    deck: str = "金融",
    k: int = 10,
    mode: str = "live",
    repo_root: Path = ANKI_REPO_ROOT,
    anki_connect_url: str = "http://127.0.0.1:8765",
    cache_path: Path | None = None,
    force_recompute: bool = False,
) -> BaselineReport:
    """Compute or load cached baseline density report for target deck."""
    if cache_path is None:
        cache_path = DEFAULT_BASELINE_CACHE_PATH

    graph_path = repo_root / "graph" / "graph_data.json"
    graph_hash = compute_graph_hash(graph_path)
    current_zlib_ver = zlib.ZLIB_VERSION
    current_jieba_ver = getattr(jieba, "__version__", "unknown")

    # Attempt cache load if not forced
    if not force_recompute and cache_path.exists():
        try:
            cached = json.loads(cache_path.read_text(encoding="utf-8"))
            if (
                cached.get("deck") == deck
                and cached.get("graph_hash") == graph_hash
                and cached.get("zlib_version") == current_zlib_ver
                and cached.get("jieba_version") == current_jieba_ver
            ):
                per_card = [DensityReport(**item) for item in cached.get("per_card", [])]
                return BaselineReport(
                    deck=cached["deck"],
                    top_guids=cached.get("top_guids", []),
                    mean_density=float(cached.get("mean_density", 0.0)),
                    per_card=per_card,
                    lexicon=set(cached.get("lexicon", [])),
                    zlib_version=cached.get("zlib_version", ""),
                    jieba_version=cached.get("jieba_version", ""),
                    graph_hash=cached.get("graph_hash", ""),
                )
        except Exception:
            # Recompute on corrupted cache
            pass

    # Compute baseline
    guids = top_k_hub_guids(deck=deck, k=k, repo_root=repo_root)
    note_texts = fetch_note_texts(
        guids=guids, mode=mode, repo_root=repo_root, anki_connect_url=anki_connect_url
    )

    lexicon = build_domain_lexicon(
        deck=deck,
        k=max(k, 50),
        max_terms=500,
        mode=mode,
        repo_root=repo_root,
        anki_connect_url=anki_connect_url,
    )

    per_card_reports: list[DensityReport] = []
    for guid in guids:
        text_dict = note_texts.get(guid, {"front": "", "back": ""})
        report = card_density(text_dict.get("front", ""), text_dict.get("back", ""), lexicon)
        per_card_reports.append(report)

    if per_card_reports:
        mean_density = sum(r.composite for r in per_card_reports) / len(per_card_reports)
    else:
        mean_density = 0.0

    baseline = BaselineReport(
        deck=deck,
        top_guids=guids,
        mean_density=mean_density,
        per_card=per_card_reports,
        lexicon=lexicon,
        zlib_version=current_zlib_ver,
        jieba_version=current_jieba_ver,
        graph_hash=graph_hash,
    )

    # Save cache
    try:
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        serializable = {
            "deck": baseline.deck,
            "top_guids": baseline.top_guids,
            "mean_density": baseline.mean_density,
            "per_card": [asdict(r) for r in baseline.per_card],
            "lexicon": sorted(list(baseline.lexicon)),
            "zlib_version": baseline.zlib_version,
            "jieba_version": baseline.jieba_version,
            "graph_hash": baseline.graph_hash,
        }
        cache_path.write_text(json.dumps(serializable, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception as e:
        # Non-fatal if cache write fails
        pass

    return baseline
