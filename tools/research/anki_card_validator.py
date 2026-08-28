"""Validate a generated Anki TSV package before import.

Flags common quality problems that slip through the generator's chunk-level
gate: control characters, slide-number titles, ASCII diagrams, OCR fragments,
and generic topic labels that don't ask a concrete question.

Usage:
    python3 tools/research/anki_card_validator.py research/anki_import.txt
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

FIELD_SEP = "\t"
CONTROL_CHAR_RE = re.compile(r"[\x00-\x08\x0b-\x1f\x7f-\x9f]")
SLIDE_TITLE_PATTERNS = [
    re.compile(r"Network Layer\s+\d+-\d+", re.IGNORECASE),
    re.compile(r"Wireless,\s*Mobile Networks\s+\d+-\d+", re.IGNORECASE),
    re.compile(r"\b\d+-\d+\b.*Mobile IP", re.IGNORECASE),
    re.compile(r"^Page\s+\d+\s*:", re.IGNORECASE),
]
DIAGRAM_PATTERNS = [
    re.compile(r"\b(R|H|F|M|G|V)\s*bit\b", re.IGNORECASE),
    re.compile(r"\btype\s*=\s*\d+\b.*\bcode\s*=\s*\d+\b", re.IGNORECASE),
    re.compile(r"\d+\s+\d+\s+\d+\s+\d+\s*$"),  # column headers like 0 8 16 24
    # router ID lists like "Router1 Router2"; (?!\.\w) exempts domains like router137.cerf.edu
    re.compile(r"\b(?:AS\s+\d+|Router\d+|router\d+)(?!\.\w)\b", re.IGNORECASE),
]
GENERIC_TOPIC_LABELS = {
    "bgp basics",
    "lsa updates",
    "link-state routing",
    "distance vector",
    "network layer",
    "transport layer",
    "introduction",
    "overview",
    "summary",
    "conclusion",
}
OCR_ERROR_PATTERNS = [
    re.compile(r"\b(limi|limi e)\b", re.IGNORECASE),
    re.compile(r"\bq\s+[a-z]+", re.IGNORECASE),  # q frequent
    re.compile(r"Ø\s+"),
]
PAPER_METADATA_PATTERNS = [
    re.compile(r"Categories and Subject Descriptors", re.IGNORECASE),
    re.compile(r"\bGeneral Terms\s*:", re.IGNORECASE),
    re.compile(r"Additional Key Words", re.IGNORECASE),
    re.compile(r"Permission to make digital", re.IGNORECASE),
    re.compile(r"\b\d+\.\s+(?:INTRODUCTION|BACKGROUND|CONCLUSION|RELATED WORK)\b"),
]
ALLCAPS_NAME_RUN_RE = re.compile(r"\b[A-Z]{2,}\s+[A-Z]\.?\s*[A-Z]{2,}\b")
ORG_KEYWORD_RE = re.compile(
    r"\b(?:University|Institute|Laboratories|Laboratory|International|SRI)\b"
)
DATE_STAMP_RE = re.compile(r"\b\d{1,2}/\d{1,2}/\d{2,4}\b")
TEMPLATE_FRONT_RE = re.compile(r"【.+】的核心技术机制、计算公式与工程应用是什么？?$")
# Over-translation gate: a card body is Chinese prose with <b> emphasis on key
# Chinese terms. English annotations are reserved for acronym expansions and
# the rare term a domain reader would not already know (the user's reference
# card annotates exactly one term, "time-harmonic field"). More than this many
# non-acronym English parentheticals in the back is sprinkling, not annotation.
MAX_ENGLISH_ANNOTATIONS = 2
SECTION_HEADER_RE = re.compile(r"<(b|strong)>[^<]*[:：]</\1>", re.IGNORECASE)
LATEX_RE = re.compile(r"\\\(.*?\\\)|\\\[.*?\\\]")
MARKDOWN_LINK_RE = re.compile(r"\[[^\]]*\]\([^()]*\)")
ACRONYM_TOKEN_RE = re.compile(r"\b(?:[A-Z]{2,}|[A-Za-z]*[A-Z][a-z]+[A-Z][A-Za-z]*)$")
CITATION_SECTION_RE = re.compile(r"源码与文档引用\s*\(?Source Citation\)?:", re.IGNORECASE)
CITATION_LINK_RE = re.compile(r"\[[^\]]+\]\(file://[^\s#]+#L\d+(?:-L\d+)?\)")
# Canonical tag vocabulary. Tags are the one free-form field the LLM authors,
# so they are machine-gated like everything else: a card may only carry tags
# from this set (after normalization), which keeps the Anki tag space from
# accumulating synonyms like tcp/tcp_protocol or cs231/cs231-distributed-systems.
COURSE_CODES = ("cs231", "cs232", "cs233", "cs234")
CANONICAL_TAGS = frozenset(
    {
        # structural markers
        "research",
        "networking",
        "qa_export",
        # course tags (flat course code only, never cs231-distributed-systems)
        *COURSE_CODES,
        # protocols
        "tcp",
        "udp",
        "ip",
        "bgp",
        "ospf",
        "dns",
        "http",
        "tls",
        "nat",
        "arp",
        "dhcp",
        "icmp",
        "mpls",
        "vlan",
        "vxlan",
        "rdma",
        # mechanisms and concepts
        "qos",
        "routing",
        "switching",
        "congestion_control",
        "flow_control",
        "reliable_transport",
        "multicast",
        "wireless",
        "mobile_ip",
        "sdn",
        "p2p",
        "cdn",
        "network_security",
        "traffic_engineering",
        "measurement",
        # distributed systems
        "distributed_systems",
        "consensus",
        "paxos",
        "raft",
        "mapreduce",
        "mpi",
        "parallelism",
        "scheduling",
        "load_balancing",
        "caching",
        "replication",
        "fault_tolerance",
    }
)
# Known synonym spellings observed in authored cards, mapped to the canonical
# form. Separator/case variants (tcp-protocol, TCP) normalize before this map.
TAG_ALIASES = {
    "tcp_protocol": "tcp",
    "udp_protocol": "udp",
    "ip_protocol": "ip",
    "distributed_system": "distributed_systems",
    "load_balancer": "load_balancing",
}


def canonical_tag(tag: str) -> str | None:
    """Return the canonical form of a tag, or None if it is not in the vocabulary."""
    norm = tag.strip().lower().replace("-", "_").replace(" ", "_")
    if norm in CANONICAL_TAGS:
        return norm
    if norm in TAG_ALIASES:
        return TAG_ALIASES[norm]
    for code in COURSE_CODES:
        if norm.startswith(code + "_"):  # cs231_distributed_systems -> cs231
            return code
    return None


def canonicalize_tags(tags: list[str]) -> list[str]:
    """Map tags to canonical form, dropping unknowns and deduping (order kept)."""
    seen: dict[str, None] = {}
    for tag in tags:
        canon = canonical_tag(tag)
        if canon is not None:
            seen.setdefault(canon)
    return list(seen)


COMMON_ACRONYMS = {
    "FFT",
    "MPI",
    "TCP",
    "IP",
    "UDP",
    "BGP",
    "DNS",
    "HTTP",
    "HTTPS",
    "TLS",
    "SSL",
    "NAT",
    "ARP",
    "DHCP",
    "QoS",
    "SLA",
    "AS",
    "LAN",
    "WAN",
    "SDN",
    "RDMA",
    "RPC",
    "API",
    "OSI",
    "VLAN",
    "ICMP",
    "OSPF",
    "MPLS",
    "VXLAN",
    "NVGRE",
    "GRE",
    "IPsec",
    "MAC",
    "PHY",
    "LLC",
    "PPP",
    "SLIP",
    "ATM",
    "SONET",
    "SDH",
    "DWDM",
    "CDMA",
    "TDMA",
    "FDMA",
    "GSM",
    "LTE",
    "WiFi",
    "GPS",
    "AS-PATH",
    "NEXT-HOP",
}


def _count_control_chars(text: str) -> int:
    return len(CONTROL_CHAR_RE.findall(text))


def _has_slide_title(front: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", front)
    return any(pat.search(plain) for pat in SLIDE_TITLE_PATTERNS)


def _has_diagram_artifacts(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in DIAGRAM_PATTERNS)


def _is_generic_topic(front: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", front).strip().rstrip(":?").lower()
    # Extract the topic before the Chinese question part
    topic = plain.split(":")[0].strip().lower()
    if topic in GENERIC_TOPIC_LABELS:
        return True
    # The length guard targets English topic labels; a short CJK title like
    # 实时系统 is a legitimate concept name, not a generic label.
    if re.search(r"[一-鿿]", topic):
        return False
    return len(topic) < 8


def _has_ocr_errors(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in OCR_ERROR_PATTERNS)


def _has_paper_metadata(back: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", back)
    return any(pat.search(plain) for pat in PAPER_METADATA_PATTERNS)


def _has_author_block(back: str) -> bool:
    """Author/affiliation dump: an ALL-CAPS name run next to an org keyword."""
    plain = re.sub(r"<[^>]+>", "", back)
    return bool(ALLCAPS_NAME_RUN_RE.search(plain) and ORG_KEYWORD_RE.search(plain))


def _has_date_stamp(text: str) -> bool:
    plain = re.sub(r"<[^>]+>", "", text)
    return bool(DATE_STAMP_RE.search(plain))


def _is_template_front(front: str) -> bool:
    """The generator's fallback front (【topic】的核心技术机制…) is not a real question."""
    plain = re.sub(r"<[^>]+>", "", front).strip()
    return bool(TEMPLATE_FRONT_RE.search(plain))


