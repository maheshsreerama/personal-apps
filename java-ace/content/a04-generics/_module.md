---
title: Generics
icon: 🧬
blurb: Type parameters, bounds, wildcards (PECS), inference and erasure — write code once, let the compiler check every type.
---
# Generics
## Generic Basics
### [Why Generics?](lesson:a04-generics/01-why-generics)
- Checked at the door (compile time), erased in the warehouse (runtime)
- No casts, no ClassCastException from generic code
- `T` = type parameter, `Integer` in `Box<Integer>` = type argument
- Never raw types; never `Box<int>`
### [Generic Classes & Interfaces](lesson:a04-generics/02-generic-classes)
- `class Pair<T, U>` — `<T>` after the name
- Static members can't see `T`
- Fix it, forward it, or add to it (`extends Pair<String, Integer>`)
- One runtime class for all parameterizations; prefer a generic `record`
### [Generic Methods](lesson:a04-generics/03-generic-methods)
- `static <T> void printArray(T[] a)` — `<T>` before the return type
- `T` inferred per call; witness: `Cls.<Integer>m(x)`
- Worth it only when `T` links 2+ positions
- `int[]` never fits `T[]`; `Arrays.asList(int[])` has size 1
## Bounds & Wildcards
### [Bounded Type Parameters](lesson:a04-generics/04-bounded-type-parameters)
- `<T extends Number>` = Number or any subtype, unlocks `doubleValue()`
- `extends` for classes AND interfaces; `&` for extra bounds, class first
- Erasure goes to the first bound
- `T extends Comparable<? super T>` for sortable types
### [Wildcards & PECS](lesson:a04-generics/05-wildcards)
- `List<Integer>` is NOT a `List<Number>` (invariance)
- `? extends T` read-only producer, `? super T` write-in consumer
- PECS: Producer Extends, Consumer Super
- `List<?>` = any list, read as Object, add only null
## Inference & Erasure
### [Type Inference](lesson:a04-generics/06-type-inference)
- Diamond `<>` (Java 7), target typing (Java 8), `var` (Java 10)
- `var list = new ArrayList<>()` is `ArrayList<Object>`
- Chained calls lose the target type: `comparing(...).reversed()`
### [Type Erasure](lesson:a04-generics/07-type-erasure)
- Replace `T` with its bound, insert casts, add bridge methods
- No `new T()`, `T.class`, `instanceof List<String>`, `new List<String>[n]`
- Heap pollution: raw types, unchecked casts, generic varargs
- Reifiable = fully known at runtime (`List<?>`, `String[]`, `int`)
