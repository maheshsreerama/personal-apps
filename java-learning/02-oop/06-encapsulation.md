# Encapsulation & Access Modifiers

## What is encapsulation?

Bundling data and the methods that operate on it into one class, while **hiding the data**
behind a controlled interface: `private` fields + `public` getters/setters. The class
stays free to validate, log, or change its internals without breaking callers.

```java
public class BankAccount {
    private double balance;              // hidden — nobody can set it directly

    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) {
            System.out.println("Rejected: invalid amount " + amount);
            return;
        }
        balance += amount;
        System.out.println("Deposited " + amount);
    }

    public void withdraw(double amount) {
        if (amount > balance) {
            System.out.println("Rejected: insufficient funds");
            return;
        }
        balance -= amount;
        System.out.println("Withdrew " + amount);
    }

    public static void main(String[] args) {
        BankAccount acc = new BankAccount();
        acc.deposit(500);
        acc.deposit(-50);        // validation kicks in
        acc.withdraw(9999);      // validation kicks in
        acc.withdraw(200);
        System.out.println("balance = " + acc.getBalance());
    }
}
```

**Output:**

```
Deposited 500.0
Rejected: invalid amount -50.0
Rejected: insufficient funds
Withdrew 200.0
balance = 300.0
```

Without encapsulation, any code could write `acc.balance = -1_000_000;`. With it, every
change passes through your rules.

## The four access modifiers

| Modifier | Same class | Same package | Subclass (other pkg) | Everywhere |
|----------|:---:|:---:|:---:|:---:|
| `private` | ✅ | ❌ | ❌ | ❌ |
| *(default)* | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

Guideline: make everything as **private as possible**; widen only when needed.

## Immutable classes — encapsulation taken to the max

An immutable object can never change after construction — automatically thread-safe,
safe to share and cache (`String`, `Integer`, `LocalDate` are all immutable).

Recipe:

1. Class `final` (no subclass can add mutability).
2. All fields `private final`.
3. No setters.
4. **Defensive-copy** any mutable field on the way in *and* out.

```java
import java.util.ArrayList;
import java.util.List;

public final class ImmutableStudent {
    private final String name;
    private final List<String> subjects;

    public ImmutableStudent(String name, List<String> subjects) {
        this.name = name;
        this.subjects = new ArrayList<>(subjects);   // copy in
    }

    public String getName() { return name; }
    public List<String> getSubjects() {
        return new ArrayList<>(subjects);            // copy out
    }

    public static void main(String[] args) {
        List<String> subs = new ArrayList<>(List.of("Math", "Physics"));
        ImmutableStudent s = new ImmutableStudent("Ravi", subs);

        subs.add("HACKED-IN");                 // attack via original list
        s.getSubjects().add("HACKED-OUT");     // attack via getter

        System.out.println(s.getName() + " → " + s.getSubjects());
    }
}
```

**Output:**

```
Ravi → [Math, Physics]
```

Both "attacks" failed — the defensive copies protected the internal state.

## Records (Java 16+) — immutability for free

```java
public class RecordDemo {
    record Point(int x, int y) { }   // final fields, constructor, accessors,
                                     // equals, hashCode, toString — all generated
    public static void main(String[] args) {
        Point p = new Point(3, 4);
        System.out.println(p);
        System.out.println(p.x() + p.y());
        System.out.println(p.equals(new Point(3, 4)));
    }
}
```

**Output:**

```
Point[x=3, y=4]
7
true
```

> 💡 **Interview line:** "Encapsulation is about hiding *data*; abstraction is about
> hiding *implementation complexity*. Getters/setters vs interfaces."
