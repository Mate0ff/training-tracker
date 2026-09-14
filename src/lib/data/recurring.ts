import type { RecurringPlan, SetEntry, WorkoutLogEntry } from './types';
import { getDateForWeekday } from './dateUtils';

export interface MaterializationCandidate {
  date: string;
  exerciseId: string;
  sets: SetEntry[];
  notes?: string;
  recurringPlanId: string;
}

/**
 * Extracts the "YYYY-MM-DD" calendar date a plan was created on from its
 * `createdAt` ISO timestamp. Deliberately a plain string slice (ISO 8601
 * always starts with the date) rather than a parse-then-reformat through
 * date-fns, which would convert to local time and could shift the date —
 * `createdAt` is compared purely as a calendar date here, the same way
 * `WorkoutLogEntry.date` is treated everywhere else in this app.
 */
function createdDateOf(plan: RecurringPlan): string {
  return plan.createdAt.slice(0, 10);
}

/**
 * Pure planning step for ensureWeekMaterialized(): given a week's active
 * plans and the WorkoutLogEntry rows that already exist for that week,
 * returns the entries that still need to be created — one per active plan
 * whose (date, recurringPlanId) pair isn't already present, and whose
 * occurrence date is on or after the day the plan was created (a plan
 * never backfills weeks before it existed, even when a past week is
 * (re-)viewed and this runs again for it).
 *
 * Defined once here and called from both src/lib/data/mockApi.ts and
 * electron/ipc/persistence.ts so this rule is never duplicated / allowed
 * to drift between the two API implementations.
 */
export function planMaterialization(
  weekStart: string,
  activePlans: RecurringPlan[],
  existingEntriesThisWeek: WorkoutLogEntry[],
): MaterializationCandidate[] {
  const existingKeys = new Set(
    existingEntriesThisWeek
      .filter((e) => e.recurringPlanId)
      .map((e) => `${e.date}::${e.recurringPlanId}`),
  );

  return activePlans
    .map((plan) => ({ plan, date: getDateForWeekday(weekStart, plan.dayOfWeek) }))
    .filter(({ plan, date }) => date >= createdDateOf(plan))
    .filter(({ plan, date }) => !existingKeys.has(`${date}::${plan.id}`))
    .map(({ plan, date }) => ({
      date,
      exerciseId: plan.exerciseId,
      sets: plan.sets,
      notes: plan.notes,
      recurringPlanId: plan.id,
    }));
}
