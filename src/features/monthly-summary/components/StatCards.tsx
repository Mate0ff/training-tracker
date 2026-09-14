import { Dumbbell, ListChecks, TrendingUp, Trophy } from 'lucide-react';
import { StatTile } from '../../../components';
import { bodyPartColors, bodyPartLabels, colors } from '../../../theme/tokens';
import type { MonthSummary } from '../../../lib/data/types';

export interface StatCardsProps {
  summary: MonthSummary;
}

const numberFormat = new Intl.NumberFormat('en-US');

/** The four top-line KPI tiles for a month: workouts, sets, volume, most-trained body part. */
export function StatCards({ summary }: StatCardsProps) {
  const mostTrained = summary.mostTrainedBodyPart;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile
        label="Workout Days"
        value={numberFormat.format(summary.totalWorkouts)}
        icon={<Dumbbell size={20} />}
        accentColor={colors.accent}
      />
      <StatTile
        label="Total Sets"
        value={numberFormat.format(summary.totalSets)}
        icon={<ListChecks size={20} />}
        accentColor={colors.muted.blue}
      />
      <StatTile
        label="Total Volume"
        value={`${numberFormat.format(summary.totalVolume)} kg`}
        icon={<TrendingUp size={20} />}
        accentColor={colors.muted.teal}
      />
      <StatTile
        label="Most Trained"
        value={mostTrained ? bodyPartLabels[mostTrained] : '—'}
        icon={<Trophy size={20} />}
        accentColor={mostTrained ? bodyPartColors[mostTrained] : undefined}
      />
    </div>
  );
}
