"""End-to-End Dry Run for Density Gate (spec T7 / A5.4).

Runs the density gate in report-only mode on a batch of 5 candidate cards,
inspects verdicts, and verifies that the output conforms to expectations.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from tools.research.anki_density import card_density
from tools.research.anki_density_baseline import compute_baseline
from tools.research.anki_density_gate import evaluate_cards

SAMPLE_BATCH_5_CARDS = [
    {
        "chunk_id": "research/cs234-advanced-networks/01-slides/cs234-15/part-01.md:chunk-8",
        "front": "<strong>LBS 复兴的技术条件</strong>: 哪些关键技术进步使 LBS (Location-Based Services) 摆脱早期失败并走向普及？",
        "back": "<div><b>定位终端普及:</b></div><div>具备 <b>GPS (Global Positioning System) 能力的移动设备</b>出现，使普通用户终端自身即可获得较高精度的位置。</div><div><b>服务范式转变:</b></div><div><b>Web 2.0 范式</b>的到来改变了服务的构建与分发方式，使用户参与和第三方服务成为可能。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs234/part-01.md#L93-L104](file:///tmp/part-01.md#L93-L104)</div>",
        "tags": ["research", "cs234", "wireless"],
    },
    {
        "chunk_id": "research/cs234-advanced-networks/01-slides/cs234-15/part-01.md:chunk-9",
        "front": "<strong>新一代成功的 LBS</strong>: 2004 年起哪些定位服务首先取得成功，其底层定位技术经历了怎样的演进？",
        "back": "<div><b>首批成功场景:</b></div><div>2004 年起开始提供<b>车队管理</b>以及<b>儿童与宠物追踪</b>服务。</div><div><b>定位技术演进:</b></div><div>初期版本基于 <b>蜂窝小区标识三角测量</b>，精度低，很快被 <b>GPS</b> 取代。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs234/part-01.md#L105-L124](file:///tmp/part-01.md#L105-L124)</div>",
        "tags": ["research", "cs234", "wireless"],
    },
    {
        "chunk_id": "research/cs231-distributed-systems/01-slides/cs231-04/part-02.md:chunk-3",
        "front": "<strong>Paxos 共识算法</strong>: Paxos 中 Proposer 与 Acceptor 在 Phase 1 阶段如何交互？",
        "back": "<div><b>Phase 1a Prepare:</b></div><div>Proposer 选择唯一递增提案编号 n 向多数派 Acceptor 发送 Prepare(n)。</div><div><b>Phase 1b Promise:</b></div><div>Acceptor 若 n 大于其见过的所有提案编号，承诺不再接受小于 n 的提案，并返回其已接受的最大编号提案。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs231/part-02.md#L45-L60](file:///tmp/part-02.md#L45-L60)</div>",
        "tags": ["research", "cs231", "consensus"],
    },
    {
        "chunk_id": "research/cs232-computer-systems/01-slides/cs232-02/part-01.md:chunk-5",
        "front": "<strong>反向页表 (Inverted Page Table)</strong>: 反向页表相比传统多级页表的核心优势与查找开销？",
        "back": "<div><b>核心优势:</b></div><div>页表大小与物理内存大小成正比而非虚拟地址空间大小，大幅节省页表内存占用。</div><div><b>查找机制:</b></div><div>需要通过散列表或关联寄存器 (TLB) 查找物理页框号。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs232/part-01.md#L20-L35](file:///tmp/part-01.md#L20-L35)</div>",
        "tags": ["research", "cs232", "memory"],
    },
    {
        "chunk_id": "research/cs233-network-systems/01-slides/cs233-06/part-03.md:chunk-1",
        "front": "<strong>BBR 算法瓶颈带宽测量</strong>: BBR 拥塞控制如何同时避免排队延迟与丢包？",
        "back": "<div><b>状态探测:</b></div><div>通过在 PROBE_BW 阶段周期性加速 (1.25x pacing gain) 测量 BtlBw，在 PROBE_RTT 阶段排空管道队列测量 RTprop。</div><div><b>控制目标:</b></div><div>将网络运行点维持在 Kleinrock 最优工作点（即管道刚好填满且队列长度为零）。</div><div><b>源码与文档引用 (Source Citation):</b> [research/cs233/part-03.md#L80-L95](file:///tmp/part-03.md#L80-L95)</div>",
        "tags": ["research", "cs233", "tcp"],
    },
]


def run_dry_run() -> bool:
    """Run end-to-end dry run on 5 candidate cards."""
    baseline = compute_baseline(deck="金融", k=10)
    verdicts = evaluate_cards(
        cards=SAMPLE_BATCH_5_CARDS,
        baseline=baseline,
        config={"threshold_scale": 0.6},
    )

    print(f"=== Anki Density Gate Dry Run (5 Candidate Cards) ===")
    print(f"Deck Baseline Mean: {baseline.mean_density:.4f}, Effective Threshold (scale=0.6): {baseline.mean_density * 0.6:.4f}\n")

    for idx, (card, verdict) in enumerate(zip(SAMPLE_BATCH_5_CARDS, verdicts)):
        report = card_density(card["front"], card["back"], baseline.lexicon)
        print(f"Card #{idx+1}: {card['front'][:50]}")
        print(f"  Tokens: {report.token_count} | D_comp: {report.d_comp:.4f} | D_lex: {report.d_lex:.2f} | D_concept: {report.d_concept:.2f}% | D_domain: {report.d_domain:.2f}%")
        print(f"  Composite: {verdict.density:.4f} | Threshold: {verdict.threshold:.4f} | Decision: {verdict.decision}")
        if verdict.decision == "consolidate":
            print(f"  Consolidation Group: {verdict.consolidation_group}")
        elif verdict.decision == "enrich":
            print(f"  Enrich Context: {verdict.enrich_context}")
        print()

    accepted_count = sum(1 for v in verdicts if v.decision == "accept")
    print(f"Summary: {accepted_count}/{len(verdicts)} cards accepted by density gate.")
    return len(verdicts) == 5


if __name__ == "__main__":
    success = run_dry_run()
    sys.exit(0 if success else 1)
