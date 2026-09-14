import { format, parseISO } from 'date-fns';
import { CalendarCheck, Layers, Weight } from 'lucide-react';
import { Card, StatTile } from '../../../components';
import { bodyPartColors, bodyPartLabels } from '../../../theme/tokens';
import type { WeekSummary } from '../../../lib/data/types';

export interface WeekSummaryBarProps {
  summary: WeekSummary | undefined;
  isLoading: boolean;
}

/** Week-total stat tiles plus a per-day sets/volume strip, driven by WeekSummary/DaySummary. */
export function WeekSummaryBar({ summary, isLoading }: WeekSummaryBarProps) {
  if (isLoading && !summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Workout Days"
          value={`${summary.totalWorkoutDays} / 7`}
          icon={<CalendarCheck size={18} />}
        />
        <StatTile
          label="Total Sets"
          value={summary.totalSets}
          icon={<Layers size={18} />}
          accentColor={bodyPartColors.back}
        />
        <StatTile
          label="Total Volume"
          value={`${summary.totalVolume.toLocaleString()} kg`}
          icon={<Weight size={18} />}
          accentColor={bodyPartColors.legs}
        />
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {summary.days.map((day) => {
          const dominant = day.bodyParts[0];
          const color = dominant ? bodyPartColors[dominant] : undefined;
          return (
            <Card
              key={day.date}
              padded={false}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-center"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-text-tertiary sm:text-xs">
                {format(parseISO(day.date), 'EEE')}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color ?? '#2A2E37' }}
                title={dominant ? bodyPartLabels[dominant] : 'Rest day'}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold text-text-primary">{day.totalSets}</span>
              <span className="text-[10px] text-text-tertiary">sets</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
