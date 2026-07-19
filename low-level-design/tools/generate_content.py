#!/usr/bin/env python3
"""Bundle all markdown chapters into app/src/main/assets/content.js for the mobile app."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app/src/main/assets/content.js"

PARTS = [
    ("README.md", "Overview", None),
    ("01-foundations", "Part 1 · OOP Foundations", "🧱"),
    ("02-design-patterns", "Part 2 · Design Patterns", "🧩"),
    ("03-concurrency", "Part 3 · Concurrency", "🧵"),
    ("04-machine-coding", "Part 4 · Machine Coding", "⌨️"),
    ("05-case-studies", "Part 5 · Case Studies", "📐"),
    ("06-interview-prep", "Part 6 · Interview Prep", "🎯"),
]


def title_of(md: str, fallback: str) -> str:
    for line in md.splitlines():
        m = re.match(r"^#\s+(.+)$", line.strip())
        if m:
            return m.group(1).strip()
    return fallback


def main() -> None:
    chapters = []
    for entry, part, _icon in PARTS:
        path = ROOT / entry
        if path.is_file():
            md = path.read_text(encoding="utf-8")
            chapters.append({
                "id": "readme",
                "path": "README.md",
                "part": part,
                "title": "📖 Start Here — Curriculum & Study Plan",
                "md": md,
            })
            continue
        for f in sorted(path.glob("*.md")):
            md = f.read_text(encoding="utf-8")
            rel = f"{entry}/{f.name}"
            chapters.append({
                "id": rel[:-3],  # strip .md
                "path": rel,
                "part": part,
                "title": title_of(md, f.stem),
                "md": md,
            })

    payload = json.dumps(chapters, ensure_ascii=False)
    OUT.write_text("window.CHAPTERS = " + payload + ";\n", encoding="utf-8")
    total_kb = OUT.stat().st_size // 1024
    print(f"Wrote {OUT} — {len(chapters)} chapters, {total_kb} KB")


if __name__ == "__main__":
    main()
