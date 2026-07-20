# Tricky Output Questions — Predict Before You Peek!

Read each snippet, **write down** your predicted output, then check. These traps appear
in quizzes and interviews constantly.

## Q1. Integer caching

```java
public class Q1 {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));
    }
}
```

**Output:**

```
true
false
true
```

**Why:** autoboxing reuses cached `Integer` objects for −128…127. Outside that range,
`==` compares two distinct objects. Moral: compare wrappers with `equals()`, always.

## Q2. String concatenation vs pool

```java
public class Q2 {
    public static void main(String[] args) {
        String a = "ja" + "va";               // compile-time constant → pooled
        String b = "java";
        String p = "ja";
        String c = p + "va";                  // runtime concat → new object
        System.out.println(a == b);
        System.out.println(b == c);
        System.out.println(b.equals(c));
    }
}
```

**Output:**

```
true
false
true
```

**Why:** the compiler folds `"ja" + "va"` into the pooled literal `"java"`, but a
concatenation involving a *variable* builds a fresh String at runtime.

## Q3. Pass-by-value with objects

```java
public class Q3 {
    static void update(StringBuilder sb1, StringBuilder sb2) {
        sb1.append(" world");        // mutates the shared object
        sb2 = new StringBuilder("replaced");   // rebinds only the local copy
    }
    public static void main(String[] args) {
        StringBuilder x = new StringBuilder("hello");
        StringBuilder y = new StringBuilder("original");
        update(x, y);
        System.out.println(x);
        System.out.println(y);
    }
}
```

**Output:**

```
hello world
original
```

**Why:** references are passed **by value** — the method can mutate the object both
variables point to, but reassigning its local parameter doesn't affect the caller.

## Q4. Integer division & floating point

```java
public class Q4 {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println(7 / 2.0);
        System.out.println(0.1 + 0.2);
        System.out.println(0.1 + 0.2 == 0.3);
    }
}
```

**Output:**

```
3
3.5
0.30000000000000004
false
```

**Why:** int/int truncates; and binary floating point cannot represent 0.1 exactly —
never compare doubles with `==` (use a tolerance, or `BigDecimal` for money).

## Q5. Autoboxing NullPointerException

```java
public class Q5 {
    public static void main(String[] args) {
        Integer count = null;
        try {
            int c = count;              // unboxing null!
            System.out.println(c);
        } catch (NullPointerException e) {
            System.out.println("NPE while unboxing");
        }
    }
}
```

**Output:**

```
NPE while unboxing
```

**Why:** `int c = count` secretly calls `count.intValue()` — on `null`, that's an NPE.
Watch for this in ternaries mixing `int` and `Integer` too.

## Q6. Pre/post increment madness

```java
public class Q6 {
    public static void main(String[] args) {
        int i = 5;
        i = i++;                 // post-increment, then OVERWRITE with old value
        System.out.println(i);

        int j = 5;
        j = ++j;                 // pre-increment, assign new value
        System.out.println(j);

        int k = 5;
        System.out.println(k++ + ++k);   // 5 + 7
    }
}
```

**Output:**

```
5
6
12
```

**Why:** `i = i++` saves the old value (5), increments i to 6, then assigns the saved 5
back. A famous "gotcha" — and a reason to never write such code for real.

## Q7. char arithmetic

```java
public class Q7 {
    public static void main(String[] args) {
        char c = 'A';
        System.out.println(c + 1);
        System.out.println((char) (c + 1));
        System.out.println("" + c + 1);
    }
}
```

**Output:**

```
66
B
A1
```

**Why:** `char + int` promotes to `int` (65+1). Casting back gives `'B'`. With a String
first, everything becomes concatenation.

## Q8. Ternary type promotion

```java
public class Q8 {
    public static void main(String[] args) {
        int x = 5;
        System.out.println(true ? x : 7.5);   // branches unify to double!
    }
}
```

**Output:**

```
5.0
```

**Why:** a conditional expression has ONE type — here `int` and `double` unify to
`double`, so 5 prints as 5.0 even though the double branch is never taken.

## Q9. Array default vs local default

```java
public class Q9 {
    static int[] data = new int[2];
    public static void main(String[] args) {
        System.out.println(data[0]);       // array elements get defaults
        int x;
        // System.out.println(x);          // ❌ compile error: x not initialized
        System.out.println("locals have NO defaults — that line won't compile");
    }
}
```

**Output:**

```
0
locals have NO defaults — that line won't compile
```

## Q10. Short-circuit side effects

```java
public class Q10 {
    static int calls = 0;
    static boolean bump() { calls++; return true; }
    public static void main(String[] args) {
        boolean r1 = false && bump();   // right side skipped
        boolean r2 = false & bump();    // non-short-circuit & evaluates both!
        System.out.println("calls = " + calls);
    }
}
```

**Output:**

```
calls = 1
```

**Why:** `&&` short-circuits; bitwise `&` on booleans does not. Same story for `||`
vs `|`.

> 💡 Score yourself: 8+ correct = you've internalized Java's evaluation rules.
> Anything you missed — reread the linked part of this app (operators, strings,
> autoboxing).
