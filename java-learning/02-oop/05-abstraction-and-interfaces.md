# Abstraction — Abstract Classes & Interfaces

**Abstraction** = expose *what* something does, hide *how*. Java gives two tools:
abstract classes and interfaces.

## Abstract classes

- Declared with `abstract`; **cannot be instantiated**.
- May mix **abstract methods** (no body — children must implement) with normal methods,
  fields and constructors.

```java
abstract class Payment {
    double amount;
    Payment(double amount) { this.amount = amount; }

    abstract void pay();                       // each child decides HOW

    void receipt() {                           // shared concrete behavior
        System.out.println("Paid " + amount + " ✔");
    }
}

class CardPayment extends Payment {
    CardPayment(double a) { super(a); }
    @Override void pay() { System.out.println("Charging card: " + amount); }
}
class UpiPayment extends Payment {
    UpiPayment(double a) { super(a); }
    @Override void pay() { System.out.println("UPI transfer: " + amount); }
}

public class AbstractDemo {
    public static void main(String[] args) {
        Payment[] payments = { new CardPayment(250), new UpiPayment(99) };
        for (Payment p : payments) { p.pay(); p.receipt(); }
        // new Payment(10);   // ❌ compile error: Payment is abstract
    }
}
```

**Output:**

```
Charging card: 250.0
Paid 250.0 ✔
UPI transfer: 99.0
Paid 99.0 ✔
```

## Interfaces

An interface is a pure **contract**: a set of methods a class promises to implement.

- All abstract methods are implicitly `public abstract`.
- Fields are implicitly `public static final` (constants).
- A class can **implement many** interfaces — Java's answer to multiple inheritance.
- Since Java 8: `default` and `static` methods with bodies are allowed.

```java
interface Flyable { void fly(); }
interface Swimmable { void swim(); }

class Duck implements Flyable, Swimmable {     // multiple contracts — fine!
    public void fly()  { System.out.println("Duck flies"); }
    public void swim() { System.out.println("Duck swims"); }
}

public class InterfaceDemo {
    public static void main(String[] args) {
        Duck d = new Duck();
        d.fly();
        d.swim();

        Flyable f = d;          // program against the contract
        f.fly();
    }
}
```

**Output:**

```
Duck flies
Duck swims
Duck flies
```

## default methods (Java 8+)

Let interfaces evolve without breaking every implementor:

```java
interface Logger {
    void log(String msg);
    default void logError(String msg) {   // has a body — inherited for free
        log("[ERROR] " + msg);
    }
}

public class DefaultDemo implements Logger {
    public void log(String msg) { System.out.println(msg); }
    public static void main(String[] args) {
        DefaultDemo d = new DefaultDemo();
        d.log("starting");
        d.logError("disk full");
    }
}
```

**Output:**

```
starting
[ERROR] disk full
```

If two interfaces provide the **same default method**, the class must override it
(and may pick one with `InterfaceName.super.method()`).

## Abstract class vs interface — when to use which

| | Abstract class | Interface |
|---|---|---|
| Inheritance | single (`extends` one) | multiple (`implements` many) |
| Fields | any kind | only `public static final` constants |
| Constructors | ✅ yes | ❌ no |
| Method bodies | ✅ any method | only `default` / `static` / `private` |
| Relationship it models | strong IS-A with shared state | capability / contract ("can do") |
| Example | `Payment`, `AbstractList` | `Comparable`, `Runnable`, `List` |

Rules of thumb:

- Need shared **fields or constructors**? → abstract class.
- Modeling a **capability** many unrelated classes share? → interface.
- Unsure? Start with an interface — it's the more flexible contract.

> 💡 A class that implements an interface but leaves a method unimplemented must itself
> be declared `abstract`.
