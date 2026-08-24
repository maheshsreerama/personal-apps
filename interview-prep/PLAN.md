# The 84-day plan

Five phases, twelve weeks, 84 days. Every seventh day consolidates; days 14, 28, 42, 63, 84 are phase gates you score yourself through.

| Phase | Weeks | Focus |
| --- | --- | --- |
| 1 | 1–2 | Foundations |
| 2 | 3–4 | Structures & Articulation |
| 3 | 5–6 | Interview-Ready Sprint |
| 4 | 7–9 | In-Season |
| 5 | 10–12 | Peak & Close |

## Week 1 — Arrays, pointers, windows, search, stacks

### Day 1 — Arrays & Hashing  ·  6h

- **180m** — DSA — complexity, frequency-map pattern, HashMap internals
- **120m** — Java — equals/hashCode contract, ArrayList vs LinkedList, Arrays.sort
- **60m** — Set up the Problem Log + revision

Problems: `Two Sum`, `Contains Duplicate`, `Valid Anagram`, `Group Anagrams`, `Top K Frequent Elements`, `Product of Array Except Self`

### Day 2 — Two Pointers  ·  6h

- **180m** — DSA — opposite-ends vs same-direction, sorted invariant, dedup
- **120m** — Java — TreeMap/TreeSet, LinkedHashMap as LRU, ConcurrentHashMap, CopyOnWriteArrayList
- **60m** — Revision — re-solve Day 1's two hardest

Problems: `Valid Palindrome`, `Two Sum II`, `3Sum`, `Container With Most Water`, `Trapping Rain Water`, `Sort Colors`

### Day 3 — Sliding Window  ·  6h

- **180m** — DSA — fixed vs variable window, shrink condition, when it fails
- **120m** — Java — JMM: happens-before, volatile, visibility vs atomicity, reordering
- **60m** — Revision — D+1 re-solves

Problems: `Best Time to Buy and Sell Stock`, `Longest Substring Without Repeating Characters`, `Longest Repeating Character Replacement`, `Permutation in String`, `Minimum Window Substring`, `Sliding Window Maximum`

### Day 4 — Binary Search  ·  6h

- **180m** — DSA — one template, binary search on answer space, monotonic predicate
- **120m** — Java — ThreadPoolExecutor tuning, CompletableFuture, latches/semaphores, ForkJoinPool
- **60m** — Revision — D+1 and D+3

Problems: `Binary Search`, `Search in Rotated Sorted Array`, `Find Minimum in Rotated Sorted Array`, `Search a 2D Matrix`, `Koko Eating Bananas`, `Median of Two Sorted Arrays (stretch)`

### Day 5 — Stacks & Monotonic Stack  ·  6h

- **180m** — DSA — next-greater family, stack as parser, O(1) aux queries
- **120m** — Java — ReentrantLock, ReadWriteLock, CAS/Atomic, LongAdder, deadlock, DCL
- **60m** — Revision — log review + D+1/D+3

Problems: `Valid Parentheses`, `Min Stack`, `Evaluate Reverse Polish Notation`, `Daily Temperatures`, `Car Fleet`, `Largest Rectangle in Histogram (stretch)`

### Day 6 — Timed set + Streams  ·  5.5h

- **120m** — Timed DSA — 4 unseen, 30 min each, talk out loud
- **90m** — DSA review — where did the minutes go?
- **90m** — Java — Streams: laziness, collectors, when NOT to use them
- **30m** — Log

Problems: `Subarray Sum Equals K`, `Longest Consecutive Sequence`, `Find K Closest Elements`, `Encode and Decode Strings`

### Day 7 — CONSOLIDATION  ·  5.5h

- **150m** — Cold re-solve — 6 problems marked N, blank file
- **60m** — Pattern write-ups — 5 patterns, your own words
- **60m** — Self-mock — 1 problem out loud, recorded, watch it back
- **60m** — Week 1 checkpoint + next-week plan

## Week 2 — Lists, trees, heaps, intervals — Phase 1 gate

### Day 8 — Linked Lists  ·  6h

