# Training Tracker — Contracts & Folder Ownership

This document is the source of truth for the shared types/interfaces every
agent codes against, and for who owns which part of the repo. Read this
before touching anything outside your own feature folder.

## Folder ownership

To let 4 agents work in parallel without merge conflicts, ownership is
split by folder. **Only touch files inside your own folder(s).** If you
need something to change outside your folder (a type, a new shared
component, a route), flag it to the orchestrator rather than editing it
yourself.

| Owner | Owns |
|---|---|
| **Agent 1 (scaffold)** | `routes.tsx`, `package.json`, `electron/**`, `src/components/**`, `src/theme/**`, `src/lib/data/**` |
| **Agent 2 (Exercise Library)** | `src/features/exercise-library/**` |
| **Agent 3 (Weekly Tracker)** | `src/features/weekly-tracker/**`, `src/lib/hooks/useWeek.ts` |
| **Agent 4 (Monthly Summary)** | `src/features/monthly-summary/**`, `src/lib/hooks/useMonth.ts`, plus a later light polish pass across the repo |

Everyone may **read** anything in the repo; only the owner above should
**write** to it.

## Data contracts (`src/lib/data/types.ts`)

```ts
export type BodyPart = 'chest'|'back'|'shoulders'|'legs'|'arms'|'core'|'cardio'|'full_body';

export interface Exercise {
  id: string; name: string; bodyPart: BodyPart;
  secondaryMuscles?: string[]; equipment?: string;
  instructions: string[]; imageUrl?: string; // optional, UI falls back to a body-part icon
  youtubeSearchUrl: string; // e.g. youtube.com/results?search_query=... — NOT a hardcoded video link
}

export interface SetEntry { setNumber: number; reps: number; weight: number; } // weight in kg

export interface WorkoutLogEntry {
  id: string; date: string; // "YYYY-MM-DD"
  exerciseId: string; sets: SetEntry[]; notes?: string;
  createdAt: string; updatedAt: string;
  recurringPlanId?: string; // set when auto-created from a RecurringPlan; undefined = one-off manual entry
}

// "Repeat weekly" — a template that auto-materializes into a WorkoutLogEntry
// on the same weekday every week, via ensureWeekMaterialized() below.
export interface RecurringPlan {
  id: string;
  exerciseId: string;
  dayOfWeek: number; // 0 = Monday ... 6 = Sunday — NOT JS Date.getDay()'s 0 = Sunday. Easy off-by-one, double-check at every boundary.
  sets: SetEntry[];
  notes?: string;
  isActive: boolean; // false once the user "stops repeating"; inactive plans stop materializing new entries but past ones are untouched
  createdAt: string;
}

export interface DaySummary { date: string; totalExercises: number; totalSets: number; totalVolume: number; bodyParts: BodyPart[]; }
export interface WeekSummary { weekStart: string; weekEnd: string; days: DaySummary[]; totalWorkoutDays: number; totalSets: number; totalVolume: number; }
export interface MonthSummary {
  month: string; totalWorkouts: number; totalSets: number; totalVolume: number;
  volumeByDay: { date: string; volume: number }[];
  bodyPartBreakdown: { bodyPart: BodyPart; setCount: number }[];
  mostTrainedBodyPart?: BodyPart;
}

export interface ExercisePickerProps { isOpen: boolean; onClose: () => void; onSelect: (exercise: Exercise) => void; }
```

## API contract (`src/lib/data/api.ts`)

```ts
export interface WorkoutTrackerApi {
  listExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  listLogEntriesForDate(date: string): Promise<WorkoutLogEntry[]>;
  listLogEntriesForRange(startDate: string, endDate: string): Promise<WorkoutLogEntry[]>;
  createLogEntry(entry: Omit<WorkoutLogEntry,'id'|'createdAt'|'updatedAt'>): Promise<WorkoutLogEntry>;
  updateLogEntry(id: string, patch: Partial<Pick<WorkoutLogEntry,'sets'|'notes'>>): Promise<WorkoutLogEntry>;
  deleteLogEntry(id: string): Promise<void>;
  getWeekSummary(weekStartDate: string): Promise<WeekSummary>;
  getMonthSummary(month: string): Promise<MonthSummary>;

  // "Repeat weekly"
  listRecurringPlans(): Promise<RecurringPlan[]>;
  createRecurringPlan(input: Omit<RecurringPlan,'id'|'createdAt'|'isActive'>): Promise<RecurringPlan>; // creates the plan only — does NOT itself create a WorkoutLogEntry
  deactivateRecurringPlan(id: string): Promise<void>; // sets isActive false; does not touch already-created WorkoutLogEntry rows
  ensureWeekMaterialized(weekStart: string): Promise<void>; // idempotent — see below
}
```

