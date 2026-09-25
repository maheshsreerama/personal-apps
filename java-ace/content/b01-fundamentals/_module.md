---
title: Java Fundamentals
icon: 🎯
blurb: The platform, types, operators, object contracts, exceptions and design principles that every Java interview checks first.
---
# Java Fundamentals
## Platform
### [JDK vs JRE vs JVM](lesson:b01-fundamentals/01-jdk-jre-jvm)
- JDK ⊃ JRE ⊃ JVM: tools ⊃ class library ⊃ bytecode engine
- Bytecode is portable; the JVM is platform specific
- javac compiles to bytecode; interpreter + JIT (C1, C2) run it
- Class-file major version = Java version + 44
## Language Basics
### [Data Types & Casting](lesson:b01-fundamentals/02-data-types-and-casting)
- 8 primitives, sizes 1-2-4-8 / 4-8 / 2; char is unsigned
- Widening is implicit; narrowing needs a cast and keeps the low bits
- byte + byte = int; `+=` hides a cast
- Overflow wraps silently; 0.1 + 0.2 != 0.3 (use BigDecimal)
### [Operators & Control Flow](lesson:b01-fundamentals/03-operators-and-control-flow)
- `&&` / `||` short-circuit; `&` / `|` always evaluate both sides
- `i++` returns the old value; `i = i++` leaves i unchanged
- `>>` keeps the sign, `>>>` fills with zeros
- switch falls through without break; labeled break exits outer loops
### [Pass-by-Value](lesson:b01-fundamentals/04-pass-by-value)
- Java always passes a copy of the variable
- For objects the copy is the reference: mutation is visible, reassignment is not
- A swap method cannot work in Java
### [Access Modifiers & Packages](lesson:b01-fundamentals/05-access-modifiers-and-packages)
- private < default (package) < protected < public
- protected = package + subclasses (through their own type)
- Overrides may widen access, never narrow it
- Package = folder + namespace; import is only a shortcut
## Objects
### [Object Class, equals & hashCode](lesson:b01-fundamentals/06-object-class-equals-hashcode)
- Every class extends Object: equals, hashCode, toString, getClass, clone, wait/notify
- Equal objects must have equal hash codes
- Override equals and hashCode together, or HashMap/HashSet break
### [String Pool & Immutability](lesson:b01-fundamentals/07-string-pool-and-immutability)
- Literals are interned in the pool (on the heap since Java 7)
- `new String("a")` makes a new object; `intern()` returns the pooled one
- Immutable: safe to share, cache the hash, use as map keys
- Compare strings with equals, never ==
### [Immutable Classes](lesson:b01-fundamentals/08-immutable-classes)
- final class, private final fields, no setters
- Defensive copies in and out
- Records give shallow immutability for free
### [Comparable vs Comparator](lesson:b01-fundamentals/09-comparable-vs-comparator)
- Comparable = natural order inside the class (compareTo)
- Comparator = external, many orders (compare, comparing, thenComparing)
- Keep compareTo consistent with equals
### [Initialization Order](lesson:b01-fundamentals/12-initialization-order)
- Static blocks once per class, parent before child
- Per object: parent constructor, then field initializers and instance blocks, then constructor body
- this(...) / super(...) must be the first statement
## Exceptions
### [Exception Fundamentals](lesson:b01-fundamentals/10-exceptions-fundamentals)
- Throwable → Error / Exception → RuntimeException
- Checked must be caught or declared; unchecked need not
- try / catch / finally; throw vs throws
### [Advanced Exceptions](lesson:b01-fundamentals/11-exceptions-advanced)
- try-with-resources closes in reverse order; close failures become suppressed
- A return in finally swallows exceptions
- Custom exceptions: keep the cause, pick checked vs unchecked deliberately
## Design
### [SOLID Principles](lesson:b01-fundamentals/13-solid-principles)
- S: one reason to change; O: extend without editing
- L: subtypes must be substitutable
- I: small interfaces; D: depend on abstractions