- **180m** — DSA — dummy head, fast/slow, in-place reversal, Floyd
- **120m** — LLD — OOP done right + SOLID with examples from your billing system
- **60m** — Revision

Problems: `Reverse Linked List`, `Merge Two Sorted Lists`, `Linked List Cycle`, `Reorder List`, `Remove Nth Node From End`, `Copy List with Random Pointer`, `LRU Cache`

### Day 9 — Trees I — traversal & recursion  ·  6h

- **180m** — DSA — recursion contracts, DFS orders, BFS levels
- **120m** — LLD — patterns batch 1: Strategy, Factory, Builder, Singleton, Observer (type them)
- **60m** — Revision

Problems: `Invert Binary Tree`, `Maximum Depth of Binary Tree`, `Diameter of Binary Tree`, `Balanced Binary Tree`, `Same Tree`, `Subtree of Another Tree`, `Binary Tree Level Order Traversal`

### Day 10 — Trees II — BST  ·  6h

- **180m** — DSA — BST invariant, bounds validation, LCA, serialization
- **120m** — LLD — patterns batch 2: Decorator, Adapter, Command, State, CoR, Template Method
- **60m** — Revision

Problems: `Validate Binary Search Tree`, `Kth Smallest Element in a BST`, `LCA of a BST`, `LCA of a Binary Tree`, `Construct Tree from Preorder and Inorder`, `Binary Tree Maximum Path Sum`, `Serialize and Deserialize Binary Tree`

### Day 11 — Heaps & Priority Queues  ·  6h

- **180m** — DSA — heapify, k-largest family, two-heap median, PriorityQueue gotchas
- **120m** — 🎯 MACHINE CODING #1 — Parking Lot (60 min timed + 60 min review)
- **60m** — Revision

Problems: `Kth Largest Element in an Array`, `K Closest Points to Origin`, `Task Scheduler`, `Merge K Sorted Lists`, `Find Median from Data Stream`, `Design Twitter (stretch)`

### Day 12 — Intervals & Greedy intro  ·  6h

- **180m** — DSA — sort-by-start vs end, sweep line, exchange argument
- **120m** — 🎯 MACHINE CODING #2 — Rate Limiter (60 min + review). Note how you'd distribute it.
- **60m** — Revision

Problems: `Insert Interval`, `Merge Intervals`, `Non-overlapping Intervals`, `Meeting Rooms`, `Meeting Rooms II`, `Jump Game`, `Gas Station`

### Day 13 — Timed set + HLD kickoff  ·  5.5h

- **120m** — Timed DSA — 4 unseen
- **120m** — 🎯 HLD fundamentals — latency numbers, estimation, LB, caching, CAP/PACELC, consistency models
- **60m** — LLD refactor — parking lot + rate limiter with fresh eyes
- **30m** — Log

### Day 14 — CONSOLIDATION + Phase 1 gate  ·  5.5h

- **150m** — Cold re-solve — 6 problems
- **90m** — 🎯 MOCK #1 — DSA (60 min live + 30 min scoring)
- **60m** — Pattern write-ups — linked lists, trees, heaps, intervals
- **30m** — Phase 1 checkpoint

## Week 3 — Graphs, DSU, backtracking, HLD kickoff

### Day 15 — Graphs I — traversal  ·  6h

- **180m** — DSA — adjacency list vs matrix, BFS vs DFS, where to mark visited, grids
- **120m** — Java — JVM internals: memory layout, object header, escape analysis, JIT tiers
- **60m** — Revision

Problems: `Number of Islands`, `Clone Graph`, `Max Area of Island`, `Pacific Atlantic Water Flow`, `Surrounded Regions`, `Rotting Oranges`

### Day 16 — Graphs II — topological sort  ·  6h

- **180m** — DSA — DAGs, Kahn's vs DFS colours, directed vs undirected cycles
- **120m** — Java — GC: generational hypothesis, G1, tuning levers, reading a GC log. 🎯 Then: container limits vs -Xmx, OOMKilled vs OutOfMemoryError
- **60m** — Revision

Problems: `Course Schedule`, `Course Schedule II`, `Alien Dictionary`, `Graph Valid Tree`, `Number of Connected Components`, `Is Graph Bipartite`

