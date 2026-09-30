---
title: JVM Internals & Memory
icon: 🧠
blurb: How the JVM loads classes, lays out memory, collects garbage and leaks it — the internals behind every "why is my service out of memory?" question.
---
# JVM Internals & Memory
## Loading & Memory
### [Class Loading](lesson:b02-jvm/01-class-loading)
- Load → Link (verify, prepare, resolve) → Initialize, lazily on first active use
- Bootstrap (null) → Platform → Application; ask the parent first
- Class identity = name + defining loader
- ClassNotFoundException = your lookup failed; NoClassDefFoundError = the JVM's
### [JVM Memory Areas](lesson:b02-jvm/02-memory-areas)
- Per thread: PC, stack, native stack; shared: heap, Metaspace, code cache
- Locals in frames; every object and array in the heap
- Statics and the string pool live in the heap (HotSpot 8+); PermGen → Metaspace
- RSS > -Xmx: stacks, Metaspace, code cache, direct buffers are native
## Garbage Collection
### [Garbage Collection](lesson:b02-jvm/03-garbage-collection)
- Garbage = unreachable from GC roots; cycles are collected
- Eden → Survivors (age + 1, max 15) → Old; most objects die young
- Serial, Parallel, G1 (default since 9), ZGC (sub-ms pauses)
- System.gc() is a hint; finalize() is deprecated for removal
### [Reference Types](lesson:b02-jvm/04-reference-types)
- Strong > Soft > Weak > Phantom
- Soft: cleared before OOM; Weak: next GC; Phantom: get() is always null
- WeakHashMap = weak keys, strong values
- Cleaner replaces finalize(); never capture the object in the action
## Troubleshooting
### [Memory Leaks & OOM](lesson:b02-jvm/05-memory-leaks-and-oom)
- Leak = still reachable but no longer needed
- The OOM message names the area: heap, Metaspace, native thread, direct buffer
- Histogram → heap dump → dominator tree → path to GC roots
- Don't catch OOM: dump, exit, restart
