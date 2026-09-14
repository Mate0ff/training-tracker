import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  format,
  parseISO,
} from 'date-fns';

/** Formats a Date as "YYYY-MM-DD" (the canonical date string used throughout the app). */
export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export interface DateRange {
  start: string; // "YYYY-MM-DD"
  end: string; // "YYYY-MM-DD"
}

/** Monday-Sunday range for the week containing `reference` (defaults to today). */
export function getCurrentWeekRange(reference: Date = new Date()): DateRange {
  return {
    start: formatDateISO(startOfWeek(reference, { weekStartsOn: 1 })),
    end: formatDateISO(endOfWeek(reference, { weekStartsOn: 1 })),
  };
}

/** Calendar-month range for the month containing `reference` (defaults to today). */
export function getCurrentMonthRange(reference: Date = new Date()): DateRange {
  return {
    start: formatDateISO(startOfMonth(reference)),
    end: formatDateISO(endOfMonth(reference)),
  };
}

/**
 * Resolves a RecurringPlan's `dayOfWeek` (0 = Monday ... 6 = Sunday — NOT
 * JS Date.getDay()'s 0 = Sunday) to the actual date within the week
 * starting `weekStart` (itself a Monday, "YYYY-MM-DD" — e.g. from
 * getCurrentWeekRange().start).
 */
export function getDateForWeekday(weekStart: string, dayOfWeek: number): string {
  return formatDateISO(addDays(parseISO(weekStart), dayOfWeek));
}
