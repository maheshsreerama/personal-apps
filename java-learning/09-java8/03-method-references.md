# Method References & Interface default/static Methods

## Method references — lambdas with a name

When a lambda only calls one existing method, the `::` shorthand is cleaner:

| Kind | Syntax | Lambda equivalent |
|------|--------|-------------------|
| static method | `Integer::parseInt` | `s -> Integer.parseInt(s)` |
| instance method of a *particular* object | `out::println` | `x -> out.println(x)` |
| instance method of an *arbitrary* object | `String::length` | `s -> s.length()` |
| constructor | `ArrayList::new` | `() -> new ArrayList<>()` |

```java
import java.util.*;
import java.util.function.*;

public class MethodRefs {
    public static void main(String[] args) {
        // 1. static
        Function<String, Integer> parse = Integer::parseInt;
        System.out.println(parse.apply("99") + 1);

        // 2. bound instance (particular object)
        String greeting = "hello world";
        Supplier<Integer> lenOfGreeting = greeting::length;
        System.out.println(lenOfGreeting.get());

        // 3. unbound instance (first argument becomes the receiver)
        Function<String, String> upper = String::toUpperCase;
        System.out.println(upper.apply("java"));

        BiPredicate<String, String> starts = String::startsWith;
        System.out.println(starts.test("java", "ja"));   // "java".startsWith("ja")

        // 4. constructor
        Supplier<List<String>> maker = ArrayList::new;
        List<String> fresh = maker.get();
        fresh.add("made by ref");
        System.out.println(fresh);
    }
}
```

**Output:**

```
100
11
JAVA
true
[made by ref]
```

In practice you meet them everywhere in stream pipelines:

```java
import java.util.*;

public class RefsInAction {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("chitra", "anil", "balu"));
        names.sort(Comparator.comparing(String::length));
        names.forEach(System.out::println);
    }
}
```

**Output:**

```
anil
balu
chitra
```

## default methods — evolving interfaces safely

Before Java 8, adding a method to an interface broke **every** implementing class.
`default` methods carry an implementation, so old implementors keep compiling:

```java
interface Vehicle {
    String name();
    default String horn() { return name() + " says beep"; }   // free for everyone
}

class Truck implements Vehicle {
    public String name() { return "Truck"; }
    // horn() inherited
}
class Train implements Vehicle {
    public String name() { return "Train"; }
    @Override public String horn() { return "Train says CHOO CHOO"; }  // customized
}

public class DefaultMethods {
    public static void main(String[] args) {
        System.out.println(new Truck().horn());
        System.out.println(new Train().horn());
    }
}
```

**Output:**

```
Truck says beep
Train says CHOO CHOO
```

## The diamond rule

If a class inherits the **same default method from two interfaces**, it must resolve the
conflict itself:

```java
interface A { default String hi() { return "hi from A"; } }
interface B { default String hi() { return "hi from B"; } }

public class Diamond implements A, B {
    @Override public String hi() {
        return A.super.hi() + " (chosen explicitly)";   // pick one, or write your own
    }
    public static void main(String[] args) {
        System.out.println(new Diamond().hi());
    }
}
```

**Output:**

```
hi from A (chosen explicitly)
```

Precedence rules: **class wins over interface**, more-specific interface wins, otherwise
you must override.

## static methods in interfaces

Utility methods that belong with the contract — called on the **interface name**:

```java
interface Validator {
    boolean valid(String s);

    static Validator nonEmpty() { return s -> s != null && !s.isBlank(); }
    static Validator maxLen(int n) { return s -> s.length() <= n; }
}

public class StaticIface {
    public static void main(String[] args) {
        Validator v = Validator.nonEmpty();
        System.out.println(v.valid("ok"));
        System.out.println(v.valid("  "));
        System.out.println(Validator.maxLen(3).valid("abcd"));
    }
}
```

**Output:**

```
true
false
false
```

This is exactly how the JDK builds factories like `Comparator.comparing(...)` and
`Predicate.not(...)`.

> 💡 **Interview line:** "default methods enable interface evolution; the classic example
> is `List.sort` and `Collection.stream` — added in Java 8 without breaking a single
> existing class."
