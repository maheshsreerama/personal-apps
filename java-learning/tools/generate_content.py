#!/usr/bin/env python3
"""Bundle all markdown chapters into app/src/main/assets/content.js for the mobile app."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "app/src/main/assets/content.js"

PARTS = [
    ("README.md", "Overview", None),
    ("01-basics", "Part 1 · Java Basics", "🌱"),
    ("02-oop", "Part 2 · OOP Concepts", "🏛️"),
    ("03-strings", "Part 3 · Strings", "🔤"),
    ("04-arrays", "Part 4 · Arrays", "🧮"),
    ("05-exceptions", "Part 5 · Exception Handling", "🚨"),
    ("06-collections", "Part 6 · Collections Framework", "📦"),
    ("07-generics", "Part 7 · Generics", "🧬"),
    ("08-multithreading", "Part 8 · Multithreading", "🧵"),
    ("09-java8", "Part 9 · Java 8+ Features", "⚡"),
    ("10-io-serialization", "Part 10 · I/O & Serialization", "💾"),
    ("11-inner-classes", "Part 11 · Nested & Inner Classes", "🪆"),
    ("12-programs", "Part 12 · Practice Programs", "⌨️"),
    ("13-quiz", "Part 13 · Tricky Quiz & Interview Q&A", "🎯"),
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
                "title": "📖 Start Here — Curriculum & How to Use",
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
