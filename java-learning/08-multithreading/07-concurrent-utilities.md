# Concurrent Utilities — Atomics, ConcurrentHashMap, Latches & BlockingQueue

`java.util.concurrent` gives you battle-tested building blocks — reach for these before
hand-rolling `synchronized` logic.

## AtomicInteger — lock-free counters

Atomics use CPU compare-and-swap instructions: thread-safe without blocking.

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicDemo {
    public static void main(String[] args) throws InterruptedException {
        AtomicInteger hits = new AtomicInteger();

        Runnable job = () -> { for (int i = 0; i < 100_000; i++) hits.incrementAndGet(); };
        Thread t1 = new Thread(job), t2 = new Thread(job);
        t1.start(); t2.start(); t1.join(); t2.join();

        System.out.println("hits = " + hits.get());
        System.out.println("addAndGet(5) → " + hits.addAndGet(5));
        System.out.println("compareAndSet(200005 → 0): "
                + hits.compareAndSet(200_005, 0) + ", now " + hits.get());
    }
}
```

**Output:**

```
hits = 200000
addAndGet(5) → 200005
compareAndSet(200005 → 0): true, now 0
```

Compare with the broken `unsafe++` from the synchronization chapter — same job, no locks,
always correct.

## ConcurrentHashMap — the concurrent workhorse

Thread-safe map with fine-grained internal locking (reads don't lock at all). Its atomic
compound operations replace check-then-act races:

```java
import java.util.concurrent.*;

public class ChmDemo {
    public static void main(String[] args) throws InterruptedException {
        ConcurrentHashMap<String, Integer> votes = new ConcurrentHashMap<>();

        ExecutorService pool = Executors.newFixedThreadPool(4);
        for (int i = 0; i < 1000; i++) {
            pool.submit(() -> votes.merge("java", 1, Integer::sum));    // atomic!
            pool.submit(() -> votes.merge("kotlin", 1, Integer::sum));
        }
        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println(votes);
        votes.putIfAbsent("scala", 0);
        System.out.println("after putIfAbsent: " + votes);
    }
}
```

**Output:**

```
{java=1000, kotlin=1000}
after putIfAbsent: {java=1000, kotlin=1000, scala=0}
```

⚠️ `if (!map.containsKey(k)) map.put(k, v)` is a **race** even on a concurrent map —
use the atomic `putIfAbsent`/`merge`/`compute` methods instead.

## CountDownLatch — "wait until N things happen"

```java
import java.util.concurrent.*;

public class LatchDemo {
    public static void main(String[] args) throws InterruptedException {
        int services = 3;
        CountDownLatch ready = new CountDownLatch(services);

        for (int i = 1; i <= services; i++) {
            final int id = i;
            new Thread(() -> {
                try { Thread.sleep(id * 100L); } catch (InterruptedException ignored) { }
                System.out.println("service " + id + " started");
                ready.countDown();                 // one step closer
            }).start();
        }

        System.out.println("main: waiting for all services…");
        ready.await();                             // blocks until count hits 0
        System.out.println("main: all up — accepting traffic!");
    }
}
```

**Output:**

```
main: waiting for all services…
service 1 started
service 2 started
service 3 started
main: all up — accepting traffic!
```

A latch is one-shot; for reusable meeting points use `CyclicBarrier`.

## BlockingQueue — producer-consumer without wait/notify

`put()` blocks when full, `take()` blocks when empty — all the coordination from the
wait/notify chapter, prewritten:

```java
import java.util.concurrent.*;

public class BlockingQueueDemo {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<String> queue = new LinkedBlockingQueue<>(2);

        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 4; i++) {
                    queue.put("job-" + i);              // blocks if full
                    System.out.println("queued job-" + i);
                }
                queue.put("DONE");
            } catch (InterruptedException ignored) { }
        });

        Thread consumer = new Thread(() -> {
            try {
                while (true) {
                    String job = queue.take();          // blocks if empty
                    if (job.equals("DONE")) break;
                    System.out.println("            processing " + job);
                    Thread.sleep(100);
                }
            } catch (InterruptedException ignored) { }
        });

        producer.start(); consumer.start();
        producer.join(); consumer.join();
        System.out.println("pipeline finished");
    }
}
```

**Output (typical interleaving):**

```
queued job-1
queued job-2
            processing job-1
queued job-3
            processing job-2
queued job-4
            processing job-3
            processing job-4
pipeline finished
```

## Which tool when?

| Problem | Tool |
|---------|------|
| shared counter / flag | `AtomicInteger`, `AtomicBoolean` |
| shared map/cache | `ConcurrentHashMap` |
| hand-off between producer & consumer | `BlockingQueue` |
| wait for N startup events (one-shot) | `CountDownLatch` |
| N threads repeatedly meeting | `CyclicBarrier` |
| limit concurrent access to a resource | `Semaphore` |
| mostly-read list, rare writes | `CopyOnWriteArrayList` |
| composing async pipelines | `CompletableFuture` |

> 💡 **Interview line:** "My order of preference: immutable → confined to one thread →
> java.util.concurrent tool → synchronized as the last resort."
