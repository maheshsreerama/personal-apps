# 2.4 Behavioral Patterns II — Template Method, Chain of Responsibility, Iterator, Mediator, Memento, Visitor, Null Object

> The supporting cast. Chain of Responsibility powers the Logger and ATM questions; Template Method appears in any "common workflow, varying steps" problem; the rest you need at *recognition* depth.

---

## Template Method — fixed skeleton, pluggable steps

**Trigger:** several workflows share the same step sequence but differ in specific steps (report generation, data pipelines, game loops, onboarding flows).

```java
public abstract class DataExporter {
    // the template: final so subclasses can't break the sequence
    public final void export(Query q, Path out) {
        List<Row> rows = fetch(q);
        byte[] bytes = format(rows);          // varying step
        write(out, bytes);
        afterExport(out);                     // hook: optional override, default no-op
    }
    protected List<Row> fetch(Query q) { /* shared impl */ return db.run(q); }
    protected abstract byte[] format(List<Row> rows);          // must vary
    protected void afterExport(Path out) {}                    // may vary
}
public class CsvExporter extends DataExporter {
    protected byte[] format(List<Row> rows) { /* csv */ }
}
```

**Hollywood principle:** "don't call us, we'll call you" — the parent drives, children fill blanks. Modern alternative to mention: pass steps as lambdas/strategies instead of subclassing ("Template via composition") — fewer classes, no inheritance lock-in. JDK citation: `AbstractList`, servlet `service()`→`doGet/doPost`.

## Chain of Responsibility — pass the request down a pipeline

**Trigger:** logger levels, ATM cash denominations, approval workflows (manager → director → VP), middleware/filters, support-ticket escalation.

```java
public abstract class LogHandler {
    protected final LogLevel level;
    protected LogHandler next;                                 // the chain link
    protected LogHandler(LogLevel l) { level = l; }
    public LogHandler setNext(LogHandler n) { next = n; return n; }

    public void handle(LogLevel msgLevel, String msg) {
        if (msgLevel.ordinal() >= level.ordinal()) write(msg); // handle...
        if (next != null) next.handle(msgLevel, msg);          // ...and/or pass on
    }
    protected abstract void write(String msg);
}
// ConsoleHandler(INFO) → FileHandler(WARN) → AlertHandler(ERROR)
```

Two flavors — **say which you're building**: (a) *first-match-wins* (ATM dispenser, support escalation — stop after handling); (b) *process-and-continue* (loggers, servlet filters — everyone gets a look). Client holds only the head; chain assembly is configuration.

```mermaid
flowchart LR
    C[Client] --> H1[ConsoleHandler ≥ INFO] --> H2[FileHandler ≥ WARN] --> H3[AlertHandler ≥ ERROR] --> X[end]
```

## Iterator — sequential access without exposing structure

You use it every day (`for (Item i : cart)`). Interview depth needed: implement `Iterable<T>`/`Iterator<T>` on your own class so internals stay private.

```java
public class Playlist implements Iterable<Song> {
    private final List<Song> songs = new ArrayList<>();
    @Override public Iterator<Song> iterator() {
        return new Iterator<>() {                               // could be shuffled, lazy, filtered…
            private int i = 0;
            public boolean hasNext() { return i < songs.size(); }
            public Song next() { if (!hasNext()) throw new NoSuchElementException(); return songs.get(i++); }
        };
    }
}
```

Points worth a sentence: multiple simultaneous traversals (each `iterator()` call = fresh cursor), `ConcurrentModificationException` is fail-fast detection of structural change mid-iteration, and custom iterators can encode policy (tree in-order, paginated fetch).

## Mediator — a hub instead of a mesh

**Trigger:** n objects all talking to each other (chat rooms, air-traffic control, complex form widgets, auction houses). n² pairwise links → each talks only to the mediator.

```java
public class ChatRoom {                                        // the mediator
    private final Map<String, User> users = new HashMap<>();
    public void send(String from, String to, String msg) { users.get(to).receive(from, msg); }
    public void broadcast(String from, String msg) {
        users.values().stream().filter(u -> !u.name().equals(from))
             .forEach(u -> u.receive(from, msg));
    }
}
```

Colleagues stay dumb and reusable; interaction rules live in one place. Risk to admit: the mediator can grow into a god class — split by interaction type when it does. Observer vs Mediator: observer broadcasts "something happened" one-way; mediator *coordinates* multi-party conversations with logic.

## Memento — snapshot state without breaking encapsulation

**Trigger:** save/restore, checkpoints, transactional rollback of an object, game saves.

```java
public class Editor {
    private StringBuilder text = new StringBuilder();
    public record Snapshot(String text) {}                     // opaque to outsiders
    public Snapshot save() { return new Snapshot(text.toString()); }
    public void restore(Snapshot s) { text = new StringBuilder(s.text()); }
}
// caretaker (History) stores Snapshots but cannot peek inside or edit them
```

