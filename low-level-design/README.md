# 🧩 Low-Level Design Mastery — Java Edition

> Clean, complete, from-scratch notes to take you from **zero → pro** in LLD / object-oriented design,
> with Java code, UML & Mermaid diagrams, real interview case studies, tips & tricks, and **interview Q&A in every chapter**.

---

## 📱 Mobile App (Android)

These notes ship as a **fully offline Android app** — all 32 chapters, rendered Mermaid class/sequence/state diagrams (pinch-zoom), search, dark mode, and reading progress. No permissions, no network.

**➡️ Download the APK from the [Releases page](../../../releases/latest)** (tag `lld-v*`) and install it on any Android 8.0+ phone.

The app lives in [`app/`](app) (WebView reader) and is built + published automatically by [GitHub Actions](../.github/workflows/lld-release.yml) on every `lld-v*` tag.

---

## 📖 How to use these notes

1. **Read in order** — chapters build on each other (foundations → patterns → concurrency → machine coding → case studies).
2. **Every chapter ends with** ✅ *Key Takeaways / Outcome*, 💡 *Tips & Tricks*, and 🎯 *Interview Q&A* — revise those before interviews.
3. **Case studies include "say this" scripts** — the exact narration that scores in interviews, not just the design.
4. **Diagrams are Mermaid** — class, sequence, and state diagrams render directly on GitHub and in the app.
5. **Code is Java** — runnable, minimal, interview-calibrated.
6. Finish with the **Interview Prep** section: the 45-minute framework, the cheat sheet, and the 60-question rapid-fire bank.

---

## 🗺️ Curriculum

### Part 1 — OOP Foundations (`01-foundations/`)
| # | Chapter | What you'll master |
|---|---------|--------------------|
| 1.1 | [OOP in Java](01-foundations/01-oop-in-java.md) | The four pillars as habits, composition over inheritance, equals/hashCode, immutability, records |
| 1.2 | [SOLID Principles](01-foundations/02-solid-principles.md) | Each principle as smell → refactor, with Java code and the cheat table |
| 1.3 | [Beyond SOLID](01-foundations/03-design-principles.md) | DRY, KISS, YAGNI, Law of Demeter, cohesion & coupling |
| 1.4 | [UML for Interviews](01-foundations/04-uml-for-interviews.md) | Class boxes, the 5 arrows, sequence diagrams, diagram-first workflow |

### Part 2 — Design Patterns (`02-design-patterns/`)
| # | Chapter | What you'll master |
|---|---------|--------------------|
| 2.1 | [Creational](02-design-patterns/01-creational-patterns.md) | Singleton (done right), Factory, Abstract Factory, Builder, Prototype |
| 2.2 | [Structural](02-design-patterns/02-structural-patterns.md) | Adapter, Decorator, Facade, Composite, Proxy, Flyweight, Bridge |
| 2.3 | [Behavioral I](02-design-patterns/03-behavioral-patterns-1.md) | Strategy, Observer, Command, State — the interview big four |
| 2.4 | [Behavioral II](02-design-patterns/04-behavioral-patterns-2.md) | Template Method, Chain of Responsibility, Iterator, Mediator, Memento, Visitor |
| 2.5 | [Choosing Patterns](02-design-patterns/05-choosing-patterns.md) | The problem → pattern map, winning combos, the anti-checklist |

### Part 3 — Concurrency (`03-concurrency/`)
| # | Chapter | What you'll master |
|---|---------|--------------------|
| 3.1 | [Java Concurrency Essentials](03-concurrency/01-java-concurrency-essentials.md) | synchronized, volatile, atomics/CAS, locks, executors, deadlock |
| 3.2 | [Concurrent Collections](03-concurrency/02-concurrent-collections.md) | ConcurrentHashMap, BlockingQueue, semaphores, per-key locking |
| 3.3 | [Thread-Safe LLD](03-concurrency/03-thread-safe-lld-patterns.md) | The 5 moves: immutability, per-entity locks, CAS, confinement, expiry |

