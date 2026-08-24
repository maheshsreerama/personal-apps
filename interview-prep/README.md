# Interview Prep 84

An 84-day senior-backend interview plan — DSA, Java internals, machine coding, HLD and
behavioural — and the Android app that tracks it. Fully offline: no permissions, no network,
no account. Everything lives on the device.

Download the APK from the [Releases page](../../releases) (tags `prep-v*`), or read the plan
itself in [`PLAN.md`](PLAN.md).

## The plan

Five phases, twelve weeks, 84 days, ~450 hours. Every seventh day is a consolidation day —
cold re-solves, write-ups, a checkpoint. Days 14, 28, 42, 63 and 84 are phase gates you score
yourself through.

| Phase | Weeks | What it is |
| --- | --- | --- |
| 1 — Foundations | 1–2 | Arrays through intervals; Java collections, JMM, concurrency; the first mock |
| 2 — Structures & Articulation | 3–4 | Graphs, backtracking, greedy, tries; Spring & JPA internals; HLD cases 1–4 |
| 3 — Interview-Ready Sprint | 5–6 | The four DP families, shortest paths, design problems; a full-loop rehearsal |
| 4 — In-Season | 7–9 | Real loops: gap repair, HLD cases 9–13, machine coding 6–8, external mocks |
| 5 — Peak & Close | 10–12 | Cold peak passes over every pattern, three external mocks, taper, offer prep |

Days carry timed blocks (3–5 per day, with minutes) and, where the topic warrants it,
a named problem set — 155 problems in all, no repeats.

## The app

Four tabs.

**Today** — the day's blocks, checked off as you finish them, with the minutes you have banked
against the minutes you planned. Underneath, the day's problems; above, anything the revision
ladder says is due, and on a gate day, a reminder that a gate you walk through without scoring
is not a gate you passed.

**Plan** — all 84 days as a single grid, each cell filling with its phase colour as you work
through it, gates outlined, today ringed. Below it, the twelve weeks, expandable to their days.
Tap any day, past or future, to open and work it.

**Log** — every problem you have rated, on a spaced-repetition ladder. Rate a problem **N**
(missed, or needed the solution), **~** (needed a hint) or **Y** (clean and unaided). A clean
solve promotes it — the next look moves out through 1, 2, 4, 8, 16, 30 days. A hint holds it
where it is. A miss knocks it to the bottom and it is back tomorrow. Add problems of your own
and they join the same ladder.

**Stats** — days complete, current streak, hours logged, clean-solve rate; progress per phase;
your patterns sorted weakest first, which is the list you actually work from; and every mock
you have scored, against a per-round rubric (DSA, machine coding, HLD, behavioural).

Back up and restore through the Android share sheet — the whole log is plain text.

## Layout

```
app/src/main/assets/     the entire app: index.html, app.css, app.js, plan.js, bundled fonts
app/src/main/java/       MainActivity — a WebView shell, a share bridge, a back handler
tools/plan_to_md.js      regenerates PLAN.md from plan.js
PLAN.md                  the 84 days, readable on GitHub
```

`plan.js` is the single source of truth for the curriculum. Edit a day there, run
`node tools/plan_to_md.js`, and both the app and the markdown follow.

## Build

```
gradle assembleRelease      # → app/build/outputs/apk/release/app-release.apk
```

Release builds are debug-signed on purpose, so the APK on the Releases page installs directly.
CI builds every push to a `claude/**` branch and publishes on a `prep-v*` tag, a manual run, or
a commit message carrying `[release]`.
