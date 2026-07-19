# 3.2 Concurrent Collections & Coordination — The java.util.concurrent Toolkit

> Senior answers don't hand-roll locks — they pick the right j.u.c. tool and explain *why it's enough*. This chapter is your toolbox with the exact sentences that justify each pick.

---

## ConcurrentHashMap — the workhorse

```java
private final ConcurrentHashMap<String, Ticket> activeTickets = new ConcurrentHashMap<>();

// atomic check-then-act — the methods that make CHM more than "thread-safe HashMap":
activeTickets.putIfAbsent(ticket.id(), ticket);                 // insert if new, atomically
activeTickets.computeIfAbsent(userId, id -> new UserSession(id)); // get-or-create, once
activeTickets.compute(key, (k, v) -> v == null ? one() : v.increment()); // atomic update
activeTickets.merge(word, 1L, Long::sum);                       // atomic counter map
```

**Why not `synchronized(map)` around a HashMap?** CHM gives per-bin locking (reads mostly lock-free, writers contend only per bucket) → scales with cores; and its atomic compound ops remove the check-then-act races that external locking gets wrong. **The trap they test:** `if (!map.containsKey(k)) map.put(k, v)` is a race *even on CHM* — two thread-safe calls don't compose into one atomic action. Use `putIfAbsent`/`compute*`.

Notes: no null keys/values; iterators are *weakly consistent* (no `ConcurrentModificationException`, may or may not see concurrent updates); `size()` is an estimate under concurrency — don't build invariants on it. `compute*` lambdas should be short and never touch other keys (deadlock risk).

## BlockingQueue — producer-consumer, solved

```java
BlockingQueue<LogEvent> buffer = new ArrayBlockingQueue<>(10_000);   // BOUNDED — always say why

// producer                              // consumer (worker thread)
buffer.put(event);      // blocks full   LogEvent e = buffer.take();   // blocks empty
buffer.offer(event);    // false if full — or offer(e, 50, MILLIS) to shed load
```

| Implementation | Traits | Pick when |
|---|---|---|
| `ArrayBlockingQueue` | bounded, array, single lock | default bounded buffer |
| `LinkedBlockingQueue` | optionally bounded, two locks (head/tail) | higher producer/consumer parallelism |
| `PriorityBlockingQueue` | unbounded, heap order | task scheduling by priority/time |
| `DelayQueue` | elements available after delay | timeouts, seat-hold expiry, retry queues |
| `SynchronousQueue` | zero capacity, direct handoff | thread-pool handoff (cached pool uses it) |
| `ConcurrentLinkedQueue` | *non*-blocking, CAS-based | when you never want waiting, just fast FIFO |

**The sentence that scores:** "bounded queue = backpressure — when consumers fall behind, producers block/fail fast instead of the process dying with OOM." Unbounded queues hide overload; bounded queues surface it as a policy decision.

## CopyOnWriteArrayList — read-mostly listener lists

Every mutation copies the array; reads are lock-free on an immutable snapshot; iteration never throws CME. Perfect for observer lists (reads = every event, writes = rare register/unregister). Wrong for write-heavy data — O(n) copy per write.

## Coordination primitives

```java
// CountDownLatch — one-shot "wait until N things done"
CountDownLatch ready = new CountDownLatch(3);
// three init tasks each call ready.countDown(); main thread: ready.await();

// Semaphore — N permits for a limited resource
Semaphore spots = new Semaphore(50, true);              // 50 parking spots, fair
if (spots.tryAcquire(2, TimeUnit.SECONDS)) {            // park with timeout
    try { doPark(v); } finally { /* release on UNpark, not here */ }
}

// CyclicBarrier — N threads rendezvous repeatedly (phased simulations)
CyclicBarrier round = new CyclicBarrier(players, this::evaluateRound);
```

Semaphore *is* a counting inventory — for "limited spots/permits/connections", `Semaphore` alone may replace a lock-and-count design; say that. Latch = one-shot gate; Barrier = reusable meeting point; **Phaser** generalizes both (name-drop level).

## Pattern: get-or-create without races

```java
// One session per user, exactly once, no locks visible:
sessions.computeIfAbsent(userId, UserSession::new);
```

This single line replaces the DCL-per-key dance and is the canonical answer to "how do you lazily create per-key objects safely?"

## Pattern: per-key locking (lock striping)

Global lock serializes everything; per-key locks let independent keys proceed:

```java
private final ConcurrentHashMap<String, Object> keyLocks = new ConcurrentHashMap<>();

public void bookSeat(String seatId, User u) {
    Object lock = keyLocks.computeIfAbsent(seatId, k -> new Object());
    synchronized (lock) {                       // only contends with SAME seat
        Seat seat = seats.get(seatId);
        if (!seat.isAvailable()) throw new SeatTakenException(seatId);
        seat.hold(u);                           // check-then-act atomic per seat
    }
}
```

