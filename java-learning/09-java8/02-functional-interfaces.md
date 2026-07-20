# Functional Interfaces — Predicate, Function, Consumer, Supplier

## What makes an interface "functional"?

Exactly **one abstract method** (SAM — single abstract method). `default` and `static`
methods don't count. The `@FunctionalInterface` annotation makes the compiler enforce it.

```java
@FunctionalInterface
interface Converter<F, T> {
    T convert(F from);                      // the single abstract method

    default Converter<F, T> logged() {      // defaults are allowed
        return from -> {
            T result = convert(from);
            System.out.println(from + " → " + result);
            return result;
        };
    }
}

public class CustomFi {
    public static void main(String[] args) {
        Converter<String, Integer> parse = Integer::parseInt;
        System.out.println(parse.convert("42") + 1);
        parse.logged().convert("7");
    }
}
```

**Output:**

```
43
7 → 7
```

## The core four (java.util.function)

| Interface | Method | Shape | Typical use |
|-----------|--------|-------|-------------|
| `Predicate<T>` | `test(T) → boolean` | T → boolean | filtering |
| `Function<T,R>` | `apply(T) → R` | T → R | transforming |
| `Consumer<T>` | `accept(T) → void` | T → (side effect) | printing, saving |
| `Supplier<T>` | `get() → T` | () → T | lazy creation |

```java
import java.util.function.*;

public class CoreFour {
    public static void main(String[] args) {
        Predicate<String> isLong = s -> s.length() > 5;
        Function<String, Integer> len = String::length;
        Consumer<String> shout = s -> System.out.println(s.toUpperCase() + "!");
        Supplier<Double> dice = () -> Math.ceil(Math.random() * 6);

        System.out.println(isLong.test("banana"));
        System.out.println(len.apply("banana"));
        shout.accept("banana");
        System.out.println("rolled ≤ 6? " + (dice.get() <= 6));
    }
}
```

**Output:**

```
true
6
BANANA!
rolled ≤ 6? true
```

## Composing them

The default methods make small functions combine into bigger ones:

```java
import java.util.function.*;

public class Composing {
    public static void main(String[] args) {
        // Predicate: and / or / negate
        Predicate<Integer> even = n -> n % 2 == 0;
        Predicate<Integer> positive = n -> n > 0;
        System.out.println(even.and(positive).test(4));
        System.out.println(even.or(positive).test(-3));
        System.out.println(even.negate().test(3));

        // Function: andThen / compose
        Function<Integer, Integer> triple = n -> n * 3;
        Function<Integer, Integer> plusOne = n -> n + 1;
        System.out.println(triple.andThen(plusOne).apply(5));  // (5*3)+1
        System.out.println(triple.compose(plusOne).apply(5));  // (5+1)*3

        // Consumer: andThen chains side effects
        Consumer<String> print = System.out::println;
        Consumer<String> printLen = s -> System.out.println("len=" + s.length());
        print.andThen(printLen).accept("chain");
    }
}
```

**Output:**

```
true
false
false
16
18
chain
len=5
```

## The extended family

| Interface | Shape | Notes |
|-----------|-------|-------|
| `BiPredicate<T,U>` | (T,U) → boolean | two-arg test |
| `BiFunction<T,U,R>` | (T,U) → R | two-arg transform |
| `BiConsumer<T,U>` | (T,U) → void | e.g. `map.forEach` |
| `UnaryOperator<T>` | T → T | Function with same in/out |
| `BinaryOperator<T>` | (T,T) → T | e.g. reduce, `Integer::sum` |
| `IntPredicate`, `IntFunction`, … | primitive variants | avoid boxing in hot loops |

```java
import java.util.function.*;

public class FamilyDemo {
    public static void main(String[] args) {
        BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
        BinaryOperator<Integer> max = Integer::max;
        IntUnaryOperator square = n -> n * n;

        System.out.println(repeat.apply("ab", 3));
        System.out.println(max.apply(7, 12));
        System.out.println(square.applyAsInt(9));
    }
}
```

**Output:**

```
ababab
12
81
```

## Old friends are functional too

`Runnable` (`run`), `Callable<V>` (`call`), `Comparator<T>` (`compare`) — all
single-abstract-method interfaces, all lambda-compatible. That's why
`names.sort((a, b) -> a.compareTo(b))` works.

> 💡 **Interview line:** "Before writing a custom functional interface, check
> `java.util.function` — with 40+ shapes, one almost always fits."
