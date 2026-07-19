# 6.3 Rapid-Fire Q&A Bank — 60 Questions With Crisp Answers

> Screening rounds and interview warm-ups fire these directly. Answers here are the 15–30 second versions — expand on request. Grouped by topic; the ⭐ ones are near-guaranteed.

---

## OOP & Principles

**1. ⭐ Four pillars in one line each?**
> Encapsulation: state hidden behind behavior. Abstraction: expose what, hide how. Inheritance: is-a reuse of contract+code. Polymorphism: one call site, runtime-chosen behavior.

**2. ⭐ Composition over inheritance — why?**
> No fragile base class, runtime-swappable behavior, testable via injection, survives multi-axis change. Inherit only for true, stable is-a with substitutability.

**3. ⭐ Explain each SOLID letter in a sentence.**
> S: one reason to change. O: extend by adding code, not editing. L: subtypes must honor the base contract. I: many client-shaped interfaces over one fat one. D: depend on abstractions, inject the concretes.

**4. Abstract class vs interface?**
> Interface = contract, multiple inheritance of type, default methods, no state. Abstract class = partial implementation + state + constructors, single slot. Capability → interface; shared skeleton → abstract class.

**5. ⭐ Why override equals and hashCode together?**
> Hash collections bucket by hashCode then confirm by equals; breaking the pact makes contains/get silently fail or duplicate keys.

**6. What makes a class immutable?**
> final class, private final fields, no setters, defensive copies in/out, no `this` escape in constructor. Free thread-safety, safe map keys.

**7. Law of Demeter in practice?**
> One dot of behavior: `customer.canPay(x)`, never `customer.getWallet().getBalance()...` — tell the object holding the data to decide.

**8. Anemic domain model — why is it bad?**
> Entities as field-bags with logic in services → invariants unenforced and duplicated, check-then-act races, procedural code wearing OO syntax. Put behavior with data.

**9. When is a `switch` acceptable in good design?**
> In the one factory/creation site over a sealed/enum domain (compiler-checked exhaustive), or two honest variants with no third coming. Everywhere else on type → polymorphism.

**10. Cohesion vs coupling?**
> Cohesion: how much a class's parts belong together (high = one concept). Coupling: how much classes know each other (low = narrow, abstract dependencies). Aim high/low; every principle serves these two dials.

## Design Patterns

**11. ⭐ Strategy vs State?**
> Same UML, different intent: Strategy — client picks an algorithm, variants independent, stable over lifetime. State — object switches its own mode, states know successors, transitions constant.

**12. ⭐ Factory Method vs Abstract Factory?**
> One product from a type → factory method. A consistent *family* of related products → abstract factory.

**13. ⭐ Decorator vs Proxy?**
> Same wrapping shape. Decorator: client composes it to add visible behavior, stacks. Proxy: controls access (lazy/auth/cache/remote), client usually unaware, single layer.

**14. Adapter vs Facade?**
> Adapter translates one alien interface into yours. Facade invents a simpler interface over many subsystems. Translate vs simplify.

**15. When is Singleton legitimate, and what's the safest Java form?**
> Genuinely process-wide, stateless-or-thread-safe service (config, ids, logging context); enum or holder idiom; and prefer container-managed single instances — inject, don't `getInstance()` everywhere.

**16. Why does double-checked locking need volatile?**
> `new` = allocate→construct→publish can reorder; without volatile another thread can see a non-null, half-built object. Volatile fences publication.

**17. Builder vs telescoping constructors?**
> Named steps, optional params with defaults, cross-field validation in build(), immutable product. Use at 4+ params or any optionality.

**18. Observer's two failure modes and fixes?**
> A throwing listener breaking the loop → try/catch per listener. Slow listener blocking publish → async delivery via per-listener queue/executor.

**19. Command pattern's superpower?**
> Actions become objects → storable, queueable, loggable, undoable (inverse), replayable. Undo/redo = two stacks.

**20. Template Method vs Strategy for varying steps?**
> Template: fixed skeleton, inheritance fills blanks, parent controls order. Strategy: whole algorithm swapped by composition. Prefer composition; protect an invariant sequence with a final template.

