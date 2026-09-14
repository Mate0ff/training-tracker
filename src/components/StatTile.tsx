import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Card } from './Card';

export interface StatTileProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  accentColor?: string;
  className?: string;
}

export function StatTile({ label, value, icon, accentColor, className }: StatTileProps) {
  return (
    <Card className={clsx('flex items-center gap-4', className)}>
      {icon && (
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
          style={{
            backgroundColor: `${accentColor ?? '#F97316'}1F`,
            color: accentColor ?? '#F97316',
          }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {label}
        </div>
        <div className="mt-0.5 text-xl font-semibold text-text-primary">{value}</div>
      </div>
    </Card>
  );
}
