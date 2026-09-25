---
title: Design Patterns
icon: 🏛️
blurb: The 23 Gang of Four patterns plus Null Object, MVC, MVVM and DAO — the intent, structure, JDK/Spring examples and look-alike differences that interviews probe.
---
# Design Patterns
## Overview
### [Design Patterns Overview](lesson:a10-patterns/00-design-patterns-overview)
- Pattern = named, proven solution to a recurring design problem
- GoF 23: 5 Creational, 7 Structural, 11 Behavioral
- Program to an interface; favour composition over inheritance
- Interview answer: intent → problem → structure → trade-offs → real example
## Creational
### [Singleton](lesson:a10-patterns/01-singleton)
- Private constructor + static field + static accessor
- Course version is lazy and NOT thread-safe
- Thread-safe: eager, synchronized, DCL + volatile, holder idiom, enum
- Enum beats reflection, serialization and cloning
### [Factory](lesson:a10-patterns/02-factory)
- Course version = Simple Factory, not GoF Factory Method
- Factory Method: subclass decides; Abstract Factory: families
- Static factories: `valueOf`, `of`, `EnumSet.of`
- Never return null; registry of `Supplier`s for open/closed
### [Builder](lesson:a10-patterns/03-builder)
- Required in the constructor, optional in the chain, rules in `build()`
- Static nested builder + private product constructor
- Immutable product; copy mutable inputs
- GoF form adds a Director; `HttpRequest.newBuilder()`
### [Prototype](lesson:a10-patterns/04-prototype)
- Create by copying a configured master
- `Cloneable` + `super.clone()`: shallow, no constructor runs
- Deep-copy mutable fields; prefer copy constructors
- Registry returns copies, never the master
## Structural
### [Adapter](lesson:a10-patterns/05-adapter)
- Converts an incompatible interface into the one the client expects
- Object adapter (composition) vs class adapter (inheritance)
- `Arrays.asList`, `InputStreamReader`, `Executors.callable`
### [Bridge](lesson:a10-patterns/06-bridge)
- Split abstraction from implementation; both vary independently
- m + n classes instead of m × n
- Shape HAS-A DrawAPI; JDBC API + drivers
### [Composite](lesson:a10-patterns/07-composite)
- Tree of part-whole; leaf and composite share one interface
- Composite delegates to children recursively
- Transparent vs safe child management; watch cycles
### [Decorator](lesson:a10-patterns/08-decorator)
- Same interface, wraps, adds behaviour; stackable
- Order of wrapping matters
- `java.io` streams, `Collections.unmodifiableList`
### [Facade](lesson:a10-patterns/09-facade)
- One simple entry point to a complex subsystem
- Does not hide the subsystem, just simplifies it
- `JdbcTemplate`, SLF4J, service layer
### [Flyweight](lesson:a10-patterns/10-flyweight)
- Share intrinsic state; pass extrinsic state in
- Factory caches one object per key
- Flyweights must be immutable; `Integer.valueOf` cache -128..127
### [Proxy](lesson:a10-patterns/11-proxy)
- Same interface, controls access to the real subject
- Virtual (lazy), protection, remote, caching, logging
- JDK dynamic proxies vs CGLIB; Spring AOP self-invocation trap
## Behavioral
### [Chain of Responsibility](lesson:a10-patterns/12-chain-of-responsibility)
- Handle it or pass it to the next handler
- Sender knows only the head of the chain
- Unhandled requests fall off the end; servlet filters
### [Command](lesson:a10-patterns/13-command)
- A request wrapped as an object with `execute()`
- Invoker (remote) decoupled from receiver (light)
- Enables undo, queues, logging; `Runnable` is a command
### [Interpreter](lesson:a10-patterns/14-interpreter)
- One class per grammar rule; `interpret(context)`
- Terminal vs non-terminal (And/Or) expressions form a tree
- Fine for tiny languages; regex and SpEL in practice
### [Iterator](lesson:a10-patterns/15-iterator)
- Traverse a collection without exposing its structure
- `Iterable` + `Iterator` = for-each support
- `hasNext()` / `next()` / `remove()`; fail-fast
### [Mediator](lesson:a10-patterns/16-mediator)
- Colleagues talk through a hub, not to each other
- Many-to-many links become one-to-many
- Chat room: the sender does not receive its own message
### [Memento](lesson:a10-patterns/17-memento)
- Snapshot state for undo without breaking encapsulation
- Originator creates, Caretaker stores, Memento is opaque
- Keep mementos immutable
### [Null Object](lesson:a10-patterns/18-null-object)
- A do-nothing object instead of `null`
- Removes null checks; `isNil()` in the example
- Relatives: `Collections.emptyList()`, `Optional`
### [Observer](lesson:a10-patterns/19-observer)
- Subject notifies all registered observers on change
- One-to-many, loose coupling; push vs pull
- `java.util.Observable` deprecated; listeners, Flow API
### [State](lesson:a10-patterns/20-state)
- Behaviour changes with an internal state object
- State classes replace a big switch
- Context delegates to the current state
### [Strategy](lesson:a10-patterns/21-strategy)
- Interchangeable algorithms behind one interface
- Context holds a strategy chosen by the client
- `Comparator`; lambdas make strategies one-liners
### [Template Method](lesson:a10-patterns/22-template-method)
- `final` skeleton in the superclass, steps in subclasses
- Hollywood principle: "don't call us, we'll call you"
- `AbstractList`, `JdbcTemplate`
### [Visitor](lesson:a10-patterns/23-visitor)
- Add operations without changing element classes
- Double dispatch: `accept(visitor)` → `visitor.visit(this)`
- Easy new operations, hard new element types
## Architectural
### [MVC](lesson:a10-patterns/24-mvc)
- Model = data, View = display, Controller = glue
- Controller updates the model and refreshes the view
- Spring MVC: `DispatcherServlet` front controller
### [MVVM](lesson:a10-patterns/25-mvvm)
- ViewModel exposes observable properties for data binding
- Needs JavaFX `javafx-base` properties
- Stray `;;` import compiles only with `--release 17`
### [DAO](lesson:a10-patterns/26-dao)
- Interface hides how data is stored (CRUD methods)
- Swap JDBC/JPA/in-memory without touching callers
- Lombok `@Getter/@Setter`; example prints nothing (`getById` returns null)
