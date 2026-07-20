# try-with-resources & Best Practices

## The old problem

Resources (files, sockets, DB connections) must be closed even when exceptions fly.
Pre-Java-7 code needed clumsy nested `finally` blocks. **try-with-resources** closes
anything that implements `AutoCloseable` — automatically, in reverse order.

```java
class Resource implements AutoCloseable {
    private final String name;
    Resource(String name) { this.name = name; System.out.println("opened " + name); }
    void use() { System.out.println("using " + name); }
    @Override public void close() { System.out.println("closed " + name); }
}

public class TwrDemo {
    public static void main(String[] args) {
        try (Resource a = new Resource("A");
             Resource b = new Resource("B")) {
            a.use();
            b.use();
        }                      // close() called automatically: B first, then A
        System.out.println("done");
    }
}
```

**Output:**

```
opened A
opened B
using A
using B
closed B
closed A
done
```

Even if `use()` throws, both resources still get closed **before** the exception
propagates — no leaks.

## Real file example

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.StringReader;

public class ReadDemo {
    public static void main(String[] args) {
        try (BufferedReader br = new BufferedReader(
                new StringReader("line one\nline two"))) {
            String line;
            while ((line = br.readLine()) != null) {
                System.out.println("read: " + line);
            }
        } catch (IOException e) {
            System.out.println("I/O problem: " + e.getMessage());
        }
    }
}
```

**Output:**

```
read: line one
read: line two
```

## finally quirks worth knowing

```java
public class FinallyQuirks {
    @SuppressWarnings("finally")
    static int trickyReturn() {
        try {
            return 1;
        } finally {
            return 2;          // ⚠️ overrides the try's return — never do this!
        }
    }
    public static void main(String[] args) {
        System.out.println(trickyReturn());
    }
}
```

**Output:**

```
2
```

- A `return` (or `throw`) inside `finally` **silently swallows** whatever the `try` block
  was returning or throwing. Treat it as forbidden.
- `finally` does run after a `return` in `try` — the return value is computed first,
  then `finally` executes, then the value is returned.

## Best practices checklist

1. **Catch the most specific type you can handle** — never blanket-`catch (Exception e)`
   just to silence the compiler.
2. **Never swallow exceptions silently**:

```java
try { risky(); } catch (IOException e) { }        // ❌ bug black hole
try { risky(); } catch (IOException e) {          // ✅ at least log it
    logger.warn("retrying after failure", e);
}
```

3. **Don't use exceptions for flow control** — they're ~1000× slower than an `if`.
4. **Prefer try-with-resources** over manual `finally { close(); }`.
5. **Throw early, catch late** — validate at the boundary, handle where you have context.
6. **Include context in messages**: `"Cannot load user 42 from users.db"` beats `"error"`.
7. Don't catch `Error` or `Throwable` — `OutOfMemoryError` is not yours to handle.

## Common exceptions and their usual meaning

| Exception | Usual cause |
|-----------|-------------|
| `NullPointerException` | calling a method / field on `null` |
| `ArrayIndexOutOfBoundsException` | bad index |
| `ClassCastException` | wrong downcast |
| `NumberFormatException` | `parseInt("abc")` |
| `IllegalArgumentException` | caller passed a bad value |
| `IllegalStateException` | method called at the wrong time |
| `ConcurrentModificationException` | collection modified while iterating |
| `UnsupportedOperationException` | mutating an immutable collection |

> 💡 Since Java 14, NPE messages are *helpful*: they tell you exactly **which** variable
> was null (`"Cannot invoke String.length() because <local1> is null"`).
