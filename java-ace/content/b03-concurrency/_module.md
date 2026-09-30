---
title: Advanced Concurrency
icon: 🔒
blurb: The memory model, lock-free atomics, concurrent collections, thread confinement, locks and virtual threads that senior Java interviews dig into.
---
# Advanced Concurrency
## Memory Model & Atomics
### [Java Memory Model & volatile](lesson:b03-concurrency/01-java-memory-model-and-volatile)
- Visibility only through happens-before: lock, volatile, start/join
- No happens-before = data race: stale, reordered or torn values
- volatile = visibility + ordering, NOT atomic (`count++` still races)
- DCL needs volatile; final fields are safely published
### [Atomics & CAS](lesson:b03-concurrency/02-atomics-and-cas)
- volatile field + hardware CAS = lock-free single-variable updates
- CAS loop: read, compute, compareAndSet, retry
- ABA problem → AtomicStampedReference
- Hot counters → LongAdder (striped cells)
## Concurrent Collections
### [ConcurrentHashMap](lesson:b03-concurrency/03-concurrenthashmap)
- Java 7: 16 segments; Java 8+: CAS on empty bin, synchronized on bin head
- Lock-free reads, weakly consistent iterators, no nulls
- Atomic per-key ops: computeIfAbsent, merge, putIfAbsent
### [BlockingQueue & Concurrent Collections](lesson:b03-concurrency/04-blockingqueue-and-concurrent-collections)
- put/take block, offer/poll time out: producer-consumer with backpressure
- ArrayBlockingQueue (1 lock) vs LinkedBlockingQueue (2 locks)
- CopyOnWriteArrayList: snapshot reads, copy on every write
- ConcurrentSkipListMap = concurrent sorted map
## Threads & Locks
### [ThreadLocal](lesson:b03-concurrency/05-threadlocal)
- The map lives in the Thread; ThreadLocal is only the key
- Weak key, strong value: pools leak and leak stale data
- set, try, finally remove()
- InheritableThreadLocal copies at thread creation; ScopedValue for context
### [synchronized vs ReentrantLock](lesson:b03-concurrency/06-synchronized-vs-reentrantlock)
- Same exclusion, visibility, reentrancy; similar speed
- Lock extras "TIFCo": tryLock, Interruptible, Fairness, Conditions
- Monitor waiter BLOCKED, Lock waiter WAITING (parked)
- Mark word: thin lock (CAS) → inflated ObjectMonitor; biased locking gone
## Modern Concurrency
### [Virtual Threads](lesson:b03-concurrency/07-virtual-threads)
- Millions of cheap threads on one carrier per core (Java 21)
- Blocking unmounts; synchronized + blocking pins (JDK 21–23)
- One per task, never pooled; Semaphore limits resources
- For I/O-bound throughput, not CPU-bound speed; StructuredTaskScope (preview)
