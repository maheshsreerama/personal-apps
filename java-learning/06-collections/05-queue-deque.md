# Queue, Deque & PriorityQueue

## Queue — first in, first out

A `Queue` processes elements in arrival order. Prefer the **non-throwing** methods:

| Action | Throws on failure | Returns special value |
|--------|-------------------|-----------------------|
| insert | `add(e)` | `offer(e)` → `false` |
| remove head | `remove()` | `poll()` → `null` |
| peek head | `element()` | `peek()` → `null` |

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<String> tickets = new ArrayDeque<>();
        tickets.offer("cust-1");
        tickets.offer("cust-2");
        tickets.offer("cust-3");

        System.out.println("queue    : " + tickets);
        System.out.println("peek     : " + tickets.peek());   // look, don't remove
        System.out.println("serving  : " + tickets.poll());   // remove head
        System.out.println("serving  : " + tickets.poll());
        System.out.println("left     : " + tickets);
        tickets.clear();
        System.out.println("empty poll → " + tickets.poll()); // null, no exception
    }
}
```

**Output:**

```
queue    : [cust-1, cust-2, cust-3]
peek     : cust-1
serving  : cust-1
serving  : cust-2
left     : [cust-3]
empty poll → null
```

## Deque — double-ended queue (and the best stack)

`ArrayDeque` adds/removes at **both ends** in O(1). It replaces the legacy `Stack` class:

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
    public static void main(String[] args) {
        Deque<String> stack = new ArrayDeque<>();
        stack.push("page1");        // addFirst
        stack.push("page2");
        stack.push("page3");

        System.out.println("history: " + stack);
        System.out.println("back → " + stack.pop());   // removeFirst (LIFO)
        System.out.println("back → " + stack.pop());
        System.out.println("now on: " + stack.peek());
    }
}
```

**Output:**

```
history: [page3, page2, page1]
back → page3
back → page2
now on: page1
```

Classic stack use — balanced brackets checker:

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Brackets {
    static boolean balanced(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            switch (c) {
                case '(', '[', '{' -> st.push(c);
                case ')' -> { if (st.isEmpty() || st.pop() != '(') return false; }
                case ']' -> { if (st.isEmpty() || st.pop() != '[') return false; }
                case '}' -> { if (st.isEmpty() || st.pop() != '{') return false; }
            }
        }
        return st.isEmpty();
    }
    public static void main(String[] args) {
        System.out.println(balanced("{[()()]}"));
        System.out.println(balanced("{[(])}"));
    }
}
```

**Output:**

```
true
false
```

## PriorityQueue — always serve the "smallest"

A binary **heap**: `poll()` always returns the element with the highest priority
(natural order, or your `Comparator`). Iteration order is **not** sorted!

```java
import java.util.PriorityQueue;
import java.util.Comparator;

public class PqDemo {
    record Patient(String name, int severity) { }

    public static void main(String[] args) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(40); minHeap.offer(10); minHeap.offer(30);
        System.out.print("minHeap polls: ");
        while (!minHeap.isEmpty()) System.out.print(minHeap.poll() + " ");
        System.out.println();

        // max-heap via reversed comparator
        PriorityQueue<Patient> er = new PriorityQueue<>(
                Comparator.comparingInt(Patient::severity).reversed());
        er.offer(new Patient("cold", 2));
        er.offer(new Patient("fracture", 6));
        er.offer(new Patient("cardiac", 9));

        while (!er.isEmpty()) {
            Patient p = er.poll();
            System.out.println("treating " + p.name() + " (severity " + p.severity() + ")");
        }
    }
}
```

**Output:**

```
minHeap polls: 10 30 40
treating cardiac (severity 9)
treating fracture (severity 6)
treating cold (severity 2)
```

## Which queue when?

| Need | Pick |
|------|------|
| plain FIFO | `ArrayDeque` |
| LIFO stack | `ArrayDeque` (`push`/`pop`) |
| priority ordering | `PriorityQueue` |
| thread-safe producer/consumer | `LinkedBlockingQueue` (Part 8) |

> 💡 **Top-K trick:** keep a *min*-heap of size K while streaming data — the heap root is
> always the weakest of the current top K, so replace it whenever something bigger arrives.