def _count_section_headers(back: str) -> int:
    """Count <b>...</b>: style section headers used in dense card backs."""
    return len(re.findall(r"<(b|strong)>[^<]*[:：]</\1>", back, re.IGNORECASE))


def _english_annotations(back: str) -> list[str]:
    """English parenthetical annotations in the body, excluding acronym
    expansions, section headers, LaTeX, and citation links."""
    stripped = SECTION_HEADER_RE.sub("", back)
    stripped = LATEX_RE.sub("", stripped)
    stripped = MARKDOWN_LINK_RE.sub("", stripped)
    plain = re.sub(r"<[^>]+>", "", stripped)
    annotations: list[str] = []
    for match in re.finditer(r"[（(]([^（）()]+)[)）]", plain):
        content = match.group(1).strip()
        if not re.search(r"[A-Za-z]", content):
            continue
        before = plain[: match.start()].rstrip()
        if ACRONYM_TOKEN_RE.search(before):
            continue  # acronym expansion, e.g. WSN (Wireless Sensor Network)
        if re.search(r"\b[A-Z]{2,}\b", content):
            continue  # the parenthetical itself carries the acronym
        annotations.append(content)
    return annotations


def _acronym_is_explained(acronym: str, text: str) -> bool:
    """True if the acronym is expanded in a parenthetical (words match letters)."""
    letters = acronym.lower()

    def _expansion_matches(content: str) -> bool:
        words = re.findall(r"[A-Za-z]+", content)
        core = [w for w in words if w.lower() != letters]
        if not core or core[0][0].lower() != letters[0]:
            return False
        # Subsequence match: handles hyphenated and stop-word letters, e.g.
        # MANET = Mobile Ad-hoc NETwork, IoT = Internet of Things.
        remaining = iter("".join(core).lower())
        return all(ch in remaining for ch in letters)

    for match in re.finditer(
        r"[（(]([^（）()]*\b" + re.escape(acronym) + r"\b[^（）()]*)[)）]", text
    ):
        if _expansion_matches(match.group(1)):
            return True
    for match in re.finditer(
        r"\b" + re.escape(acronym) + r"\s*[（(]([^（）()]+)[)）]", text
    ):
        if _expansion_matches(match.group(1)):
            return True
    # Reversed order: Expansion (ACRONYM), e.g. Traffic Engineering (TE).
    for match in re.finditer(r"[（(]\s*" + re.escape(acronym) + r"\s*[)）]", text):
        preceding = re.findall(r"[A-Za-z]+", text[: match.start()])
        for width in range(len(letters), len(letters) + 4):
            window = preceding[-width:]
            if len(window) == width and _expansion_matches(" ".join(window)):
                return True
    return False


