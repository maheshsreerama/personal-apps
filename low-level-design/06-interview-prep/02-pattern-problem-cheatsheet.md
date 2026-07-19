# 6.2 The Cheat Sheet — Problems × Patterns × Traps

> One-screen revision before an interview. Every classic problem: its pattern sentence, its concurrency moment, and its trap. If you can reproduce this table from memory, you're ready.

---

## The master table

| Problem | Pattern sentence | Concurrency moment | The trap (avoid it) |
|---|---|---|---|
| **Parking Lot** (5.1) | Strategy (assignment, fee) + Factory (vehicle) + per-spot state | Two gates, last spot → `tryAssign` per-spot lock + retry | Fee logic in ParkingLot instead of FeePolicy |
| **Elevator** (5.2) | State (car) + Strategy (scheduling) + LOOK on two TreeSets | Confine cars to control thread; queues in | FCFS serving → zigzag; thread-per-elevator |
| **Vending Machine** (5.3) | State pattern, pure delegation + CoR-ish change | Single-user machine — say it, coarse lock if shared | Dispensing without `canMakeChange` check first |
| **LRU Cache** (5.4) | HashMap + DLL; eviction as Strategy; TTL lazy+sweep | get() mutates → coarse lock, then shard/approximate | O(n) eviction via timestamps; forgetting map+list dual removal |
| **Tic-Tac-Toe / S&L** (5.5) | Small clean model; Dice/Player interfaces; jumps = one Map | Turn validation is the serializer | Snake and Ladder as separate class hierarchies |
| **Chess** (5.6) | Piece polymorphism + slide() reuse; simulate-undo legality | Game is the serialization point | Pieces knowing their position; coding all 6 pieces |
| **Splitwise** (5.7) | Strategy (splits) + immutable ledger + pairwise balance sheet | Per-group consistency | double for money; losing paise in ₹100/3 |
| **BookMyShow** (5.8) | HOLD→PAY→CONFIRM + per-seat lock, sorted multi-acquire | *The* seat race — bring it up yourself | Book-then-pay; holds that never expire |
| **Ride Hailing** (5.9) | Trip state machine + matching Strategy + pricing Decorators | CAS driver AVAILABLE→OFFERED + offer timeout | Re-pricing at drop-off (freeze the quote) |
| **Logger** (5.10) | Appenders + Formatter Strategy + AsyncAppender decorator | Bounded queue, one writer thread, overflow policy | Logger that throws; unbounded queue |
| **Rate Limiter** (5.11) | Strategy per algorithm; token bucket lazy refill | check+consume in one critical section / CAS | Fixed-window boundary burst unmentioned |
| **Pub-Sub** (5.12) | Log+offsets; groups own partitions; commit-after-process | Per-partition append lock; pull loops | Per-subscriber copies; "exactly-once" without idempotency |
| **File System** (5.13) | Composite + Map children + single PathResolver | RW-lock coarse → per-directory, mv in path order | addChild on Node (LSP); List children |

## Requirements checklists (ask-these-first, per problem family)

- **Booking/inventory** (BookMyShow, hotel, cab): hold TTL? partial success on multi-item? cancellation/refund rules? overbooking allowed?
- **Machines** (vending, ATM, kiosk): denominations? change availability? cancel mid-flow? admin/restock?
- **Games**: variants of rules? undo? N players? bot? board size generic?
- **Money** (Splitwise, wallet, payment): currency? rounding rule? edit history? settlement?
- **Infra libraries** (cache, limiter, logger, queue): capacity/bounds? eviction/overflow policy? thread-safety contract? metrics hooks?

## The universal seams (pre-decide these before any interview)

1. **Repository interfaces** over in-memory maps — persistence-ready by construction.
2. **Clock injected** — every time-based rule becomes testable.
3. **Strategy for the axis the problem statement says varies** — pricing, matching, splitting, eviction, scheduling.
4. **State machine (explicit transitions) for any entity with a lifecycle** — ticket, order, trip, booking, machine.
5. **Observer for "notify/update X when Y"** — boards, alerts, analytics.
6. **Domain exceptions** — one small hierarchy, thrown at invariant violations.

## Java snippets you should be able to type from memory

