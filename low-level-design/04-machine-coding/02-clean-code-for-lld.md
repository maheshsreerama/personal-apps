# 4.2 Clean Code & API Design for LLD — What Reviewers Actually Read

> Two candidates produce the same design; one gets "strong hire". The delta is almost always code-level: names, method size, error handling, and API shape. These are cheap points — collect all of them.

---

## Naming — the 80/20 of readability

| Smell | Fix | Why it matters |
|---|---|---|
| `ParkingLotManager`, `DataHelper` | `SpotAllocator`, `FeeCalculator` | -er/-or names tied to one job |
| `process()`, `handle()`, `doStuff()` | `assignSpot()`, `settleBalance()` | verb = contract |
| `list1`, `temp`, `flag` | `availableSpots`, `isWithinGrace` | reader never decodes |
| `getUser()` that creates a user | `findOrCreateUser()` | least astonishment |
| boolean param `book(seat, true)` | `book(seat, BookingType.PREMIUM)` | call sites self-document |

Test: read the call site aloud — `lot.park(car)` reads as English; `mgr.process(obj, true, 2)` doesn't.

## Methods — small, one level of abstraction

```java
// ❌ 40-line method mixing policy and plumbing        // ✅ the method reads as its own outline
public Receipt unpark(String ticketId) {
    Ticket t = activeTicketOrThrow(ticketId);
    Duration stay = clock.durationSince(t.entryTime());
    Money fee = feePolicy.feeFor(t.vehicleType(), stay);
    releaseSpot(t.spotId());
    return receipts.issue(t, fee);
}
```

