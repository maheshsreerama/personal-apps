# Operators

## Arithmetic, assignment & unary

```java
public class ArithmeticDemo {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println("a + b = " + (a + b));
        System.out.println("a - b = " + (a - b));
        System.out.println("a * b = " + (a * b));
        System.out.println("a / b = " + (a / b));   // integer division!
        System.out.println("a % b = " + (a % b));   // remainder (modulo)
        System.out.println("a / 5.0 = " + (a / 5.0)); // one double → double division

        int x = 10;
        x += 3;                     // same as x = x + 3
        System.out.println("x after += 3 : " + x);
    }
}
```

**Output:**

```
a + b = 22
a - b = 12
a * b = 85
a / b = 3
a % b = 2
a / 5.0 = 3.4
x after += 3 : 13
```

⚠️ `17 / 5` is `3`, not `3.4` — **integer division truncates**. Make one operand a
`double` to get decimals.

## Increment/decrement: prefix vs postfix

```java
public class IncrementDemo {
    public static void main(String[] args) {
        int i = 5;
        System.out.println(i++);  // postfix: use THEN increment → prints 5
        System.out.println(i);    // now 6
        System.out.println(++i);  // prefix: increment THEN use → prints 7
    }
}
```

**Output:**

```
5
6
7
```

## Comparison & logical operators

| Operator | Meaning | Note |
|----------|---------|------|
| `==` `!=` | equal / not equal | for objects compares **references**, not content |
| `<` `<=` `>` `>=` | ordering | primitives only |
| `&&` | logical AND | **short-circuits**: right side skipped if left is `false` |
| `\|\|` | logical OR | short-circuits if left is `true` |
| `!` | logical NOT | |

```java
public class ShortCircuitDemo {
    static boolean check(String label, boolean value) {
        System.out.println("evaluating " + label);
        return value;
    }
    public static void main(String[] args) {
        // right side never runs — left already decides the result
        boolean r = check("left", false) && check("right", true);
        System.out.println("result = " + r);
    }
}
```

**Output:**

```
evaluating left
result = false
```

Short-circuiting is why `if (s != null && s.length() > 0)` is safe — the length check never
runs on `null`.

## Ternary operator

```java
int score = 72;
String verdict = (score >= 60) ? "PASS" : "FAIL";
System.out.println(verdict);          // PASS
```

## Bitwise & shift operators (quick tour)

```java
public class BitwiseDemo {
    public static void main(String[] args) {
        int a = 6, b = 4;             // 110 and 100 in binary
        System.out.println(a & b);    // AND  → 100 = 4
        System.out.println(a | b);    // OR   → 110 = 6
        System.out.println(a ^ b);    // XOR  → 010 = 2
        System.out.println(a << 1);   // shift left  → 1100 = 12 (×2)
        System.out.println(a >> 1);   // shift right → 011 = 3 (÷2)
    }
}
```

**Output:**

```
4
6
2
12
3
```

> 💡 **Interview favourite:** swap two numbers without a temp variable using XOR —
> `a ^= b; b ^= a; a ^= b;` (full program in Part 12).
