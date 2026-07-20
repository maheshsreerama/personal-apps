# sleep, join, daemon, priority & interrupt

## sleep() — pause the current thread

Static method; always pauses **the thread that calls it**, holding any locks it owns.

```java
public class SleepDemo {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("fetching...");
        long start = System.currentTimeMillis();
        Thread.sleep(500);                       // ms
        System.out.println("done after ~" + (System.currentTimeMillis() - start) + " ms");
    }
}
```

**Output:**

```
fetching...
done after ~502 ms
```

(Sleep guarantees *at least* the requested time — never exactly.)

## join() — wait for another thread to finish

```java
public class JoinDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread download = new Thread(() -> {
            try { Thread.sleep(300); } catch (InterruptedException ignored) { }
            System.out.println("1. download finished");
        });
        Thread install = new Thread(() -> System.out.println("2. installing"));

        download.start();
        download.join();          // main blocks here until download ends
        install.start();
        install.join();
        System.out.println("3. all done");
    }
}
```

**Output:**

```
1. download finished
2. installing
3. all done
```

Without the first `join()`, "installing" would usually print **before** the download
finished.

## Daemon threads — background helpers

The JVM exits when all **non-daemon** threads finish; daemons are killed abruptly:

```java
public class DaemonDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread heartbeat = new Thread(() -> {
            while (true) {
                System.out.println("beat");
                try { Thread.sleep(100); } catch (InterruptedException e) { return; }
            }
        });
        heartbeat.setDaemon(true);      // must be set BEFORE start()
        heartbeat.start();

        Thread.sleep(250);
        System.out.println("main exits — daemon dies with it");
    }
}
```

**Output:**

```
beat
beat
beat
main exits — daemon dies with it
```

Garbage collection runs on daemon threads. Never do critical work (like saving files)
in a daemon — it can be killed mid-write.

## Priority — a hint, not a command

```java
Thread t = new Thread(job);
t.setPriority(Thread.MAX_PRIORITY);   // 10 (MIN=1, NORM=5)
```

Priorities merely *suggest* scheduling preference; behavior is OS-dependent.
**Never build correctness on priorities.**

## interrupt() — polite cancellation

Java has no safe way to kill a thread (`stop()` is deprecated for good reason).
Instead you *request* cancellation and the thread cooperates:

```java
public class InterruptDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                // simulate a chunk of work
                try {
                    Thread.sleep(100);
                    System.out.println("working...");
                } catch (InterruptedException e) {
                    // sleep clears the flag when throwing — re-set it and exit
                    Thread.currentThread().interrupt();
                }
            }
            System.out.println("worker: cleaned up and stopped");
        });

        worker.start();
        Thread.sleep(250);
        worker.interrupt();            // request cancellation
        worker.join();
        System.out.println("main: worker has terminated");
    }
}
```

**Output:**

```
working...
working...
worker: cleaned up and stopped
main: worker has terminated
```

Pattern to remember: loop on `!isInterrupted()`, and if a blocking call throws
`InterruptedException`, either exit or restore the flag with
`Thread.currentThread().interrupt()`.

## sleep() vs wait() — perennial interview question

| | `Thread.sleep(ms)` | `obj.wait(ms)` |
|---|---|---|
| Defined on | `Thread` (static) | `Object` |
| Needs a lock? | no | **must** hold `obj`'s monitor |
| Releases the lock? | ❌ keeps all locks | ✅ releases `obj`'s lock |
| Woken by | timeout / interrupt | `notify()` / `notifyAll()` / timeout |
| Purpose | pause execution | wait for a **condition** |

(`wait/notify` get their own chapter.)

> 💡 `Thread.sleep(0)` and `Thread.yield()` both hint "reschedule me" — and both are
> legitimately ignorable by the scheduler.
