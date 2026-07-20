# Learn Java — Concepts & Examples

A complete, offline Java course in your pocket. Every chapter teaches **one concept**, shows a
**runnable example**, and prints the **exact output** so you always know what to expect —
in the spirit of a "Java concept of the day".

## How to use this app

1. Go **part by part** — the parts are ordered so each one builds on the previous.
2. In every chapter, **read the code before the output**, predict the result, then check yourself.
3. Retype the examples on your computer (any JDK 17+) — typing them is how they stick.
4. Use **search** on the home screen to jump to any concept (`hashmap`, `lambda`, `deadlock`, …).
5. Chapters you've opened get a ✓ so you can track progress. Theme toggle is in the top bar.

## Curriculum

| Part | What you learn |
|------|----------------|
| 1 · Java Basics | JVM/JRE/JDK, variables & data types, operators, control flow, methods, core keywords |
| 2 · OOP Concepts | Classes, constructors, inheritance, polymorphism, abstraction, interfaces, encapsulation |
| 3 · Strings | Immutability & string pool, essential methods, StringBuilder/StringBuffer, string programs |
| 4 · Arrays | 1-D & multi-dimensional arrays, `java.util.Arrays`, classic array programs |
| 5 · Exception Handling | Hierarchy, try/catch/finally, throw vs throws, custom exceptions, try-with-resources |
| 6 · Collections | List, Set, Map, Queue, HashMap internals, Comparable/Comparator, iterators & fail-fast |
| 7 · Generics | Generic classes & methods, bounded types, wildcards, type erasure |
| 8 · Multithreading | Threads, lifecycle, synchronization, wait/notify, deadlock, executors, concurrent utilities |
| 9 · Java 8+ | Lambdas, functional interfaces, method references, Streams, Optional, Date/Time API |
| 10 · I/O & Serialization | Files, readers/writers, NIO, object serialization |
| 11 · Inner Classes | Static nested, inner, local, anonymous classes |
| 12 · Practice Programs | Classic interview programs — numbers, patterns, recursion — all with outputs |
| 13 · Quiz & Interview Q&A | Tricky output-prediction puzzles and rapid-fire interview questions |

## Building the APK

The GitHub Actions workflow `java-learning-release.yml` regenerates the content bundle from
these markdown files, builds the release APK, and attaches it to a GitHub Release
(tags `java-v*`). To build locally:

```bash
cd java-learning
python3 tools/generate_content.py
gradle assembleRelease   # needs the Android SDK
```

> All explanations and examples in this app are original content written for this project.
