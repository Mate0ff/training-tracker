import { eachDayOfInterval, parseISO } from 'date-fns';
import type { BodyPart, DaySummary, MonthSummary, WeekSummary, WorkoutLogEntry } from './types';
import { formatDateISO } from './dateUtils';

/**
 * Pure, side-effect-free summary builders shared by both API
 * implementations (mockApi and the Electron/better-sqlite3 persistence
 * layer) so the aggregation logic — and its definition of "volume",
 * "workout day", etc. — is defined exactly once.
 */

function setVolume(entry: WorkoutLogEntry): number {
  return entry.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);
}

function setCount(entry: WorkoutLogEntry): number {
  return entry.sets.length;
}

export function computeDaySummary(
  date: string,
  entries: WorkoutLogEntry[],
  bodyPartOf: (exerciseId: string) => BodyPart | undefined,
): DaySummary {
  const bodyParts = Array.from(
    new Set(
      entries
        .map((e) => bodyPartOf(e.exerciseId))
        .filter((b): b is BodyPart => b !== undefined),
    ),
  );
  return {
    date,
    totalExercises: entries.length,
    totalSets: entries.reduce((sum, e) => sum + setCount(e), 0),
    totalVolume: entries.reduce((sum, e) => sum + setVolume(e), 0),
    bodyParts,
  };
}

export function computeWeekSummary(
  weekStart: string,
  weekEnd: string,
  entries: WorkoutLogEntry[],
  bodyPartOf: (exerciseId: string) => BodyPart | undefined,
): WeekSummary {
  const days = eachDayOfInterval({ start: parseISO(weekStart), end: parseISO(weekEnd) }).map(
    (d) => {
      const date = formatDateISO(d);
      const dayEntries = entries.filter((e) => e.date === date);
      return computeDaySummary(date, dayEntries, bodyPartOf);
    },
  );
  return {
    weekStart,
    weekEnd,
    days,
    totalWorkoutDays: days.filter((d) => d.totalExercises > 0).length,
    totalSets: days.reduce((sum, d) => sum + d.totalSets, 0),
    totalVolume: days.reduce((sum, d) => sum + d.totalVolume, 0),
  };
}

export function computeMonthSummary(
  month: string, // "YYYY-MM"
  monthStart: string,
  monthEnd: string,
  entries: WorkoutLogEntry[],
  bodyPartOf: (exerciseId: string) => BodyPart | undefined,
): MonthSummary {
  const days = eachDayOfInterval({ start: parseISO(monthStart), end: parseISO(monthEnd) });
  const volumeByDay = days.map((d) => {
    const date = formatDateISO(d);
    const dayEntries = entries.filter((e) => e.date === date);
    return { date, volume: dayEntries.reduce((sum, e) => sum + setVolume(e), 0) };
  });

  const setsByBodyPart = new Map<BodyPart, number>();
  for (const entry of entries) {
    const bodyPart = bodyPartOf(entry.exerciseId);
    if (!bodyPart) continue;
    setsByBodyPart.set(bodyPart, (setsByBodyPart.get(bodyPart) ?? 0) + setCount(entry));
  }
  const bodyPartBreakdown = Array.from(setsByBodyPart.entries()).map(([bodyPart, setCount]) => ({
    bodyPart,
    setCount,
  }));
  const mostTrainedBodyPart = bodyPartBreakdown.sort((a, b) => b.setCount - a.setCount)[0]?.bodyPart;

  const workoutDays = new Set(entries.map((e) => e.date));

  return {
    month,
    totalWorkouts: workoutDays.size,
    totalSets: entries.reduce((sum, e) => sum + setCount(e), 0),
    totalVolume: entries.reduce((sum, e) => sum + setVolume(e), 0),
    volumeByDay,
    bodyPartBreakdown,
    mostTrainedBodyPart,
  };
}
