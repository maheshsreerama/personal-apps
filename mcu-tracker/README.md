# MCU Roadmap

A chronological Marvel Cinematic Universe watch-list tracker for Android. 46 titles across
5 phases, in recommended viewing order — tick them off, and the app always tells you what
is next.

**[Download the APK](mcu-roadmap.apk)** — Android 8.0+, sideload it and allow
"install from unknown sources" when prompted.

## What it does

- **Up Next** — a hero card for the single next unwatched title in roadmap order, with a
  one-tap *Mark watched*. This is the whole point of the app: never wonder what is next.
- **Progress rings** — animated completion dial, hours watched, hours still ahead.
- **Phases** — the roadmap grouped into its five blocks, each collapsible, each with its
  own colour and progress bar. A title is identifiable by hue alone while scrolling.
- **Search and filters** — search by name; filter to All / To watch / Watched / Movies /
  Series.
- **Skip list** — mark a title as skipped and it stops blocking *Up Next* and drops out of
  the totals, instead of sitting there unwatched forever.
- **Stats** — per-phase breakdown, movies vs series rings, recently ticked off, and a
  finish-date forecast: pick a pace (1–7 titles a week) and it tells you the date you
  land on.
- **Watch-order notes** — the handful of titles whose position is deliberate (Captain
  Marvel before Endgame, Loki season 1 before No Way Home) carry a note explaining why.

## Posters

Poster URLs are deliberately **not** hard-coded — a baked-in image path rots, and a dead
link is a permanently broken tile. Each title instead carries its exact Wikipedia article
name, and the artwork is resolved on first sight and then cached on disk forever.

Underneath every tile sits generated artwork: a deterministic two-tone wash in the title's
phase colour, stamped with its initials. It is drawn first and never removed, so there is
no grey box while the network answers and nothing looks broken offline or if a lookup
fails.

## Build

```
gradle assembleRelease      # -> app/build/outputs/apk/release/app-release.apk
```

Kotlin 2.0.21, Jetpack Compose (Material 3), AGP 8.5.2, JDK 17, minSdk 26 / targetSdk 34.
No architecture components and no database — progress is a few dozen ids in
`SharedPreferences`, exposed as Compose snapshot state, which is all a checklist needs.

CI (`.github/workflows/mcu-tracker-release.yml`) builds the release APK on every push and
commits it back to `mcu-roadmap.apk`, so the downloadable file in this repo is always the
current code.

## The roadmap

| Phase | Tagline | Titles |
|-------|---------|--------|
| Phase 1 | Assembling the Team | 6 |
| Phase 2 | The Universe Expands | 6 |
| Phase 3 | The Climax | 11 |
| Phase 4 | Entering the Multiverse | 15 |
| Phase 5 & Beyond | The New Era | 8 |

Runtimes are approximate, and series totals are the sum of their episodes.
