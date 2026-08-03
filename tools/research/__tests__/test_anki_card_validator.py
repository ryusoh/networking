"""Tests for the Anki TSV card validator."""
import json
from pathlib import Path

from tools.research.anki_card_validator import validate_cards, validate_tsv


def _write_tsv(tmp_path: Path, rows: list[str]) -> Path:
    p = tmp_path / "test_import.txt"
    p.write_text("#separator:Tab\n#html:true\n" + "\n".join(rows) + "\n", encoding="utf-8")
    return p


def _card_issues(issues: dict, card_num: int) -> list[str]:
    for key, vals in issues.items():
        if key.startswith(f"card {card_num} "):
            return vals
    return []


def _all_issue_texts(issues: dict) -> list[str]:
    return [text for vals in issues.values() for text in vals]


def test_clean_card_passes(tmp_path: Path) -> None:
    rows = [
        "边界网关协议 (Border Gateway Protocol, BGP): BGP 如何通过 AS-PATH 实现域间路由？\t"
        "<div><b>定义 (Definition):</b></div><div><b>BGP</b> 是路径向量路由协议，使用 <b>AS-PATH</b> 防止环路。</div>"
        "<div><b>机制 (Mechanism):</b></div><div>路由通过 <b>NEXT-HOP</b> 和 <b>Local-Pref</b> 属性选择。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs232/bgp.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research networking"
    ]
    path = _write_tsv(tmp_path, rows)
    assert validate_tsv(path) == {}