**21. Chain of Responsibility's two flavors?**
> First-match-wins (ATM denominations, approvals) vs process-and-continue (loggers, filters). Say which you're building.

**22. Visitor — when, and its cost?**
> Stable hierarchy + growing operations; double dispatch via accept/visit. Cost: new element type touches every visitor. Modern Java: sealed + pattern-matching switch often replaces it.

**23. Flyweight in one line + JDK example?**
> Share the immutable intrinsic part among millions of instances; extrinsic state passed in. `Integer.valueOf` cache, string interning.

**24. Null Object pattern?**
> A do-nothing implementation replacing null checks (NoDiscount, no-op logger). Don't use where absence is an error to surface.

## Java & Language

**25. ⭐ Why is money never double?**
> Binary floats can't represent 0.1; errors compound across arithmetic. Use long minor-units or BigDecimal — exactness is the requirement.

**26. Records — what do they give and when not to use?**
> Immutable value carriers: final fields, equals/hashCode/toString, compact validation constructors. Not for entities with identity+lifecycle or mutable state.

**27. Optional — the rules?**
> Return type for expected absence; never fields or params; never `.get()` bare; empty collections instead of Optional-of-collection.

**28. ⭐ HashMap vs ConcurrentHashMap vs synchronizedMap?**
> HashMap: none-safe, corrupts under concurrent write. synchronizedMap: one global lock, compound ops still race. CHM: per-bin concurrency + atomic compound ops (putIfAbsent/compute) — the default under threads.

**29. ArrayList vs LinkedList — real answer?**
> ArrayList almost always: O(1) index, cache-friendly; amortized O(1) append. LinkedList only for heavy head/mid insert-delete via iterator — rare. (Deque → ArrayDeque.)

**30. fail-fast vs weakly-consistent iterators?**
> ArrayList etc. throw ConcurrentModificationException on structural change mid-iteration (best-effort). CHM/COW iterate a safe view: no exception, may miss concurrent updates.

**31. Comparable vs Comparator?**
> Comparable: the type's one natural order (`compareTo`). Comparator: external, many orders, composable (`comparing().thenComparing()`), keeps the entity clean.

**32. Sealed interfaces — why care in LLD?**
> Closed hierarchies the compiler knows: exhaustive switch without default, safer domain sums (PaymentMethod = Card|Upi|Wallet). Pattern-matching makes visitor-free dispatch clean.

**33. String immutability — design consequences?**
> Safe sharing/interning/map keys, no defensive copies; concatenation in loops → StringBuilder.

**34. Why prefer enums to string/int constants?**
> Type safety, exhaustive switches, namespaced values, attachable behavior/fields — a mini strategy per constant if needed.

## Concurrency

**35. ⭐ synchronized guarantees?**
> Mutual exclusion on the monitor + memory visibility: release flushes, acquire re-reads — happens-before between exiting and entering threads.

**36. ⭐ volatile vs synchronized?**
> volatile: visibility + ordering for a single variable; no atomicity for compound actions. synchronized: atomicity + visibility for a block. Flag → volatile; count++ → atomic/lock.

**37. ⭐ What is check-then-act and why does it break?**
> Decision on state that can change between the check and the act (if free → assign). Fix: one atomic operation covering both — lock spanning check+act, CAS, or CHM compute methods.

**38. Deadlock's four conditions and the practical fix?**
> Mutual exclusion, hold-and-wait, no preemption, circular wait. Fix: global lock ordering (sorted IDs); or tryLock-with-timeout-and-retry; or one coarser lock.

**39. wait/notify rules?**
> Only while holding the monitor; wait in a while(predicate) loop (spurious/stolen wakeups); prefer separate Conditions (notFull/notEmpty) over notifyAll storms; prefer BlockingQueue over all of it.

**40. CAS — what and where?**
> Compare-and-set: write only if the value is still what I read; retry loop otherwise. Atomics, lock-free counters, single-field state machines (FREE→HELD). Fails under multi-field invariants → lock or immutable-snapshot-in-AtomicReference.

**41. ⭐ How do you make seat/spot booking thread-safe in one JVM?**
> Lock on the entity: synchronized tryHold checking-and-setting in one section; multi-seat → sorted acquisition all-or-release; TTL holds with lazy + swept expiry.

