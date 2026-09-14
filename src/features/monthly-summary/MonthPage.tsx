// Route: /monthly (see src/routes.tsx). Do not rename this file/path.

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card } from '../../components';
import { useMonth } from '../../lib/hooks/useMonth';
import { BodyPartBreakdownChart } from './components/BodyPartBreakdownChart';
import { StatCards } from './components/StatCards';
import { VolumeTrendChart } from './components/VolumeTrendChart';

export function MonthPage() {
  const {
    summary,
    isLoading,
    error,
    monthLabel,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    isCurrentMonth,
    canGoToNextMonth,
  } = useMonth();

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Monthly Summary</h1>
          <p className="text-sm text-text-secondary">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {!isCurrentMonth && (
            <Button variant="ghost" size="sm" onClick={goToCurrentMonth}>
              This month
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={goToNextMonth}
            disabled={!canGoToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-muted-danger/40 text-sm text-muted-danger">
          Couldn't load this month's data — {error.message}
        </Card>
      ) : isLoading && !summary ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-20 animate-pulse" />
          ))}
        </div>
      ) : summary ? (
        <>
          <StatCards summary={summary} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <VolumeTrendChart data={summary.volumeByDay} />
            <BodyPartBreakdownChart data={summary.bodyPartBreakdown} />
          </div>
        </>
      ) : null}
    </div>
  );
}
