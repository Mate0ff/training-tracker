import { format, parseISO } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import { Card, CardHeader, CardTitle } from '../../../components';
import { colors } from '../../../theme/tokens';
import type { MonthSummary } from '../../../lib/data/types';

export interface VolumeTrendChartProps {
  data: MonthSummary['volumeByDay'];
}

const volumeFormat = new Intl.NumberFormat('en-US');

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const date = point.payload?.date as string | undefined;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      {date && (
        <div className="mb-1 font-medium text-text-primary">{format(parseISO(date), 'EEE, MMM d')}</div>
      )}
      <div className="text-text-secondary">
        Volume: <span className="text-text-primary">{volumeFormat.format(point.value as number)} kg</span>
      </div>
    </div>
  );
}

/** Volume-per-day bar chart across the full month, zero-filled for days with no logged sets. */
export function VolumeTrendChart({ data }: VolumeTrendChartProps) {
  const hasVolume = data.some((d) => d.volume > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume Trend</CardTitle>
      </CardHeader>
      {hasVolume ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              barCategoryGap={2}
            >
              <CartesianGrid vertical={false} stroke={colors.border} />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) => format(parseISO(date), 'd')}
                tick={{ fill: colors.textTertiary, fontSize: 11 }}
                axisLine={{ stroke: colors.border }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: colors.textTertiary, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} />}
                cursor={{ fill: colors.surfaceHover }}
              />
              <Bar dataKey="volume" fill={colors.accent} radius={[2, 2, 0, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center text-sm text-text-tertiary">
          No logged sets this month yet.
        </div>
      )}
    </Card>
  );
}