def test_control_characters_are_flagged(tmp_path: Path) -> None:
    rows = [
        "BGP basics\t<div>peers\x01path vector\x02</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("control character" in i for i in _all_issue_texts(issues))


def test_slide_title_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Wireless, Mobile Networks 6-58: question\t<div>Mobile IP</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("slide title" in i for i in _all_issue_texts(issues))


def test_generic_topic_is_flagged(tmp_path: Path) -> None:
    rows = ["BGP basics\t<div>content</div>\tresearch networking"]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("generic topic" in i.lower() for i in _all_issue_texts(issues))


def test_duplicate_titles_within_batch_are_flagged(tmp_path: Path) -> None:
    rows = [
        "BGP Path Vector\t<div>a</div>\tresearch networking",
        "BGP Path Vector: ask\t<div>b</div>\tresearch networking",
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("duplicate title" in i.lower() for i in _all_issue_texts(issues))


def test_ocr_errors_are_flagged(tmp_path: Path) -> None:
    rows = [
        "Question\t<div>limi e due to the q frequent changes</div>\tresearch networking"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("ocr" in i.lower() for i in _all_issue_texts(issues))


def test_paper_metadata_dump_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Real question about consensus protocols?\t"
        "<div>Categories and Subject Descriptors: C.2.4 General Terms: Algorithms / 1. INTRODUCTION text</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("paper metadata" in i for i in _all_issue_texts(issues))


def test_author_affiliation_block_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Real question about consensus protocols?\t"
        "<div>LESLIE LAMPORT, ROBERT SHOSTAK SRI International studied agreement.</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("author/affiliation" in i for i in _all_issue_texts(issues))


def test_date_stamp_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Real question about consensus protocols?\t<div>Winter notes 1/13/17 on NUMA</div>\tresearch"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("date stamp" in i for i in _all_issue_texts(issues))


def test_template_front_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Paxos: 【Paxos】的核心技术机制、计算公式与工程应用是什么？\t<div>consensus</div>\tresearch"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("fallback template" in i for i in _all_issue_texts(issues))


def test_abstract_dump_card_is_flagged_on_multiple_detectors(tmp_path: Path) -> None:
    """The Byzantine Generals failure mode: title front + raw abstract back."""
    rows = [
        "The Byzantine Generals Problem: 【The Byzantine Generals Problem】的核心技术机制、计算公式与工程应用是什么？\t"
        "<div>LESLIE LAMPORT, ROBERT SHOSTAK, and MARSHALL PEASE SRI International ... "
        "oral messages ... two-thirds ... Categories and Subject Descriptors: C.2.4 "
        "General Terms: Algorithms / 1. INTRODUCTION A reliable computer system</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    texts = _all_issue_texts(issues)
    assert any("fallback template" in i for i in texts)
    assert any("paper metadata" in i for i in texts)
    assert any("author/affiliation" in i for i in texts)


def test_low_density_card_is_flagged(tmp_path: Path) -> None:
    """A short, unstructured, Chinese-only card like the post-regression batch must fail."""
    rows = [
        "并行二维 FFT 中，如何将矩阵分配给多个处理器？\t"
        "将矩阵划分为方块，每个处理器负责一行。Data Distribution: an n×n matrix is partitioned into blocks.<br><br>来源：[research/cs231/parallel-fft.md#L103-L167](file:///tmp/x.md)\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    texts = _all_issue_texts(issues)
    assert any("bilingual term annotation" in i for i in texts)
    assert any("inline English term annotations" in i for i in texts)
    assert any("structured section headers" in i for i in texts)


def test_router_id_list_is_flagged(tmp_path: Path) -> None:
    rows = [
        "Real question about OSPF flooding?\t<div>Router1 Router2 Router3 exchange LSAs</div>\tresearch"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("ASCII diagram" in i for i in _all_issue_texts(issues))


def test_router_domain_name_is_not_a_diagram(tmp_path: Path) -> None:
    """A hostname like router137.cerf.edu is prose, not a router-ID diagram."""
    rows = [
        "地址绑定到接口 (Addresses Bind to Interfaces): 为什么域名分配给接口而非主机？\t"
        "<div><b>核心论断 (Key Claim):</b></div><div><b>域名</b>、<b>IP 地址</b>、<b>MAC 地址</b>分配给<b>网络接口</b>。</div>"
        "<div><b>示例 (Example):</b></div><div>同一台路由器从不同接口引用时有不同域名，如 <b>router137.cerf.edu</b>。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs233/ch0.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    assert validate_tsv(path) == {}


def test_reviewed_bilingual_card_passes(tmp_path: Path) -> None:
    rows = [
        "拜占庭将军问题 (Byzantine Generals Problem): 口头消息下的可解条件是什么？\t"
        "<div><b>定义 (Definition):</b></div><div>仅使用 <b>oral messages</b> 时，可解当且仅当超过三分之二忠诚。</div>"
        "<div><b>条件 (Condition):</b></div><div>即 \\(n \\geq 3m+1\\)。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs234/byzantine.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    assert validate_tsv(path) == {}


def test_golden_corpus_accepted_and_rejected() -> None:
    """Regression fixture covering known good and bad cards from production imports."""
    fixture = Path(__file__).parent / "fixtures" / "anki_golden.jsonl"
    records = [json.loads(line) for line in fixture.read_text(encoding="utf-8").splitlines() if line.strip()]
    cards = [{k: r[k] for k in ("chunk_id", "front", "back", "tags")} for r in records]
    issues = validate_cards(cards)

    rejected_chunk_ids = {r["chunk_id"] for r in records if r["expected"] == "rejected"}
    accepted_chunk_ids = {r["chunk_id"] for r in records if r["expected"] == "accepted"}

    # All rejected records must have at least one validator issue.
    flagged_chunk_ids = {cards[int(label.split()[1]) - 1]["chunk_id"] for label in issues}
    assert rejected_chunk_ids <= flagged_chunk_ids, f"Expected rejections missing: {rejected_chunk_ids - flagged_chunk_ids}"

    # All accepted records must have zero issues.
    for i, card in enumerate(cards, start=1):
        if card["chunk_id"] in accepted_chunk_ids:
            assert f"card {i}" not in issues, f"Expected {card['chunk_id']} to pass, got {issues[f'card {i}']}"
