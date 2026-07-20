# Generics — Why & How

## The problem generics solve

Before generics, collections held raw `Object`s — type bugs surfaced only at **runtime**:

```java
List names = new ArrayList();        // raw type (pre-Java 5 style)
names.add("Asha");
names.add(42);                       // compiles fine…
String s = (String) names.get(1);   // 💥 ClassCastException at runtime
```

Generics move the check to **compile time** and remove the casts:

```java
import java.util.*;

public class WhyGenerics {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        names.add("Asha");
        // names.add(42);            // ❌ compile error — bug caught instantly
        String s = names.get(0);     // no cast needed
        System.out.println(s.toUpperCase());
    }
}
```

**Output:**

```
ASHA
```

## Writing a generic class

Type parameters (conventionally `T`, `E`, `K`, `V`) act as placeholders:

```java
public class Box<T> {
    private T value;

    public void put(T value) { this.value = value; }
    public T get() { return value; }

    public static void main(String[] args) {
        Box<String> sBox = new Box<>();
        sBox.put("hello");
        System.out.println(sBox.get().length());   // String methods available

        Box<Integer> iBox = new Box<>();
        iBox.put(21);
        System.out.println(iBox.get() * 2);        // arithmetic works
    }
}
```

**Output:**

```
5
42
```

One class, type-safe for every payload. Multiple parameters work too:

```java
public class Pair<K, V> {
    private final K key; private final V value;
    public Pair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }

    public static void main(String[] args) {
        Pair<String, Integer> entry = new Pair<>("age", 30);
        System.out.println(entry.getKey() + " = " + entry.getValue());
    }
}
```

**Output:**

```
age = 30
```

## Generic methods

The type parameter goes **before the return type**; the compiler infers it per call:

```java
import java.util.*;

public class GenericMethods {
    static <T> void printAll(List<T> items) {
        for (T item : items) System.out.print(item + " ");
        System.out.println();
    }

    static <T> T firstOr(List<T> items, T fallback) {
        return items.isEmpty() ? fallback : items.get(0);
    }

    public static void main(String[] args) {
        printAll(List.of(1, 2, 3));
        printAll(List.of("a", "b"));
        System.out.println(firstOr(List.of(), "default"));
        System.out.println(firstOr(List.of(9, 8), -1));
    }
}
```

**Output:**

```
1 2 3
a b
default
9
```

## Bounded type parameters — `extends`

Restrict what `T` can be, and gain access to the bound's methods:

```java
import java.util.List;

public class Bounded {
    // T must be a Number (or subclass) → we can call doubleValue()
    static <T extends Number> double sum(List<T> nums) {
        double total = 0;
        for (T n : nums) total += n.doubleValue();
        return total;
    }

    // multiple bounds: class first, then interfaces
    static <T extends Comparable<T>> T max(List<T> items) {
        T best = items.get(0);
        for (T item : items) if (item.compareTo(best) > 0) best = item;
        return best;
    }

    public static void main(String[] args) {
        System.out.println(sum(List.of(1, 2, 3)));
        System.out.println(sum(List.of(1.5, 2.5)));
        // sum(List.of("a"));            // ❌ String is not a Number
        System.out.println(max(List.of("pear", "apple", "fig")));
        System.out.println(max(List.of(3, 9, 4)));
    }
}
```

**Output:**

```
6.0
4.0
pear
9
```

## Type erasure — what generics compile to

Generics exist **only at compile time**. The compiler checks types, inserts casts, then
**erases** the parameters — at runtime `List<String>` and `List<Integer>` are the same
class:

```java
import java.util.*;

public class Erasure {
    public static void main(String[] args) {
        List<String> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        System.out.println(a.getClass() == b.getClass());
        System.out.println(a.getClass().getName());
    }
}
```

**Output:**

```
true
java.util.ArrayList
```

Consequences of erasure:

- `new T()`, `new T[]`, `T.class` — all illegal (T is gone at runtime).
- `obj instanceof List<String>` — illegal; only `instanceof List<?>` works.
- Overloading `f(List<String>)` and `f(List<Integer>)` — clash: same erased signature.

> 💡 **Interview line:** "Generics give compile-time safety with zero runtime cost —
> because by runtime, they're gone."