def _unexplained_acronyms(front: str, back: str) -> list[str]:
    """Non-common acronyms anywhere in the card must be expanded somewhere in it."""
    front_plain = re.sub(r"<[^>]+>", "", front)
    back_plain = re.sub(r"<[^>]+>", "", back)
    back_plain = LATEX_RE.sub("", MARKDOWN_LINK_RE.sub("", back_plain))
    combined = f"{front_plain} {back_plain}"
    acronyms = set(re.findall(r"\b[A-Z]{2,}(?:-[A-Z]+)*\b", combined)) - COMMON_ACRONYMS
    return [
        acronym
        for acronym in acronyms
        if not _acronym_is_explained(acronym, combined)
    ]


def _front_gloss_violations(front: str) -> list[str]:
    """Multi-word English glosses in the front that are not acronym expansions.
    Front English is limited to acronyms and single-token standard names;
    multi-word descriptive glosses read as translated titles, not terminology."""
    plain = re.sub(r"<[^>]+>", "", front)
    plain = LATEX_RE.sub("", plain)
    violations: list[str] = []
    for match in re.finditer(r"[（(]([^（）()]+)[)）]", plain):
        gloss = match.group(1).strip()
        words = re.findall(r"[A-Za-z]+", gloss)
        if len(words) < 2:
            continue
        before = plain[: match.start()].rstrip()
        if ACRONYM_TOKEN_RE.search(before):
            continue  # acronym expansion, e.g. WSN (Wireless Sensor Network)
        if re.search(r"\b[A-Z]{2,}\b", gloss):
            continue  # the gloss itself carries the acronym being expanded
        violations.append(gloss)
    return violations


