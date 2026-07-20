# Map — HashMap, LinkedHashMap & TreeMap

A `Map` stores **key → value** pairs. Keys are unique; each key maps to exactly one value.

## HashMap essentials

```java
import java.util.HashMap;
import java.util.Map;

public class MapBasics {
    public static void main(String[] args) {
        Map<String, Integer> stock = new HashMap<>();
        stock.put("apple", 50);
        stock.put("banana", 30);
        stock.put("apple", 60);           // same key → value REPLACED

        System.out.println(stock);
        System.out.println("get apple    : " + stock.get("apple"));
        System.out.println("get mango    : " + stock.get("mango"));           // null!
        System.out.println("getOrDefault : " + stock.getOrDefault("mango", 0));
        System.out.println("containsKey  : " + stock.containsKey("banana"));
        System.out.println("size         : " + stock.size());

        stock.remove("banana");
        System.out.println("after remove : " + stock);
    }
}
```

**Output:**

```
{banana=30, apple=60}
get apple    : 60
get mango    : null
getOrDefault : 0
containsKey  : true
size         : 2
after remove : {apple=60}
```

## Iterating a map — three ways

```java
import java.util.*;

public class MapIterate {
    public static void main(String[] args) {
        Map<String, Integer> m = new LinkedHashMap<>();
        m.put("a", 1); m.put("b", 2); m.put("c", 3);

        for (String k : m.keySet()) System.out.print(k + " ");
        System.out.println();

        for (int v : m.values()) System.out.print(v + " ");
        System.out.println();

        for (Map.Entry<String, Integer> e : m.entrySet())   // most efficient
            System.out.println(e.getKey() + " → " + e.getValue());

        m.forEach((k, v) -> System.out.println(k + " = " + v));  // Java 8 style
    }
}
```

**Output:**

```
a b c
1 2 3
a → 1
b → 2
c → 3
a = 1
b = 2
c = 3
```

## The Java 8 power methods

`merge`, `computeIfAbsent`, `putIfAbsent` remove tons of boilerplate:

```java
import java.util.*;

public class MapPower {
    public static void main(String[] args) {
        // word frequency — the classic
        String text = "to be or not to be";
        Map<String, Integer> freq = new TreeMap<>();
        for (String w : text.split(" ")) {
            freq.merge(w, 1, Integer::sum);       // insert 1 or add 1
        }
        System.out.println(freq);

        // grouping — one line per group thanks to computeIfAbsent
        Map<Integer, List<String>> byLength = new TreeMap<>();
        for (String w : List.of("cat", "lion", "dog", "tiger")) {
            byLength.computeIfAbsent(w.length(), k -> new ArrayList<>()).add(w);
        }
        System.out.println(byLength);
    }
}
```

**Output:**

```
{be=2, not=1, or=1, to=2}
{3=[cat, dog], 4=[lion], 5=[tiger]}
```

## How HashMap works inside (interview gold)

1. `put(key, value)` computes `key.hashCode()`, spreads it, and picks a **bucket**:
   `index = hash & (capacity - 1)`.
2. Collisions (two keys, same bucket) form a **linked list**; since Java 8 a long chain
   (≥ 8 nodes) becomes a **red-black tree** → worst case O(log n) instead of O(n).
3. When `size > capacity × loadFactor` (default 16 × 0.75), the table **doubles** and all
   entries are rehashed.
4. That's why keys must be **immutable** with stable `hashCode` — mutate a key after
   insertion and you may never find it again:

```java
import java.util.*;

public class MutableKeyTrap {
    static class Key { int id; Key(int id) { this.id = id; }
        @Override public int hashCode() { return id; }
        @Override public boolean equals(Object o) {
            return o instanceof Key k && k.id == id; }
    }
    public static void main(String[] args) {
        Map<Key, String> map = new HashMap<>();
        Key k = new Key(1);
        map.put(k, "hello");
        k.id = 99;                          // mutated after insertion!
        System.out.println(map.get(k));     // looks in the WRONG bucket
        System.out.println(map.get(new Key(1)));
    }
}
```

**Output:**

```
null
null
```

The entry is still in the map — but unreachable. **Never mutate map keys.**

## HashMap vs LinkedHashMap vs TreeMap vs Hashtable

| | HashMap | LinkedHashMap | TreeMap | Hashtable (legacy) |
|---|---|---|---|---|
| Order | none | insertion (or access) | sorted by key | none |
| get/put | O(1) | O(1) | O(log n) | O(1), synchronized |
| Null key | 1 allowed | 1 allowed | ❌ | ❌ |
| Thread-safe | ❌ | ❌ | ❌ | ✅ (but obsolete) |

Modern concurrent code uses `ConcurrentHashMap`, never `Hashtable`.

## TreeMap navigation

```java
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        TreeMap<Integer, String> grades = new TreeMap<>();
        grades.put(90, "A"); grades.put(75, "B"); grades.put(60, "C");

        System.out.println(grades);
        System.out.println("floorEntry(82) : " + grades.floorEntry(82));
        System.out.println("firstKey       : " + grades.firstKey());
        System.out.println("headMap(80)    : " + grades.headMap(80));
    }
}
```

**Output:**

```
{60=C, 75=B, 90=A}
floorEntry(82) : 75=B
firstKey       : 60
headMap(80)    : {60=C, 75=B}
```

> 💡 **Interview line:** "HashMap allows one null key because null's hash is fixed at
> bucket 0; TreeMap forbids null keys because it must *compare* keys to order them."