### Day 17 — Graphs III — Union-Find  ·  6h

- **180m** — DSA — DSU with path compression + union by rank, when it beats BFS/DFS
- **120m** — 🎯 MACHINE CODING #3 — Splitwise (60 min + 45 review). BigDecimal, never double.
- **60m** — Revision

Problems: `Number of Connected Components (redo with DSU)`, `Redundant Connection`, `Accounts Merge`, `Number of Provinces`, `Most Stones Removed with Same Row or Column`

### Day 18 — Graph consolidation + Spring internals  ·  6h

- **180m** — DSA — 5 unseen graph problems, timed 30 min each
- **120m** — Java/Spring — autoconfiguration resolution, @Conditional, bean lifecycle, 🎯 JDK vs CGLIB proxies and the @Transactional self-invocation trap
- **60m** — Revision

Problems: `Word Ladder`, `Reconstruct Itinerary`, `Evaluate Division`, `Snakes and Ladders`, `Shortest Path in Binary Matrix`

### Day 19 — Backtracking I + transactions & JPA  ·  6h

- **180m** — DSA — choose/explore/unchoose, draw the decision tree first, pruning
- **120m** — 🎯 Java — @Transactional propagation & isolation, rollback rules; Hibernate N+1, lazy init, @Version, open-session-in-view
- **60m** — Revision

Problems: `Subsets`, `Combination Sum`, `Permutations`, `Subsets II`, `Word Search`

### Day 20 — HLD Case Study 1 — Payment / Billing  ·  5.5h

- **150m** — 🎯 HLD CASE 1 — double-entry ledger, idempotency keys, saga vs 2PC, outbox + CDC, reconciliation. Write the full 6-step narrative.
- **120m** — Timed DSA — 4 unseen, graphs + backtracking
- **60m** — Log & review

### Day 21 — CONSOLIDATION  ·  5.5h

- **120m** — Cold re-solve — 6 problems
- **90m** — 🎯 MOCK #2 — Machine coding (60 min + 30 scoring)
- **60m** — Pattern write-ups — graphs, topo sort, DSU, backtracking
- **30m** — Behavioral — draft 8 STAR stories, one paragraph each
- **30m** — Week 3 checkpoint

## Week 4 — Greedy, tries, messaging — Phase 2 gate

### Day 22 — Backtracking II + Notification Service  ·  6h

- **180m** — DSA — pruning with sorting, dedup with duplicates, constraint propagation
- **120m** — 🎯 HLD CASE 2 — Notification Service: fan-out, per-channel rate limits, dedup, backoff + DLQ, provider failover
- **60m** — Revision

Problems: `Combination Sum II`, `Permutations II`, `Palindrome Partitioning`, `Letter Combinations of a Phone Number`, `N-Queens`

### Day 23 — Greedy + sharding & replication  ·  6h

- **180m** — DSA — the exchange argument, when greedy fails, sorting as enabler
- **120m** — 🎯 HLD — hash/range/directory sharding, consistent hashing + vnodes, hot partitions, quorums, replication lag
- **60m** — Revision

Problems: `Jump Game II`, `Hand of Straights`, `Partition Labels`, `Valid Parenthesis String`, `Merge Triplets to Form Target`, `Gas Station (greedy lens)`

### Day 24 — Tries + messaging & Kafka  ·  6h

- **180m** — DSA — trie structure, prefix vs exact, when it beats a hash map. Then 2 re-solves in your weakest pattern.
- **120m** — 🎯 HLD — Kafka's actual ordering guarantee, consumer groups, delivery semantics, log compaction, CDC, outbox, DLQ. Convert ops knowledge into trade-off language.
- **60m** — Revision

Problems: `Implement Trie`, `Design Add and Search Words Data Structure`, `Word Search II`

### Day 25 — Mixed diagnostic + Distributed Rate Limiter  ·  6h

- **180m** — DSA — 5 unseen spanning weeks 1–4. Log recognition failures separately from execution failures.
- **120m** — 🎯 HLD CASE 3 — Distributed Rate Limiter: Redis + Lua atomicity, window trade-offs, local vs global, fail-open vs fail-closed
- **60m** — Revision

