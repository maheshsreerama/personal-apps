---
title: Modern Java (9–21)
icon: 🚀
blurb: The language features and API upgrades from Java 9 to 21 that interviewers expect you to use and to date correctly.
---
# Modern Java (9–21)
## Overview
### [Java Versions Roadmap](lesson:b05-modern-java/01-java-versions-roadmap)
- A release every six months; LTS = 8, 11, 17, 21, 25
- Preview first (`--enable-preview`), final later
- Hooks: 10 var, 14 switch expr, 15 text blocks, 16 records, 17 sealed, 21 patterns + virtual threads
- Compile with `--release N`; class-file major = version + 44
## Language Features
### [var & Immutable Collections](lesson:b05-modern-java/02-var-and-immutable-collections)
- `var` (10) infers a static type for initialised locals only
- `List.of`/`Set.of`/`Map.of` (9): unmodifiable, no nulls
- `copyOf` (10) = snapshot; `Collections.unmodifiableList` = live view
### [Records](lesson:b05-modern-java/03-records)
- `record Point(int x, int y)` (16): final class, final fields, accessors, equals/hashCode/toString
- Compact constructor for validation; shallowly immutable
- Transparent data carriers that work with record patterns
### [Sealed Classes](lesson:b05-modern-java/04-sealed-classes)
- `sealed ... permits` (17) closes a hierarchy
- Subclasses must be `final`, `sealed` or `non-sealed`
- Lets the compiler check switch exhaustiveness without `default`
### [Switch Expressions & Pattern Matching](lesson:b05-modern-java/05-switch-expressions-and-pattern-matching)
- Switch expressions (14): `->`, no fall-through, `yield`, must be exhaustive
- `instanceof String s` (16): test + cast + bind, flow-scoped
- Pattern switch + record patterns + `when` + `case null` (21)
- Specific cases first (dominance); no `default` on sealed types; `default` does not catch null
## Library Upgrades
### [Text Blocks & New String Methods](lesson:b05-modern-java/06-text-blocks-and-new-string-methods)
- `"""` text blocks (15): closing delimiter sets the margin, `\s` and `\` escapes
- 11: `isBlank`, `strip`, `lines`, `repeat`; 12: `indent`, `transform`; 15: `formatted`
- `strip` is Unicode-aware, `trim` is not; `chars()` vs `codePoints()`
- No interpolation: String Templates were withdrawn
### [New Stream & Optional Methods](lesson:b05-modern-java/07-new-stream-and-optional-methods)
- 9: `takeWhile`/`dropWhile` cut at the first failure; `iterate(seed, hasNext, next)`; `ofNullable`
- 12: `teeing` = two collectors, one pass; 16: `toList()` (unmodifiable, allows null), `mapMulti`
- Optional: `or`, `ifPresentOrElse`, `stream` (9), `orElseThrow()` (10), `isEmpty` (11)
