# Four Cars

The two-car arcade classic, doubled. **Four roads, four cars, two lanes each** — and all four are
yours at once.

<p align="center">🚗 🚙 🚕 🚓</p>

## How to play

- The screen is split into four vertical **tap zones**, one per road.
  Tap a zone and that road's car flips to its other lane.
- **Collect every circle.** Letting one slip past the car ends the run — same as crashing.
- **Dodge every square.**
- Two thumbs work: taps are tracked per pointer, so two cars can move in the same frame.
- Score is circles collected. Everything speeds up as you go.

Back pauses. Tap to resume.

## Install

Grab the latest `four-cars-*.apk` from the [Releases page](../../releases) (tags `cars-v*`), open it
on an Android 8.0+ phone, and allow "install from unknown sources" when prompted.

## Fairness rules

Difficulty comes from having four things to watch, never from an unwinnable board. Each spawned row
on a road is one of three shapes, and that's the whole set:

| Row | Lane A | Lane B | Demands |
|-----|--------|--------|---------|
| Take | circle | — | be in lane A |
| Dodge | square | — | be in lane B |
| Switch | square | circle | move to lane B |

Two squares would leave nowhere to go; two circles would force a miss. Neither is ever generated.
Rows on a road are also spaced by at least ~0.44 screen heights, which at top speed is ~0.42 s
between demands — comfortably longer than the ~0.12 s a car takes to change lanes.

## Why it feels fast

- **`SurfaceView` + dedicated render thread**, drawing to `lockHardwareCanvas()`. `unlockCanvasAndPost`
  blocks on vsync, so the loop self-paces to the panel's refresh rate with no timer in the way.
- **Touches are applied to the very next frame.** `onTouchEvent` only bumps an `AtomicIntegerArray`,
  handed to the render thread without a lock — no allocation, no handler hop, no contention.
- **Fixed 1/240 s physics sub-steps** under a real-time frame delta: identical behaviour at 60, 90
  and 120 Hz, and obstacles can't tunnel through a car at top speed.
- **No allocation on the hot path.** Obstacles and particles are fixed pools, paints and rects are
  reused, the score and best-score labels are only rebuilt when those numbers change. Nothing for
  the GC to collect, so nothing to stutter on.
- **Generous pickups, forgiving hazards.** A circle clipped mid-switch still counts; a square's
  corner doesn't kill. Both hitboxes stay well inside one lane width, so the neighbouring lane is
  never reachable by accident.
- Sound is synthesised into static `AudioTrack` buffers on a background thread at startup — no
  file decode mid-run, and no first-play hitch.

## Build

```sh
cd four-cars
gradle assembleRelease     # -> app/build/outputs/apk/release/app-release.apk
```

Release builds are debug-signed on purpose, so the APK on the Releases page installs directly.

## Layout

```
four-cars/app/src/main/java/com/fourcars/app/
  MainActivity.java   immersive full-screen host
  GameView.java       surface, render thread, touch stream
  Game.java           world state, rules, drawing
  Sfx.java            three synthesised sounds, no assets
```

No permissions, no network, no ads, no analytics.