### Day 26 — Repair + caching, resilience, testing  ·  6h

- **180m** — DSA — repair Day 25: re-solve every miss cold, then one fresh problem in each pattern that failed
- **120m** — 🎯 HLD — caching (aside/through/behind), invalidation, stampede & negative caching; then resilience: timeouts, retries with jitter, circuit breakers, bulkheads
- **60m** — Java — testing: JUnit 5, Mockito, Testcontainers; what a unit test is actually worth

### Day 27 — Timed set + URL shortener & ID generation  ·  5.5h

- **150m** — Timed DSA — 5 unseen across weeks 1–4, 30 min each
- **120m** — 🎯 HLD CASE 4 — URL shortener: key generation (counter vs hash vs Snowflake), read-heavy caching, redirect semantics, click analytics pipeline
- **60m** — Revision + log

### Day 28 — CONSOLIDATION + Phase 2 gate  ·  5.5h

- **150m** — Cold re-solve — 8 problems marked N
- **75m** — 🎯 MOCK #3 — HLD (45 min live + 30 min scoring)
- **60m** — Write-ups — greedy, tries, backtracking II; one-pagers for HLD cases 1–4
- **45m** — Phase 2 checkpoint — score each round type 1–5, plan Phase 3

## Week 5 — Dynamic programming & shortest paths

### Day 29 — DP I — one dimension  ·  6h

- **180m** — DSA — state, transition, base case. Write the recurrence in words before any code, then memo → tabulation → rolling array.
- **120m** — Java — records, sealed types, pattern matching, text blocks: what 17 and 21 actually gave you
- **60m** — Revision

Problems: `Climbing Stairs`, `Min Cost Climbing Stairs`, `House Robber`, `House Robber II`, `Longest Palindromic Substring`, `Palindromic Substrings`, `Decode Ways`

### Day 30 — DP II — grids & two sequences  ·  6h

- **180m** — DSA — 2-D tables, index conventions, walking the grid, reconstructing the answer not just its size
- **120m** — 🎯 MACHINE CODING #4 — Snake & Ladder with pluggable rules (60 min + 45 review)
- **60m** — Revision

Problems: `Unique Paths`, `Unique Paths II`, `Minimum Path Sum`, `Longest Common Subsequence`, `Edit Distance`, `Interleaving String`, `Distinct Subsequences (stretch)`

### Day 31 — DP III — the knapsack family  ·  6h

- **180m** — DSA — 0/1 vs unbounded, why loop order decides which one you wrote, subset-sum reductions
- **120m** — 🎯 HLD — storage engines: B-tree vs LSM, index design, why your query is slow, isolation levels in practice
- **60m** — Revision

Problems: `Coin Change`, `Coin Change II`, `Partition Equal Subset Sum`, `Target Sum`, `Combination Sum IV`, `Word Break`, `Ones and Zeroes`

### Day 32 — DP IV — sequences & state machines  ·  6h

- **180m** — DSA — DP over states, O(n log n) LIS, interval DP. Say the state out loud before coding.
- **120m** — 🎯 HLD CASE 5 — News feed: fan-out on write vs read, the celebrity problem, ranking, cursor pagination
- **60m** — Revision

Problems: `Longest Increasing Subsequence`, `Maximum Product Subarray`, `Best Time to Buy and Sell Stock with Cooldown`, `Best Time to Buy and Sell Stock IV`, `Longest String Chain`, `Burst Balloons (stretch)`

### Day 33 — Advanced graphs — shortest paths & MST  ·  6h

- **180m** — DSA — Dijkstra with a PQ, Bellman-Ford and the K-stops twist, Prim vs Kruskal
- **120m** — Java — profiling for real: JFR/async-profiler flame graphs, heap dumps, and one production incident of yours retold as a story
- **60m** — Revision

Problems: `Network Delay Time`, `Cheapest Flights Within K Stops`, `Path with Minimum Effort`, `Min Cost to Connect All Points`, `Swim in Rising Water`