Rules of thumb: ≤ 15 lines; one level of abstraction per method (don't mix `stream().filter()` plumbing with business decisions); early-return guard clauses instead of arrow-shaped nesting:

```java
public void cancel(Booking b) {
    if (b.status() == CANCELLED) return;                       // idempotent, flat
    if (b.status() == COMPLETED) throw new IllegalStateException("completed bookings can't cancel");
    b.markCancelled();
    refunds.issue(b);
}
```

## Errors — a small taxonomy, used consistently

- **Domain exceptions** extend `RuntimeException`, named by business meaning: `SeatUnavailableException`, `InsufficientBalanceException`, `TicketNotFoundException`. Carry context in the message (ids, amounts).
- **`Optional<T>`** for *expected* absence (`findById`); exceptions for *violated expectations* (`getActiveTicket` when the flow guarantees one). Never `Optional` fields/params; never return null collections — return empty.
- **Validate at the boundary** (constructor/service entry), then trust internally — no re-checking nulls five layers deep.

```java
public Expense(String paidBy, Money amount, List<Split> splits) {
    this.paidBy = Objects.requireNonNull(paidBy);
    if (amount.isNegativeOrZero()) throw new InvalidExpenseException("amount must be positive");
    if (!Split.sumsTo(splits, amount)) throw new InvalidExpenseException("splits must equal amount");
    this.amount = amount; this.splits = List.copyOf(splits);   // defensive copy
}
```

An object that *cannot be constructed invalid* deletes whole categories of downstream checks — say "invariants enforced at construction" while writing it.

## API shape — design the calls before the classes

Write the dream client code first, then make it compile:

```java
SplitwiseService s = SplitwiseService.create();
Group trip = s.createGroup("Goa", alice, bob, carol);
s.addExpense(trip, alice.paid(rupees(3000)), Split.equally());
s.addExpense(trip, bob.paid(rupees(1200)), Split.percent(alice, 50, bob, 30, carol, 20));
List<Settlement> due = s.settlementsFor(trip);
```

Principles: **make illegal states unrepresentable** (an `enum` + sealed types instead of string status; `Split.percent(...)` that validates 100% at creation); accept the most abstract type (`Collection` in, `List` out); return immutable views; keep services stateless where possible (state lives in entities/repos).

## Comments & formatting

- Comments say **why**, never what: `// LOOK algorithm: keep direction until no requests ahead` ✓; `// increment i` ✗.
- Dead code and commented-out blocks: delete — they read as indecision.
- Consistent formatting > any particular style. In an interview, let the IDE format; never hand-align.

## The senior-signal checklist (drop these in naturally)

- `final` fields everywhere possible; `List.copyOf` on the way in and out.
- A `Clock` injected instead of `Instant.now()` scattered — testable time ("I can unit-test the grace period").
- IDs as value types or at least dedicated `String` wrappers created in one `IdGenerator` — not `UUID.randomUUID()` sprinkled.
- `Objects.requireNonNull` in constructors; `@Override` always; enums over int/string constants.
- Streams where they clarify (mapping/filtering), loops where they don't (complex mutation, early exit).

---

## ✅ Key Takeaways
- Names carry the design: -er/-or classes with one job, verb methods, no Manager/Helper/Util.
- Small methods at one abstraction level, guard clauses, idempotent operations.
- Domain exceptions + Optional-for-absence + construct-valid-or-throw = the whole error story.
- Design the client call first; make illegal states unrepresentable; inject the Clock.

## 💡 Tips & Tricks
- When you catch yourself writing a bad name, rename aloud — visible taste beats silent perfection.
- One defensive copy with the sentence "so callers can't mutate my internals" scores more than ten getters.
- If an interviewer reads any method of yours without asking "what does this do?", you're winning the round.

## 🎯 Interview Q&A

**Q1. Checked vs unchecked exceptions in your interview code — and why?**
> Unchecked domain exceptions. Checked exceptions pollute every intermediate signature, and in a 90-minute round that friction buys nothing: callers of `bookSeat` can't recover from `SeatUnavailableException` by catching it mid-stack — it should fly to the boundary that reports it. I reserve checked-style thinking for genuinely recoverable, expected outcomes — and for those I prefer return types: `Optional`, or a small `Result`/sealed outcome when the caller must branch (hold-succeeded vs seat-taken vs payment-declined).

**Q2. Where do you draw the line between an anemic model and a fat entity?**
> Rule: behavior lives with the data it guards. Entity owns its invariants and state transitions — `seat.tryHold()`, `wallet.debit()`, `order.cancel()` — because that's the only way they're enforced everywhere. Services own orchestration across entities — booking = hold seats + charge payment + issue ticket. Anemic = entities as field-bags with services doing `seat.setStatus(HELD)` (invariants optional, scattered). Fat = entity calling repositories/gateways (untestable, coupled). The line: entities never do I/O.

**Q3. Why inject a Clock — isn't that over-engineering for an interview?**
> It's one constructor parameter, and it converts my most bug-prone logic — fees by duration, hold expiry, grace periods — from untestable to trivially testable: `clock.fixed(...)`, park, advance, assert fee. Without it, testing "2h 5m costs ₹60" means sleeping or reflection hacks. It also centralizes time zone/now decisions. This is the rare abstraction whose cost is one line and whose payoff appears within the same interview when I demo the fee test.

**Q4. `Optional` return vs throwing — give your exact rule.**
> If absence is a *normal outcome the caller decides about* → `Optional`: `findTicket(id)` — caller may create, report 404, or retry. If absence means *the system broke its own assumption* → throw: inside `unpark()`, the ticket must exist because the flow validated it — `orElseThrow(TicketNotFoundException::new)` documents that assumption and fails loud. Corollaries: never `Optional.get()` bare, never Optional parameters (overload instead), and empty collections instead of Optional<List>.

**Q5. The interviewer says your code is "too many small classes." Defend or concede?**
> First check honestly: are any classes ceremony — an interface with one forever-implementation, a layer that only forwards? Concede those; inline them live ("you're right, `TicketValidator` can be a private method until validation grows"). Defend the ones carrying a real axis: "FeeStrategy exists because you said pricing varies; folding it back couples pricing changes to tested allocation code." The meta-answer that wins: class count isn't the metric — reasons-to-change per class is; I can defend each class's reason or delete it.