### Part 4 — Machine Coding (`04-machine-coding/`)
| # | Chapter | What you'll master |
|---|---------|--------------------|
| 4.1 | [The Playbook](04-machine-coding/01-machine-coding-playbook.md) | The 90-minute budget, build order, demo runner, walkthrough |
| 4.2 | [Clean Code for LLD](04-machine-coding/02-clean-code-for-lld.md) | Naming, small methods, exceptions, Optional, API shape |
| 4.3 | [Object Modeling](04-machine-coding/03-object-modeling.md) | Entities vs VOs, aggregates, repositories, state machines, typed IDs |

### Part 5 — Case Studies: Real Interview Problems (`05-case-studies/`)
| # | Design… | Core concepts exercised |
|---|---------|-------------------------|
| 5.1 | [Parking Lot](05-case-studies/01-parking-lot.md) | The template problem: strategies, per-spot locking, factory, extensions |
| 5.2 | [Elevator System](05-case-studies/02-elevator-system.md) | LOOK scheduling, State, Strategy, confinement concurrency |
| 5.3 | [Vending Machine](05-case-studies/03-vending-machine.md) | State pattern, change-making, money safety |
| 5.4 | [LRU Cache](05-case-studies/04-lru-cache.md) | HashMap+DLL, eviction Strategy, TTL, thread-safety ladder |
| 5.5 | [Tic-Tac-Toe & Snake-Ladder](05-case-studies/05-board-games.md) | Clean fundamentals, turn management, injected dice, win detection |
| 5.6 | [Chess](05-case-studies/06-chess.md) | Piece polymorphism, layered legality, simulate-undo, scoping |
| 5.7 | [Splitwise](05-case-studies/07-splitwise.md) | Split strategies, exact money math, balance sheets, debt simplification |
| 5.8 | [Movie Ticket Booking](05-case-studies/08-movie-ticket-booking.md) | HOLD→PAY→CONFIRM, seat races, TTL holds, idempotent payments |
| 5.9 | [Ride Hailing](05-case-studies/09-ride-hailing.md) | Trip state machine, CAS driver matching, pricing decorators |
| 5.10 | [Logging Framework](05-case-studies/10-logging-framework.md) | Appenders, async queues, overflow policy, never-throw discipline |
| 5.11 | [Rate Limiter](05-case-studies/11-rate-limiter.md) | Token bucket + 3 rivals, atomic check-consume, distributed story |
| 5.12 | [Pub-Sub Queue](05-case-studies/12-pub-sub-queue.md) | Log+offsets, consumer groups, delivery semantics, DLQ |
| 5.13 | [In-Memory File System](05-case-studies/13-in-memory-file-system.md) | Composite, path resolution, recursive ops, symlink cycles |

### Part 6 — Interview Prep (`06-interview-prep/`)
| # | Chapter | What you get |
|---|---------|--------------|
| 6.1 | [The Interview Framework](06-interview-prep/01-interview-framework.md) | The 45-minute script, phrase bank, seniority calibration, failure modes |
| 6.2 | [The Cheat Sheet](06-interview-prep/02-pattern-problem-cheatsheet.md) | Problems × patterns × traps table, universal seams, memory snippets |
| 6.3 | [Rapid-Fire Q&A Bank](06-interview-prep/03-qa-bank.md) | 60 questions with crisp 15-second answers |
| 6.4 | [Tips & Red Flags](06-interview-prep/04-tips-and-red-flags.md) | The 10 behaviors, the red-flag list, 4-week plan, night-before checklist |

---

## 🧭 Suggested study plan (4 weeks)

```
Week 1  → Part 1 + Part 4 (foundations & modeling — the grading rubric)
Week 2  → Part 2 (patterns) + reproduce the Ch 2.5 map from memory
Week 3  → Part 3 (concurrency) + case studies 5.1–5.5
Week 4  → Case studies 5.6–5.13 + all of Part 6 + one recorded 45-min mock
```

**Golden rule:** after each chapter, close the notes and *design it aloud from scratch* (or code the kata). If you can't narrate it, re-read. LLD is learned by *designing*, not by reading.

---

## 🔗 Companion

Pairs with the [System Design Mastery (HLD)](https://github.com/maheshsreerama/System-Design) notes — same style, same app, one level up the stack. Ch 6.2 Q5 maps exactly which LLD ideas reappear in HLD interviews.