### Day 34 — Timed set + Chat & presence  ·  5.5h

- **150m** — Timed DSA — 5 unseen, DP-heavy
- **120m** — 🎯 HLD CASE 6 — Chat: WebSocket fan-out, presence, ordering, offline queue, group messaging at scale
- **60m** — Behavioral — turn the 8 STAR drafts into spoken two-minute answers, recorded

### Day 35 — CONSOLIDATION  ·  5.5h

- **150m** — Cold re-solve — 8 problems, DP first
- **90m** — 🎯 MOCK #4 — DSA (60 min live + 30 min scoring)
- **60m** — Pattern write-ups — the four DP families, shortest paths, MST
- **30m** — Week 5 checkpoint

## Week 6 — Design problems, search, geo — Phase 3 gate

### Day 36 — Matrix, math & bit manipulation  ·  6h

- **180m** — DSA — in-place transforms, overflow, XOR identities, bitmask as a set
- **120m** — 🎯 MACHINE CODING #5 — Elevator system (60 min + 45 review). State machine first, scheduling policy second.
- **60m** — Revision

Problems: `Rotate Image`, `Spiral Matrix`, `Set Matrix Zeroes`, `Single Number`, `Number of 1 Bits`, `Counting Bits`, `Reverse Bits`, `Missing Number`

### Day 37 — Design-the-data-structure day  ·  6h

- **180m** — DSA — design problems: state the invariants and defend the O(1) claim before writing a line
- **120m** — 🎯 HLD — API design: REST vs gRPC, pagination, versioning, idempotent writes, auth (OAuth2/JWT), gateway concerns
- **60m** — Revision

Problems: `LRU Cache (from memory, blank file)`, `LFU Cache`, `Design Hit Counter`, `Insert Delete GetRandom O(1)`, `Time Based Key-Value Store`, `Design Underground System`

### Day 38 — HLD Case 7 — Search & autocomplete  ·  5.5h

- **150m** — 🎯 HLD CASE 7 — Typeahead & search: inverted index, in-memory trie, shard by term vs by document, ranking, near-real-time indexing
- **120m** — Timed DSA — 4 unseen
- **60m** — Behavioral — the failure story, the conflict story, the 'I disagreed with my manager' story

### Day 39 — Repair day + Java/Spring rapid fire  ·  6h

- **180m** — DSA — re-solve everything still marked N or ~ from weeks 4–5, cold
- **120m** — Java/Spring rapid fire — 40 questions out loud, two minutes each, no notes
- **60m** — Log — split recognition failures from execution failures and decide what to drill

### Day 40 — HLD Case 8 — Ride hailing & geo  ·  5.5h

- **150m** — 🎯 HLD CASE 8 — Ride hailing: geo indexing (geohash/quadtree/H3), matching, surge, trip state machine, location write amplification
- **120m** — Timed DSA — 4 unseen
- **60m** — Revision

### Day 41 — Full-loop dress rehearsal  ·  4h

- **60m** — 🎯 MOCK #5 — DSA round, 45 min, with a peer
- **75m** — 🎯 MOCK #6 — Machine coding, 60 min
- **60m** — 🎯 MOCK #7 — HLD, 45 min
- **45m** — Scoring — all three rubrics, written verdict, no flattery

### Day 42 — CONSOLIDATION + Phase 3 gate  ·  5.3h

- **150m** — Cold re-solve — 8 problems
- **60m** — Gap list — rank every weakness the three mocks exposed, pick the top five
- **60m** — Write-ups — design problems, matrix & bits, search & geo
- **45m** — Phase 3 checkpoint — are you interview-ready? Score each round type 1–5.

## Week 7 — In-season: repair, booking, first externals

### Day 43 — Gap repair A + concurrency rapid fire  ·  6h

- **180m** — DSA — the top two gaps from the Phase 3 list: theory refresh, then four problems in each
- **120m** — Java — concurrency rapid fire (30 questions out loud), then write a bounded blocking queue and a thread-safe LRU from scratch
- **60m** — Revision — clear the due queue

### Day 44 — Company research + tailored drill  ·  5h