Key phrase: the *originator* creates/consumes snapshots; the *caretaker* only stores them. Pairs with Command for undo (Ch 2.3 Q3).

## Visitor — new operations over a fixed object family

**Trigger:** stable class hierarchy (AST nodes, shapes, file nodes) + ever-growing operations (print, evaluate, export, lint). Double dispatch via `accept`:

```java
public interface Shape { <R> R accept(ShapeVisitor<R> v); }
public record Circle(double r) implements Shape {
    public <R> R accept(ShapeVisitor<R> v) { return v.visit(this); }
}
public interface ShapeVisitor<R> { R visit(Circle c); R visit(Rect r); }
// AreaVisitor, PerimeterVisitor, SvgExportVisitor — new ops, zero edits to shapes
```

Trade: adding operations is easy, adding *element types* touches every visitor — the exact inverse of polymorphic methods. **Modern Java note:** sealed interfaces + pattern-matching `switch` (Java 21) now cover most Visitor use cases with less ceremony — mentioning this is a strong currency signal.

## Null Object — a do-nothing implementation instead of null

```java
public final class NoDiscount implements DiscountPolicy {
    public long discount(long amount) { return 0; }            // safe default, no null checks
}
```

Kills scattered `if (policy != null)`. Use for optional collaborators (logger, discount, listener). Don't overuse — a Null Object that hides a genuine error is worse than an NPE.

---

## ✅ Key Takeaways
- Template Method = frozen skeleton + abstract steps + optional hooks; prefer lambda-composition when no shared state.
- CoR = pipeline of handlers; know first-match vs process-all flavors; it's the Logger/ATM answer.
- Mediator centralizes n² chatter; Memento = opaque snapshots; Visitor = operations over a sealed family (or use sealed+switch).
- Iterator/Null Object: small, but naming them at the right moment earns points.

## 💡 Tips & Tricks
- ATM cash dispensing = CoR over denominations (2000 → 500 → 100), first-match style with remainder passing — a 5-minute win if you've rehearsed it.
- Approval-workflow questions ("expense > ₹50k needs VP") are CoR verbatim: handler = approver level.
- If the interviewer's problem has both a fixed pipeline *and* varying steps, Template (vertical: skeleton) and CoR (horizontal: handlers) can coexist — say which axis each covers.
- Visitor only when they say the hierarchy is stable; otherwise answer "polymorphic method" and save 10 minutes.

## 🎯 Interview Q&A

**Q1. Template Method vs Strategy — both vary an algorithm. Choose.**
> Template varies *steps inside* a fixed skeleton via inheritance: one workflow, blanks filled by subclasses; the parent controls order. Strategy varies the *whole algorithm* via composition: swappable at runtime, testable standalone, no inheritance chain. Default to Strategy for flexibility; choose Template when the invariant sequence itself is the asset to protect (and mark the template `final`). Middle path I often take: template class whose steps are injected functions.

**Q2. Design a logging framework's level handling. Why CoR over a simple if-ladder?**
> Handlers (console/file/alert) each carry a threshold and a `next`. Win over if-ladder: the *pipeline is data, not code* — reconfigure order, add a RemoteHandler, or give prod vs dev different chains without touching logic; each handler is single-responsibility and unit-testable. It's process-and-continue flavor: every handler sees every message and decides independently. Full design in Ch 5.10.

**Q3. How does Visitor achieve double dispatch, and why is it needed?**
> Java picks methods by the *static* type of arguments — `print(shape)` can't pick `print(Circle)` at runtime. Visitor routes through two virtual calls: `shape.accept(v)` dispatches on the shape's runtime type; inside, `v.visit(this)` dispatches on the visitor with `this` statically typed as `Circle`. Two single dispatches compose into behavior chosen by *both* types. Needed whenever an operation depends on the concrete element type but can't live inside the element.

**Q4. Your Mediator is becoming a god class. Now what?**
> Expected failure mode — centralizing interaction logic concentrates it. Fixes: split by conversation type (SeatSelectionMediator vs PaymentMediator); demote simple notifications to Observer events and keep only genuine multi-party coordination in the mediator; extract rule objects (Strategy) the mediator merely sequences. If most interactions are broadcast-shaped, the honest refactor is to an event bus and delete the mediator.

**Q5. Iterator seems trivial — what's actually worth discussing?**
> Three things. Encapsulation: iteration without exposing whether it's an array, tree, or remote pages — I can change structure without breaking clients. Policy iterators: shuffle-play, filtered views, BFS vs DFS over a composite — the traversal *algorithm* is a first-class object. Concurrency: fail-fast iterators + `ConcurrentModificationException`, vs snapshot iterators (`CopyOnWriteArrayList`) vs weakly-consistent ones (`ConcurrentHashMap`) — choosing the right collection *is* choosing iterator semantics (Part 3).
