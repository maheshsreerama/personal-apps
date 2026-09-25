# Java Ace

An offline Android app for learning Java deeply and preparing for interviews. It teaches every
example from the HungryCoders Java course (Track A) plus the interview essentials the course doesn't
cover (Track B).

Every lesson has: a one-line summary, a mental model, a concept deep dive, hand-drawn (Excalidraw-style)
diagrams, the original example with its **real output** (recorded on JDK 21), a walkthrough, traps and
errata, tips and memory tricks, interview Q&A with model answers, a quiz with explanations, and takeaways.

App features: roadmap with progress, mind maps (whole course and per module), quizzes, spaced-repetition
flashcards, timed mock interviews with a weak-areas report, cheat sheets, search, bookmarks, dark mode,
and a full offline Excalidraw sketchpad (open any lesson diagram as editable shapes, or draw it from memory).

**Install:** download the latest `JavaAce-*.apk` from this repo's Releases page.

## Layout

| Path | What |
|---|---|
| `source-material/` | The course's 140 example programs, `pom.xml` and `AppTest.java`, unchanged |
| `outputs/` | Real console output of every example (`tools/run-examples.sh`); `.varies` = changes between runs |
| `content/` | Lessons as Markdown, one folder per module — format in [`content/README.md`](content/README.md) |
| `web/` | The app UI (Vite, plain JS; Mermaid, Markmap, Excalidraw loaded on demand) |
| `android/` | One-Activity Java shell that serves the built UI from the APK's assets |
| `tools/` | `verify.mjs` (lesson format + every example taught), `check-diagrams.mjs`, `ui-check.mjs`, `run-examples.sh` |

## Build

```sh
cd web && npm ci && npm run build          # builds into android/app/src/main/assets/www
cd ../android && ./gradlew assembleRelease # APK in app/build/outputs/apk/release/
```

CI (`.github/workflows/java-ace-release.yml`) does both on every push to `java-ace/` and publishes the
APK as release `java-ace-v<versionName>`. Bump `versionName`/`versionCode` in `android/app/build.gradle`
for a new release.
