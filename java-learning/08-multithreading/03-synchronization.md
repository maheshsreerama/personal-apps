# Synchronization — Race Conditions, synchronized & volatile

## The race condition

`count++` is secretly three steps (read, add, write). Two threads can interleave those
steps and **lose updates**:

```java
public class RaceDemo {
    static int unsafe = 0;
    static int safe = 0;
    static final Object LOCK = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable job = () -> {
            for (int i = 0; i < 100_000; i++) {
                unsafe++;                        // ❌ not atomic
                synchronized (LOCK) { safe++; }  // ✅ one thread at a time
            }
        };
        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start();
        t1.join();  t2.join();

        System.out.println("unsafe = " + unsafe + "  (expected 200000)");
        System.out.println("safe   = " + safe);
    }
}
```

**Typical output (unsafe value varies run to run!):**

```
unsafe = 137482  (expected 200000)
safe   = 200000
```

## synchronized — mutual exclusion

Every object has a hidden **monitor lock**. `synchronized` acquires it on entry, releases
on exit (even via exception). Only one thread can hold a given monitor at a time.

```java
public class SyncForms {
    private int balance = 100;

    // form 1: synchronized method → locks `this`
    public synchronized void deposit(int amt) { balance += amt; }

    // form 2: synchronized block → lock only the critical section (finer-grained)
    private final Object lock = new Object();
    public void withdraw(int amt) {
        // ...validation can run unlocked...
        synchronized (lock) {
            if (balance >= amt) balance -= amt;
        }
    }

    // form 3: static synchronized → locks the Class object (shared by ALL instances)
    private static int totalOps = 0;
    public static synchronized void countOp() { totalOps++; }

    public static void main(String[] args) throws InterruptedException {
        SyncForms acc = new SyncForms();
        Thread t1 = new Thread(() -> { for (int i = 0; i < 1000; i++) { acc.deposit(1); countOp(); } });
        Thread t2 = new Thread(() -> { for (int i = 0; i < 1000; i++) { acc.withdraw(1); countOp(); } });
        t1.start(); t2.start(); t1.join(); t2.join();
        System.out.println("balance = " + acc.balance + ", totalOps = " + totalOps);
    }
}
```

**Output:**

```
balance = 100, totalOps = 2000
```

Key points:

- Instance-`synchronized` and `static synchronized` use **different locks** — they don't
  exclude each other.
- Keep critical sections **small**: lock the update, not the whole method, when possible.
- The same thread may re-enter a lock it already holds (locks are **reentrant**).

## volatile — visibility without locking

Threads may cache variables in CPU registers. Without a visibility guarantee, one
thread's write may **never be seen** by another. `volatile` forces reads/writes to go to
main memory:

```java
public class VolatileDemo {
    static volatile boolean running = true;   // try removing volatile → may hang forever!

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            long spins = 0;
            while (running) { spins++; }       // no lock, just reads a flag
            System.out.println("worker saw stop after " + spins + " spins");
        });
        worker.start();

        Thread.sleep(100);
        running = false;                       // visible to worker because volatile
        worker.join();
        System.out.println("main done");
    }
}
```

**Output (spin count varies):**

```
worker saw stop after 172503418 spins
main done
```

`volatile` gives **visibility + ordering**, but **not atomicity** — `volatile int x; x++`
is still a race. For counters, use `AtomicInteger` (later chapter).

## synchronized vs volatile

| | `synchronized` | `volatile` |
|---|---|---|
| Guarantees | atomicity + visibility | visibility only |
| Blocks other threads | yes | no |
| Usable on | methods / blocks | fields only |
| Typical use | compound updates (`balance += x`) | status flags, publish-once references |

## Rules of thumb

1. Shared **mutable** state needs synchronization — pick one: locks, `volatile`
   (flags only), atomics, or confine data to one thread.
2. Always lock the **same monitor** for all accesses to the same data (reads too!).
3. Prefer `private final Object lock = new Object()` over locking `this` —
   outsiders can't interfere with a private lock.
4. Immutable objects need **no** synchronization — the best fix is making the problem
   disappear.

> 💡 **Interview line:** "synchronized gives me mutual exclusion *and* a happens-before
> edge; volatile gives me only the happens-before — enough for a flag, not for a counter."