### "Repeat weekly" (RecurringPlan)

A `RecurringPlan` is a template, not a schedule of entries — creating one
with `createRecurringPlan` does not create any `WorkoutLogEntry`. Entries
get created lazily by `ensureWeekMaterialized(weekStart)`: for every active
plan, it resolves `dayOfWeek` to that week's actual date (via
`getDateForWeekday` in `dateUtils.ts`) and creates a `WorkoutLogEntry`
(`recurringPlanId` set to the plan's id) **only if** no entry already
exists for that exact `(date, recurringPlanId)` pair. That makes it
idempotent and safe to call every time a week is viewed — past, current,
or future — without ever creating duplicates.

**`dayOfWeek` is 0 = Monday ... 6 = Sunday** (matching the week grid's
Mon-Sun column order), which is *not* the same as JS's `Date.getDay()`
(0 = Sunday). Getting this backwards silently shifts every materialized
entry by a day (e.g. Monday 6 doesn't touch this — it just picks the wrong
day) — the type in `types.ts` calls this out, but double-check it at every
boundary (UI weekday pickers included).

The idempotency check and the date resolution are both pure logic, shared
by both API implementations in `src/lib/data/recurring.ts`
(`planMaterialization`) — don't reimplement either independently.

`Weekly Tracker` calls `ensureWeekMaterialized(weekStart)` when a week's
view loads (before/alongside reading that week's entries), then offers a
"Repeat weekly" checkbox on a logged entry (→ `createRecurringPlan`) and a
"stop repeating" action (→ `deactivateRecurringPlan`).

Use it via `getApi()`:

```ts
import { getApi } from '../../lib/data/api';

const api = await getApi();
const exercises = await api.listExercises();
```

`getApi()` resolves to `window.trackerApi` (the real, better-sqlite3-backed
implementation, bridged from the Electron main process) when running
inside Electron, and transparently falls back to the in-memory
`src/lib/data/mockApi.ts` otherwise — e.g. running `vite` directly in a
browser tab while developing a feature in isolation. **Never** reach for
`window.trackerApi` directly in feature code; always go through `getApi()`.

Two implementations exist:
- `electron/ipc/persistence.ts` + `electron/preload.ts` — the real one, over better-sqlite3.
- `src/lib/data/mockApi.ts` — in-memory, seeded with a handful of exercises and log entries.

Both are built on the same pure aggregation logic in `src/lib/data/summaries.ts`
(`computeDaySummary`/`computeWeekSummary`/`computeMonthSummary`), so "volume",
"workout day", etc. are defined exactly once.

Date helpers live in `src/lib/data/dateUtils.ts`:
`formatDateISO(date)`, `getCurrentWeekRange(reference?)` (Mon-Sun),
`getCurrentMonthRange(reference?)`, `getDateForWeekday(weekStart, dayOfWeek)`
(resolves a `RecurringPlan.dayOfWeek` to an actual date within that week).

## Theme (`src/theme/tokens.ts` + `tailwind.config.js`)

The app is always-dark (no light mode, `darkMode: 'class'`, `<html class="dark">`).
Reuse these tokens — don't invent new colors.

| Token | Hex | Tailwind class |
|---|---|---|
| bg | `#0F1115` | `bg-bg` |
| surface | `#181B20` | `bg-surface` |
| surface hover | `#21252C` | `bg-surface-hover` |
| border | `#2A2E37` | `border-border` |
| text primary | `#F5F6F7` | `text-text-primary` |
| text secondary | `#A0A6B0` | `text-text-secondary` |
| text tertiary | `#6B7280` | `text-text-tertiary` |
| accent (light) | `#FF9152` | `text-accent-light` / `bg-accent-light` |
| accent (primary CTAs / active nav / focus rings) | `#F97316` | `bg-accent` / `text-accent` |
| accent (hover/pressed) | `#EA5F0A` | `bg-accent-hover` |

Muted secondary/status colors: `muted-teal #4FB6AC`, `muted-blue #6C8EBF`,
`muted-lavender #9B8AC4`, `muted-gold #D9B85C`, `muted-success #6FAE8C`,
`muted-danger #D9756B`.

Body-part color map (reused by the Exercise Library and Monthly Summary
charts — via `bodyPartColors` in `src/theme/tokens.ts` or the `bodyPart.*`
Tailwind colors):

| Body part | Hex |
|---|---|
| chest | `#E08A5C` |
| back | `#6C8EBF` |
| shoulders | `#9B8AC4` |
| legs | `#4FB6AC` |
| arms | `#D9B85C` |
| core | `#6FAE8C` |
| cardio | `#D9756B` |
| full_body | `#A0A6B0` |

Font: Inter / system-ui (`font-sans`, already the Tailwind default here).

## Component kit (`src/components`)

Import from the barrel: `import { Button, Card, Modal, ... } from '../../components';`

- `Button` — variants `primary | secondary | ghost | danger`, sizes `sm | md`.
- `Card`, `CardHeader`, `CardTitle` — the standard padded, rounded surface for page content.
- `Modal` — `isOpen`, `onClose`, `title?`, `children`, `footer?`. Closes on Escape and backdrop click.
- `Accordion` — `items: {id, title, content}[]`, `allowMultiple?`.
- `Badge` — `variant` (theme colors) or `colorHex` (e.g. a body-part color) for a pill label.
- `Input`, `Select` — labeled form fields with an `error?` slot.
- `StatTile` — a `Card` for a labeled KPI number, optional icon/accent color. Used for weekly/monthly stat rows.
- `AppShell`, `Sidebar`, `TopBar` — the app layout. `AppShell` wraps a page's content; `Sidebar` reads nav items from `src/routes.tsx`.

## Routes (`src/routes.tsx`)

Exactly 3 routes, each with a stub page already in place so the app runs
end-to-end from day one:

| Path | Label | Page component |
|---|---|---|
| `/` | Week | `src/features/weekly-tracker/WeekPage.tsx` |
| `/library` | Exercise Library | `src/features/exercise-library/LibraryPage.tsx` |
| `/monthly` | Monthly Summary | `src/features/monthly-summary/MonthPage.tsx` |

Routing uses `HashRouter` (not `BrowserRouter`) — required for routing to
work in a packaged Electron app loading `index.html` from `file://`.

`src/features/exercise-library/components/ExercisePicker.tsx` is also
stubbed (a plain `<select>` over the seeded mock exercises) implementing
`ExercisePickerProps`, so Agents 3/4 have a working picker to import
immediately; Agent 2 replaces the implementation but must keep the props
contract.

## Electron / persistence

- `electron/db/index.ts` — opens (and migrates) a single SQLite database
  file under `app.getPath('userData')`. Tables: `workout_log_entries`
  (`sets` stored as a JSON text column, plus a nullable `recurring_plan_id`
  column) and `recurring_plans` (`day_of_week`, `sets` as JSON, `is_active`
  as 0/1). Loads `better-sqlite3` via a runtime `require` (not a static
  import) so the bundler never tries to inline the native binary.
- `electron/ipc/persistence.ts` — registers one `ipcMain.handle` per
  `WorkoutTrackerApi` method (channel names `trackerApi:*`).
- `electron/preload.ts` — bridges those channels to the renderer as
  `window.trackerApi` via `contextBridge`.
- Exercises are **not** persisted in SQLite — `seedExercises` in
  `src/lib/data/mockApi.ts` is the single exercise catalog, reused by both
  the mock and real API implementations.

## Native module note

`better-sqlite3` ships prebuilt, ABI-stable N-API binaries directly in the
package (`node_modules/better-sqlite3/prebuilds/`), so **no native rebuild
step is required** on a normal dev machine — `npmRebuild: false` in
`electron-builder.yml` reflects that. Don't add an `electron-builder
install-app-deps` postinstall step; on a machine without a C++ toolchain
(MSVC Build Tools) it will fail and break `npm install` for everyone.