- **90m** — Company prep — for your top three targets: loop format, tagged question lists, their engineering blog
- **150m** — DSA — 4 problems tagged for the target you interview with first
- **60m** — Behavioral — retune four stories to that company's values

### Day 45 — Maintenance + Metrics & monitoring  ·  5.5h

- **150m** — Timed DSA — 5 unseen, fully mixed
- **120m** — 🎯 HLD CASE 9 — Metrics pipeline: ingestion, cardinality explosions, rollups, time-series storage, alerting
- **60m** — Revision

### Day 46 — MACHINE CODING #6 — Food ordering  ·  5h

- **120m** — 🎯 MACHINE CODING #6 — Food ordering: cart, pricing rules, order state machine (60 min + 45 review)
- **90m** — LLD — re-read your own parking lot and elevator code; refactor one to be extension-friendly
- **90m** — DSA — 3 problems from the due queue

### Day 47 — HLD Case 10 — Booking & inventory  ·  5.5h

- **150m** — 🎯 HLD CASE 10 — Ticket booking: seat holds, overselling, distributed locks vs DB constraints, payment coupling, hold expiry
- **120m** — Timed DSA — 4 unseen
- **60m** — Revision

### Day 48 — Mock + interview hygiene  ·  4.5h

- **120m** — 🎯 MOCK #8 — full loop with a peer: DSA + HLD, recorded
- **90m** — Scoring and same-day repair of everything that went wrong
- **60m** — Interview hygiene — setup, editor drill, questions to ask, the comp conversation script

### Day 49 — CONSOLIDATION — week 7  ·  4.5h

- **150m** — Cold re-solve — 8 problems
- **45m** — Pattern write-ups — anything new this week
- **45m** — Behavioral — retell all twelve stories to a recorder, two minutes each
- **30m** — Week 7 checkpoint

## Week 8 — In-season: streaming, scheduler, multi-region

### Day 50 — Gap repair B + JVM & performance  ·  6h

- **180m** — DSA — gaps three and four from the list: theory, then four problems each
- **120m** — Java — JVM & performance rapid fire: allocation, GC pauses, false sharing, JIT deopt; read one real flame graph
- **60m** — Revision

### Day 51 — HLD Case 11 — Video streaming & CDN  ·  5.5h

- **150m** — 🎯 HLD CASE 11 — Video: upload & transcode pipeline, object storage, CDN, adaptive bitrate, cost of egress
- **120m** — Timed DSA — 4 unseen
- **60m** — Revision

### Day 52 — MACHINE CODING #7 — Job scheduler  ·  5h

- **120m** — 🎯 MACHINE CODING #7 — Distributed job scheduler LLD: cron parsing, retries, at-least-once vs at-most-once (75 min + 45 review)
- **90m** — 🎯 HLD — the same scheduler at scale: leader election, leases, clock skew
- **90m** — DSA — due queue

### Day 53 — Timed full set + DP repair  ·  6h

- **180m** — Timed DSA — 6 unseen at loop pace, no breaks between them
- **120m** — DP repair — re-solve four DP problems cold; if any recurrence is still shaky, write it out longhand
- **60m** — Revision

### Day 54 — HLD Case 12 — Multi-region  ·  5.5h

- **150m** — 🎯 HLD CASE 12 — Multi-region: active-active vs active-passive, replication topology, conflict resolution, failover drills, RPO/RTO
- **120m** — Timed DSA — 4 unseen
- **60m** — Behavioral — scope, ambiguity and influence stories

### Day 55 — MOCK #9 — external  ·  4.5h

- **120m** — 🎯 MOCK #9 — machine coding + HLD with an external interviewer
- **90m** — Scoring + repair
- **60m** — Revision — due queue

### Day 56 — CONSOLIDATION — week 8  ·  5h

- **150m** — Cold re-solve — 8 problems
- **80m** — HLD — re-narrate cases 5–8 from memory, 20 minutes each, no notes
- **40m** — Log hygiene — prune what's solid, promote what isn't
- **30m** — Week 8 checkpoint

## Week 9 — In-season: analytics, loop pace — Phase 4 gate

