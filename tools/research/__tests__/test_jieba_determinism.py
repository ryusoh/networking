"""Tests for jieba tokenizer determinism with HMM=False (spec T5)."""

import jieba


def test_jieba_determinism_across_runs():
    """Verify jieba.cut with HMM=False produces identical tokens across multiple runs."""
    sample_texts = [
        "分布式共识算法在拜占庭容错系统中的应用与状态机复制",
        "基于深度优先搜索和PageRank的金融知识图谱中心性分析",
        "TCP拥塞控制算法BBR通过测量瓶颈带宽和往返传播时间优化吞吐量",
        "零知识证明zk-SNARKs通过多项式承诺实现隐私验证",
        "现代操作系统虚拟内存管理中的反向页表与TLB命中率优化",
    ]

    # First run
    run1 = [list(jieba.cut(text, HMM=False)) for text in sample_texts]

    assert jieba.dt.initialized is True

    # Second run
    run2 = [list(jieba.cut(text, HMM=False)) for text in sample_texts]

    assert run1 == run2

    # Assert non-empty tokens produced for each sample
    for tokens in run1:
        assert len(tokens) > 0
