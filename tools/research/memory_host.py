#!/usr/bin/env python3
"""Phase 5 Durable Memory & Mastery Matrix Integration for research courseware.

Manages persistent student progress, topic mastery scores, and historical study session
milestones across research/ courseware modules (cs231, cs232, cs233, cs234).
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Sequence

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

DEFAULT_RESEARCH_DIR = REPO_ROOT / "research"
DEFAULT_MEMORY_PATH = DEFAULT_RESEARCH_DIR / ".durable_memory.json"


class MemoryHost:
    """Persistent state manager for student mastery matrix and session summaries."""

    def __init__(self, memory_path: Path = DEFAULT_MEMORY_PATH):
        self.memory_path = memory_path
        self.data: dict[str, Any] = self._load_memory()

    def _load_memory(self) -> dict[str, Any]:
        if self.memory_path.exists():
            try:
                content = self.memory_path.read_text(encoding="utf-8", errors="replace")
                return json.loads(content)
            except Exception:
                pass
        return {
            "metadata": {
                "created_at": datetime.now(timezone.utc).isoformat(),
                "version": "1.0.0",
            },
            "students": {},
        }

    def save(self) -> None:
        """Persist memory state to JSON file."""
        self.memory_path.parent.mkdir(parents=True, exist_ok=True)
        self.memory_path.write_text(json.dumps(self.data, indent=2, ensure_ascii=False), encoding="utf-8")

    def record_mastery(
        self, student_id: str, course_module: str, topic: str, score: float
    ) -> dict[str, Any]:
        """Record or update student topic mastery score (0.0 to 1.0)."""
        score = max(0.0, min(1.0, float(score)))

        students = self.data.setdefault("students", {})
        student = students.setdefault(student_id, {"modules": {}, "session_history": []})
        modules = student.setdefault("modules", {})
        module_topics = modules.setdefault(course_module, {})

        now_str = datetime.now(timezone.utc).isoformat()
        entry = {
            "mastery_score": score,
            "last_reviewed": now_str,
        }
        module_topics[topic] = entry

        # Append turn to session history
        student["session_history"].append(
            {
                "timestamp": now_str,
                "module": course_module,
                "topic": topic,
                "score": score,
            }
        )

        self.save()
        return entry

    def get_student_report(self, student_id: str = "default_user") -> dict[str, Any]:
        """Generate summary report of student mastery and weak areas."""
        student = self.data.get("students", {}).get(student_id, {"modules": {}})
        modules = student.get("modules", {})

        all_topics = []
        weak_topics = []
        strong_topics = []

        for module_name, topics in modules.items():
            for topic_name, meta in topics.items():
                score = meta.get("mastery_score", 0.0)
                item = {
                    "module": module_name,
                    "topic": topic_name,
                    "score": score,
                    "last_reviewed": meta.get("last_reviewed"),
                }
                all_topics.append(item)
                if score < 0.70:
                    weak_topics.append(item)
                elif score >= 0.85:
                    strong_topics.append(item)

        avg_score = (sum(t["score"] for t in all_topics) / len(all_topics)) if all_topics else 0.0

        return {
            "student_id": student_id,
            "total_topics_tracked": len(all_topics),
            "average_mastery": round(avg_score, 4),
            "strong_topics": strong_topics,
            "weak_topics": weak_topics,
            "all_topics": all_topics,
        }

    def render_memory_context(self, student_id: str = "default_user") -> str:
        """Render compact memory context string for SceneBuilder prompt injection."""
        report = self.get_student_report(student_id)
        if report["total_topics_tracked"] == 0:
            return "No previous study history recorded for student."

        lines = [
            f"Student ID: {student_id} | Average Mastery: {report['average_mastery'] * 100:.1f}%",
        ]

        if report["weak_topics"]:
            weak_str = ", ".join(f"{t['topic']} ({t['module']})" for t in report["weak_topics"])
            lines.append(f"Focus Needed (Weak Areas): {weak_str}")

        if report["strong_topics"]:
            strong_str = ", ".join(f"{t['topic']} ({t['module']})" for t in report["strong_topics"])
            lines.append(f"Mastered Topics: {strong_str}")

        return "\n".join(lines)


def main(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Manage student durable memory and mastery matrix.")
    parser.add_argument("--student", default="default_user", help="Student ID.")
    parser.add_argument("--record", action="store_true", help="Record topic mastery score.")
    parser.add_argument("--module", help="Course module name (e.g. cs234-advanced-networks).")
    parser.add_argument("--topic", help="Topic name (e.g. b4_traffic_engineering).")
    parser.add_argument("--score", type=float, help="Mastery score (0.0 to 1.0).")
    parser.add_argument("--json", action="store_true", help="Emit JSON output.")
    args = parser.parse_args(argv)

    memory_host = MemoryHost()

    if args.record:
        if not args.module or not args.topic or args.score is None:
            parser.error("--record requires --module, --topic, and --score arguments.")
        entry = memory_host.record_mastery(args.student, args.module, args.topic, args.score)
        print(f"Successfully recorded mastery for {args.student}: {args.module} / {args.topic} = {entry['mastery_score']}")
        return 0

    report = memory_host.get_student_report(args.student)
    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print("=== STUDENT DURABLE MEMORY REPORT ===")
        print(f"Student ID: {report['student_id']}")
        print(f"Total Topics Tracked: {report['total_topics_tracked']}")
        print(f"Average Mastery: {report['average_mastery'] * 100:.1f}%\n")

        if report["weak_topics"]:
            print("Weak Topics (< 70%):")
            for t in report["weak_topics"]:
                print(f"  - {t['module']} / {t['topic']}: {t['score'] * 100:.1f}%")
            print()

        if report["strong_topics"]:
            print("Strong Topics (>= 85%):")
            for t in report["strong_topics"]:
                print(f"  - {t['module']} / {t['topic']}: {t['score'] * 100:.1f}%")
            print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
