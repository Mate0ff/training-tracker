# Training Tracker

A free, local desktop workout-tracking app. Electron + React + TypeScript,
Vite, Tailwind CSS, better-sqlite3 — no backend, no server, no account.

## Stack

- Electron (desktop shell) + React 19 + TypeScript
- Vite 8 (`vite-plugin-electron` for the main/preload build + dev reload)
- Tailwind CSS (`darkMode: 'class'`, the app is always-dark)
- better-sqlite3 (local persistence) + recharts (charts) + date-fns + uuid
- electron-builder (Windows packaging: NSIS installer + portable exe)

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts the Vite dev server and opens an Electron window
pointed at it, with hot reload for the renderer and auto-restart for the
main process.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the app in development (Electron + Vite dev server, hot reload) |
| `npm run build` | Type-check, then build the renderer (`dist/`) and main/preload (`dist-electron/`) |
| `npm run package` | Build, then package a Windows installer + portable exe into `release/` |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview the built renderer in a plain browser (no Electron/native APIs) |

## Project layout

```
electron/            Main process, preload script, IPC + SQLite persistence
src/
  components/         Shared UI kit (Button, Card, Modal, AppShell, ...)
  theme/              Color tokens (mirrors tailwind.config.js)
  lib/
    data/             Shared types, the WorkoutTrackerApi contract, mock + real
                       implementations, date/summary helpers
    hooks/            Feature-owned data hooks (useWeek, useMonth)
  features/
    exercise-library/ Exercise browser + ExercisePicker
    weekly-tracker/   Weekly log view (default route, "/")
    monthly-summary/  Monthly charts/summary
  routes.tsx          The 3 app routes + sidebar nav items
docs/CONTRACTS.md      Shared data contracts + folder-ownership rules
build-resources/       App icon (icon.ico, icon.png) used for the packaged
                        installer/exe and the window icon
```

See `docs/CONTRACTS.md` for the full data contracts, theme tokens, and
folder-ownership rules if you're working on one of the feature areas.

## Data & persistence

All workout data lives in a single SQLite file under the OS's per-user app
data folder (`app.getPath('userData')/training-tracker.db`) — nothing is
sent anywhere. The exercise catalog is a static seed list bundled with the
app (`src/lib/data/mockApi.ts`), not user-editable data, so it isn't
stored in SQLite.

## Data & licensing

The exercise catalog (names, instructions, equipment) was written from
scratch for this app — no exercise photos ship with it, and every exercise
links out to a YouTube search instead of a hardcoded video, to avoid
redistributing anyone else's media. See
`src/features/exercise-library/assets/LICENSE_NOTES.md` for the full
reasoning and what to check before adding real photos/illustrations later.

## Packaging

```bash
npm run package
```

Produces an NSIS installer and a portable `.exe` in `release/`. No code
signing is configured (unsigned builds — Windows SmartScreen may warn on
first run).
