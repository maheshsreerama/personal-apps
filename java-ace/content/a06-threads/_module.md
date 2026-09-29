---
title: Multithreading
icon: 🧵
blurb: Creating and running threads, their lifecycle, synchronized and wait/notify, producer–consumer, deadlock, and the java.util.concurrent locks and synchronizers that interviews probe hardest.
---
# Multithreading
## Thread Basics
### [Creating Threads (extends Thread)](lesson:a06-threads/01-creating-threads)
- `start()` creates a new thread; `run()` alone is a plain method call
- `start()` twice → `IllegalThreadStateException`
- JVM exits when the last non-daemon thread ends
- `stop/suspend/resume` throw on JDK 20+: stop threads cooperatively
### [Runnable Interface](lesson:a06-threads/02-runnable)
- A task, not a thread: `new Thread(runnable).start()`
- Prefer it over `extends Thread`: free inheritance, works with executors and lambdas
- No result, no checked exceptions → `Callable` + `FutureTask`
- Shared `Runnable` = shared fields: make them thread-safe
### [Thread Lifecycle & States](lesson:a06-threads/03-thread-lifecycle)
- NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED (no RUNNING)
- BLOCKED = waiting for a monitor only; `j.u.c` locks show WAITING
- `join()` waits and makes the thread's writes visible
- `interrupt()` sets a flag; `InterruptedException` clears it: restore it
### [Thread Priority & Scheduling](lesson:a06-threads/04-thread-priority)
- 1..10, default 5, inherited; only a hint to the OS
- Ignored by HotSpot on Linux by default and by virtual threads
- Never use priority for correctness or ordering
## Synchronization & Communication
### [Synchronization (synchronized)](lesson:a06-threads/05-synchronization)
- `count++` = read-modify-write → race condition
- Instance method locks `this`, static locks the `Class`, block locks what you name
- Unlock happens-before the next lock of the same monitor
- `volatile` = visibility only; atomics for single variables
### [wait() and notify()](lesson:a06-threads/06-wait-notify)
- Must own the monitor, else `IllegalMonitorStateException`
- `wait()` releases the lock; `sleep()` keeps it
- `while (!condition) wait();`: never `if`
- Signals are not stored: the state flag remembers
### [notifyAll()](lesson:a06-threads/07-notify-all)
- notify = tap one shoulder, notifyAll = ring the bell
- Woken threads re-take the lock one at a time and re-check
- `notify()` only for uniform waiters + one-in, one-out
- Course example: 2 consumers, 1 event → `notify()` hangs one
### [Thread Communication (Producer–Consumer)](lesson:a06-threads/08-thread-communication)
- Full? producer waits. Empty? consumer waits. Then notify the other side
- One slot → strict `Produced`/`Consumed` ping-pong
- 2 producers + 2 consumers with `notify()` → everyone WAITING
- Real code: `BlockingQueue` `put`/`take` + poison pill
### [Deadlock](lesson:a06-threads/09-deadlock)
- Cycle of threads each holding a lock the next one needs
- Four conditions: "My Horse Never Cries" (mutual exclusion, hold and wait, no preemption, circular wait)
- Fix: global lock order, or `tryLock` + random back-off
- Detect: thread dump "Found one Java-level deadlock", `findDeadlockedThreads()`
## Concurrency Utilities
### [ReentrantLock](lesson:a06-threads/10-reentrantlock)
- `lock(); try { ... } finally { unlock(); }`
- Adds `tryLock`, timeouts, `lockInterruptibly()`, fairness, many `Condition`s
- Owner + hold count; never released automatically
- Default to `synchronized`; choose this for the extra features
### [ReadWriteLock](lesson:a06-threads/11-readwritelock)
- Many readers OR one writer
- Downgrade write → read is fine; upgrade read → write deadlocks
- Pays off only for read-heavy loads; see `StampedLock`
### [CountDownLatch](lesson:a06-threads/12-countdownlatch)
- One-shot gate: `countDown()` never blocks, `await()` until 0
- Cannot be reset; `countDown()` in `finally`
- Done gate (N workers) and start gate (count 1)
### [CyclicBarrier](lesson:a06-threads/13-cyclicbarrier)
- Reusable meeting point for a fixed number of parties
- Barrier action runs once per trip, in the last arriver
- Timeout or interrupt breaks it: `BrokenBarrierException`
### [Semaphore](lesson:a06-threads/14-semaphore)
- N permits: at most N threads at once
- Permits are counted, not owned; not reentrant
- `acquire()` before `try`, `release()` in `finally`
### [Exchanger](lesson:a06-threads/15-exchanger)
- Two threads swap objects at a rendezvous
- `exchange(x)` blocks until the partner arrives
- Classic use: double buffering
