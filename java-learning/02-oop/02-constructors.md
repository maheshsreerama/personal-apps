# Constructors

## What is a constructor?

A special block that initializes a new object. It has the **same name as the class** and
**no return type** (not even `void`). It runs exactly once per object, at `new`.

```java
public class Book {
    String title;
    double price;

    Book() {                              // no-arg constructor
        this("Untitled", 0.0);            // chain to the 2-arg one
        System.out.println("no-arg constructor finished");
    }

    Book(String title, double price) {    // parameterized constructor
        this.title = title;
        this.price = price;
        System.out.println("created: " + title);
    }

    public static void main(String[] args) {
        Book b1 = new Book("Effective Java", 45.0);
        Book b2 = new Book();
        System.out.println(b2.title + " / " + b2.price);
    }
}
```

**Output:**

```
created: Effective Java
created: Untitled
no-arg constructor finished
Untitled / 0.0
```

## The default constructor

If you write **no constructor at all**, the compiler inserts an invisible no-arg one.
The moment you write **any** constructor, that freebie disappears:

```java
class A { }                 // ✅ new A() works — compiler-provided default
class B { B(int x) { } }    // ❌ new B() is a compile error — only B(int) exists
```

## Constructor overloading & chaining

- **Overloading:** several constructors with different parameter lists.
- **Chaining:** `this(...)` calls a sibling constructor — must be the **first statement**.
- In a subclass, `super(...)` calls the parent constructor first (implicitly `super()` if
  you don't write it).

```java
class Vehicle {
    Vehicle() { System.out.println("1. Vehicle()"); }
}
public class Bike extends Vehicle {
    Bike() {
        // compiler inserts super() here
        System.out.println("2. Bike()");
    }
    public static void main(String[] args) {
        new Bike();
    }
}
```

**Output:**

```
1. Vehicle()
2. Bike()
```

**Parent constructors always run before child constructors** — an object is built
top-down.

## Copy constructor (a common pattern, not a language feature)

```java
public class PointCopy {
    int x, y;
    PointCopy(int x, int y) { this.x = x; this.y = y; }
    PointCopy(PointCopy other) {          // "copy constructor"
        this(other.x, other.y);
    }
    public static void main(String[] args) {
        PointCopy p1 = new PointCopy(3, 4);
        PointCopy p2 = new PointCopy(p1); // independent copy
        p2.x = 99;
        System.out.println("p1.x = " + p1.x + ", p2.x = " + p2.x);
    }
}
```

**Output:**

```
p1.x = 3, p2.x = 99
```

## Constructor facts interviewers love

- Constructors are **not inherited** and **cannot be overridden**.
- A constructor can be `private` — used by Singletons and factory methods.
- Constructors can be overloaded, but you can't have two with identical parameter lists.
- `abstract`, `final`, `static` are **illegal** on constructors.
- If both `this(...)` and `super(...)` are needed — impossible; only one, and it must be
  first.

> 💡 **Singleton preview:** `private` constructor + `public static` accessor = only one
> instance ever exists. Full program in Part 12.
