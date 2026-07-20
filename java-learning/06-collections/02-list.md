# List — ArrayList & LinkedList

## ArrayList — the default list

Backed by a resizable array. Fast random access, cheap appends; inserting/removing in the
middle shifts elements.

```java
import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<String> cities = new ArrayList<>();
        cities.add("Delhi");
        cities.add("Mumbai");
        cities.add("Chennai");
        cities.add(1, "Pune");             // insert at index 1

        System.out.println(cities);
        System.out.println("get(2)      : " + cities.get(2));
        System.out.println("indexOf     : " + cities.indexOf("Chennai"));
        System.out.println("contains    : " + cities.contains("Goa"));
        System.out.println("size        : " + cities.size());

        cities.set(0, "New Delhi");        // replace
        cities.remove("Pune");             // remove by value
        cities.remove(2);                  // remove by index
        System.out.println("after edits : " + cities);
    }
}
```

**Output:**

```
[Delhi, Pune, Mumbai, Chennai]
get(2)      : Mumbai
indexOf     : 3
contains    : false
size        : 4
after edits : [New Delhi, Mumbai]
```

⚠️ For a `List<Integer>`, `remove(2)` removes **index 2**, while
`remove(Integer.valueOf(2))` removes the **value** 2 — a classic trap.

## How ArrayList grows

Internally an `Object[]` with default capacity 10. When full, it allocates a new array
**~1.5× larger** and copies elements. If you know the size ahead, pre-size it:
`new ArrayList<>(100_000)` avoids repeated copying.

## LinkedList — a doubly-linked chain

Each element (node) points to the previous and next one. No random access — reaching
index *i* walks the chain — but adding/removing at the **ends** is O(1), and it
implements `Deque` too.

```java
import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<String> queue = new LinkedList<>();
        queue.add("task1");
        queue.add("task2");
        queue.addFirst("urgent");          // Deque powers
        queue.addLast("task3");

        System.out.println(queue);
        System.out.println("first: " + queue.peekFirst() + ", last: " + queue.peekLast());
        System.out.println("processing: " + queue.pollFirst());
        System.out.println(queue);
    }
}
```

**Output:**

```
[urgent, task1, task2, task3]
first: urgent, last: task3
processing: urgent
[task1, task2, task3]
```

## ArrayList vs LinkedList

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| `get(i)` | **O(1)** | O(n) |
| add at end | O(1) amortized | O(1) |
| add/remove at front | O(n) — shifts all | **O(1)** |
| add/remove in middle | O(n) shift | O(n) walk + O(1) relink |
| memory per element | just the reference | node object + 2 pointers |
| cache friendliness | excellent (contiguous) | poor (scattered nodes) |

**Honest advice:** `ArrayList` wins almost every real benchmark thanks to CPU caches.
Reach for `ArrayDeque` when you need fast ends; `LinkedList` is rarely the best pick.

## Iterating safely while removing

```java
import java.util.*;

public class SafeRemove {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));

        // ❌ for-each + remove → ConcurrentModificationException
        // ✅ option 1: Iterator.remove
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) it.remove();
        }
        System.out.println("odds: " + nums);

        // ✅ option 2: removeIf (Java 8+) — cleanest
        List<Integer> nums2 = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
        nums2.removeIf(n -> n % 2 == 0);
        System.out.println("odds: " + nums2);
    }
}
```

**Output:**

```
odds: [1, 3, 5]
odds: [1, 3, 5]
```

## Sorting a list

```java
import java.util.*;

public class SortList {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Charlie", "alice", "Bob"));
        names.sort(null);                                  // natural (case-sensitive!)
        System.out.println(names);
        names.sort(String.CASE_INSENSITIVE_ORDER);
        System.out.println(names);
        names.sort(Comparator.comparing(String::length));
        System.out.println(names);
    }
}
```

**Output:**

```
[Bob, Charlie, alice]
[alice, Bob, Charlie]
[Bob, alice, Charlie]
```

> 💡 Natural String order is **lexicographic by char value** — all capitals before all
> lowercase. Use `CASE_INSENSITIVE_ORDER` for human-friendly sorting.
