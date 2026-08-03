"""Tests for tools/research/anki_card_validator.py over-translation gate.

The gate caps non-acronym English parenthetical annotations in the back;
Chinese prose with <b> emphasis on Chinese key terms must pass with zero
English annotations.
"""

import importlib.util
import os

TOOLS_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = os.path.join(TOOLS_DIR, "research", "anki_card_validator.py")

_spec = importlib.util.spec_from_file_location("anki_card_validator", SCRIPT)
anki_card_validator = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(anki_card_validator)

validate_cards = anki_card_validator.validate_cards

FRONT = "<strong>实时系统 (Real-Time System)</strong>: Stankovic 对实时系统正确性的经典定义是什么？"

CLEAN_BACK = (
    "<div><b>经典定义:</b></div>"
    "<div>实时系统的正确性不仅取决于计算结果本身，还取决于<b>结果产生的时间点</b>；"
    "结果正确但超过截止期限交付仍视为失效。</div>"
    "<div><b>分类:</b></div>"
    "<div>按时间约束的严格程度分为<b>硬实时</b>与<b>软实时</b>。</div>"
    "<div><b>源码与文档引用 (Source Citation):</b> "
    "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
)

SPRINKLED_BACK = (
    "<div><b>经典定义:</b></div>"
    "<div>正确性还取决于结果产生的时间点 (the time at which results are produced)；"
    "超过截止期限 (deadline) 即失效。</div>"
    "<div><b>分类:</b></div>"
    "<div>分为硬实时 (hard real-time) 与软实时。</div>"
    "<div><b>源码与文档引用 (Source Citation):</b> "
    "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
)


def _issues(front: str, back: str) -> list[str]:
    return validate_cards([{"front": front, "back": back}]).get("card 1", [])


def test_clean_chinese_back_passes_with_zero_english_annotations():
    assert _issues(FRONT, CLEAN_BACK) == []


def test_sprinkled_back_is_rejected():
    issues = _issues(FRONT, SPRINKLED_BACK)
    assert any("sprinkles 3 English annotations" in issue for issue in issues)


def test_acronym_expansions_are_exempt_from_the_cap():
    back = (
        "<div><b>组网形态:</b></div>"
        "<div>WSN (Wireless Sensor Network) 与 MANET (Mobile Ad-hoc Network) "
        "均无固定基础设施；IoT (Internet of Things) 应用常部署于其上。</div>"
        "<div><b>交付目标:</b></div>"
        "<div>前者交付信息，后者交付比特。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(FRONT, back) == []


def test_section_header_english_is_exempt_from_the_cap():
    back = (
        "<div><b>通信模式 (Communication Pattern):</b></div>"
        "<div>节点按块互发数据。</div>"
        "<div><b>复杂度 (Complexity):</b></div>"
        "<div>总传输量不随并行维度减少。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(FRONT, back) == []


def test_latex_and_citation_link_parens_are_not_counted():
    back = (
        "<div><b>数学形式:</b></div>"
        "<div>角频率 \\(\\omega = 2\\pi f\\) 决定相位 \\(e^{j(\\omega t + \\phi)}\\) 的旋转速度。</div>"
        "<div><b>稳态:</b></div>"
        "<div>所有点以同一频率振动。</div>"
        "<div><b>源码与文档引用 (Source Citation):</b> "
        "[research/x.md#L1-L2](file:///tmp/research/x.md#L1-L2)</div>"
    )
    assert _issues(FRONT, back) == []
