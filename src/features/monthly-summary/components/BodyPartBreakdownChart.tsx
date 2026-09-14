import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import { Card, CardHeader, CardTitle } from '../../../components';
import { bodyPartColors, bodyPartLabels, colors } from '../../../theme/tokens';
import type { BodyPart, MonthSummary } from '../../../lib/data/types';

export interface BodyPartBreakdownChartProps {
  data: MonthSummary['bodyPartBreakdown'];
}

function ChartTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const bodyPart = point.payload?.bodyPart as BodyPart | undefined;
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-medium text-text-primary">
        {bodyPart ? bodyPartLabels[bodyPart] : ''}
      </div>
      <div className="text-text-secondary">
        Sets: <span className="text-text-primary">{point.value}</span>
      </div>
    </div>
  );
}

/** Horizontal bar chart of sets logged per body part, colored by the shared body-part palette. */
export function BodyPartBreakdownChart({ data }: BodyPartBreakdownChartProps) {
  const sorted = [...data].sort((a, b) => b.setCount - a.setCount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Part Breakdown</CardTitle>
      </CardHeader>
      {sorted.length > 0 ? (
        <div style={{ height: Math.max(sorted.length * 40, 120) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="bodyPart"
                tickFormatter={(bodyPart: BodyPart) => bodyPartLabels[bodyPart]}
                tick={{ fill: colors.textSecondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                content={(props) => <ChartTooltip {...props} />}
                cursor={{ fill: colors.surfaceHover }}
              />
              <Bar dataKey="setCount" radius={[0, 3, 3, 0]} maxBarSize={20}>
                {sorted.map((entry) => (
                  <Cell key={entry.bodyPart} fill={bodyPartColors[entry.bodyPart]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center text-sm text-text-tertiary">
          No sets logged this month yet.
        </div>
      )}
    </Card>
  );
}
