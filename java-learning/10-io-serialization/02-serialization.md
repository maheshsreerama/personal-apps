# Serialization — Saving Objects

## What is serialization?

Converting an object into a **byte stream** (to save to disk or send over a network) and
back (**deserialization**). A class opts in by implementing the marker interface
`Serializable` (no methods — just a flag).

```java
import java.io.*;

public class SerializeDemo {
    static class User implements Serializable {
        private static final long serialVersionUID = 1L;

        String name;
        int score;
        transient String password;      // transient: excluded from the stream!

        User(String name, int score, String password) {
            this.name = name; this.score = score; this.password = password;
        }
        @Override public String toString() {
            return name + " score=" + score + " password=" + password;
        }
    }

    public static void main(String[] args) throws Exception {
        User original = new User("asha", 990, "secret123");
        System.out.println("before : " + original);

        // serialize → bytes
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (ObjectOutputStream out = new ObjectOutputStream(bytes)) {
            out.writeObject(original);
        }
        System.out.println("serialized to " + bytes.size() + " bytes");

        // deserialize ← bytes
        try (ObjectInputStream in = new ObjectInputStream(
                new ByteArrayInputStream(bytes.toByteArray()))) {
            User restored = (User) in.readObject();
            System.out.println("after  : " + restored);
        }
    }
}
```

**Output:**

```
before : asha score=990 password=secret123
serialized to 95 bytes
after  : asha score=990 password=null
```

Note the password came back **null** — `transient` fields are skipped and get their
default value on deserialization.

## The rules

- Every field must also be serializable, or be `transient` — otherwise
  `NotSerializableException` at runtime.
- `static` fields are never serialized (they belong to the class, not the object).
- Constructors do **not** run during deserialization (of the serializable class itself).
- If a parent class isn't serializable, its fields are re-initialized via its no-arg
  constructor.

## serialVersionUID — version insurance

The JVM stamps each serialized object with a class version. If the class changes and the
IDs don't match, deserialization fails with `InvalidClassException`.

```java
private static final long serialVersionUID = 1L;
```

Declare it explicitly. Without it, the compiler generates one from the class structure —
so *any* field change breaks old data. With it, you control compatibility.

| Change | Safe with same UID? |
|--------|--------------------|
| add a field | ✅ old data reads it as default |
| remove a field | ✅ extra data ignored |
| rename/retype a field | ⚠️ value silently lost / error |
| change class hierarchy | ❌ usually breaks |

## Customizing with writeObject/readObject

```java
import java.io.*;

public class CustomSer {
    static class Vault implements Serializable {
        private static final long serialVersionUID = 1L;
        transient String secret;                 // don't store plainly

        Vault(String secret) { this.secret = secret; }

        private void writeObject(ObjectOutputStream out) throws IOException {
            out.defaultWriteObject();
            out.writeObject(new StringBuilder(secret).reverse().toString()); // toy "cipher"
        }
        private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
            in.defaultReadObject();
            secret = new StringBuilder((String) in.readObject()).reverse().toString();
        }
    }

    public static void main(String[] args) throws Exception {
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        try (var out = new ObjectOutputStream(bytes)) { out.writeObject(new Vault("tOpSecret")); }
        try (var in = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
            Vault v = (Vault) in.readObject();
            System.out.println("restored secret = " + v.secret);
        }
    }
}
```

**Output:**

```
restored secret = tOpSecret
```

## Serialization in the real world (honest notes)

- Java native serialization is **rarely used for new systems** — JSON (Jackson/Gson),
  protobuf, or database mapping are preferred: readable, cross-language, safer.
- **Security:** never deserialize untrusted bytes — crafted streams can execute code
  ("deserialization gadget" attacks). Use `ObjectInputFilter` if you must.
- Records serialize cleanly (fields restored through the canonical constructor).
- Android note: prefer `Parcelable` on Android — it's the platform's faster equivalent.

> 💡 **Interview line:** "`transient` skips a field, `static` was never the object's to
> begin with, and `serialVersionUID` is my contract with old data."