**42. ReadWriteLock — when does it pay?**
> Read-heavy shared structures (catalogs, configs, file trees): parallel readers, exclusive writers. Useless when "reads" mutate (LRU recency!).

**43. ThreadLocal — use and hazard?**
> Per-thread context (request ids, formatters) without passing params. Hazards: leaks on thread pools (remove() in finally), invisible coupling; scoped values on virtual threads.

**44. Virtual threads' one-line pitch?**
> Cheap JVM-scheduled threads → thread-per-request survives 100K blocking tasks with simple code; not faster CPU, just cheaper waiting.

**45. Why bounded queues?**
> Backpressure: producers feel the overload (block/fail) instead of OOM. The bound + overflow policy is a design decision, not a tuning knob.

## Modeling & Architecture

**46. ⭐ Entity vs value object?**
> Entity: identity + lifecycle + mutable state (equality by id). VO: is its attributes, immutable, freely shared (equality by value). Push everything possible to VO.

**47. Aggregate root — why does it matter?**
> Single entry point owning a consistency boundary: invariants enforced once, natural lock scope, small API. Reference other aggregates by ID.

**48. Repository pattern in one line?**
> Collection-like interface for aggregate roots, domain-named queries; in-memory today, DB tomorrow, tests forever.

**49. Why constructor injection over field injection/statics?**
> Dependencies explicit and final, object valid at construction, trivially testable with fakes, no framework needed — a main() wiring is enough.

**50. ⭐ How do you make a design testable?**
> Inject seams: repositories, Clock, external gateways as interfaces; pure logic in entities/VOs; side effects at edges. Then tests need no infra and no mocks-of-everything.

**51. Idempotency — define and give the standard mechanism.**
> Same operation applied twice = applied once. Mechanism: caller-supplied idempotency key, dedupe store checked atomically before effect; or naturally idempotent writes (set-status).

**52. Event sourcing in miniature (LLD scale)?**
> Store the operations (moves, expenses, commands), derive state by folding; gives audit, undo, replay. Chess history and Splitwise ledger are exactly this.

**53. When do you introduce an interface?**
> Stated variation axis, external system boundary, or test seam. Not for "just in case" — one forever-implementation is ceremony.

**54. State machine: enum+switch vs State pattern — the boundary?**
> 2–3 states with trivial transitions → enum + transition table. Rich per-state behavior across many events → state classes (matrix completeness by construction).

## Curveballs

**55. "Design anything you like in 10 minutes" — what do you pick?**
> A rate limiter or LRU cache: small enough to finish, deep enough to show strategy seams, algorithms, and concurrency in one arc.

**56. "What's the worst code you've written?"**
> Have a real story: the smell, the consequence, the refactor, the lesson (e.g., god service → split by reason-to-change). Self-awareness is the point.

**57. "Estimate classes needed for X" (weird but asked)?**
> Refuse the number gracefully: "entities + VOs + one service per flow + interfaces per variation axis — for this problem that lands around N; the count follows the model, not vice versa."

**58. "Is Java OOP done right?"**
> Diplomatic depth: great — interfaces, strong typing, now records/sealed/patterns for data modeling; warts — primitives split, arrays covariance, checked exceptions, pre-record boilerplate. Modern Java closes most gaps.

**59. "Convince me NOT to use microservices for this."**
> One process, one team, entangled invariants (seat + payment + booking) → a modular monolith with clean aggregates wins: transactions instead of sagas, refactoring instead of API versioning. Distribution is a cost you pay when team/scale forces it.

**60. ⭐ "Any questions for me?" — the LLD-round version.**
> Ask about *their* design reality: "What's the most contended piece of state in your system and how do you protect it?" or "What does code review push back on most here?" — signals you think about the craft, and their answer teaches you about the team.

---

## 💡 Tips
- Practice these out loud, 20 per day for 3 days — verbal fluency is the whole game in rapid-fire rounds.
- Every ⭐ deserves a written-from-memory version in your own words.
- If an answer draws a follow-up you can't handle, the chapter reference is your study pointer: patterns → Part 2, concurrency → Part 3, modeling → Ch 4.3.
