// OWNED BY Agent 3 (Weekly Tracker). See docs/CONTRACTS.md.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, format, parseISO } from 'date-fns';
import { getApi } from '../data/api';
import { getCurrentWeekRange } from '../data/dateUtils';
import type { Exercise, SetEntry, WeekSummary, WorkoutLogEntry } from '../data/types';

export interface UseWeekResult {
  /** Monday of the week currently being viewed, "YYYY-MM-DD". */
  weekStart: string;
  /** Sunday of the week currently being viewed, "YYYY-MM-DD". */
  weekEnd: string;
  /** Human-readable range label, e.g. "Sep 8 – Sep 14, 2026". */
  weekLabel: string;
  entries: WorkoutLogEntry[];
  /** `entries` grouped by "YYYY-MM-DD" for quick per-day lookup. */
  entriesByDate: Map<string, WorkoutLogEntry[]>;
  /** Exercise catalog keyed by id, for rendering entry names/body parts. */
  exercisesById: Map<string, Exercise>;
  summary: WeekSummary | undefined;
  isLoading: boolean;
  error: Error | undefined;
  refresh: () => Promise<void>;
  createEntry: (input: {
    date: string;
    exerciseId: string;
    sets: SetEntry[];
    notes?: string;
  }) => Promise<WorkoutLogEntry>;
  updateEntry: (
    id: string,
    patch: { sets?: SetEntry[]; notes?: string },
  ) => Promise<WorkoutLogEntry>;
  deleteEntry: (id: string) => Promise<void>;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  goToCurrentWeek: () => void;
  isCurrentWeek: boolean;
  /** False once the viewed week reaches the current week — no browsing into the future. */
  canGoToNextWeek: boolean;
}

/**
 * Loads the current Mon-Sun week's log entries + aggregated summary
 * (defaults to the week containing today, via `dateUtils.getCurrentWeekRange`),
 * the exercise catalog needed to render entries, and exposes create/update/
 * delete helpers plus prev/next/current week navigation.
 */
export function useWeek(initialReference: Date = new Date()): UseWeekResult {
  const [weekAnchor, setWeekAnchor] = useState(() =>
    parseISO(getCurrentWeekRange(initialReference).start),
  );
  const [entries, setEntries] = useState<WorkoutLogEntry[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [summary, setSummary] = useState<WeekSummary>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const { start: weekStart, end: weekEnd } = useMemo(
    () => getCurrentWeekRange(weekAnchor),
    [weekAnchor],
  );

  const currentWeekStart = useMemo(() => getCurrentWeekRange().start, []);

  const weekLabel = useMemo(() => {
    const startDate = parseISO(weekStart);
    const endDate = parseISO(weekEnd);
    const startFmt = format(
      startDate,
      format(startDate, 'yyyy') === format(endDate, 'yyyy') ? 'MMM d' : 'MMM d, yyyy',
    );
    return `${startFmt} – ${format(endDate, 'MMM d, yyyy')}`;
  }, [weekStart, weekEnd]);

  // Exercise catalog — not week-specific, loaded once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const api = await getApi();
        const result = await api.listExercises();
        if (!cancelled) setExercises(result);
      } catch {
        // Non-fatal: entries just fall back to a generic label in the UI.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(undefined);
    (async () => {
      try {
        const api = await getApi();
        const [entriesResult, summaryResult] = await Promise.all([
          api.listLogEntriesForRange(weekStart, weekEnd),
          api.getWeekSummary(weekStart),
        ]);
        if (!cancelled) {
          setEntries(entriesResult);
          setSummary(summaryResult);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load week'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [weekStart, weekEnd]);

  const refresh = useCallback(async () => {
    setError(undefined);
    try {
      const api = await getApi();
      const [entriesResult, summaryResult] = await Promise.all([
        api.listLogEntriesForRange(weekStart, weekEnd),
        api.getWeekSummary(weekStart),
      ]);
      setEntries(entriesResult);
      setSummary(summaryResult);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh week'));
    }
  }, [weekStart, weekEnd]);

  const createEntry = useCallback<UseWeekResult['createEntry']>(
    async (input) => {
      const api = await getApi();
      const created = await api.createLogEntry(input);
      await refresh();
      return created;
    },
    [refresh],
  );

  const updateEntry = useCallback<UseWeekResult['updateEntry']>(
    async (id, patch) => {
      const api = await getApi();
      const updated = await api.updateLogEntry(id, patch);
      await refresh();
      return updated;
    },
    [refresh],
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      const api = await getApi();
      await api.deleteLogEntry(id);
      await refresh();
    },
    [refresh],
  );

  const goToPreviousWeek = useCallback(() => setWeekAnchor((d) => addDays(d, -7)), []);
  const goToNextWeek = useCallback(() => setWeekAnchor((d) => addDays(d, 7)), []);
  const goToCurrentWeek = useCallback(
    () => setWeekAnchor(parseISO(currentWeekStart)),
    [currentWeekStart],
  );

  const entriesByDate = useMemo(() => {
    const map = new Map<string, WorkoutLogEntry[]>();
    for (const entry of entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return map;
  }, [entries]);

  const exercisesById = useMemo(
    () => new Map(exercises.map((e) => [e.id, e] as const)),
    [exercises],
  );

  return {
    weekStart,
    weekEnd,
    weekLabel,
    entries,
    entriesByDate,
    exercisesById,
    summary,
    isLoading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek: weekStart === currentWeekStart,
    canGoToNextWeek: weekStart < currentWeekStart,
  };
}