```java
// 1. The atomic claim (parking, seats, drivers)
public synchronized boolean tryClaim(String owner) {
    if (state != FREE) return false;
    state = HELD; this.owner = owner; return true;
}

// 2. Get-or-create per key (sessions, buckets, locks)
map.computeIfAbsent(key, k -> factory.create(k));

// 3. Sorted multi-lock (multi-seat, transfer)
items.sort(comparing(Item::id));
for (...) if (!item.tryClaim(o)) { releaseAll(claimed); return false; }

// 4. Strategy + factory selection
Map<Type, Strategy> registry; registry.get(type).execute(...);

// 5. State transition table
enum Status { ...; boolean canGoTo(Status next) { return LEGAL.get(this).contains(next); } }

// 6. Deterministic money split
long base = total / n, rem = total % n;   // first rem shares get +1

// 7. Bounded handoff
BlockingQueue<T> q = new ArrayBlockingQueue<>(cap); q.offer(x) /*policy*/; q.take();
```

## Red-flag phrases to never say (and their replacements)

| ❌ Don't say | ✅ Say instead |
|---|---|
| "I'll just make it a singleton" | "One instance, injected from the composition root" |
| "double for the price" | "long minor-units / BigDecimal — money is never floating point" |
| "I'll synchronize everything" | "The invariant is X; the smallest lock protecting it is on Y" |
| "We can add getters/setters for all fields" | "I'll expose behavior; fields stay private" |
| "This pattern is best practice" | "This axis varies per the requirements, so it gets an interface" |
| "That edge case won't happen" | "Guarding it here: throw DomainException with context" |

---

## ✅ Key Takeaways
- 13 problems, one table: pattern sentence + concurrency moment + trap. Reproduce it from memory as your final revision.
- Six universal seams cover every problem; seven snippets cover every coding moment.
- Family checklists make your Phase-1 questions instant and impressive.

## 💡 Tips & Tricks
- Night before: rewrite the master table from memory, check gaps, reread only the chapters where you blanked.
- Each problem's "trap" is usually the interviewer's favorite probe — prepare the dodge sentence.
- The snippets are finger-memory: type each 3 times today; they cost zero thought under pressure.

## 🎯 Interview Q&A

**Q1. You get a problem not in any list — "design a smart irrigation controller." First 60 seconds?**
> Same machine, new nouns: it's a *machine* family problem (state machine: idle/watering/paused) + *scheduling* (strategy: timer, moisture-threshold, weather-aware) + *observer* (sensors publish readings) + limited shared resource (water pressure/zones → semaphore thinking). I'd say the family mapping aloud, run Phase 1 with the machines checklist, and trust the universal seams. Novel problems are recombinations — the confidence to say "this decomposes into shapes I know" is exactly what the unusual prompt is testing.

**Q2. Which single problem is the best all-round practice, and why?**
> BookMyShow. It exercises the modeling insight (Movie/Show/ShowSeat lifecycle split), the hardest common concurrency (multi-entity atomic claim with TTL holds), a state machine (booking), strategies (pricing), external-system discipline (idempotent payments), and clean extension pressure (waitlist, cancellation). If you can do it end-to-end in 45 minutes with the concurrency narrated unprompted, every other problem is a subset. Parking lot second — it's the gentler version of the same skeleton.

**Q3. How do you revise these in the final week?**
> Spaced retrieval, not rereading: day 1 — master table from memory + fix gaps. Days 2–5 — two problems daily as *timed whiteboard runs* (20-min diagram + narration, no code), pairing one heavy (chess, pub-sub) with one light (S&L, limiter). Day 6 — the seven snippets typed cold + the phrase bank (6.1) out loud. Day 7 — one full 45-minute mock with a friend or recorder, then rest. Producing beats reviewing 10:1 for this material.

**Q4. The table says "bring up the seat race yourself" — what if the interviewer wanted to ask it as their big question?**
> Even better: you answer it before it's asked, and they upgrade to the harder follow-ups (multi-JVM, payment-after-expiry) — which is where differentiation actually happens. There's no scenario where volunteering the core risk hurts: either it was their question (you look proactive) or it wasn't (you added a dimension they now probe). The only mistake is raising it and hand-waving the solution — volunteer it *with* the per-seat lock and TTL story ready.

**Q5. How much of this transfers to the HLD interview?**
> The spines are shared: strategy seams become pluggable services; state machines become workflow/saga states; per-entity locks become DB row locks or optimistic versions; the pub-sub log IS Kafka; rate limiter and cache appear verbatim in both rounds; idempotency and immutable ledgers are the same idea at both scales. What changes is the unit of composition — classes vs services — and the failure model (partial failure, networks). Saying "this JVM lock is that DB constraint at scale" in either round signals you see the continuum, which is the strongest architectural signal there is.
