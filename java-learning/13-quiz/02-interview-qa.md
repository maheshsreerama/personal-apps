# Rapid-Fire Interview Q&A

Fifty questions, straight answers. Each links back to a part of this app for the deep dive.

## Basics & OOP

**1. Why is Java platform independent?**
Source compiles to bytecode; any platform's JVM runs it. (Part 1)

**2. JDK vs JRE vs JVM?**
JDK = tools + JRE; JRE = libraries + JVM; JVM executes bytecode.

**3. Why is `main` static?**
So the JVM can invoke it without constructing an object first.

**4. Is Java pass-by-reference?**
No — strictly pass-by-value. For objects, the value copied is the reference.

**5. Four pillars of OOP?**
Encapsulation, abstraction, inheritance, polymorphism. (Part 2)

**6. Overloading vs overriding?**
Overloading: same name, different parameters, compile-time. Overriding: same signature
in a subclass, runtime dispatch.

**7. Why no multiple class inheritance?**
The diamond ambiguity — two parents defining the same method. Interfaces (with explicit
conflict resolution for defaults) provide the safe alternative.

**8. Abstract class vs interface in one line?**
Shared state & constructors → abstract class; pure capability contract, multiple
inheritance → interface.

**9. Can a constructor be private / final / overridden?**
Private yes (singletons). Final no. Overridden no — constructors aren't inherited.

**10. What does `final` do in its three positions?**
Variable: single assignment. Method: no overriding. Class: no subclassing.

## Strings & Collections

**11. Why are Strings immutable?**
Pooling, thread safety, safe hash keys, security (paths/URLs can't change under you). (Part 3)

**12. `==` vs `equals()` for Strings?**
`==` compares references; `equals` compares characters. Always `equals`.

**13. String vs StringBuilder vs StringBuffer?**
Immutable / mutable-fast / mutable-synchronized-legacy.

**14. ArrayList vs LinkedList?**
Array-backed O(1) access vs doubly-linked O(1) end-operations; ArrayList wins most real
workloads. (Part 6)

**15. HashMap vs Hashtable?**
HashMap: unsynchronized, allows one null key. Hashtable: legacy synchronized. Modern
concurrent choice: ConcurrentHashMap.

**16. How does HashMap work?**
hashCode → bucket; collisions chain (tree-ify at 8); resize at load factor 0.75.

**17. The equals/hashCode contract?**
Equal objects MUST share a hash code; override both together or hash collections break.

**18. Fail-fast vs fail-safe iterators?**
Fail-fast throw `ConcurrentModificationException` on outside modification (ArrayList);
fail-safe iterate a snapshot (CopyOnWriteArrayList, ConcurrentHashMap).

**19. Comparable vs Comparator?**
Natural order inside the class vs pluggable external orderings.

**20. HashSet vs TreeSet?**
O(1) unordered vs O(log n) sorted with navigation methods.

## Exceptions & Generics

**21. Checked vs unchecked?**
Checked = declared or caught, recoverable conditions. Unchecked = RuntimeException,
programming bugs. (Part 5)

**22. throw vs throws?**
`throw` raises one exception now; `throws` declares what a method may raise.

**23. Can `finally` be skipped?**
Only by `System.exit()`, JVM crash, or an infinite loop before it.

**24. try-with-resources?**
Auto-closes `AutoCloseable`s in reverse order, even on exception — no leak boilerplate.

**25. What is type erasure?**
Generics vanish after compilation; `List<String>` and `List<Integer>` share one runtime
class. (Part 7)

**26. PECS?**
Producer Extends, Consumer Super — `? extends` to read, `? super` to write.

## Multithreading

**27. Runnable vs Thread subclassing?**
Runnable — separates task from mechanism, lambda-friendly, pool-compatible. (Part 8)

**28. start() vs run()?**
`start()` creates a new thread; calling `run()` yourself is an ordinary method call.

**29. synchronized — what does it guarantee?**
Mutual exclusion on a monitor + visibility (happens-before) for guarded state.

**30. volatile vs synchronized?**
volatile = visibility only (flags); synchronized = visibility + atomicity for compound
actions.

**31. wait() vs sleep()?**
wait releases the lock and needs notify; sleep holds locks and just pauses.

**32. What causes deadlock and how do you prevent it?**
Circular lock waiting; prevent with global lock ordering or tryLock timeouts.

**33. Why use a thread pool?**
Threads are expensive; pools bound resource use and reuse workers — `ExecutorService`.

**34. Callable vs Runnable?**
Callable returns a value and can throw checked exceptions; retrieved via `Future.get()`.

**35. What's special about virtual threads (Java 21)?**
JVM-scheduled, ultra-cheap threads — blocking IO scales to millions of tasks.

## Java 8+

**36. What is a functional interface?**
Exactly one abstract method; the target type for lambdas. (Part 9)

**37. Predicate / Function / Consumer / Supplier shapes?**
T→boolean, T→R, T→void, ()→T.

**38. Intermediate vs terminal stream operations?**
Intermediate: lazy, return streams (filter/map). Terminal: eager, produce results
(collect/count). No terminal = nothing executes.

**39. map vs flatMap?**
1→1 transform vs 1→many flattened.

**40. Why Optional?**
Makes possible absence part of the method's type, forcing callers to decide — fewer NPEs.

**41. When is parallelStream() a bad idea?**
Small data, IO-bound work, ordered dependencies, or side effects — overhead beats gains.

**42. Period vs Duration?**
Calendar units (years/months/days) vs clock units (hours/seconds).

## JVM & memory

**43. Stack vs heap?**
Stack: per-thread frames, locals, references. Heap: all objects, shared, GC-managed.

**44. What triggers garbage collection eligibility?**
No live references reach the object (unreachable from GC roots).

**45. Can you force GC?**
No — `System.gc()` is only a suggestion.

**46. String pool lives where?**
In the heap (since Java 7); literals are interned there.

**47. StackOverflowError vs OutOfMemoryError?**
Runaway recursion exhausts a thread stack vs heap exhaustion from too many live objects.

**48. What is JIT compilation?**
The JVM compiles hot bytecode paths to native code at runtime — interpreted start,
compiled cruise.

**49. Strong vs weak references?**
Strong keeps objects alive; `WeakReference` allows collection — used in caches
(`WeakHashMap`).

**50. Java is compiled or interpreted?**
Both: compiled to bytecode ahead of time, interpreted + JIT-compiled at runtime.

> 🎯 Done! If any answer felt shaky, the part reference tells you which section of this
> app to reread. Revisit this list weekly — spaced repetition wins interviews.