### Day 57 — Gap repair C + Spring & data  ·  6h

- **180m** — DSA — the last gaps standing: theory, then four problems each
- **120m** — Java/Spring — data layer rapid fire: transactions, locking, connection pools, migrations, N+1 hunts
- **60m** — Revision

### Day 58 — HLD Case 13 — Analytics & pipelines  ·  5.5h

- **150m** — 🎯 HLD CASE 13 — Analytics: batch vs stream, exactly-once in practice, windowing & watermarks, warehouse vs lake, backfills
- **120m** — Timed DSA — 4 unseen
- **60m** — Revision

### Day 59 — MACHINE CODING #8 — hardest yet  ·  5h

- **120m** — 🎯 MACHINE CODING #8 — your own pick, the hardest one you have avoided (75 min + 45 review)
- **90m** — LLD — write the extension question you'd be asked next, then implement it in 30 minutes
- **90m** — DSA — due queue

### Day 60 — Timed DSA at loop pace  ·  5.5h

- **180m** — Timed DSA — 6 unseen back to back, narrating throughout, recorded
- **90m** — Review the recording — silence, rambling, unstated assumptions
- **60m** — Revision

### Day 61 — HLD open bank  ·  5h

- **120m** — 🎯 HLD — four designs from your bank at 30 minutes each, spoken, no notes
- **90m** — Score yourself against the 6-step narrative; rewrite the two weakest one-pagers
- **90m** — DSA — due queue

### Day 62 — MOCK #10 — behavioral & hiring manager  ·  4.5h

- **75m** — 🎯 MOCK #10 — behavioral / hiring-manager round, recorded
- **75m** — Scoring + story surgery on the two that landed worst
- **120m** — Timed DSA — 4 unseen

### Day 63 — CONSOLIDATION + Phase 4 gate  ·  5h

- **150m** — Cold re-solve — 8 problems
- **60m** — Full-bank audit — every pattern, every case, every story: red / amber / green
- **45m** — Write-ups — refresh anything that has gone stale
- **45m** — Phase 4 checkpoint — the final gap list for the last three weeks

## Week 10 — Peak passes — every pattern, cold

### Day 64 — Peak pass A — arrays → binary search  ·  5h

- **180m** — Cold pass — arrays & hashing, two pointers, sliding window, binary search: 8 problems, no notes, 20 min each
- **60m** — Repair — anything that missed, re-solved immediately
- **60m** — Pattern cards — one card per pattern, front: cue; back: template

### Day 65 — Peak pass B — stacks → intervals  ·  5h

- **180m** — Cold pass — stacks, linked lists, trees, heaps, intervals: 8 problems, no notes
- **60m** — Repair — same-day re-solves
- **60m** — Pattern cards

### Day 66 — Peak pass C — graphs → greedy  ·  5h

- **180m** — Cold pass — graphs, topo sort, DSU, backtracking, tries, greedy: 8 problems, no notes
- **60m** — Repair — same-day re-solves
- **60m** — Pattern cards

### Day 67 — Peak pass D — DP, math, design  ·  5h

- **180m** — Cold pass — DP (all four families), math & bits, design problems: 8 problems, no notes
- **60m** — Repair — same-day re-solves
- **60m** — Pattern cards

### Day 68 — HLD peak  ·  5h

- **160m** — 🎯 HLD — four cases at 40 minutes each, spoken end to end, recorded
- **80m** — Review the recordings: did you estimate, did you name trade-offs, did you close?
- **60m** — DSA — due queue

### Day 69 — LLD peak  ·  5h

- **150m** — 🎯 Machine coding — three redos at pace: 45 minutes each, tests included
- **60m** — Review — compare against your first attempt; write down what changed
- **90m** — DSA — due queue

### Day 70 — CONSOLIDATION — week 10  ·  4.5h

- **150m** — Cold re-solve — everything still red from the four peak passes
- **45m** — Final gap list — at most five items; anything else is now out of scope
- **45m** — Behavioral — full run-through of the story bank
- **30m** — Week 10 checkpoint

## Week 11 — Gap repair & three external mocks

