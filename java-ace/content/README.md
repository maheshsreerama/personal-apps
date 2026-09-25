# Java Ace content guide

Every lesson is one Markdown file. The app parses these files directly, so the
format below is a contract — `node tools/verify.mjs` enforces it.

```
content/
  a01-oop/                 <- module folder (a = Track A: the course material, b = Track B: interview essentials)
    _module.md             <- module metadata + mind map
    01-class-and-objects.md
    02-encapsulation.md    <- lessons, ordered by numeric prefix
```

Lesson id = `<module-folder>/<file-name-without-.md>`, e.g. `a01-oop/04-polymorphism`.

## Lesson file

```markdown
---
title: Polymorphism
group: The Four Pillars
---

## In One Line
...

## Mental Model
...

## Concept
...

## Diagram
...

## Code
@example CoreJava/Oops/PolymorphismExample.java
...

## Walkthrough
...

## Traps
...

## Tips & Tricks
...

## Interview Q&A
### [Basic] What is runtime polymorphism?
...

## Quiz
### What does this print?
...

## Takeaways
- ...
```

### Front matter
- `title` (required) — short lesson title.
- `group` (optional) — sub-section inside the module (e.g. `Lists`, `Creational`).

### Sections — all required, exactly these `##` headings, in this order

| Heading | What goes in it |
|---|---|
| `## In One Line` | One or two sentences. The whole idea, plain words. |
| `## Mental Model` | A real-world analogy that makes it stick. Explain how the analogy maps to the code. |
| `## Concept` | The deep dive. Why it exists, how it works internally, rules, syntax variations, when to use / avoid, comparisons with related features. Use `###` sub-headings, tables, short code snippets. This is the main teaching section — be thorough. |
| `## Diagram` | At least one ```` ```mermaid ```` diagram (see Diagrams). Add one line under each diagram explaining what to notice. |
| `## Code` | Every assigned example via `@example <path>` on its own line. The app shows the original file verbatim plus its real output behind a "predict the output" reveal. You may add extra ```` ```java ```` snippets (with ```` ```output ```` blocks) to show variations. |
| `## Walkthrough` | Line-by-line / block-by-block explanation of the example(s). Say what each part does and why, and explain the output. |
| `## Traps` | Gotchas, common mistakes, edge cases, and **errata** if the original example has a bug, wrong comment, wrong output comment, or outdated API. |
| `## Tips & Tricks` | Mnemonics, shortcuts, rules of thumb, "how to remember", best practices. |
| `## Interview Q&A` | 6–12 questions as `### [Level] Question?` where Level is `Basic`, `Intermediate` or `Advanced`. The answer follows as normal Markdown — a complete model answer (what you would say in an interview), with code if useful, and a closing `**Follow-up:**` line with the follow-up the interviewer is likely to ask and its short answer. |
| `## Quiz` | 5–8 questions (format below). Mix concept MCQs, "what does this print?", and "spot the bug". |
| `## Takeaways` | 4–8 bullet points. These are copied into the module cheat sheet — make each one self-contained. |

### `@example`
`@example IO/FileHandling/FileReaderExample.java` — path relative to `source-material/`.
Every file in `source-material/` must be used by exactly one lesson. The real output
recorded in `outputs/` is shown automatically; do not paste it again.

### Quiz question format
```markdown
### What does this print?
` ``java
String s = "a" + 1 + 2;
System.out.println(s);
` ``
- [ ] 3a
- [x] a12
- [ ] a3
- [ ] Compile error
> String concatenation is left-to-right: `"a" + 1` is `"a1"`, then `+ 2` gives `"a12"`.
```
- `###` line = the question (keep it short; put code in a fenced block under it).
- 2–5 options as `- [ ]`, exactly one `- [x]`.
- Explanation as one or more `> ` lines — say why the right answer is right AND why the tempting wrong one is wrong.

### Callouts
Blockquotes starting with a tag become coloured callouts:
```markdown
> [!TIP] Short tip text.
> [!WARNING] Something that bites.
> [!ERRATA] The original comment says X but the code does Y.
> [!NOTE] Side note.
> [!INTERVIEW] Phrase interviewers love to hear.
```

### Diagrams
Use Mermaid. They render in a hand-drawn (Excalidraw) style and can be opened in the
Sketchpad, where **flowchart**, **sequenceDiagram** and **classDiagram** become editable
shapes — prefer those three. `stateDiagram-v2` is fine for lifecycles.
- Keep labels short; quote labels containing special characters: `A["put(k, v)"]`.
- No `click`, no `style`/`classDef` colours (the theme handles colour), no HTML in labels except `<br/>`.
- 3–15 nodes. One idea per diagram.

### Code blocks
```` ```java ```` for Java, ```` ```output ```` for console output, ```` ```text ```` for anything else.

## Module file (`_module.md`)
```markdown
---
title: OOP Foundations
icon: 🧱
blurb: Classes, objects and the four pillars that every Java interview starts with.
---
# OOP Foundations
## [Classes & Objects](lesson:a01-oop/01-class-and-objects)
- Class = blueprint, object = instance
```
The body is the module mind map (Markdown headings/bullets → Markmap). Link to
lessons with `lesson:<id>`.
