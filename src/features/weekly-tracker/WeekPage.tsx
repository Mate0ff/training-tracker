// Route: / (see src/routes.tsx). Do not rename this file/path.

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '../../components';
import { useWeek } from '../../lib/hooks/useWeek';
import { WeekGrid } from './components/WeekGrid';
import { WeekSummaryBar } from './components/WeekSummaryBar';

export function WeekPage() {
  const {
    weekStart,
    weekLabel,
    entriesByDate,
    exercisesById,
    summary,
    isLoading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
    canGoToNextWeek,
  } = useWeek();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Week</h1>
          <p className="text-sm text-text-secondary">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentWeek && (
            <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>
              This week
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPreviousWeek}
            aria-label="Previous week"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextWeek}
            disabled={!canGoToNextWeek}
            aria-label="Next week"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-muted-danger/40 text-sm text-muted-danger">
          Couldn't load this week's data — {error.message}
        </Card>
      ) : (
        <>
          <WeekSummaryBar summary={summary} isLoading={isLoading} />
          <WeekGrid
            weekStart={weekStart}
            entriesByDate={entriesByDate}
            exercisesById={exercisesById}
            onCreate={createEntry}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />
        </>
      )}
    </div>
  );
}
