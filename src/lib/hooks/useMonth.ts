// OWNED BY Agent 4 (Monthly Summary). See docs/CONTRACTS.md.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { addMonths, format, parseISO } from 'date-fns';
import { getApi } from '../data/api';
import { getCurrentMonthRange } from '../data/dateUtils';
import type { MonthSummary } from '../data/types';

export interface UseMonthResult {
  /** First-of-month reference date for the month currently being viewed. */
  monthDate: Date;
  /** "YYYY-MM" key, as passed to `api.getMonthSummary`. */
  month: string;
  /** Human-readable label, e.g. "September 2026". */
  monthLabel: string;
  summary: MonthSummary | undefined;
  isLoading: boolean;
  error: Error | undefined;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
  isCurrentMonth: boolean;
  /** False once `monthDate` reaches the current calendar month — no browsing into the future. */
  canGoToNextMonth: boolean;
}

/**
 * Loads the aggregated summary for a calendar month (defaults to the
 * current month via `dateUtils.getCurrentMonthRange`) and exposes
 * prev/next/current navigation between months.
 */
export function useMonth(initialReference: Date = new Date()): UseMonthResult {
  const [monthDate, setMonthDate] = useState(() =>
    parseISO(getCurrentMonthRange(initialReference).start),
  );
  const [summary, setSummary] = useState<MonthSummary>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  const month = useMemo(() => format(monthDate, 'yyyy-MM'), [monthDate]);
  const monthLabel = useMemo(() => format(monthDate, 'MMMM yyyy'), [monthDate]);
  const currentMonthDate = useMemo(() => parseISO(getCurrentMonthRange().start), []);
  const currentMonth = useMemo(() => format(currentMonthDate, 'yyyy-MM'), [currentMonthDate]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(undefined);
    (async () => {
      try {
        const api = await getApi();
        const result = await api.getMonthSummary(month);
        if (!cancelled) setSummary(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load month summary'));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const goToPreviousMonth = useCallback(() => setMonthDate((d) => addMonths(d, -1)), []);
  const goToNextMonth = useCallback(() => setMonthDate((d) => addMonths(d, 1)), []);
  const goToCurrentMonth = useCallback(() => setMonthDate(currentMonthDate), [currentMonthDate]);

  return {
    monthDate,
    month,
    monthLabel,
    summary,
    isLoading,
    error,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth: month === currentMonth,
    canGoToNextMonth: month < currentMonth,
  };
}
