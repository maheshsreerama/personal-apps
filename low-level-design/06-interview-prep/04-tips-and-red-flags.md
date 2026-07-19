# 6.4 Tips, Tricks & Red Flags — What Separates Senior Candidates

> The last-mile chapter: behaviors that flip borderline rounds, the red flags that quietly end them, and the exact prep plan. Read this the night before every LLD interview.

---

## The 10 highest-leverage behaviors

1. **Narrate decisions, not code.** "I'm locking on the seat so contention is per-seat" > silently typing `synchronized`. The interviewer scores what they hear.
2. **Volunteer the hard part first.** Raise the double-booking race, the rounding paisa, the boundary burst — before they do. It flips you from examinee to co-designer.
3. **Take every hint instantly.** "What if fees change?" = build the seam *now*, thank them implicitly by using it.
4. **Say trade-offs in pairs.** Never "I'll use X" — always "X over Y because Z." One sentence, every decision.
5. **Fix your own mistakes out loud.** Caught-and-corrected beats lucky-and-silent. The review instinct is the hire signal.
6. **Calibrate abstraction.** Interface on the stated variation axis; honest `if` on the two-variant case; and *say which is which*.
7. **Keep one flow fully alive.** A demoable park→unpark beats five half-built features — always.
8. **Use domain vocabulary.** Hold, ledger, idempotency key, aggregate, happens-before — precise words are compressed proofs of experience.
9. **State your assumptions as assumptions.** "Assuming single currency — flag me if not" leaves doors open instead of walls.
10. **Land the closing summary.** Coverage, key decisions, named debts — 30 rehearsed seconds (Ch 6.1 Q4).

## Red flags that end rounds (interviewers' actual list)

| Red flag | What the interviewer writes down |
|---|---|
| Codes for 10 minutes before any question | "Doesn't gather requirements" |
| God class / anemic entities | "Weak OO fundamentals" |
| `double` for money, string statuses, public fields | "Production-unready instincts" |
| Pattern-bingo (6 patterns, no reasons) | "Cargo cult, over-engineers" |
| Concurrency never mentioned in a booking problem | "Misses the core risk" |
| Defends a broken design after a clear counterexample | "Uncoachable" |
| "That edge case won't happen" | "Ships bugs" |
| Silent for long stretches | "Can't collaborate" |
| Rewrites everything at minute 30 | "No incremental instincts" |
| Claims exactly-once/thread-safe without justification | "Hand-waves hard problems" |

## Tricks of the format

- **Whiteboard rounds:** diagram quality matters more than code volume — invest in the class diagram + one sequence; code only the 2–3 methods with invariants.
- **Machine coding:** the Ch 4.1 budget; demo main is non-negotiable; commit history (if git) tells your story — commit per working feature.
- **Follow-up-heavy rounds (senior):** answers should *end with a hook* — "…and that's also where I'd plug pricing experiments" invites the next question onto your strong ground.
- **Pair-style rounds:** verbalize options and *ask which they prefer* at genuine forks — collaboration is the rubric line.
- **Take-home LLD:** README with decisions + trade-offs is worth as much as the code; include the tests they'll try to break you with (concurrency, rounding, expiry).

## The 4-week preparation plan

```
Week 1 — Foundations: Part 1 + Part 4 (modeling & clean code).
          Daily: 1 chapter + rewrite one past project's class in this style.
Week 2 — Patterns: Part 2. Daily: 1 chapter + implement 2 patterns from memory in Java.
          Weekend: reproduce the Ch 2.5 map from memory.
Week 3 — Concurrency + first case studies: Part 3, then 5.1/5.3/5.4/5.5.
          Daily: 1 thread-safe kata (bounded buffer, tryClaim, computeIfAbsent patterns).
Week 4 — Case studies at interview speed: remaining 5.x as timed 45-min runs (diagram
          + narration + core code), 2/day. Finish with Part 6 + one recorded full mock.
```

**Golden rule (same as HLD):** after each chapter, close the notes and *design it aloud from scratch*. If you can't narrate it, you don't own it yet — reread. LLD is learned by designing, not by reading.

## The night-before checklist

- [ ] Reproduce the Ch 6.2 master table from memory (problems × patterns × traps).
- [ ] Type the 7 snippets cold (atomic claim, computeIfAbsent, sorted multi-lock, strategy map, transition table, money split, bounded queue).
- [ ] Read the phrase bank (Ch 6.1) aloud once.
- [ ] Rehearse the 30-second closing summary shape.
- [ ] Pick your default stack answers: money=long paise; ids=typed records; time=injected Clock; storage=repository interfaces.
- [ ] Sleep. A rested candidate who knows 80% beats an exhausted one who knows 95%.

---

## ✅ Key Takeaways
- Rounds are won by narration, volunteered hard parts, taken hints, and paired trade-offs — behaviors, not knowledge.
- The red-flag list is short and avoidable; know it cold.
- Prep = timed designing aloud, not reading. The night-before checklist is 40 minutes.

## 💡 Final Tips
- Interviewers remember how the round *felt*: momentum, honesty, and recovery from mistakes weigh more than any single decision.
- When in doubt, return to the triad: **what varies (seam it), what's invariant (guard it), what's shared (lock it).** Nearly every LLD question is one of the three.
- You've built all 13 systems in this app. Walk in knowing you've already done the job's hard part — repeatedly.

## 🎯 Interview Q&A

**Q1. What single habit most reliably upgrades an LLD performance?**
> Decision narration with reasons — "X over Y because Z" on every choice. It converts invisible thinking into scoreable evidence, catches your own errors as you hear them, invites course-correcting hints early, and produces the collaborative feel interviewers rate. Candidates with identical designs score a full band apart on narration alone.

**Q2. How do you recover when the interviewer disproves your design with a counterexample?**
> Concede fast and specifically — "right: two holds can interleave there" — then repair in place with the smallest change that restores the invariant, and add the test/scenario that would have caught it. What's being measured in that moment is coachability and debugging instinct, not the original bug. The only losing moves are defending, deflecting, or full rewrites.

**Q3. Is it better to appear knowledgeable or honest when you don't know something?**
> Honest, structured, and curious — "I haven't implemented that; reasoning from what I know: …" — then reason visibly and invite correction. Interviewers calibrate against bluffing constantly and it's easy to detect with one follow-up. A principled guess labeled as a guess scores; a confident wrong answer un-labeled ends trust for the whole round.

**Q4. How different is LLD prep for a 3-YOE vs a 10-YOE candidate?**
> Same material, different emphasis. At 3 YOE: execution — clean code fast, patterns applied correctly, the script followed; interviewers forgive scope narrowness. At 10 YOE: judgment — scope negotiation, what *not* to build, trade-off fluency, connecting class design to system consequences and team realities ("this seam is where two teams' code meets"). Seniors fail by over-proving coding speed and under-showing judgment; juniors fail the reverse. Calibrate to the altitude they're hiring for.

**Q5. Final question: how do you keep these skills after the interview?**
> Practice on the job deliberately: every feature is a mini-LLD round — write the two-line design note (what varies/invariant/shared) before coding; refactor one smell per week toward the principles here; and re-derive one case study monthly from memory. Interview skills and engineering skills converge at exactly this material — that's why it's worth owning, not memorizing.
