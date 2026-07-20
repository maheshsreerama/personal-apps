# StringBuilder & StringBuffer

## Why do they exist?

Because `String` is immutable, this innocent loop creates ~10,000 throw-away objects:

```java
String s = "";
for (int i = 0; i < 10_000; i++) s += i;   // new String every iteration! O(n²)
```

`StringBuilder` keeps one **mutable** character buffer instead — appends are O(1) amortized.

```java
public class BuilderSpeed {
    public static void main(String[] args) {
        long t1 = System.nanoTime();
        String s = "";
        for (int i = 0; i < 20_000; i++) s += "x";
        long stringMs = (System.nanoTime() - t1) / 1_000_000;

        long t2 = System.nanoTime();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 20_000; i++) sb.append("x");
        long builderMs = (System.nanoTime() - t2) / 1_000_000;

        System.out.println("String  += took ~" + stringMs + " ms");
        System.out.println("StringBuilder took ~" + builderMs + " ms");
    }
}
```

**Output (typical — exact numbers vary by machine):**

```
String  += took ~180 ms
StringBuilder took ~1 ms
```

## StringBuilder API tour

```java
public class BuilderDemo {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Java");

        sb.append(" rocks");             // add at end
        sb.insert(4, " really");         // add at index
        sb.replace(0, 4, "JAVA");        // replace range [0,4)
        System.out.println(sb);

        sb.deleteCharAt(sb.length() - 1);
        sb.delete(4, 11);                // remove " really"
        System.out.println(sb);

        sb.setCharAt(0, 'j');
        System.out.println(sb.reverse());
        System.out.println("length=" + sb.length());

        String result = sb.toString();   // back to an immutable String
        System.out.println(result.toUpperCase());
    }
}
```

**Output:**

```
JAVA really rocks
JAVA rock
kcor AVAj
length=9
KCOR AVAJ
```

Methods return `this`, so calls **chain**:

```java
String msg = new StringBuilder().append("a").append(1).append(true).toString();
System.out.println(msg);   // a1true
```

## StringBuilder vs StringBuffer vs String

| | `String` | `StringBuilder` | `StringBuffer` |
|---|---|---|---|
| Mutable | ❌ | ✅ | ✅ |
| Thread-safe | ✅ (immutable) | ❌ | ✅ (synchronized) |
| Speed | slow for many edits | **fastest** | slower (locking) |
| Since | 1.0 | 1.5 | 1.0 |
| Use when | value doesn't change | single-thread edits (99% of cases) | shared across threads (rare) |

`StringBuffer` is the legacy synchronized twin. Modern code almost always wants
`StringBuilder`; if multiple threads build one string you usually restructure the code
instead of sharing a buffer.

```java
public class BufferDemo {
    public static void main(String[] args) {
        StringBuffer buf = new StringBuffer("thread");
        buf.append("-safe");             // same API as StringBuilder
        System.out.println(buf);
    }
}
```

**Output:**

```
thread-safe
```

## equals() surprise

`StringBuilder` does **not** override `equals()` — it compares references:

```java
public class BuilderEquals {
    public static void main(String[] args) {
        StringBuilder a = new StringBuilder("hi");
        StringBuilder b = new StringBuilder("hi");
        System.out.println(a.equals(b));                       // reference compare!
        System.out.println(a.toString().equals(b.toString())); // content compare
        System.out.println(a.compareTo(b));                    // 0 → equal content (Java 11+)
    }
}
```

**Output:**

```
false
true
0
```

> 💡 **Rule of thumb:** building a string in a loop → `StringBuilder`. Simple one-line
> concatenation → plain `+` is fine (the compiler optimizes single expressions).
