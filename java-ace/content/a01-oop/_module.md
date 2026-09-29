---
title: OOP Foundations
icon: 🧱
blurb: How the course project is built, then classes, objects, the four pillars, overloading and nested classes — the ground every Java interview starts on.
---
# OOP Foundations
## Getting Started
### [Course Project Setup](lesson:a01-oop/00-course-project-setup)
- Maven layout: `src/main/java` (examples), `src/test/java` (AppTest), `target/` (disposable output)
- Package = folder: run `CoreJava.Oops.X` by full name from the classpath root
- pom: GAV, `source`/`target` 18 (prefer `release` + LTS), scopes: JUnit test, Lombok provided, JavaFX compile
- `java File.java` runs the FIRST class in the file; a phase runs all earlier phases
## Basics
### [Classes and Objects](lesson:a01-oop/01-class-and-objects)
- Class = blueprint, object = heap instance with state, behaviour, identity
- `new`: allocate → zero fields → `super()` → initializers → constructor body
- Fields get defaults, locals do not; variables hold references (`==` = same object)
- Declare any constructor → no free default constructor
## The Four Pillars
### [Encapsulation](lesson:a01-oop/02-encapsulation)
- Private data + controlled methods; validate at every entry point
- `private` < package-private < `protected` < `public`
- Copy mutable fields in and out; immutability is the strongest form
### [Inheritance](lesson:a01-oop/03-inheritance)
- `extends` = IS-A; one class, many interfaces (no diamond of classes)
- Constructors and private members are not inherited; `super(...)` runs first
- Stop it with `final`, private constructors or `sealed`; favour composition
### [Polymorphism](lesson:a01-oop/04-polymorphism)
- Overloading = compile time; overriding = runtime dynamic dispatch
- Reference type decides WHAT compiles; object type decides WHICH runs
- Not polymorphic: static, private, final methods, fields, constructors
- Override: same signature, covariant return, wider access, narrower exceptions, `@Override`
### [Abstraction](lesson:a01-oop/05-abstraction)
- Show WHAT, hide HOW: callers use the abstract type
- Abstract class: cannot `new`, may have constructors, state, concrete methods
- `abstract` never with `final`, `private` or `static`
### [Abstract Class vs Interface](lesson:a01-oop/06-abstract-vs-interface)
- Abstract class = IS-A + shared state; interface = CAN-DO contract
- Interface: `public static final` fields, default/static (8), private (9) methods
- Default conflict: class wins, then more specific interface, else `X.super.m()`
## Overloading
### [Method Overloading](lesson:a01-oop/07-method-overloading)
- Same name, different parameter list; return type alone is not enough
- Resolution order: exact → widening → boxing → varargs, most specific wins
- Decided at compile time from static argument types; `null` can be ambiguous
### [Constructor Overloading](lesson:a01-oop/08-constructor-overloading)
- Several constructors, chosen by overloading rules
- Chain with `this(...)`, first statement only, no cycles
- Same types, different meaning → static factories; many options → Builder
## Nested Types
### [Nested and Inner Classes](lesson:a01-oop/09-inner-classes)
- Static nested (no outer object) vs inner: member, local, anonymous
- Inner = `outer.new Inner()`, hidden `this$0`, `Outer.this.x`; can leak the outer
- Captured locals must be effectively final (values are copied)
- Anonymous: no name, no constructor; for functional interfaces use a lambda
