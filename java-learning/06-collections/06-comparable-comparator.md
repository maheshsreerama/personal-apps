# Comparable vs Comparator

## Comparable — the natural order

A class implements `Comparable<T>` to define its **one default ordering** via
`compareTo`: negative = this first, positive = other first, zero = tie.

```java
import java.util.*;

public class ComparableDemo {
    static class Employee implements Comparable<Employee> {
        String name; int salary;
        Employee(String n, int s) { name = n; salary = s; }

        @Override public int compareTo(Employee other) {
            return Integer.compare(this.salary, other.salary);  // by salary, ascending
        }
        @Override public String toString() { return name + "(" + salary + ")"; }
    }

    public static void main(String[] args) {
        List<Employee> team = new ArrayList<>(List.of(
                new Employee("Ravi", 900), new Employee("Asha", 1200),
                new Employee("Kiran", 700)));
        Collections.sort(team);              // uses compareTo
        System.out.println(team);
    }
}
```

**Output:**

```
[Kiran(700), Ravi(900), Asha(1200)]
```

⚠️ Use `Integer.compare(a, b)`, never `a - b` — subtraction overflows for large values.

## Comparator — orderings on demand

A `Comparator<T>` is a **separate object** describing one way to compare. Have as many as
you like, without touching the class:

```java
import java.util.*;

public class ComparatorDemo {
    record Product(String name, double price, int rating) { }

    public static void main(String[] args) {
        List<Product> items = new ArrayList<>(List.of(
                new Product("Mouse", 25.0, 4),
                new Product("Keyboard", 45.0, 5),
                new Product("Webcam", 45.0, 3)));

        items.sort(Comparator.comparing(Product::name));
        System.out.println("by name  : " + items);

        items.sort(Comparator.comparingDouble(Product::price).reversed());
        System.out.println("by price↓: " + items);

        // multi-level: price ascending, then rating descending
        items.sort(Comparator.comparingDouble(Product::price)
                .thenComparing(Comparator.comparingInt(Product::rating).reversed()));
        System.out.println("combined : " + items);
    }
}
```

**Output:**

```
by name  : [Product[name=Keyboard, price=45.0, rating=5], Product[name=Mouse, price=25.0, rating=4], Product[name=Webcam, price=45.0, rating=3]]
by price↓: [Product[name=Keyboard, price=45.0, rating=5], Product[name=Webcam, price=45.0, rating=3], Product[name=Mouse, price=25.0, rating=4]]
combined : [Product[name=Mouse, price=25.0, rating=4], Product[name=Keyboard, price=45.0, rating=5], Product[name=Webcam, price=45.0, rating=3]]
```

The `Comparator.comparing / thenComparing / reversed` combinators replace almost all
hand-written comparators.

## Handling nulls while sorting

```java
import java.util.*;

public class NullSort {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(Arrays.asList("Zoe", null, "Amy"));
        names.sort(Comparator.nullsFirst(Comparator.naturalOrder()));
        System.out.println(names);
        names.sort(Comparator.nullsLast(Comparator.naturalOrder()));
        System.out.println(names);
    }
}
```

**Output:**

```
[null, Amy, Zoe]
[Amy, Zoe, null]
```

## Side-by-side

| | `Comparable` | `Comparator` |
|---|---|---|
| Package | `java.lang` | `java.util` |
| Method | `compareTo(T other)` | `compare(T a, T b)` |
| Where | inside the class itself | separate object / lambda |
| How many orders | exactly one ("natural") | unlimited |
| Modifies the class? | yes | no — works on classes you don't own |
| Used by default in | `TreeSet`, `TreeMap`, `sort()` with no arg | pass explicitly |

## TreeSet with a Comparator

```java
import java.util.*;

public class TreeSetComparator {
    public static void main(String[] args) {
        Set<String> byLength = new TreeSet<>(
                Comparator.comparingInt(String::length)
                          .thenComparing(Comparator.naturalOrder()));
        byLength.addAll(List.of("kiwi", "fig", "banana", "apple"));
        System.out.println(byLength);
    }
}
```

**Output:**

```
[fig, kiwi, apple, banana]
```

⚠️ In sorted collections the comparator also defines **equality** — two elements that
compare as 0 are treated as duplicates. That's why the tie-breaker
(`thenComparing(naturalOrder())`) matters: comparing by length alone, `kiwi` and
`apple`… would be fine, but any two words of the *same* length (like `fig` and `owl`)
would collide and one of them would silently be dropped from the set.

> 💡 **Rule:** `compareTo`/`compare` should be **consistent with equals** — return 0 only
> for objects you'd also consider `equals()`. Sorted collections misbehave otherwise.
