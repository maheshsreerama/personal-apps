# Methods, main(), Varargs & Recursion

## Anatomy of a method

```java
//  modifier  return-type  name(parameters)
    public    static int   add(int a, int b) {
        return a + b;
    }
```

- **Return type** `void` means "returns nothing".
- Parameters are **passed by value** — always. For objects, the *reference* is copied,
  so the method can mutate the object but cannot re-point the caller's variable.

```java
public class PassByValueDemo {
    static void reassign(int[] arr) {
        arr = new int[]{99};          // only reassigns the LOCAL copy of the reference
    }
    static void mutate(int[] arr) {
        arr[0] = 42;                  // mutates the shared object — caller sees this
    }
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        reassign(nums);
        System.out.println("after reassign: " + nums[0]);
        mutate(nums);
        System.out.println("after mutate:   " + nums[0]);
    }
}
```

**Output:**

```
after reassign: 1
after mutate:   42
```

> 💡 **Interview line:** "Java is strictly pass-by-value; for objects, the value passed is
> the reference."

## Why is main() written the way it is?

```java
public static void main(String[] args)
```

| Word | Why |
|------|-----|
| `public` | JVM must call it from outside the class |
| `static` | JVM calls it **without creating an object** first |
| `void` | nothing is returned to the JVM |
| `main` | the exact name the JVM looks for |
| `String[] args` | command-line arguments |

```java
public class ArgsDemo {
    public static void main(String[] args) {
        System.out.println("You passed " + args.length + " argument(s)");
        for (String a : args) System.out.println("→ " + a);
    }
}
```

Running `java ArgsDemo hello world` prints:

```
You passed 2 argument(s)
→ hello
→ world
```

## Varargs — variable number of arguments

```java
public class VarargsDemo {
    static int sum(int... nums) {      // nums behaves like an int[]
        int total = 0;
        for (int n : nums) total += n;
        return total;
    }
    public static void main(String[] args) {
        System.out.println(sum());
        System.out.println(sum(5));
        System.out.println(sum(1, 2, 3, 4));
    }
}
```

**Output:**

```
0
5
10
```

Rules: at most **one** varargs parameter per method, and it must be **last**.

## Recursion — a method calling itself

```java
public class RecursionDemo {
    static long factorial(int n) {
        if (n <= 1) return 1;          // base case — stops the recursion
        return n * factorial(n - 1);   // recursive case
    }
    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5));
        System.out.println("10! = " + factorial(10));
    }
}
```

**Output:**

```
5! = 120
10! = 3628800
```

Every recursive method needs a **base case**, or it recurses forever and the JVM throws
`StackOverflowError`.

## Method overloading (preview)

Same name, different parameter lists — resolved at **compile time**:

```java
public class OverloadDemo {
    static void print(int x)    { System.out.println("int: " + x); }
    static void print(double x) { System.out.println("double: " + x); }
    static void print(String x) { System.out.println("String: " + x); }

    public static void main(String[] args) {
        print(7);
        print(7.5);
        print("seven");
    }
}
```

**Output:**

```
int: 7
double: 7.5
String: seven
```

Full details in Part 2 (Polymorphism).
