---
title: Coding Interview Drills
icon: 🏋️
blurb: Hands-on interview programs — streams, strings, arrays, collections, threads and predict-the-output puzzles — each solved, run and analysed for complexity.
---
# Coding Interview Drills
## Stream Drills
### [Stream Drills — Basics](lesson:b06-coding-drills/01-stream-drills-basics)
- Source → intermediate ops (lazy) → one terminal op
- Sum/average on IntStream; average() and max() return Optionals
- distinct() dedupes in order; Set.add == false finds duplicates
- Streams are single-use; toList() is unmodifiable
### [Stream Drills — Advanced](lesson:b06-coding-drills/02-stream-drills-advanced)
- groupingBy(key, mapFactory, downstream): counting, mapping, maxBy
- partitioningBy always has true and false keys
- toMap needs a merge function for duplicate keys
- n-th highest: distinct → sorted desc → skip(n-1) → findFirst
## Classic Programs
### [String Programs](lesson:b06-coding-drills/03-string-programs)
- Immutable: build with StringBuilder, compare with equals
- Chars are numbers: c - 'a' indexes int[26], c - '0' is the digit
- Two pointers for reverse/palindrome; sliding window for longest unique substring
- split takes a regex and drops trailing empty strings
### [Array & Number Programs](lesson:b06-coding-drills/04-array-and-number-programs)
- One pass with running max/min beats sorting
- Two pointers and HashSet lookups turn O(n²) into O(n)
- Digits: n % 10 and n / 10; watch int overflow
- Math tricks: sum formula for missing number, XOR for pairs
## Collections & Threads
### [Collections Programs](lesson:b06-coding-drills/05-collections-programs)
- Count → HashMap + merge; first-seen order → LinkedHashMap/Set
- Sort map by value: entries → list → sort → LinkedHashMap
- Top K → PriorityQueue of size K; LRU → access-order LinkedHashMap
- retainAll/removeAll mutate: copy first, pass a HashSet
### [Multithreading Programs](lesson:b06-coding-drills/06-multithreading-programs)
- Turn taking: while (!myTurn) wait(); work; notifyAll()
- Producer-consumer: BlockingQueue put/take + poison pill
- Deadlock cure: global lock order or tryLock + back-off
- Singleton: holder or enum; DCL only with volatile
- Parallel sum: chunks, local long sums, invokeAll/allOf, shutdown
## Predict the Output
### [Predict-the-Output Marathon](lesson:b06-coding-drills/07-predict-the-output-marathon)
- == on objects compares references: string pool, Integer cache -128..127
- Static init once, parent first; then super, fields/blocks, constructor
- Overloads: exact/widening → boxing → varargs; most specific wins
- finally runs after return is evaluated; a return in finally wins
- int wraps silently; NaN != NaN; char + int is an int
