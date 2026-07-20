# Iterator, ListIterator & Fail-Fast Behavior

## Iterator — the universal walker

Every `Collection` provides an `Iterator` with three moves: `hasNext()`, `next()`,
`remove()`. The for-each loop is syntactic sugar over it.

```java
import java.util.*;

public class IteratorDemo {
    public static void main(String[] args) {
        List<String> tasks = new ArrayList<>(List.of("code", "test", "deploy"));

        Iterator<String> it = tasks.iterator();
        while (it.hasNext()) {
            System.out.println("visiting " + it.next());
        }
    }
}
```

**Output:**

```
visiting code
visiting test
visiting deploy
```

## The fail-fast trap

Structurally modifying a collection **while iterating it** (except through the iterator
itself) throws `ConcurrentModificationException`. The collection keeps a `modCount`;
the iterator screams the moment it notices a change it didn't make:

```java
import java.util.*;

public class FailFast {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>(List.of("a", "b", "c"));
        try {
            for (String s : list) {
                if (s.equals("b")) list.remove(s);   // ❌ modifying mid-loop
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("caught ConcurrentModificationException!");
        }

        // ✅ fix 1: iterator.remove()
        List<String> l1 = new ArrayList<>(List.of("a", "b", "c"));
        Iterator<String> it = l1.iterator();
        while (it.hasNext()) if (it.next().equals("b")) it.remove();
        System.out.println("fix 1 → " + l1);

        // ✅ fix 2: removeIf
        List<String> l2 = new ArrayList<>(List.of("a", "b", "c"));
        l2.removeIf(s -> s.equals("b"));
        System.out.println("fix 2 → " + l2);
    }
}
```

**Output:**

```
caught ConcurrentModificationException!
fix 1 → [a, c]
fix 2 → [a, c]
```

Fail-fast is **best effort**, not guaranteed — it exists to expose bugs early, not to make
concurrent modification safe.

## Fail-safe alternatives

Concurrent collections iterate over a **snapshot** (or use weakly-consistent views) and
never throw `ConcurrentModificationException`:

```java
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;

public class FailSafe {
    public static void main(String[] args) {
        List<String> list = new CopyOnWriteArrayList<>(List.of("a", "b", "c"));
        for (String s : list) {
            if (s.equals("b")) list.remove(s);   // fine — iterator sees old snapshot
        }
        System.out.println("after loop: " + list);
    }
}
```

**Output:**

```
after loop: [a, c]
```

| | Fail-fast | Fail-safe |
|---|---|---|
| Examples | `ArrayList`, `HashMap`, `HashSet` iterators | `CopyOnWriteArrayList`, `ConcurrentHashMap` |
| On concurrent change | `ConcurrentModificationException` | keeps going |
| Iterates over | live structure | snapshot / weakly-consistent view |
| Cost | cheap | copying or relaxed guarantees |

## ListIterator — bidirectional, list-only

```java
import java.util.*;

public class ListIterDemo {
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));
        ListIterator<Integer> li = nums.listIterator();

        while (li.hasNext()) {
            int v = li.next();
            li.set(v * 10);              // replace in place
        }
        System.out.println("forward ×10 : " + nums);

        while (li.hasPrevious()) {       // walk backwards!
            System.out.print(li.previous() + " ");
        }
        System.out.println();
    }
}
```

**Output:**

```
forward ×10 : [10, 20, 30]
30 20 10
```

`ListIterator` adds `previous()`, `set()`, `add()` and index queries — only lists have it.

> 💡 **Interview line:** "`Iterator.remove()` is the only safe way to remove during
> iteration of a fail-fast collection — it updates the iterator's expected `modCount`."
