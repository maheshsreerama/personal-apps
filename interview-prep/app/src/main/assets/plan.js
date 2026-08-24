/* ═══════════ THE 84-DAY PLAN ═══════════
   PH = phases, D = days. Each day: t = title, b = blocks [label, minutes], p = problems.
   Days divisible by 7 are consolidation days; 14 / 28 / 42 / 63 / 84 are phase gates. */

const PH = [
  { n: 1, name: "Foundations",               wk: "1–2",   c: "var(--p1)", hex: "#6E7FD8", end: 14 },
  { n: 2, name: "Structures & Articulation", wk: "3–4",   c: "var(--p2)", hex: "#3FA9C9", end: 28 },
  { n: 3, name: "Interview-Ready Sprint",    wk: "5–6",   c: "var(--p3)", hex: "#46C08D", end: 42 },
  { n: 4, name: "In-Season",                 wk: "7–9",   c: "var(--p4)", hex: "#E0B341", end: 63 },
  { n: 5, name: "Peak & Close",              wk: "10–12", c: "var(--p5)", hex: "#E5695C", end: 84 }
];
const GATES = [14, 28, 42, 63, 84];
const phOf = d => PH.find(p => d <= p.end);
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const D = {
/* ── Week 1 ─────────────────────────────────────────────── */
1:{t:"Arrays & Hashing",b:[["DSA — complexity, frequency-map pattern, HashMap internals",180],["Java — equals/hashCode contract, ArrayList vs LinkedList, Arrays.sort",120],["Set up the Problem Log + revision",60]],p:["Two Sum","Contains Duplicate","Valid Anagram","Group Anagrams","Top K Frequent Elements","Product of Array Except Self"]},
2:{t:"Two Pointers",b:[["DSA — opposite-ends vs same-direction, sorted invariant, dedup",180],["Java — TreeMap/TreeSet, LinkedHashMap as LRU, ConcurrentHashMap, CopyOnWriteArrayList",120],["Revision — re-solve Day 1's two hardest",60]],p:["Valid Palindrome","Two Sum II","3Sum","Container With Most Water","Trapping Rain Water","Sort Colors"]},
3:{t:"Sliding Window",b:[["DSA — fixed vs variable window, shrink condition, when it fails",180],["Java — JMM: happens-before, volatile, visibility vs atomicity, reordering",120],["Revision — D+1 re-solves",60]],p:["Best Time to Buy and Sell Stock","Longest Substring Without Repeating Characters","Longest Repeating Character Replacement","Permutation in String","Minimum Window Substring","Sliding Window Maximum"]},
4:{t:"Binary Search",b:[["DSA — one template, binary search on answer space, monotonic predicate",180],["Java — ThreadPoolExecutor tuning, CompletableFuture, latches/semaphores, ForkJoinPool",120],["Revision — D+1 and D+3",60]],p:["Binary Search","Search in Rotated Sorted Array","Find Minimum in Rotated Sorted Array","Search a 2D Matrix","Koko Eating Bananas","Median of Two Sorted Arrays (stretch)"]},
5:{t:"Stacks & Monotonic Stack",b:[["DSA — next-greater family, stack as parser, O(1) aux queries",180],["Java — ReentrantLock, ReadWriteLock, CAS/Atomic, LongAdder, deadlock, DCL",120],["Revision — log review + D+1/D+3",60]],p:["Valid Parentheses","Min Stack","Evaluate Reverse Polish Notation","Daily Temperatures","Car Fleet","Largest Rectangle in Histogram (stretch)"]},
6:{t:"Timed set + Streams",b:[["Timed DSA — 4 unseen, 30 min each, talk out loud",120],["DSA review — where did the minutes go?",90],["Java — Streams: laziness, collectors, when NOT to use them",90],["Log",30]],p:["Subarray Sum Equals K","Longest Consecutive Sequence","Find K Closest Elements","Encode and Decode Strings"]},
7:{t:"CONSOLIDATION",b:[["Cold re-solve — 6 problems marked N, blank file",150],["Pattern write-ups — 5 patterns, your own words",60],["Self-mock — 1 problem out loud, recorded, watch it back",60],["Week 1 checkpoint + next-week plan",60]],p:[]},

/* ── Week 2 ─────────────────────────────────────────────── */
8:{t:"Linked Lists",b:[["DSA — dummy head, fast/slow, in-place reversal, Floyd",180],["LLD — OOP done right + SOLID with examples from your billing system",120],["Revision",60]],p:["Reverse Linked List","Merge Two Sorted Lists","Linked List Cycle","Reorder List","Remove Nth Node From End","Copy List with Random Pointer","LRU Cache"]},
9:{t:"Trees I — traversal & recursion",b:[["DSA — recursion contracts, DFS orders, BFS levels",180],["LLD — patterns batch 1: Strategy, Factory, Builder, Singleton, Observer (type them)",120],["Revision",60]],p:["Invert Binary Tree","Maximum Depth of Binary Tree","Diameter of Binary Tree","Balanced Binary Tree","Same Tree","Subtree of Another Tree","Binary Tree Level Order Traversal"]},
10:{t:"Trees II — BST",b:[["DSA — BST invariant, bounds validation, LCA, serialization",180],["LLD — patterns batch 2: Decorator, Adapter, Command, State, CoR, Template Method",120],["Revision",60]],p:["Validate Binary Search Tree","Kth Smallest Element in a BST","LCA of a BST","LCA of a Binary Tree","Construct Tree from Preorder and Inorder","Binary Tree Maximum Path Sum","Serialize and Deserialize Binary Tree"]},
11:{t:"Heaps & Priority Queues",b:[["DSA — heapify, k-largest family, two-heap median, PriorityQueue gotchas",180],["🎯 MACHINE CODING #1 — Parking Lot (60 min timed + 60 min review)",120],["Revision",60]],p:["Kth Largest Element in an Array","K Closest Points to Origin","Task Scheduler","Merge K Sorted Lists","Find Median from Data Stream","Design Twitter (stretch)"]},
12:{t:"Intervals & Greedy intro",b:[["DSA — sort-by-start vs end, sweep line, exchange argument",180],["🎯 MACHINE CODING #2 — Rate Limiter (60 min + review). Note how you'd distribute it.",120],["Revision",60]],p:["Insert Interval","Merge Intervals","Non-overlapping Intervals","Meeting Rooms","Meeting Rooms II","Jump Game","Gas Station"]},
13:{t:"Timed set + HLD kickoff",b:[["Timed DSA — 4 unseen",120],["🎯 HLD fundamentals — latency numbers, estimation, LB, caching, CAP/PACELC, consistency models",120],["LLD refactor — parking lot + rate limiter with fresh eyes",60],["Log",30]],p:[]},
14:{t:"CONSOLIDATION + Phase 1 gate",b:[["Cold re-solve — 6 problems",150],["🎯 MOCK #1 — DSA (60 min live + 30 min scoring)",90],["Pattern write-ups — linked lists, trees, heaps, intervals",60],["Phase 1 checkpoint",30]],p:[]},

/* ── Week 3 ─────────────────────────────────────────────── */
15:{t:"Graphs I — traversal",b:[["DSA — adjacency list vs matrix, BFS vs DFS, where to mark visited, grids",180],["Java — JVM internals: memory layout, object header, escape analysis, JIT tiers",120],["Revision",60]],p:["Number of Islands","Clone Graph","Max Area of Island","Pacific Atlantic Water Flow","Surrounded Regions","Rotting Oranges"]},
16:{t:"Graphs II — topological sort",b:[["DSA — DAGs, Kahn's vs DFS colours, directed vs undirected cycles",180],["Java — GC: generational hypothesis, G1, tuning levers, reading a GC log. 🎯 Then: container limits vs -Xmx, OOMKilled vs OutOfMemoryError",120],["Revision",60]],p:["Course Schedule","Course Schedule II","Alien Dictionary","Graph Valid Tree","Number of Connected Components","Is Graph Bipartite"]},
17:{t:"Graphs III — Union-Find",b:[["DSA — DSU with path compression + union by rank, when it beats BFS/DFS",180],["🎯 MACHINE CODING #3 — Splitwise (60 min + 45 review). BigDecimal, never double.",120],["Revision",60]],p:["Number of Connected Components (redo with DSU)","Redundant Connection","Accounts Merge","Number of Provinces","Most Stones Removed with Same Row or Column"]},
18:{t:"Graph consolidation + Spring internals",b:[["DSA — 5 unseen graph problems, timed 30 min each",180],["Java/Spring — autoconfiguration resolution, @Conditional, bean lifecycle, 🎯 JDK vs CGLIB proxies and the @Transactional self-invocation trap",120],["Revision",60]],p:["Word Ladder","Reconstruct Itinerary","Evaluate Division","Snakes and Ladders","Shortest Path in Binary Matrix"]},
19:{t:"Backtracking I + transactions & JPA",b:[["DSA — choose/explore/unchoose, draw the decision tree first, pruning",180],["🎯 Java — @Transactional propagation & isolation, rollback rules; Hibernate N+1, lazy init, @Version, open-session-in-view",120],["Revision",60]],p:["Subsets","Combination Sum","Permutations","Subsets II","Word Search"]},
20:{t:"HLD Case Study 1 — Payment / Billing",b:[["🎯 HLD CASE 1 — double-entry ledger, idempotency keys, saga vs 2PC, outbox + CDC, reconciliation. Write the full 6-step narrative.",150],["Timed DSA — 4 unseen, graphs + backtracking",120],["Log & review",60]],p:[]},
21:{t:"CONSOLIDATION",b:[["Cold re-solve — 6 problems",120],["🎯 MOCK #2 — Machine coding (60 min + 30 scoring)",90],["Pattern write-ups — graphs, topo sort, DSU, backtracking",60],["Behavioral — draft 8 STAR stories, one paragraph each",30],["Week 3 checkpoint",30]],p:[]},

/* ── Week 4 ─────────────────────────────────────────────── */
22:{t:"Backtracking II + Notification Service",b:[["DSA — pruning with sorting, dedup with duplicates, constraint propagation",180],["🎯 HLD CASE 2 — Notification Service: fan-out, per-channel rate limits, dedup, backoff + DLQ, provider failover",120],["Revision",60]],p:["Combination Sum II","Permutations II","Palindrome Partitioning","Letter Combinations of a Phone Number","N-Queens"]},
23:{t:"Greedy + sharding & replication",b:[["DSA — the exchange argument, when greedy fails, sorting as enabler",180],["🎯 HLD — hash/range/directory sharding, consistent hashing + vnodes, hot partitions, quorums, replication lag",120],["Revision",60]],p:["Jump Game II","Hand of Straights","Partition Labels","Valid Parenthesis String","Merge Triplets to Form Target","Gas Station (greedy lens)"]},
24:{t:"Tries + messaging & Kafka",b:[["DSA — trie structure, prefix vs exact, when it beats a hash map. Then 2 re-solves in your weakest pattern.",180],["🎯 HLD — Kafka's actual ordering guarantee, consumer groups, delivery semantics, log compaction, CDC, outbox, DLQ. Convert ops knowledge into trade-off language.",120],["Revision",60]],p:["Implement Trie","Design Add and Search Words Data Structure","Word Search II"]},
25:{t:"Mixed diagnostic + Distributed Rate Limiter",b:[["DSA — 5 unseen spanning weeks 1–4. Log recognition failures separately from execution failures.",180],["🎯 HLD CASE 3 — Distributed Rate Limiter: Redis + Lua atomicity, window trade-offs, local vs global, fail-open vs fail-closed",120],["Revision",60]],p:[]},
26:{t:"Repair + caching, resilience, testing",b:[["DSA — repair Day 25: re-solve every miss cold, then one fresh problem in each pattern that failed",180],["🎯 HLD — caching (aside/through/behind), invalidation, stampede & negative caching; then resilience: timeouts, retries with jitter, circuit breakers, bulkheads",120],["Java — testing: JUnit 5, Mockito, Testcontainers; what a unit test is actually worth",60]],p:[]},
27:{t:"Timed set + URL shortener & ID generation",b:[["Timed DSA — 5 unseen across weeks 1–4, 30 min each",150],["🎯 HLD CASE 4 — URL shortener: key generation (counter vs hash vs Snowflake), read-heavy caching, redirect semantics, click analytics pipeline",120],["Revision + log",60]],p:[]},
28:{t:"CONSOLIDATION + Phase 2 gate",b:[["Cold re-solve — 8 problems marked N",150],["🎯 MOCK #3 — HLD (45 min live + 30 min scoring)",75],["Write-ups — greedy, tries, backtracking II; one-pagers for HLD cases 1–4",60],["Phase 2 checkpoint — score each round type 1–5, plan Phase 3",45]],p:[]},

/* ── Week 5 ─────────────────────────────────────────────── */
29:{t:"DP I — one dimension",b:[["DSA — state, transition, base case. Write the recurrence in words before any code, then memo → tabulation → rolling array.",180],["Java — records, sealed types, pattern matching, text blocks: what 17 and 21 actually gave you",120],["Revision",60]],p:["Climbing Stairs","Min Cost Climbing Stairs","House Robber","House Robber II","Longest Palindromic Substring","Palindromic Substrings","Decode Ways"]},
30:{t:"DP II — grids & two sequences",b:[["DSA — 2-D tables, index conventions, walking the grid, reconstructing the answer not just its size",180],["🎯 MACHINE CODING #4 — Snake & Ladder with pluggable rules (60 min + 45 review)",120],["Revision",60]],p:["Unique Paths","Unique Paths II","Minimum Path Sum","Longest Common Subsequence","Edit Distance","Interleaving String","Distinct Subsequences (stretch)"]},
31:{t:"DP III — the knapsack family",b:[["DSA — 0/1 vs unbounded, why loop order decides which one you wrote, subset-sum reductions",180],["🎯 HLD — storage engines: B-tree vs LSM, index design, why your query is slow, isolation levels in practice",120],["Revision",60]],p:["Coin Change","Coin Change II","Partition Equal Subset Sum","Target Sum","Combination Sum IV","Word Break","Ones and Zeroes"]},
32:{t:"DP IV — sequences & state machines",b:[["DSA — DP over states, O(n log n) LIS, interval DP. Say the state out loud before coding.",180],["🎯 HLD CASE 5 — News feed: fan-out on write vs read, the celebrity problem, ranking, cursor pagination",120],["Revision",60]],p:["Longest Increasing Subsequence","Maximum Product Subarray","Best Time to Buy and Sell Stock with Cooldown","Best Time to Buy and Sell Stock IV","Longest String Chain","Burst Balloons (stretch)"]},
33:{t:"Advanced graphs — shortest paths & MST",b:[["DSA — Dijkstra with a PQ, Bellman-Ford and the K-stops twist, Prim vs Kruskal",180],["Java — profiling for real: JFR/async-profiler flame graphs, heap dumps, and one production incident of yours retold as a story",120],["Revision",60]],p:["Network Delay Time","Cheapest Flights Within K Stops","Path with Minimum Effort","Min Cost to Connect All Points","Swim in Rising Water"]},
34:{t:"Timed set + Chat & presence",b:[["Timed DSA — 5 unseen, DP-heavy",150],["🎯 HLD CASE 6 — Chat: WebSocket fan-out, presence, ordering, offline queue, group messaging at scale",120],["Behavioral — turn the 8 STAR drafts into spoken two-minute answers, recorded",60]],p:[]},
35:{t:"CONSOLIDATION",b:[["Cold re-solve — 8 problems, DP first",150],["🎯 MOCK #4 — DSA (60 min live + 30 min scoring)",90],["Pattern write-ups — the four DP families, shortest paths, MST",60],["Week 5 checkpoint",30]],p:[]},

/* ── Week 6 ─────────────────────────────────────────────── */
36:{t:"Matrix, math & bit manipulation",b:[["DSA — in-place transforms, overflow, XOR identities, bitmask as a set",180],["🎯 MACHINE CODING #5 — Elevator system (60 min + 45 review). State machine first, scheduling policy second.",120],["Revision",60]],p:["Rotate Image","Spiral Matrix","Set Matrix Zeroes","Single Number","Number of 1 Bits","Counting Bits","Reverse Bits","Missing Number"]},
37:{t:"Design-the-data-structure day",b:[["DSA — design problems: state the invariants and defend the O(1) claim before writing a line",180],["🎯 HLD — API design: REST vs gRPC, pagination, versioning, idempotent writes, auth (OAuth2/JWT), gateway concerns",120],["Revision",60]],p:["LRU Cache (from memory, blank file)","LFU Cache","Design Hit Counter","Insert Delete GetRandom O(1)","Time Based Key-Value Store","Design Underground System"]},
38:{t:"HLD Case 7 — Search & autocomplete",b:[["🎯 HLD CASE 7 — Typeahead & search: inverted index, in-memory trie, shard by term vs by document, ranking, near-real-time indexing",150],["Timed DSA — 4 unseen",120],["Behavioral — the failure story, the conflict story, the 'I disagreed with my manager' story",60]],p:[]},
39:{t:"Repair day + Java/Spring rapid fire",b:[["DSA — re-solve everything still marked N or ~ from weeks 4–5, cold",180],["Java/Spring rapid fire — 40 questions out loud, two minutes each, no notes",120],["Log — split recognition failures from execution failures and decide what to drill",60]],p:[]},
40:{t:"HLD Case 8 — Ride hailing & geo",b:[["🎯 HLD CASE 8 — Ride hailing: geo indexing (geohash/quadtree/H3), matching, surge, trip state machine, location write amplification",150],["Timed DSA — 4 unseen",120],["Revision",60]],p:[]},
41:{t:"Full-loop dress rehearsal",b:[["🎯 MOCK #5 — DSA round, 45 min, with a peer",60],["🎯 MOCK #6 — Machine coding, 60 min",75],["🎯 MOCK #7 — HLD, 45 min",60],["Scoring — all three rubrics, written verdict, no flattery",45]],p:[]},
42:{t:"CONSOLIDATION + Phase 3 gate",b:[["Cold re-solve — 8 problems",150],["Gap list — rank every weakness the three mocks exposed, pick the top five",60],["Write-ups — design problems, matrix & bits, search & geo",60],["Phase 3 checkpoint — are you interview-ready? Score each round type 1–5.",45]],p:[]},

/* ── Week 7 ─────────────────────────────────────────────── */
43:{t:"Gap repair A + concurrency rapid fire",b:[["DSA — the top two gaps from the Phase 3 list: theory refresh, then four problems in each",180],["Java — concurrency rapid fire (30 questions out loud), then write a bounded blocking queue and a thread-safe LRU from scratch",120],["Revision — clear the due queue",60]],p:[]},
44:{t:"Company research + tailored drill",b:[["Company prep — for your top three targets: loop format, tagged question lists, their engineering blog",90],["DSA — 4 problems tagged for the target you interview with first",150],["Behavioral — retune four stories to that company's values",60]],p:[]},
45:{t:"Maintenance + Metrics & monitoring",b:[["Timed DSA — 5 unseen, fully mixed",150],["🎯 HLD CASE 9 — Metrics pipeline: ingestion, cardinality explosions, rollups, time-series storage, alerting",120],["Revision",60]],p:[]},
46:{t:"MACHINE CODING #6 — Food ordering",b:[["🎯 MACHINE CODING #6 — Food ordering: cart, pricing rules, order state machine (60 min + 45 review)",120],["LLD — re-read your own parking lot and elevator code; refactor one to be extension-friendly",90],["DSA — 3 problems from the due queue",90]],p:[]},
47:{t:"HLD Case 10 — Booking & inventory",b:[["🎯 HLD CASE 10 — Ticket booking: seat holds, overselling, distributed locks vs DB constraints, payment coupling, hold expiry",150],["Timed DSA — 4 unseen",120],["Revision",60]],p:[]},
48:{t:"Mock + interview hygiene",b:[["🎯 MOCK #8 — full loop with a peer: DSA + HLD, recorded",120],["Scoring and same-day repair of everything that went wrong",90],["Interview hygiene — setup, editor drill, questions to ask, the comp conversation script",60]],p:[]},
49:{t:"CONSOLIDATION — week 7",b:[["Cold re-solve — 8 problems",150],["Pattern write-ups — anything new this week",45],["Behavioral — retell all twelve stories to a recorder, two minutes each",45],["Week 7 checkpoint",30]],p:[]},

/* ── Week 8 ─────────────────────────────────────────────── */
50:{t:"Gap repair B + JVM & performance",b:[["DSA — gaps three and four from the list: theory, then four problems each",180],["Java — JVM & performance rapid fire: allocation, GC pauses, false sharing, JIT deopt; read one real flame graph",120],["Revision",60]],p:[]},
51:{t:"HLD Case 11 — Video streaming & CDN",b:[["🎯 HLD CASE 11 — Video: upload & transcode pipeline, object storage, CDN, adaptive bitrate, cost of egress",150],["Timed DSA — 4 unseen",120],["Revision",60]],p:[]},
52:{t:"MACHINE CODING #7 — Job scheduler",b:[["🎯 MACHINE CODING #7 — Distributed job scheduler LLD: cron parsing, retries, at-least-once vs at-most-once (75 min + 45 review)",120],["🎯 HLD — the same scheduler at scale: leader election, leases, clock skew",90],["DSA — due queue",90]],p:[]},
53:{t:"Timed full set + DP repair",b:[["Timed DSA — 6 unseen at loop pace, no breaks between them",180],["DP repair — re-solve four DP problems cold; if any recurrence is still shaky, write it out longhand",120],["Revision",60]],p:[]},
54:{t:"HLD Case 12 — Multi-region",b:[["🎯 HLD CASE 12 — Multi-region: active-active vs active-passive, replication topology, conflict resolution, failover drills, RPO/RTO",150],["Timed DSA — 4 unseen",120],["Behavioral — scope, ambiguity and influence stories",60]],p:[]},
55:{t:"MOCK #9 — external",b:[["🎯 MOCK #9 — machine coding + HLD with an external interviewer",120],["Scoring + repair",90],["Revision — due queue",60]],p:[]},
56:{t:"CONSOLIDATION — week 8",b:[["Cold re-solve — 8 problems",150],["HLD — re-narrate cases 5–8 from memory, 20 minutes each, no notes",80],["Log hygiene — prune what's solid, promote what isn't",40],["Week 8 checkpoint",30]],p:[]},

/* ── Week 9 ─────────────────────────────────────────────── */
57:{t:"Gap repair C + Spring & data",b:[["DSA — the last gaps standing: theory, then four problems each",180],["Java/Spring — data layer rapid fire: transactions, locking, connection pools, migrations, N+1 hunts",120],["Revision",60]],p:[]},
58:{t:"HLD Case 13 — Analytics & pipelines",b:[["🎯 HLD CASE 13 — Analytics: batch vs stream, exactly-once in practice, windowing & watermarks, warehouse vs lake, backfills",150],["Timed DSA — 4 unseen",120],["Revision",60]],p:[]},
59:{t:"MACHINE CODING #8 — hardest yet",b:[["🎯 MACHINE CODING #8 — your own pick, the hardest one you have avoided (75 min + 45 review)",120],["LLD — write the extension question you'd be asked next, then implement it in 30 minutes",90],["DSA — due queue",90]],p:[]},
60:{t:"Timed DSA at loop pace",b:[["Timed DSA — 6 unseen back to back, narrating throughout, recorded",180],["Review the recording — silence, rambling, unstated assumptions",90],["Revision",60]],p:[]},
61:{t:"HLD open bank",b:[["🎯 HLD — four designs from your bank at 30 minutes each, spoken, no notes",120],["Score yourself against the 6-step narrative; rewrite the two weakest one-pagers",90],["DSA — due queue",90]],p:[]},
62:{t:"MOCK #10 — behavioral & hiring manager",b:[["🎯 MOCK #10 — behavioral / hiring-manager round, recorded",75],["Scoring + story surgery on the two that landed worst",75],["Timed DSA — 4 unseen",120]],p:[]},
63:{t:"CONSOLIDATION + Phase 4 gate",b:[["Cold re-solve — 8 problems",150],["Full-bank audit — every pattern, every case, every story: red / amber / green",60],["Write-ups — refresh anything that has gone stale",45],["Phase 4 checkpoint — the final gap list for the last three weeks",45]],p:[]},

/* ── Week 10 ────────────────────────────────────────────── */
64:{t:"Peak pass A — arrays → binary search",b:[["Cold pass — arrays & hashing, two pointers, sliding window, binary search: 8 problems, no notes, 20 min each",180],["Repair — anything that missed, re-solved immediately",60],["Pattern cards — one card per pattern, front: cue; back: template",60]],p:[]},
65:{t:"Peak pass B — stacks → intervals",b:[["Cold pass — stacks, linked lists, trees, heaps, intervals: 8 problems, no notes",180],["Repair — same-day re-solves",60],["Pattern cards",60]],p:[]},
66:{t:"Peak pass C — graphs → greedy",b:[["Cold pass — graphs, topo sort, DSU, backtracking, tries, greedy: 8 problems, no notes",180],["Repair — same-day re-solves",60],["Pattern cards",60]],p:[]},
67:{t:"Peak pass D — DP, math, design",b:[["Cold pass — DP (all four families), math & bits, design problems: 8 problems, no notes",180],["Repair — same-day re-solves",60],["Pattern cards",60]],p:[]},
68:{t:"HLD peak",b:[["🎯 HLD — four cases at 40 minutes each, spoken end to end, recorded",160],["Review the recordings: did you estimate, did you name trade-offs, did you close?",80],["DSA — due queue",60]],p:[]},
69:{t:"LLD peak",b:[["🎯 Machine coding — three redos at pace: 45 minutes each, tests included",150],["Review — compare against your first attempt; write down what changed",60],["DSA — due queue",90]],p:[]},
70:{t:"CONSOLIDATION — week 10",b:[["Cold re-solve — everything still red from the four peak passes",150],["Final gap list — at most five items; anything else is now out of scope",45],["Behavioral — full run-through of the story bank",45],["Week 10 checkpoint",30]],p:[]},

/* ── Week 11 ────────────────────────────────────────────── */
71:{t:"Gap repair 1",b:[["DSA — gap item one: theory, worked examples, then six problems",180],["Java/HLD — the matching weak spot, written up properly",120],["Revision",60]],p:[]},
72:{t:"MOCK #11 — DSA, external",b:[["🎯 MOCK #11 — DSA with an external interviewer, 60 min",60],["Scoring + immediate repair",90],["Timed DSA — 4 unseen",120]],p:[]},
73:{t:"Gap repair 2 + Java internals",b:[["DSA — gap item two: theory then six problems",180],["Java internals rapid fire — memory, concurrency, GC, proxies: 40 questions, no notes",120],["Revision",60]],p:[]},
74:{t:"MOCK #12 — HLD, external",b:[["🎯 MOCK #12 — HLD with an external interviewer, 60 min",60],["Scoring + rewrite of the design you fumbled",90],["Timed DSA — 4 unseen",120]],p:[]},
75:{t:"Gap repair 3 + behavioral polish",b:[["DSA — gap item three: theory then six problems",180],["Behavioral — polish: openings, numbers, endings; cut every story to 2 minutes flat",120],["Revision",60]],p:[]},
76:{t:"MOCK #13 — machine coding, external",b:[["🎯 MOCK #13 — machine coding with an external interviewer, 75 min",75],["Scoring + refactor to what it should have been",90],["DSA — due queue",90]],p:[]},
77:{t:"CONSOLIDATION — week 11",b:[["Cold re-solve — 8 problems from the red list",150],["Mock audit — all thirteen mocks: what keeps recurring?",60],["Write-ups — final refresh",45],["Week 11 checkpoint",30]],p:[]},

/* ── Week 12 ────────────────────────────────────────────── */
78:{t:"Warm maintenance",b:[["DSA — 4 mediums, comfortable pace, clean code, no rush",120],["HLD — narrate one case out loud, 30 minutes",45],["Review — pattern cards, front to back",45],["Rest — genuinely stop at the end of the block",30]],p:[]},
79:{t:"Offer prep",b:[["Comp & levelling research for every company in play; write your numbers down",90],["Negotiation script — the ask, the counter, the walk-away; rehearse out loud",60],["Questions for each round — write five per interviewer type",45],["DSA — 3 problems, light",60]],p:[]},
80:{t:"Full-loop dress rehearsal",b:[["🎯 Round 1 — DSA, 60 min",60],["🎯 Round 2 — machine coding, 60 min",60],["🎯 Round 3 — HLD, 45 min",45],["🎯 Round 4 — behavioral, 45 min",45],["Scoring — one honest verdict per round",45]],p:[]},
81:{t:"Light repair + recovery",b:[["Repair — only what yesterday exposed, nothing else",120],["Pattern cards — the ten you trust least",45],["Sleep, food, walk. This block is the work.",60]],p:[]},
82:{t:"Warm maintenance + story recall",b:[["DSA — 4 mediums, timed but relaxed",120],["Story recall drill — random prompt, 20 seconds to pick a story, then tell it",60],["HLD — one case narrated from a blank page",45]],p:[]},
83:{t:"Taper",b:[["DSA — 2 easy problems, just to stay warm",45],["Read your own notes: pattern cards, HLD one-pagers, story bank. Read only, no new material.",60],["Logistics — laptop, links, IDs, water, the room. Then stop.",30]],p:[]},
84:{t:"CLOSE — retrospective & bank export",b:[["Final cold set — 4 problems, one per weakest pattern, to prove the repairs held",120],["Retrospective — what worked, what you'd cut, what you'd add. Write it for the next person (probably you).",60],["Export the bank — problem log, pattern cards, HLD one-pagers, story bank into one document",60],["Phase 5 checkpoint — score every round type. Then close the log.",30]],p:[]}
};

/* Week headlines for the PLAN accordion — one per 7-day block. */
const WEEKS = [
  "Arrays, pointers, windows, search, stacks",
  "Lists, trees, heaps, intervals — Phase 1 gate",
  "Graphs, DSU, backtracking, HLD kickoff",
  "Greedy, tries, messaging — Phase 2 gate",
  "Dynamic programming & shortest paths",
  "Design problems, search, geo — Phase 3 gate",
  "In-season: repair, booking, first externals",
  "In-season: streaming, scheduler, multi-region",
  "In-season: analytics, loop pace — Phase 4 gate",
  "Peak passes — every pattern, cold",
  "Gap repair & three external mocks",
  "Taper, offer prep, close"
];
