# Lambda Expressions

## From anonymous class to lambda

A lambda is a compact way to pass **behavior** as a value. It can be used wherever a
**functional interface** (exactly one abstract method) is expected.

```java
public class LambdaIntro {
    public static void main(String[] args) {
        // before Java 8: anonymous inner class
        Runnable old = new Runnable() {
            @Override public void run() {
                System.out.println("old-style runnable");
            }
        };

        // Java 8: lambda — same thing, no ceremony
        Runnable modern = () -> System.out.println("lambda runnable");

        old.run();
        modern.run();
    }
}
```

**Output:**

```
old-style runnable
lambda runnable
```

## Lambda syntax — all the shapes

```java
import java.util.function.*;

public class LambdaShapes {
    public static void main(String[] args) {
        // no parameters
        Supplier<String> greet = () -> "hello";

        // one parameter — parentheses optional
        UnaryOperator<Integer> doubler = n -> n * 2;

        // two parameters
        BinaryOperator<Integer> add = (a, b) -> a + b;

        // block body — braces and explicit return
        BiFunction<Integer, Integer, String> describe = (a, b) -> {
            int sum = a + b;
            return a + "+" + b + "=" + sum;
        };

        System.out.println(greet.get());
        System.out.println(doubler.apply(21));
        System.out.println(add.apply(3, 4));
        System.out.println(describe.apply(2, 5));
    }
}
```

**Output:**

```
hello
42
7
2+5=7
```

Rules of thumb:

- Parameter types are usually **inferred** — write `(a, b) ->`, not `(int a, int b) ->`.
- Single expression → no braces, no `return`.
- Keep lambdas to 1–3 lines; extract longer logic into a named method.

## Passing behavior to methods

The real power: methods that accept *what to do*:

```java
import java.util.*;
import java.util.function.Predicate;

public class BehaviorParam {
    static List<Integer> keep(List<Integer> src, Predicate<Integer> test) {
        List<Integer> out = new ArrayList<>();
        for (int n : src) if (test.test(n)) out.add(n);
        return out;
    }

    public static void main(String[] args) {
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8);

        System.out.println("evens : " + keep(nums, n -> n % 2 == 0));
        System.out.println("big   : " + keep(nums, n -> n > 5));
        System.out.println("both  : " + keep(nums, n -> n % 2 == 0 && n > 5));
    }
}
```

**Output:**

```
evens : [2, 4, 6, 8]
big   : [6, 7, 8]
both  : [6, 8]
```

One `keep` method, unlimited filters — this is the pattern Streams are built on.

## Lambdas in everyday APIs

```java
import java.util.*;

public class EverydayLambdas {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>(List.of("Chitra", "Anil", "Balu"));

        names.sort((a, b) -> a.compareTo(b));           // Comparator
        System.out.println(names);

        names.forEach(n -> System.out.println("hi " + n));   // Iterable.forEach

        names.replaceAll(n -> n.toUpperCase());          // in-place transform
        System.out.println(names);

        names.removeIf(n -> n.startsWith("B"));          // conditional removal
        System.out.println(names);
    }
}
```

**Output:**

```
[Anil, Balu, Chitra]
hi Anil
hi Balu
hi Chitra
[ANIL, BALU, CHITRA]
[ANIL, CHITRA]
```

## Variable capture — "effectively final"

A lambda may read local variables of the enclosing method, but only if they are never
reassigned:

```java
public class CaptureDemo {
    public static void main(String[] args) {
        int factor = 3;                        // effectively final — never reassigned
        Runnable r = () -> System.out.println("factor = " + factor);
        // factor = 4;                         // ❌ uncommenting breaks the lambda too
        r.run();
    }
}
```

**Output:**

```
factor = 3
```

Instance fields have no such restriction — only **locals** must be effectively final.
Also note: `this` inside a lambda refers to the **enclosing object**, not the lambda
(unlike anonymous classes).

> 💡 **Interview line:** "A lambda is an instance of a functional interface; the compiler
> matches its shape to the interface's single abstract method."
