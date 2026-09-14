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
 * Pure planning step for ensureWeekMaterialized(): given a week's active
 * plans and the WorkoutLogEntry rows that already exist for that week,
 * returns the entries that still need to be created — one per active plan
 * whose (date, recurringPlanId) pair isn't already present.
 *
 * Defined once here and called from both src/lib/data/mockApi.ts and
 * electron/ipc/persistence.ts so the idempotency rule ("skip if an entry
 * already exists for this plan on this date") is never duplicated /
 * allowed to drift between the two API implementations.
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
    .filter(({ plan, date }) => !existingKeys.has(`${date}::${plan.id}`))
    .map(({ plan, date }) => ({
      date,
      exerciseId: plan.exerciseId,
      sets: plan.sets,
      notes: plan.notes,
      recurringPlanId: plan.id,
    }));
}
