# Set — HashSet, LinkedHashSet & TreeSet

A `Set` stores **unique** elements — adding a duplicate is silently ignored
(`add` returns `false`).

## The three flavours

```java
import java.util.*;

public class SetFlavours {
    public static void main(String[] args) {
        List<Integer> data = List.of(30, 10, 20, 10, 30);

        Set<Integer> hash   = new HashSet<>(data);
        Set<Integer> linked = new LinkedHashSet<>(data);
        Set<Integer> tree   = new TreeSet<>(data);

        System.out.println("HashSet       (no order)        : " + hash);
        System.out.println("LinkedHashSet (insertion order) : " + linked);
        System.out.println("TreeSet       (sorted)          : " + tree);
    }
}
```

**Output:**

```
HashSet       (no order)        : [20, 10, 30]
LinkedHashSet (insertion order) : [30, 10, 20]
TreeSet       (sorted)          : [10, 20, 30]
```

| | HashSet | LinkedHashSet | TreeSet |
|---|---|---|---|
| Order | none | insertion | sorted |
| add/contains | O(1) | O(1) | O(log n) |
| Nulls | one `null` OK | one `null` OK | ❌ throws NPE |
| Backing | HashMap | HashMap + linked list | red-black tree |

## Set operations — union, intersection, difference

```java
import java.util.*;

public class SetMath {
    public static void main(String[] args) {
        Set<String> a = new HashSet<>(Set.of("java", "python", "go"));
        Set<String> b = new HashSet<>(Set.of("java", "rust", "go"));

        Set<String> union = new TreeSet<>(a);
        union.addAll(b);

        Set<String> intersection = new TreeSet<>(a);
        intersection.retainAll(b);

        Set<String> difference = new TreeSet<>(a);
        difference.removeAll(b);

        System.out.println("union        : " + union);
        System.out.println("intersection : " + intersection);
        System.out.println("a minus b    : " + difference);
    }
}
```

**Output:**

```
union        : [go, java, python, rust]
intersection : [go, java]
a minus b    : [python]
```

## The equals/hashCode contract — why custom keys break

`HashSet` finds elements by `hashCode()` first, then confirms with `equals()`. If your
class overrides neither, two "identical" objects are different to the set:

```java
import java.util.*;

public class ContractDemo {
    static class BadPoint {
        int x, y;
        BadPoint(int x, int y) { this.x = x; this.y = y; }
        // no equals/hashCode → identity semantics
    }
    record GoodPoint(int x, int y) { }   // record generates both correctly

    public static void main(String[] args) {
        Set<BadPoint> bad = new HashSet<>();
        bad.add(new BadPoint(1, 1));
        bad.add(new BadPoint(1, 1));      // "duplicate" still gets in!

        Set<GoodPoint> good = new HashSet<>();
        good.add(new GoodPoint(1, 1));
        good.add(new GoodPoint(1, 1));    // properly rejected

        System.out.println("bad size  = " + bad.size());
        System.out.println("good size = " + good.size());
    }
}
```

**Output:**

```
bad size  = 2
good size = 1
```

**The contract:** if `a.equals(b)` then `a.hashCode() == b.hashCode()` — always override
them **together** (or use a `record`).

## TreeSet extras — navigation methods

`TreeSet` implements `NavigableSet`, great for "nearest value" queries:

```java
import java.util.TreeSet;

public class NavDemo {
    public static void main(String[] args) {
        TreeSet<Integer> scores = new TreeSet<>(java.util.Set.of(10, 20, 30, 40, 50));

        System.out.println("first/last : " + scores.first() + " / " + scores.last());
        System.out.println("floor(35)  : " + scores.floor(35));    // ≤ 35
        System.out.println("ceiling(35): " + scores.ceiling(35));  // ≥ 35
        System.out.println("headSet(30): " + scores.headSet(30));  // < 30
        System.out.println("tailSet(30): " + scores.tailSet(30));  // ≥ 30
        System.out.println("subSet     : " + scores.subSet(20, 45));
    }
}
```

**Output:**

```
first/last : 10 / 50
floor(35)  : 30
ceiling(35): 40
headSet(30): [10, 20]
tailSet(30): [30, 40, 50]
subSet     : [20, 30, 40]
```

## Practical use: dedupe while keeping order

```java
import java.util.*;

public class Dedupe {
    public static void main(String[] args) {
        List<String> visits = List.of("home", "cart", "home", "pay", "cart");
        List<String> unique = new ArrayList<>(new LinkedHashSet<>(visits));
        System.out.println(unique);
    }
}
```

**Output:**

```
[home, cart, pay]
```

> 💡 **Rule of thumb:** default to `HashSet`; switch to `LinkedHashSet` when display order
> matters; use `TreeSet` when you need sorting or range queries.
