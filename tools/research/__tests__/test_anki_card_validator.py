"""Tests for the Anki TSV card validator."""
import json
from pathlib import Path

from tools.research.anki_card_validator import (
    canonical_tag,
    canonicalize_tags,
    validate_cards,
    validate_tsv,
)


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
    assert any("structured section headers" in i for i in texts)


def test_sprinkled_back_is_flagged(tmp_path: Path) -> None:
    rows = [
        "并行二维 FFT 的精巧转置调度: 处理器 \\(P_i\\) 在第 \\(j\\) 步把块发给谁？\t"
        "<div><b>调度规则:</b></div><div>每一步 (per step) 每个处理器 (per processor) 恰好发送并接收一个块（one block per step）。</div>"
        "<div><b>复杂度:</b></div><div>精巧调度只需 \\(O(k)\\) 次块传输。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs231/fft.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("sprinkles" in i for i in _all_issue_texts(issues))


def test_unexplained_acronym_is_flagged(tmp_path: Path) -> None:
    rows = [
        "NITRD 重大挑战的进展指标 (Progress Indicators for NITRD Grand Challenges): 为什么成就难以量化？\t"
        "<div><b>定性本质 (Qualitative Nature):</b></div><div>成就本质上是定性的。</div>"
        "<div><b>指标谱系 (Indicator Spectrum):</b></div><div>指标横跨定量到定性。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs231/nitrd.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("never expanded" in i for i in _all_issue_texts(issues))


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
        "地址绑定到接口: 为什么域名分配给接口而非主机？\t"
        "<div><b>核心论断:</b></div><div><b>域名</b>、<b>IP 地址</b>、<b>MAC 地址</b>分配给<b>网络接口</b>。</div>"
        "<div><b>示例:</b></div><div>同一台路由器从不同接口引用时有不同域名，如 <b>router137.cerf.edu</b>。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> [research/cs233/ch0.md#L1-L5](file:///tmp/x.md)</div>\t"
        "research"
    ]
    path = _write_tsv(tmp_path, rows)
    assert validate_tsv(path) == {}


def test_reviewed_chinese_card_passes(tmp_path: Path) -> None:
    rows = [
        "拜占庭将军问题: 口头消息下的可解条件是什么？\t"
        "<div><b>定义:</b></div><div>仅使用 <b>oral messages</b> 时，可解当且仅当超过三分之二忠诚。</div>"
        "<div><b>条件:</b></div><div>即 \\(n \\geq 3m+1\\)。</div>"
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


CLEAN_FRONT = "<strong>实时系统</strong>: Stankovic 对实时系统正确性的经典定义是什么？"

CLEAN_BACK = (
    "<div><b>经典定义:</b></div>"
    "<div>实时系统的正确性不仅取决于计算结果本身，还取决于<b>结果产生的时间点</b>；"
    "结果正确但超过截止期限交付仍视为失效。</div>"
    "<div><b>分类:</b></div>"
    "<div>按时间约束的严格程度分为<b>硬实时</b>与<b>软实时</b>。</div>"
    "<div><b>源码与文档引用 (Source Citation):</b> "
    "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
)


def _issues(front: str, back: str) -> list[str]:
    return validate_cards([{"front": front, "back": back}]).get("card 1", [])


def test_clean_chinese_back_passes_with_zero_english_annotations() -> None:
    assert _issues(CLEAN_FRONT, CLEAN_BACK) == []


def test_acronym_expansions_are_exempt_from_the_cap() -> None:
    back = (
        "<div><b>组网形态:</b></div>"
        "<div>WSN (Wireless Sensor Network) 与 MANET (Mobile Ad-hoc Network) "
        "均无固定基础设施；IoT (Internet of Things) 应用常部署于其上。</div>"
        "<div><b>交付目标:</b></div>"
        "<div>前者交付信息，后者交付比特。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(CLEAN_FRONT, back) == []


def test_section_header_english_is_exempt_from_the_cap() -> None:
    back = (
        "<div><b>通信模式 (Communication Pattern):</b></div>"
        "<div>节点按块互发数据。</div>"
        "<div><b>复杂度 (Complexity):</b></div>"
        "<div>总传输量不随并行维度减少。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(CLEAN_FRONT, back) == []


def test_latex_and_citation_link_parens_are_not_counted() -> None:
    back = (
        "<div><b>数学形式:</b></div>"
        "<div>角频率 \\(\\omega = 2\\pi f\\) 决定相位 \\(e^{j(\\omega t + \\phi)}\\) 的旋转速度。</div>"
        "<div><b>稳态:</b></div>"
        "<div>所有点以同一频率振动。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(CLEAN_FRONT, back) == []


def test_unexplained_back_acronym_is_flagged() -> None:
    back = (
        "<div><b>层级:</b></div>"
        "<div>该过程对应 DIKW 金字塔的层级跃迁。</div>"
        "<div><b>代价:</b></div>"
        "<div>每级跃迁需要更多处理与建模。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    issues = _issues(CLEAN_FRONT, back)
    assert any("DIKW" in issue for issue in issues)


def test_expanded_back_acronym_is_accepted() -> None:
    back = (
        "<div><b>层级:</b></div>"
        "<div>该过程对应 DIKW (Data, Information, Knowledge, Wisdom) 金字塔的层级跃迁。</div>"
        "<div><b>代价:</b></div>"
        "<div>每级跃迁需要更多处理与建模。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(CLEAN_FRONT, back) == []


def test_multiword_front_gloss_is_flagged() -> None:
    front = "<strong>IoT 分析部署问题 (Analytic Deployment Problem)</strong>: 优化目标是什么？"
    issues = _issues(front, CLEAN_BACK)
    assert any("multi-word English gloss" in issue for issue in issues)


def test_descriptive_front_gloss_is_flagged() -> None:
    front = "<strong>物联网分析的知识层级 (IoT Analytics Knowledge Hierarchy)</strong>: 五个阶段？"
    issues = _issues(front, CLEAN_BACK)
    assert any("multi-word English gloss" in issue for issue in issues)


def test_acronym_expansion_in_front_is_allowed() -> None:
    front = "<strong>WSN (Wireless Sensor Network) 数据聚合</strong>: 关键指标有哪些？"
    assert _issues(front, CLEAN_BACK) == []


def test_single_token_front_gloss_is_allowed() -> None:
    front = "<strong>最短路径算法 (Dijkstra)</strong>: 松弛操作的不变量是什么？"
    assert _issues(front, CLEAN_BACK) == []


def _card_with_tags(tags: object) -> dict:
    return {"front": CLEAN_FRONT, "back": CLEAN_BACK, "tags": tags}


def test_canonical_tags_pass() -> None:
    issues = validate_cards([_card_with_tags(["research", "cs231", "tcp", "distributed_systems"])])
    assert issues == {}


def test_string_tags_are_accepted_and_checked() -> None:
    assert validate_cards([_card_with_tags("research cs234")]) == {}
    issues = validate_cards([_card_with_tags("research made-up-topic")])
    assert any("Unknown tag 'made-up-topic'" in i for i in _all_issue_texts(issues))


def test_invented_tag_is_flagged() -> None:
    issues = validate_cards([_card_with_tags(["research", "tcpip"])])
    texts = _all_issue_texts(issues)
    assert any("Unknown tag 'tcpip'" in i for i in texts)


def test_alias_and_separator_variants_are_not_flagged() -> None:
    issues = validate_cards([_card_with_tags(["TCP", "tcp-protocol", "cs231-distributed-systems", "Distributed-System"])])
    assert issues == {}


def test_canonical_tag_normalization() -> None:
    assert canonical_tag("TCP") == "tcp"
    assert canonical_tag("tcp-protocol") == "tcp"
    assert canonical_tag("tcp_protocol") == "tcp"
    assert canonical_tag("Distributed-System") == "distributed_systems"
    assert canonical_tag("cs231-distributed-systems") == "cs231"
    assert canonical_tag("cs234_advanced_networks") == "cs234"
    assert canonical_tag("made-up-topic") is None


def test_canonicalize_tags_dedupes_and_drops_unknown() -> None:
    tags = ["research", "TCP", "tcp_protocol", "made-up-topic", "cs231-distributed-systems"]
    assert canonicalize_tags(tags) == ["research", "tcp", "cs231"]


def test_tsv_invented_tag_is_flagged(tmp_path: Path) -> None:
    rows = [
        f"{CLEAN_FRONT}\t{CLEAN_BACK}\tresearch made-up-topic"
    ]
    path = _write_tsv(tmp_path, rows)
    issues = validate_tsv(path)
    assert any("Unknown tag 'made-up-topic'" in i for i in _all_issue_texts(issues))
