# Optional — Escaping the NullPointerException

## The billion-dollar problem

Returning `null` forces every caller to remember a null check — forget once and you get
an NPE at runtime, far from the real cause. `Optional<T>` makes "may be absent"
**visible in the type** and impossible to ignore.

## Creating and inspecting

```java
import java.util.Optional;

public class OptionalBasics {
    public static void main(String[] args) {
        Optional<String> present = Optional.of("value");          // must be non-null
        Optional<String> empty = Optional.empty();
        Optional<String> maybe = Optional.ofNullable(null);       // null-tolerant

        System.out.println(present.isPresent());
        System.out.println(empty.isEmpty());
        System.out.println(maybe.isPresent());

        // ⚠️ Optional.of(null) throws NullPointerException immediately
    }
}
```

**Output:**

```
true
true
false
```

## Getting the value out — the right ways

```java
import java.util.Optional;

public class Unwrapping {
    static Optional<String> findUser(int id) {
        return id == 1 ? Optional.of("Asha") : Optional.empty();
    }

    public static void main(String[] args) {
        System.out.println(findUser(1).orElse("guest"));
        System.out.println(findUser(2).orElse("guest"));

        // orElseGet: lazy — supplier runs only when empty
        System.out.println(findUser(2).orElseGet(() -> "computed-fallback"));

        // ifPresent / ifPresentOrElse: act on the value
        findUser(1).ifPresent(u -> System.out.println("hello " + u));
        findUser(2).ifPresentOrElse(
                u -> System.out.println("hello " + u),
                () -> System.out.println("nobody found"));

        // orElseThrow: when absence is a bug
        try {
            findUser(2).orElseThrow(() -> new IllegalStateException("user 2 missing"));
        } catch (IllegalStateException e) {
            System.out.println("threw: " + e.getMessage());
        }
    }
}
```

**Output:**

```
Asha
guest
computed-fallback
hello Asha
nobody found
threw: user 2 missing
```

⚠️ Avoid bare `get()` — calling it on an empty Optional throws
`NoSuchElementException`, which is just an NPE with better branding.

## map / filter / flatMap — transform without unwrapping

```java
import java.util.Optional;

public class OptionalChains {
    record Address(String city) { }
    record User(String name, Optional<Address> address) { }

    public static void main(String[] args) {
        User withAddr = new User("Anil", Optional.of(new Address("Pune")));
        User noAddr = new User("Balu", Optional.empty());

        // map: transform if present
        System.out.println(Optional.of("java").map(String::toUpperCase).orElse("?"));

        // filter: keep only if it matches
        System.out.println(Optional.of(42).filter(n -> n > 100).isPresent());

        // flatMap: chain Optionals without nesting
        String city1 = withAddr.address().map(Address::city).orElse("unknown");
        String city2 = noAddr.address().map(Address::city).orElse("unknown");
        System.out.println(city1 + " / " + city2);
    }
}
```

**Output:**

```
JAVA
false
Pune / unknown
```

The chain `optional.map(...).filter(...).orElse(...)` replaces a pyramid of
`if (x != null)` checks.

## Optionals and streams

```java
import java.util.*;
import java.util.stream.*;

public class OptionalStreams {
    public static void main(String[] args) {
        // stream terminal ops return Optionals — no "what if empty?" ambiguity
        Optional<Integer> max = Stream.of(3, 9, 4).max(Integer::compare);
        System.out.println(max.orElse(-1));

        // Optional.stream() (Java 9): filter-and-unwrap present values in one go
        List<Optional<String>> raw = List.of(
                Optional.of("a"), Optional.empty(), Optional.of("c"));
        List<String> present = raw.stream().flatMap(Optional::stream).toList();
        System.out.println(present);
    }
}
```

**Output:**

```
9
[a, c]
```

## Where Optional belongs (and doesn't)

| ✅ Do | ❌ Don't |
|-------|---------|
| return type of "find/lookup" methods | fields of a class (adds a layer, isn't serializable-friendly) |
| chain with map/filter/orElse | method **parameters** (`f(Optional<X>)` — just overload) |
| `orElseGet` for expensive fallbacks | wrap collections (`Optional<List<T>>` — return an empty list instead) |
| `orElseThrow` when absence = bug | call `.get()` blind — that's the old NPE again |

> 💡 **Interview line:** "Optional is a *return-type contract* that forces callers to
> handle absence; it is not a general replacement for every null in the codebase."
