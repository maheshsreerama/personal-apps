---
title: Collections Framework
icon: 🗂️
blurb: Lists, sets, queues, deques and maps — how each java.util collection works inside, what it costs, and which one to pick.
---
# Collections Framework
## Overview
### [Collections Framework Overview](lesson:a03-collections/00-collections-overview)
- Interfaces + implementations + algorithms, `java.util`, Java 1.2
- `Iterable` → `Collection` → `List` / `Set` / `Queue` / `Deque`; `Map` is separate
- `Collection` = root interface, `Collections` = static helpers
- Defaults: `ArrayList`, `HashSet`, `HashMap`, `ArrayDeque`
## Lists
### [ArrayList](lesson:a03-collections/01-arraylist)
- Resizable `Object[]`: `get` O(1), append amortised O(1)
- Capacity 10 on first add, grows 1.5× (`old + old >> 1`), never shrinks
- Middle insert/remove shifts: O(n)
- `remove(1)` = index, `remove(Integer.valueOf(1))` = value
### [LinkedList](lesson:a03-collections/02-linkedlist)
- Doubly linked nodes: `first`, `last`, `prev`/`next`
- O(1) at both ends, `get(i)` walks from the nearer end: O(n)
- Is a `List` AND a `Deque`; allows `null`
- Rarely beats `ArrayList`/`ArrayDeque` (memory, cache misses)
### [Vector](lesson:a03-collections/03-vector)
- Legacy (1.0) synchronized `ArrayList`
- Doubles when full (or grows by `capacityIncrement`)
- `Enumeration` via `elements()`: not fail-fast
- Per-method locks ≠ atomic compound actions
### [ListIterator](lesson:a03-collections/04-list-iterator)
- Cursor sits BETWEEN elements: n + 1 positions
- Both directions: `next`/`previous`, `nextIndex`/`previousIndex`
- `set` / `remove` act on the last returned element; `add` inserts before the cursor
- `listIterator(list.size())` to walk backwards from the end
## Stack & Queues
### [Stack](lesson:a03-collections/05-stack)
- LIFO: `push`, `pop`, `peek`, `empty`, `search` (1-based from top)
- Extends `Vector`: synchronized, and leaks index methods
- Empty `pop`/`peek` → `EmptyStackException`
- Modern replacement: `Deque<T> stack = new ArrayDeque<>()`
### [Queue](lesson:a03-collections/06-queue)
- FIFO: join at the tail, leave from the head
- Throw vs special value: `add`/`offer`, `remove`/`poll`, `element`/`peek`
- `offer` returns false on a full bounded queue; `add` throws
- BFS, task queues, producer/consumer (`BlockingQueue`)
### [PriorityQueue](lesson:a03-collections/07-priority-queue)
- Binary min-heap in an array; head = smallest
- `offer`/`poll` O(log n), `peek` O(1), `contains`/`remove(o)` O(n)
- `toString`/iteration are NOT sorted; poll to get order
- Max-heap: `Comparator.reverseOrder()`; no nulls; ties not FIFO
### [Deque](lesson:a03-collections/08-deque)
- Double-ended queue: 12 methods = first/last × insert/remove/examine × throw/null
- Stack methods: `push`/`pop`/`peek` work at the FIRST end
- Queue methods: `offer` at last, `poll` at first
- Sliding-window maximum, palindromes, undo history
### [ArrayDeque](lesson:a03-collections/09-arraydeque)
- Circular array with `head` and `tail` indexes that wrap around
- Default 16 slots (array length 17), grows when full, never shrinks
- No `null`, no index access, not thread-safe
- Faster than `Stack` as a stack and than `LinkedList` as a queue
## Sets
### [HashSet](lesson:a03-collections/10-hashset)
- Backed by a `HashMap`: element = key, dummy value
- Uniqueness = `hashCode` + `equals`; one `null` allowed
- O(1) average add/contains/remove, no order guarantee
### [TreeSet](lesson:a03-collections/11-treeset)
- Sorted set on a red-black tree (a `TreeMap` inside)
- O(log n); natural order or a `Comparator`
- Duplicates decided by `compareTo == 0`; no `null`
### [NavigableSet](lesson:a03-collections/12-navigableset)
- `lower` < `floor` ≤ x ≤ `ceiling` < `higher`
- `pollFirst`/`pollLast`, `descendingSet`
- `headSet`/`tailSet`/`subSet` are live range views
### [Iterating Sets](lesson:a03-collections/13-iterating-sets)
- for-each, `Iterator` (with safe `remove`), `forEach`, streams
- `HashSet` order is unspecified; `LinkedHashSet` keeps insertion order
- Remove only through the iterator or `removeIf`
## Maps
### [HashMap](lesson:a03-collections/14-hashmap)
- Array of buckets; index from the key's hash
- Collisions resolved with `equals`; long buckets become trees (Java 8)
- Resizes ×2 at load factor 0.75; one `null` key
### [LinkedHashMap](lesson:a03-collections/15-linkedhashmap)
- `HashMap` + doubly linked entries: predictable order
- Insertion order by default, access order on request
- `removeEldestEntry` → LRU cache in a few lines
### [TreeMap](lesson:a03-collections/16-treemap)
- Red-black tree, keys always sorted
- O(log n) get/put; `firstKey`, `lastKey`
- No `null` keys with natural ordering
### [NavigableMap](lesson:a03-collections/17-navigablemap)
- `floorKey`/`ceilingKey`/`lowerKey`/`higherKey`
- `headMap`/`tailMap`/`subMap` range views, `descendingMap`
- `pollFirstEntry`/`pollLastEntry`
### [IdentityHashMap](lesson:a03-collections/18-identityhashmap)
- Compares keys with `==`, not `equals`
- Uses `System.identityHashCode`
- For object graphs, proxies, serialization bookkeeping
### [WeakHashMap](lesson:a03-collections/19-weakhashmap)
- Keys held by weak references
- Entry disappears after GC once the key is unreachable elsewhere
- Metadata caches; interned String keys never go away
### [Hashtable](lesson:a03-collections/20-hashtable)
- Legacy (1.0) synchronized map
- No `null` keys or values
- Replace with `HashMap` or `ConcurrentHashMap`
### [Iterating Maps](lesson:a03-collections/21-iterating-maps)
- `entrySet()` for key + value (one lookup)
- `keySet()`, `values()`, `forEach((k, v) -> ...)`
- Remove safely with the iterator or `entrySet().removeIf`
## Iterators
### [Fail-Fast Iterators](lesson:a03-collections/22-fail-fast-iterators)
- `modCount` vs `expectedModCount` → `ConcurrentModificationException`
- Best-effort bug detector, not a thread-safety tool
- Modify only through the iterator itself
### [Fail-Safe Iterators](lesson:a03-collections/23-fail-safe-iterators)
- Concurrent collections never throw CME
- `CopyOnWriteArrayList`: snapshot iterator
- `ConcurrentHashMap`: weakly consistent view