def _validate_card(front: str, back: str) -> list[str]:
    """Run all single-card quality checks."""
    card_issues: list[str] = []

    ctrl_count = _count_control_chars(front) + _count_control_chars(back)
    if ctrl_count:
        card_issues.append(f"Contains {ctrl_count} control character(s) (PDF extraction artifact)")

    if _has_date_stamp(front) or _has_date_stamp(back):
        card_issues.append("Contains slide date stamp (e.g. 8/13/2008)")

    card_issues.extend(_check_front_content(front))
    card_issues.extend(_check_back_content(back))

    unexplained = _unexplained_acronyms(front, back)
    if unexplained:
        card_issues.append(
            "Acronym(s) used but never expanded/explained: " + ", ".join(sorted(unexplained))
        )

    return card_issues



def _check_front_content(front: str) -> list[str]:
    issues: list[str] = []
    if _has_slide_title(front):
        issues.append("Front looks like a slide title/page number, not a conceptual question")
    if _is_generic_topic(front):
        issues.append("Front is a generic topic label, not a specific question")
    if _is_template_front(front):
        issues.append("Front is the generator's fallback template, not a concrete question")
    invented = _front_gloss_violations(front)
    if invented:
        shown = ", ".join(f"'{g}'" for g in invented[:3])
        issues.append(
            f"Front title carries a multi-word English gloss: {shown} — drop it; "
            "front English is limited to acronyms and single-token standard names"
        )
    return issues

def _check_back_content(back: str) -> list[str]:
    issues: list[str] = []
    if _has_diagram_artifacts(back):
        issues.append("Back contains ASCII diagram/table fragments instead of explanation")
    if _has_ocr_errors(back):
        issues.append("Back contains likely OCR/extraction errors (fragmented words)")
    if _has_paper_metadata(back):
        issues.append("Back contains paper metadata dump (ACM categories, section headings)")
    if _has_author_block(back):
        issues.append("Back contains author/affiliation block instead of explanation")
    if _count_section_headers(back) < 2:
        issues.append("Back lacks structured section headers (<b>...</b>:)")
    annotations = _english_annotations(back)
    if len(annotations) > MAX_ENGLISH_ANNOTATIONS:
        shown = ", ".join(f"'{a}'" for a in annotations[:5])
        issues.append(
            f"Back sprinkles {len(annotations)} English annotations "
            f"(max {MAX_ENGLISH_ANNOTATIONS}): {shown} — write the body in Chinese; "
            "annotate only terms a domain reader would not already know"
        )
    citation_issue = _check_citation_section(back)
    if citation_issue:
        issues.append(citation_issue)
    return issues

