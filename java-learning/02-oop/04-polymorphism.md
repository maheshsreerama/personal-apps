# Polymorphism — Overloading & Overriding

*Polymorphism* = "many forms": the same method call behaving differently depending on
the type. Java gives you two flavours.

## 1. Compile-time polymorphism — method overloading

Same method name, **different parameter lists**, resolved by the **compiler**:

```java
public class Printer {
    void print(int x)              { System.out.println("int → " + x); }
    void print(String x)           { System.out.println("String → " + x); }
    void print(int x, int y)       { System.out.println("two ints → " + (x + y)); }

    public static void main(String[] args) {
        Printer p = new Printer();
        p.print(10);
        p.print("hi");
        p.print(2, 3);
    }
}
```

**Output:**

```
int → 10
String → hi
two ints → 5
```

⚠️ Changing **only the return type** is *not* overloading — it's a compile error.

## 2. Runtime polymorphism — method overriding

A subclass redefines a parent method with the **same signature**; the JVM picks the
version based on the **actual object** at runtime (*dynamic method dispatch*):

```java
class Shape {
    double area() { return 0; }
}
class Circle extends Shape {
    double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}
class Square extends Shape {
    double side;
    Square(double side) { this.side = side; }
    @Override double area() { return side * side; }
}

public class DispatchDemo {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(1), new Square(3) };
        for (Shape s : shapes) {                       // same call…
            System.out.printf("%s area = %.2f%n",
                s.getClass().getSimpleName(), s.area()); // …different behavior
        }
    }
}
```

**Output:**

```
Circle area = 3.14
Square area = 9.00
```

The variable type is `Shape`, but the **object's** method runs. This is the heart of OOP
design — code against the parent type, plug in any child.

## Overriding rules

- Same name **and** same parameter list (else it's overloading).
- Return type: same, or a subclass of it (**covariant return**).
- Access level may widen (`protected` → `public`) but never narrow.
- Cannot throw broader **checked** exceptions than the parent.
- `private`, `static`, `final` methods **cannot be overridden**.
- Always annotate with `@Override` — the compiler then catches typos.

## Fields are NOT polymorphic

```java
class Parent { String label = "parent"; void who() { System.out.println("Parent"); } }
class Child extends Parent { String label = "child"; @Override void who() { System.out.println("Child"); } }

public class FieldHiding {
    public static void main(String[] args) {
        Parent p = new Child();
        p.who();                       // method → runtime type wins
        System.out.println(p.label);   // field  → reference type wins!
    }
}
```

**Output:**

```
Child
parent
```

Methods dispatch on the **object**, fields resolve on the **reference type**. Avoid
shadowing fields — it only causes confusion.

## static methods hide, they don't override

```java
class Base  { static String tag() { return "Base";  } }
class Sub extends Base { static String tag() { return "Sub"; } }

public class StaticHiding {
    public static void main(String[] args) {
        Base b = new Sub();
        System.out.println(b.tag());   // resolved by reference type at compile time
    }
}
```

**Output:**

```
Base
```

## Overloading vs overriding — cheat table

| | Overloading | Overriding |
|---|---|---|
| Where | same class (or inherited) | subclass |
| Parameters | must differ | must match |
| Binding | compile time (static) | runtime (dynamic) |
| Return type | can differ freely | same or covariant |
| a.k.a. | compile-time polymorphism | runtime polymorphism |

> 💡 **Interview favourite:** "Can you override a static method?" — No; you can only
> *hide* it, and hidden methods bind by reference type.