This is the heart of BookMyShow/inventory answers (Ch 5.8). Alternative: `Striped<Lock>`-style fixed array of locks indexed by `hash(key) % N` — bounds memory when the key space is huge.

## Which tool for which interview moment

| Moment in the design | Reach for | The justifying sentence |
|---|---|---|
| Shared registry/cache/inventory map | `ConcurrentHashMap` + `compute*` | "atomic per-key updates, no global lock" |
| Work handoff between components | bounded `BlockingQueue` | "decouples rates; bound = backpressure" |
| Listener/observer lists | `CopyOnWriteArrayList` | "read-mostly; iteration is snapshot-safe" |
| Limited identical resources | `Semaphore` | "permits *are* the inventory" |
| Await N startup/completion events | `CountDownLatch` | "one-shot gate" |
| Expiring holds/retries | `DelayQueue` / scheduled executor | "time-ordered availability" |
| Unique IDs / metrics | `AtomicLong` / `LongAdder` | "CAS, no lock" |

---

## ✅ Key Takeaways
- CHM's `putIfAbsent`/`computeIfAbsent`/`merge` are the answer to almost every shared-map race; two safe calls ≠ one atomic action.
- BlockingQueue deletes hand-rolled wait/notify; **always bound it** and own the overflow policy.
- Semaphore = counting inventory; Latch = one-shot gate; COW list = observer storage.
- Per-key locking (via CHM of locks or striping) = concurrency without global serialization — the inventory-booking superpower.

## 💡 Tips & Tricks
- Swap vocabulary: never "I'll synchronize the map" — instead "CHM with computeIfAbsent, because the check-and-create must be atomic."
- When asked "what if two users click at once?" — per-key lock or CAS on the entity's state is your first move, not a service-wide lock.
- Mention the overflow policy the moment you draw a queue: block, drop-oldest, or reject — choosing is the design.
- `Collections.synchronizedMap` exists; knowing *why you're not using it* (compound-op races, global lock, manual sync for iteration) is the actual test.

## 🎯 Interview Q&A

**Q1. Why can `map.containsKey(k)` + `map.put(k,v)` race even on a ConcurrentHashMap?**
> Each call is atomic, but between them another thread can insert the same key — check-then-act across two operations has no combined atomicity. Result: overwritten value or duplicate initialization. Fix: the compound atomic ops — `putIfAbsent`, or `computeIfAbsent` when creation is expensive (it runs the factory at most once per key). General lesson: thread safety doesn't compose; atomicity must cover the whole decision.

**Q2. Design choice: BlockingQueue vs wait/notify for a producer-consumer buffer?**
> BlockingQueue, always, unless explicitly asked to implement the primitive. It encapsulates the lock, both conditions, the while-loop recheck, and interruption handling — the four places hand-rolled versions go wrong. I choose `ArrayBlockingQueue(capacity)` for the bound and say the backpressure sentence. If the interviewer wants internals, I then write the two-Condition ReentrantLock version (Ch 3.3) — knowing both layers is the win.

**Q3. What does "weakly consistent iterator" mean and why is it fine?**
> CHM/CLQ iterators traverse a view that reflects the state at or after creation: they never throw ConcurrentModificationException, never return an element twice, but may miss concurrent inserts. Fine because concurrent readers by definition tolerate a moving target — a monitoring sweep over active tickets doesn't need a frozen snapshot. When I *do* need one, I copy deliberately (or use COW structures) and pay for it knowingly.

**Q4. 100 parking spots, park() and unpark() from many gates — no explicit locks. Design it.**
> `Semaphore(100)` embodies the count: `tryAcquire` at entry (fail/timeout = lot full), `release` at exit. Pair it with a `ConcurrentLinkedQueue<Spot>` of free spots: acquire permit → poll a spot (guaranteed non-null because permits ≤ spots) → on exit, offer the spot back then release the permit. Permit ordering makes the invariant airtight without a single synchronized block — and fairness mode prevents gate starvation.

**Q5. When is LongAdder better than AtomicLong?**
> Under heavy multi-thread contention on a counter that's written often and read rarely (metrics, hit counts). AtomicLong = one CAS target: threads retry-storm on the same cache line. LongAdder stripes across cells (threads hit different cells, `sum()` aggregates) — much higher write throughput, at the cost of an approximate/racy read and more memory. For an ID generator I still want AtomicLong: I need each value exactly once, not a statistical sum.
