# wait / notify — Producer-Consumer

## The coordination problem

Locking stops threads from *colliding*, but sometimes a thread must **wait for a
condition**: a consumer needs data that a producer hasn't made yet. Busy-waiting
(`while (queue.isEmpty()) {}`) burns CPU. `wait()`/`notify()` let a thread sleep inside
a lock and be woken when the condition may have changed.

## The rules

1. `wait()`, `notify()`, `notifyAll()` may only be called while **holding the monitor**
   of the object you call them on (else `IllegalMonitorStateException`).
2. `wait()` **releases the lock** and sleeps; on wake-up it re-acquires the lock.
3. Always wait in a **`while` loop**, never an `if` — wake-ups can be spurious, and the
   condition may be consumed by another thread first.
4. Prefer `notifyAll()` unless you can prove one waiter is enough.

## Producer-Consumer with a bounded buffer

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class ProducerConsumer {
    static class Buffer {
        private final Deque<Integer> items = new ArrayDeque<>();
        private final int capacity = 2;

        public synchronized void put(int v) throws InterruptedException {
            while (items.size() == capacity) {   // buffer full → producer waits
                wait();
            }
            items.addLast(v);
            System.out.println("produced " + v + "  buffer=" + items);
            notifyAll();                          // wake consumers
        }

        public synchronized int take() throws InterruptedException {
            while (items.isEmpty()) {             // buffer empty → consumer waits
                wait();
            }
            int v = items.removeFirst();
            System.out.println("consumed " + v + "  buffer=" + items);
            notifyAll();                          // wake producers
            return v;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        Buffer buffer = new Buffer();

        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) buffer.put(i);
            } catch (InterruptedException ignored) { }
        });

        Thread consumer = new Thread(() -> {
            try {
                for (int i = 1; i <= 5; i++) {
                    buffer.take();
                    Thread.sleep(50);            // slow consumer → producer must wait
                }
            } catch (InterruptedException ignored) { }
        });

        producer.start();
        consumer.start();
        producer.join();
        consumer.join();
        System.out.println("done");
    }
}
```

**Output (a typical interleaving):**

```
produced 1  buffer=[1]
produced 2  buffer=[1, 2]
consumed 1  buffer=[2]
produced 3  buffer=[2, 3]
consumed 2  buffer=[3]
produced 4  buffer=[3, 4]
consumed 3  buffer=[4]
produced 5  buffer=[4, 5]
consumed 4  buffer=[5]
consumed 5  buffer=[]
done
```

Watch the capacity-2 buffer throttle the producer: it can never get more than two ahead.

## Why `while`, not `if`?

```java
// ❌ broken with multiple consumers:
if (items.isEmpty()) wait();
int v = items.removeFirst();   // another consumer may have emptied it first!

// ✅ re-check after every wake-up:
while (items.isEmpty()) wait();
int v = items.removeFirst();
```

Between being notified and re-acquiring the lock, **another thread may have taken the
item**. The `while` re-checks; the `if` crashes.

## wait vs sleep — the definitive answer

| | `wait()` | `sleep()` |
|---|---|---|
| Class | `Object` | `Thread` (static) |
| Lock required | yes — must hold monitor | no |
| Releases lock while waiting | ✅ | ❌ |
| Woken by | notify/notifyAll, timeout, interrupt | timeout, interrupt |
| Meaning | "wake me when the *condition* changes" | "pause me for a *duration*" |

## The modern alternative

In production code, reach for `java.util.concurrent` first:
`BlockingQueue` **is** producer-consumer in a box (see the Concurrent Utilities chapter) —
`put()` and `take()` do all the waiting for you. Understanding `wait/notify` remains
essential for interviews and for reading older code.

> 💡 **Interview favourite:** "Why are wait/notify defined on `Object`, not `Thread`?"
> — Because you wait on a *shared data object's* monitor; any number of threads can
> coordinate around any object.