def _check_citation_section(back: str) -> str | None:
    """Validate the mandatory final citation section and its line-anchored links."""
    plain = re.sub(r"<[^>]+>", "", back)
    if not CITATION_SECTION_RE.search(plain):
        return "Back missing mandatory '源码与文档引用 (Source Citation):' section"
    if not CITATION_LINK_RE.search(plain):
        return "Citation section contains no properly formatted file:// line-anchored link"
    return None


def _tag_issues(tags: Any) -> list[str]:
    """Flag tags outside the canonical vocabulary; alias/separator variants pass
    (the importer canonicalizes them) — only invented tags are rejected."""
    if isinstance(tags, str):
        tags = tags.split()
    issues: list[str] = []
    for tag in tags or []:
        if canonical_tag(str(tag)) is None:
            issues.append(
                f"Unknown tag '{tag}' — tags must come from the canonical vocabulary "
                "(CANONICAL_TAGS in anki_card_validator.py); pick the closest existing "
                "tag instead of inventing a variant"
            )
    return issues


def validate_cards(cards: list[dict[str, Any]]) -> dict[str, list[str]]:
    """Validate a list of card dicts {front, back, chunk_id?, tags?}."""
    issues: dict[str, list[str]] = {}
    fronts: list[str] = []
    for i, card in enumerate(cards, start=1):
        front = card.get("front", "")
        back = card.get("back", "")
        fronts.append(front)
        card_issues = _validate_card(front, back) + _tag_issues(card.get("tags"))
        if card_issues:
            issues[f"card {i}"] = card_issues

    seen: dict[str, int] = {}
    for i, front in enumerate(fronts, start=1):
        plain = re.sub(r"<[^>]+>", "", front).split("【")[0].split(":")[0].strip()
        if plain in seen:
            key = f"card {i}"
            issues.setdefault(key, []).append(f"Duplicate title within batch (first seen at card {seen[plain]})")
        else:
            seen[plain] = i

    return issues


def validate_tsv(tsv_path: Path) -> dict[str, list[str]]:
    """Return a dict mapping card index to list of issue descriptions."""
    text = tsv_path.read_text(encoding="utf-8")
    lines = text.splitlines()
    issues: dict[str, list[str]] = {}

    fronts: list[str] = []
    for idx, raw in enumerate(lines, start=1):
        if raw.startswith("#") or not raw.strip():
            continue
        parts = raw.split(FIELD_SEP)
        if len(parts) < 2:
            issues[f"line {idx}"] = ["Malformed TSV row (fewer than 2 fields)"]
            continue
        front, back = parts[0], parts[1]
        fronts.append(front)
        card_issues = _validate_card(front, back)
        card_issues += _tag_issues(parts[2].split() if len(parts) > 2 else [])
        if card_issues:
            issues[f"card {len(fronts)} (line {idx})"] = card_issues

    # Cross-card duplicate title check within the batch
    seen: dict[str, int] = {}
    for i, front in enumerate(fronts, start=1):
        plain = re.sub(r"<[^>]+>", "", front).split("【")[0].split(":")[0].strip()
        if plain in seen:
            key = f"card {i} (line unknown)"
            issues.setdefault(key, []).append(f"Duplicate title within batch (first seen at card {seen[plain]})")
        else:
            seen[plain] = i

    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate generated Anki cards before import")
    parser.add_argument("path", type=Path, default=Path("research/anki_cards.jsonl"), nargs="?")
    args = parser.parse_args(argv)

    if not args.path.exists():
        print(f"File not found: {args.path}", file=sys.stderr)
        return 1

    if str(args.path).endswith(".txt") or str(args.path).endswith(".tsv"):
        issues = validate_tsv(args.path)
    else:
        cards = []
        for raw in args.path.read_text(encoding="utf-8").splitlines():
            raw = raw.strip()
            if raw:
                cards.append(json.loads(raw))
        issues = validate_cards(cards)

    if not issues:
        print(f"OK: {args.path} passed quality checks.")
        return 0

    print(f"Quality issues found in {args.path}:")
    for label, card_issues in issues.items():
        print(f"\n{label}:")
        for issue in card_issues:
            print(f"  - {issue}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
