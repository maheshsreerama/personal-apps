---
title: Collections Internals
icon: 🔬
blurb: What really happens inside HashMap, ArrayList, LinkedList, TreeMap, HashSet and LinkedHashMap, measured on JDK 21, plus an LRU cache built two ways.
---
# Collections Internals
## Hash Tables
### [HashMap Internals](lesson:b04-collections-internals/01-hashmap-internals)
- Hash, Mask, Match: `h ^ (h >>> 16)`, `& (n - 1)`, then cached hash, `==`, `equals`
- 16, 0.75, 12: the 13th put doubles the table; lo stays at j, hi moves to j + oldCap
- Treeify: 8 up, 6 down, 64 floor; trees help only Comparable colliding keys
- Not thread-safe: lost puts, wrong size (Java 7 resize could even loop forever)
## Lists
### [ArrayList vs LinkedList Internals](lesson:b04-collections-internals/02-arraylist-vs-linkedlist-internals)
- ArrayList: one Object[]; 10 on first add, then grows to old + old/2; never shrinks by itself
- LinkedList: 24-byte Node(prev, item, next); node(i) walks from the nearer end
- Array copies, list chases: middle inserts are 20x faster in ArrayList
- Use removeIf, presize, and ArrayDeque for queues
## Trees & Sets
### [TreeMap & HashSet Internals](lesson:b04-collections-internals/03-treemap-and-hashset-internals)
- TreeMap = red-black tree; only compareTo, never hashCode/equals
- Root black, no red-red, same blacks on every path: height ≤ 2·log₂(n+1)
- Red uncle: recolour; black uncle: at most 2 rotations
- Sets are maps: add = put(e, PRESENT) == null; LinkedHashSet uses a LinkedHashMap
## Cache Design
### [LRU Cache with LinkedHashMap](lesson:b04-collections-internals/04-lru-cache-with-linkedhashmap)
- Map finds, list orders: HashMap + doubly linked list, all O(1)
- `true` in the constructor, `>` in removeEldestEntry
- Hand-built: sentinels, store the key in the node, evict head.next
- Every get writes: lock every call or use Caffeine; scans can give 0 % hits
