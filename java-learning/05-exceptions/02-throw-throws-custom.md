# throw, throws & Custom Exceptions

## throw vs throws — one letter, very different jobs

| | `throw` | `throws` |
|---|---|---|
| What | **statement** that raises one exception object | **clause** in a method signature |
| Where | inside a method body | after the parameter list |
| Says | "raise this now!" | "callers beware: I might raise these" |
| Count | one object per throw | any number of types, comma-separated |

```java
public class ThrowVsThrows {
    // throws: declares that callers must handle InterruptedException
    static void pause() throws InterruptedException {
        Thread.sleep(100);
    }

    // throw: actually raises an exception
    static void validateAge(int age) {
        if (age < 18) {
            throw new IllegalArgumentException("age " + age + " is under 18");
        }
        System.out.println("age " + age + " accepted");
    }

    public static void main(String[] args) throws InterruptedException {
        pause();
        validateAge(25);
        try {
            validateAge(15);
        } catch (IllegalArgumentException e) {
            System.out.println("rejected: " + e.getMessage());
        }
    }
}
```

**Output:**

```
age 25 accepted
rejected: age 15 is under 18
```

Checked exceptions **must** be either caught or declared with `throws` — this is the
*handle-or-declare* rule. Unchecked ones need neither.

## Writing custom exceptions

Extend `Exception` (checked) or `RuntimeException` (unchecked). Give it constructors that
pass the message (and optionally a cause) up to `super`:

```java
class InsufficientFundsException extends Exception {
    private final double shortfall;

    public InsufficientFundsException(double shortfall) {
        super("Short by ₹" + shortfall);
        this.shortfall = shortfall;
    }
    public double getShortfall() { return shortfall; }
}

public class CustomDemo {
    static double balance = 1000;

    static void withdraw(double amt) throws InsufficientFundsException {
        if (amt > balance) throw new InsufficientFundsException(amt - balance);
        balance -= amt;
        System.out.println("withdrew " + amt + ", balance = " + balance);
    }

    public static void main(String[] args) {
        try {
            withdraw(400);
            withdraw(900);
        } catch (InsufficientFundsException e) {
            System.out.println("failed: " + e.getMessage());
            System.out.println("need " + e.getShortfall() + " more");
        }
    }
}
```

**Output:**

```
withdrew 400.0, balance = 600.0
failed: Short by ₹300.0
need 300.0 more
```

Custom exceptions shine because they can carry **domain data** (like `shortfall`) that
callers can use programmatically — not just a message string.

## Exception chaining — keep the root cause

When you catch a low-level exception and throw a higher-level one, **pass the original as
the cause** so the stack trace shows the whole story:

```java
class ConfigException extends RuntimeException {
    ConfigException(String msg, Throwable cause) { super(msg, cause); }
}

public class ChainDemo {
    static int readPort(String raw) {
        try {
            return Integer.parseInt(raw);
        } catch (NumberFormatException e) {
            throw new ConfigException("invalid port setting: " + raw, e);
        }
    }
    public static void main(String[] args) {
        try {
            readPort("80a");
        } catch (ConfigException e) {
            System.out.println("error : " + e.getMessage());
            System.out.println("cause : " + e.getCause());
        }
    }
}
```

**Output:**

```
error : invalid port setting: 80a
cause : java.lang.NumberFormatException: For input string: "80a"
```

## Overriding rules with exceptions

An overriding method may throw **fewer or narrower** checked exceptions than the parent —
never broader ones. (Unchecked exceptions are unrestricted.)

```java
class Parent {
    void connect() throws java.io.IOException { }
}
class Child extends Parent {
    @Override
    void connect() throws java.io.FileNotFoundException { }  // ✅ narrower
    // void connect() throws Exception { }                   // ❌ broader — compile error
}
```

> 💡 **Naming convention:** custom exception class names end in `Exception`, and use
> checked only when the caller can realistically **recover**.
