import type { Exercise, WorkoutLogEntry, WeekSummary, MonthSummary, RecurringPlan } from './types';

// OWNERSHIP: owned by Agent 1 (scaffold). See docs/CONTRACTS.md.
//
// This is the single contract every feature codes against. It is
// implemented twice:
//   - src/lib/data/mockApi.ts    — in-memory implementation for isolated dev
//   - electron/ipc + preload.ts  — real implementation over better-sqlite3,
//                                  exposed on window.trackerApi via contextBridge
export interface WorkoutTrackerApi {
  listExercises(): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  listLogEntriesForDate(date: string): Promise<WorkoutLogEntry[]>;
  listLogEntriesForRange(startDate: string, endDate: string): Promise<WorkoutLogEntry[]>;
  createLogEntry(
    entry: Omit<WorkoutLogEntry, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WorkoutLogEntry>;
  updateLogEntry(
    id: string,
    patch: Partial<Pick<WorkoutLogEntry, 'sets' | 'notes'>>,
  ): Promise<WorkoutLogEntry>;
  deleteLogEntry(id: string): Promise<void>;
  getWeekSummary(weekStartDate: string): Promise<WeekSummary>;
  getMonthSummary(month: string): Promise<MonthSummary>;

  // "Repeat weekly" — see RecurringPlan in types.ts for the dayOfWeek convention.
  listRecurringPlans(): Promise<RecurringPlan[]>;
  createRecurringPlan(
    input: Omit<RecurringPlan, 'id' | 'createdAt' | 'isActive'>,
  ): Promise<RecurringPlan>;
  /** Sets isActive false. Does not touch any already-created WorkoutLogEntry rows. */
  deactivateRecurringPlan(id: string): Promise<void>;
  /**
   * For every active RecurringPlan, computes that week's date for its
   * dayOfWeek and creates a WorkoutLogEntry (linked via recurringPlanId) if
   * one doesn't already exist for that (date, recurringPlanId) pair.
   * Idempotent — safe to call every time a week is viewed (past, current,
   * or future) without creating duplicates.
   */
  ensureWeekMaterialized(weekStart: string): Promise<void>;
}

// Read via globalThis (not `window`) so this file type-checks under both
// the renderer's DOM lib and the Electron main process's Node-only lib —
// they're the same object in a browser/renderer context.
type GlobalWithTrackerApi = typeof globalThis & { trackerApi?: WorkoutTrackerApi };

/**
 * Resolves to the real implementation (window.trackerApi, bridged from the
 * Electron main process) when running inside Electron, and falls back to
 * the in-memory mock when running in a plain browser (e.g. `vite` preview
 * without Electron, or a future web build). Features should import `api`
 * from here rather than reaching for window.trackerApi directly.
 */
async function resolveApi(): Promise<WorkoutTrackerApi> {
  const bridged = (globalThis as GlobalWithTrackerApi).trackerApi;
  if (bridged) return bridged;
  const { mockApi } = await import('./mockApi');
  return mockApi;
}

let apiPromise: Promise<WorkoutTrackerApi> | undefined;

/** Lazily-resolved singleton implementation of {@link WorkoutTrackerApi}. */
export function getApi(): Promise<WorkoutTrackerApi> {
  if (!apiPromise) {
    apiPromise = resolveApi();
  }
  return apiPromise;
}
