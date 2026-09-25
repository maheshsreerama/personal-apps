---
title: Java 8: Lambdas & Streams
icon: λ
blurb: Lambdas, method references, the built-in functional interfaces, default and static interface methods, the Stream API with Collectors, and the other Java 8 additions (Optional, Base64, java.time, CompletableFuture, Nashorn).
---
# Java 8: Lambdas & Streams
## Lambdas
### [Functional Interfaces](lesson:a05-java8/01-functional-interfaces)
- Exactly one abstract method (SAM); default, static, private and public Object methods do not count
- `@FunctionalInterface` is optional: the compiler checks the rule for you
- A lambda needs a functional interface as its target type (`Object o = () -> {}` fails)
- `java.util.function` has 43 interfaces: Predicate, Function, Consumer, Supplier, operators, Bi- and Int/Long/Double versions
### [Lambda Expressions](lesson:a05-java8/02-lambda-expressions)
- `(params) -> body`: parentheses optional for one inferred parameter, braces optional for one expression
- Captured locals must be effectively final; fields can be changed
- `this` = the enclosing object; parameters cannot shadow locals
- Compiled to a private `lambda$` method + `invokedynamic`, not an anonymous class
### [Method References](lesson:a05-java8/03-method-references)
- Four kinds: static, bound (`obj::m`), unbound (`Type::m`, first argument is the receiver), constructor (`Type::new`)
- A bound receiver is evaluated once, when the reference is created
- Return values are silently discarded for void targets: `forEach(String::toUpperCase)` does nothing
## Built-in Functional Interfaces
### [Predicate](lesson:a05-java8/04-predicate)
- `boolean test(T)`: filter, removeIf, anyMatch/allMatch/noneMatch
- `and` / `or` / `negate` short-circuit; `isEqual`, `not` (Java 11)
- `a.or(b).and(c)` = `(a || b) && c`
### [Function](lesson:a05-java8/05-function)
- `R apply(T)`: map, comparing, computeIfAbsent, toMap
- `f.andThen(g)` = g(f(x)); `f.compose(g)` = f(g(x)); `Function.identity()`
- BiFunction has andThen only; ToIntFunction / IntFunction avoid boxing
### [Consumer](lesson:a05-java8/06-consumer)
- `void accept(T)`: forEach, ifPresent, peek
- `andThen` passes the same input to both; stops if the first throws
- BiConsumer for Map.forEach; ObjIntConsumer has no andThen
### [Supplier](lesson:a05-java8/07-supplier)
- `T get()`: no input, no default methods
- Lazy: orElseGet vs orElse, Stream.generate, logging with Supplier messages
- Factories: `ArrayList::new`, toCollection, ThreadLocal.withInitial
### [UnaryOperator](lesson:a05-java8/08-unary-operator)
- Extends `Function<T,T>`: same type in and out
- replaceAll, Stream.iterate, AtomicInteger.updateAndGet
- andThen/compose return Function, not UnaryOperator
### [BinaryOperator](lesson:a05-java8/09-binary-operator)
- Extends `BiFunction<T,T,T>`: two T in, one T out
- reduce, toMap merge function, Map.merge
- Static `minBy` / `maxBy(Comparator)`; ties keep the first argument
## Interface Upgrades
### [Default Methods](lesson:a05-java8/10-default-methods)
- Method with a body in an interface, so interfaces can evolve (Iterable.forEach)
- Conflict rules: class wins, then the more specific interface, else override and call `X.super.m()`
- Cannot be final, synchronized, or override equals/hashCode/toString
### [Static Interface Methods](lesson:a05-java8/11-static-interface-methods)
- Called only as `Interface.method()`, never through an object or an implementing class
- Not inherited by implementing classes or sub-interfaces
- Home for factories and helpers: Comparator.comparing, List.of, Function.identity
## Streams
### [Stream API](lesson:a05-java8/12-stream-api)
- Source → intermediate operations → terminal operation
- Lazy: nothing runs until the terminal operation
- A stream can be consumed only once and does not modify its source
### [Stream Operations](lesson:a05-java8/13-stream-operations)
- Intermediate: filter, map, flatMap, distinct, sorted, peek, limit, skip
- Terminal: forEach, collect, reduce, count, min/max, anyMatch, findFirst
- Stateless vs stateful operations, short-circuiting, primitive streams
### [Collectors](lesson:a05-java8/14-collectors)
- toList, toSet, toMap, joining, mapping
- toMap throws on duplicate keys unless you give a merge function
### [Collectors: counting](lesson:a05-java8/15-collectors-counting)
- `counting()` returns a Long
- Most useful as a downstream: groupingBy(f, counting())
### [Collectors: groupingBy](lesson:a05-java8/16-collectors-grouping-by)
- Map of key to List by default
- Downstream collectors: counting, mapping, summingInt, toSet
### [Collectors: partitioningBy](lesson:a05-java8/17-collectors-partitioning-by)
- Splits by a Predicate into `{false=..., true=...}`
- Both keys are always present
### [Collectors: summarizing](lesson:a05-java8/18-collectors-summarizing)
- summarizingInt/Long/Double give count, sum, min, average, max in one pass
- IntSummaryStatistics
### [Parallel Streams](lesson:a05-java8/19-parallel-streams)
- parallelStream() uses the common ForkJoinPool
- Needs stateless, associative, non-interfering operations; order is not guaranteed with forEach
## More Java 8
### [Optional](lesson:a05-java8/20-optional)
- A box that holds a value or nothing: a return type for "maybe no result"
- orElse is eager, orElseGet is lazy; avoid get() without a check
### [Base64](lesson:a05-java8/21-base64)
- Basic, URL-safe and MIME encoders and decoders
- Encoding is not encryption
### [Date-Time API](lesson:a05-java8/22-date-time-api)
- Immutable, thread-safe java.time classes: LocalDate, LocalTime, LocalDateTime, ZonedDateTime, Instant
- Period for dates, Duration for time; DateTimeFormatter
### [CompletableFuture](lesson:a05-java8/23-completablefuture)
- supplyAsync, thenApply, thenAccept, thenCombine, exceptionally
- Non-blocking pipelines on the common ForkJoinPool by default
### [Nashorn](lesson:a05-java8/24-nashorn)
- JavaScript engine from Java 8, removed in JDK 15
- Use the standalone nashorn-core dependency or GraalJS today