### Day 71 — Gap repair 1  ·  6h

- **180m** — DSA — gap item one: theory, worked examples, then six problems
- **120m** — Java/HLD — the matching weak spot, written up properly
- **60m** — Revision

### Day 72 — MOCK #11 — DSA, external  ·  4.5h

- **60m** — 🎯 MOCK #11 — DSA with an external interviewer, 60 min
- **90m** — Scoring + immediate repair
- **120m** — Timed DSA — 4 unseen

### Day 73 — Gap repair 2 + Java internals  ·  6h

- **180m** — DSA — gap item two: theory then six problems
- **120m** — Java internals rapid fire — memory, concurrency, GC, proxies: 40 questions, no notes
- **60m** — Revision

### Day 74 — MOCK #12 — HLD, external  ·  4.5h

- **60m** — 🎯 MOCK #12 — HLD with an external interviewer, 60 min
- **90m** — Scoring + rewrite of the design you fumbled
- **120m** — Timed DSA — 4 unseen

### Day 75 — Gap repair 3 + behavioral polish  ·  6h

- **180m** — DSA — gap item three: theory then six problems
- **120m** — Behavioral — polish: openings, numbers, endings; cut every story to 2 minutes flat
- **60m** — Revision

### Day 76 — MOCK #13 — machine coding, external  ·  4.3h

- **75m** — 🎯 MOCK #13 — machine coding with an external interviewer, 75 min
- **90m** — Scoring + refactor to what it should have been
- **90m** — DSA — due queue

### Day 77 — CONSOLIDATION — week 11  ·  4.8h

- **150m** — Cold re-solve — 8 problems from the red list
- **60m** — Mock audit — all thirteen mocks: what keeps recurring?
- **45m** — Write-ups — final refresh
- **30m** — Week 11 checkpoint

## Week 12 — Taper, offer prep, close

### Day 78 — Warm maintenance  ·  4h

- **120m** — DSA — 4 mediums, comfortable pace, clean code, no rush
- **45m** — HLD — narrate one case out loud, 30 minutes
- **45m** — Review — pattern cards, front to back
- **30m** — Rest — genuinely stop at the end of the block

### Day 79 — Offer prep  ·  4.3h

- **90m** — Comp & levelling research for every company in play; write your numbers down
- **60m** — Negotiation script — the ask, the counter, the walk-away; rehearse out loud
- **45m** — Questions for each round — write five per interviewer type
- **60m** — DSA — 3 problems, light

### Day 80 — Full-loop dress rehearsal  ·  4.3h

- **60m** — 🎯 Round 1 — DSA, 60 min
- **60m** — 🎯 Round 2 — machine coding, 60 min
- **45m** — 🎯 Round 3 — HLD, 45 min
- **45m** — 🎯 Round 4 — behavioral, 45 min
- **45m** — Scoring — one honest verdict per round

### Day 81 — Light repair + recovery  ·  3.8h

- **120m** — Repair — only what yesterday exposed, nothing else
- **45m** — Pattern cards — the ten you trust least
- **60m** — Sleep, food, walk. This block is the work.

### Day 82 — Warm maintenance + story recall  ·  3.8h

- **120m** — DSA — 4 mediums, timed but relaxed
- **60m** — Story recall drill — random prompt, 20 seconds to pick a story, then tell it
- **45m** — HLD — one case narrated from a blank page

### Day 83 — Taper  ·  2.3h

- **45m** — DSA — 2 easy problems, just to stay warm
- **60m** — Read your own notes: pattern cards, HLD one-pagers, story bank. Read only, no new material.
- **30m** — Logistics — laptop, links, IDs, water, the room. Then stop.

### Day 84 — CLOSE — retrospective & bank export  ·  4.5h

- **120m** — Final cold set — 4 problems, one per weakest pattern, to prove the repairs held
- **60m** — Retrospective — what worked, what you'd cut, what you'd add. Write it for the next person (probably you).
- **60m** — Export the bank — problem log, pattern cards, HLD one-pagers, story bank into one document
- **30m** — Phase 5 checkpoint — score every round type. Then close the log.
