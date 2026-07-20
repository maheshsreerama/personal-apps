# Core Keywords — static, final, this, super, instanceof

## static — belongs to the class, not the object

A `static` member is shared by **all** instances; access it via the class name.

```java
public class Counter {
    static int totalCreated = 0;   // one shared copy
    int id;                        // one copy per object

    Counter() {
        totalCreated++;
        id = totalCreated;
    }

    public static void main(String[] args) {
        new Counter();
        new Counter();
        Counter c3 = new Counter();
        System.out.println("objects created = " + Counter.totalCreated);
        System.out.println("c3.id = " + c3.id);
    }
}
```

**Output:**

```
objects created = 3
c3.id = 3
```

Static rules worth memorizing:

- Static methods **cannot** use `this` or access instance members directly.
- **Static blocks** run once, when the class is loaded — before `main`:

```java
public class InitOrder {
    static { System.out.println("1. static block (class load)"); }
    { System.out.println("2. instance block (each new)"); }
    InitOrder() { System.out.println("3. constructor"); }

    public static void main(String[] args) {
        System.out.println("--- main starts ---");
        new InitOrder();
        new InitOrder();
    }
}
```

**Output:**

```
1. static block (class load)
--- main starts ---
2. instance block (each new)
3. constructor
2. instance block (each new)
3. constructor
```

## final — "cannot change"

| On a… | Means |
|-------|-------|
| variable | value/reference can be assigned **once** (a constant) |
| method | subclasses **cannot override** it |
| class | **cannot be extended** (e.g. `String`, `Integer`) |

```java
public class FinalDemo {
    public static void main(String[] args) {
        final int LIMIT = 100;
        // LIMIT = 200;              // ❌ compile error: cannot assign

        final int[] data = {1, 2};
        data[0] = 99;                // ✅ contents may change…
        // data = new int[5];        // ❌ …but the reference may not
        System.out.println(LIMIT + ", data[0] = " + data[0]);
    }
}
```

**Output:**

```
100, data[0] = 99
```

⚠️ `final` on a reference makes the **reference** constant, not the object.

## this — the current object

```java
public class Point {
    int x, y;
    Point(int x, int y) {
        this.x = x;      // this.x = field, x = parameter
        this.y = y;
    }
    Point() {
        this(0, 0);      // constructor chaining — must be the first statement
        System.out.println("default constructor after this(0,0)");
    }
    public static void main(String[] args) {
        Point p = new Point();
        System.out.println("p = (" + p.x + ", " + p.y + ")");
    }
}
```

**Output:**

```
default constructor after this(0,0)
p = (0, 0)
```

## super — the parent object

`super.method()` calls the parent version; `super(...)` calls the parent constructor
(details in Part 2 — Inheritance).

```java
class Animal {
    void speak() { System.out.println("Some sound"); }
}
public class Dog extends Animal {
    @Override void speak() {
        super.speak();                  // run the parent's version first
        System.out.println("Woof!");
    }
    public static void main(String[] args) {
        new Dog().speak();
    }
}
```

**Output:**

```
Some sound
Woof!
```

## instanceof — safe type checks

```java
public class InstanceofDemo {
    public static void main(String[] args) {
        Object obj = "hello";
        if (obj instanceof String s) {        // Java 16+: pattern matching binds s
            System.out.println("length = " + s.length());
        }
        System.out.println(obj instanceof Integer);
    }
}
```

**Output:**

```
length = 5
false
```

> 💡 `null instanceof Anything` is always `false` — a handy null-safe check.
