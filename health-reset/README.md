# Health Reset — Daily Dashboard

An offline Android app for a 112-day health reset. Six things a day: **sleep, steps,
strength, sunlight, sabzi, protein** — plus water, weight, waist and lifts.

Everything lives on the phone. No permissions, no network, no account.

## Install

Grab the `.apk` from the [Releases page](../../releases/tag/health-v1.0.0) — or take
[`health-reset-1.0.0.apk`](health-reset-1.0.0.apk) checked in beside this README — open
it on an Android phone (8.0 / API 26+), and allow "install from unknown sources" when
asked.

The build is signed with the standard Android debug key, which is what makes it
installable without a keystore. It is not a Play Store signing identity: to upgrade
in place later, the new APK has to be signed with the same key.

## What it tracks

| Section | What it does |
| --- | --- |
| Today | Six tap-to-tick tiles + 4 × 750 ml water |
| Last 28 days | Heatmap of hits per day, today outlined |
| Weight | 7-day rolling average, week-on-week delta, ETA to 60 kg |
| Waist | Latest measurement against waist-to-height 0.5 |
| Lifts | 4-day split, last week's numbers, up/same overload flag |
| Routine | Two daily timelines — morning gym (A) or evening gym (B) |
| Reference | Food rules, protein anchors, oil warning, Sunday review |

The banner applies the two-day rule: one missed day is noise, two in a row is a new
pattern and gets called out.

## Layout

```
health-reset/
├── app/src/main/
│   ├── assets/index.html     ← the entire dashboard, one self-contained file
│   ├── java/…/MainActivity.java
│   └── res/                  ← icon, theme, strings
└── build.gradle
```

`MainActivity` is a thin WebView shell. The dashboard was originally written against
the Claude artifact `window.storage` API; a shim at the top of `index.html` reimplements
that contract over Android `SharedPreferences` (via the `AndroidStore` bridge), falling
back to `localStorage` so the same file still opens in a desktop browser unchanged.

## Building

Releases are built in CI — push a tag and the workflow does the rest:

```bash
git tag health-v1.0.0
git push origin health-v1.0.0
```

`.github/workflows/health-reset-release.yml` builds `assembleRelease` and attaches the
APK to a GitHub Release. The release build is debug-signed on purpose, so the APK is
directly installable from the Releases page without a keystore.

Locally, with an Android SDK present:

```bash
cd health-reset && gradle assembleRelease
```

## Not medical advice

Get a blood panel before starting, and re-check the calorie target with a physician if
anything in your health history changes.
