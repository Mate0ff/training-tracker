import { addDays, parseISO } from 'date-fns';
import type { Exercise, SetEntry, WorkoutLogEntry } from '../../../lib/data/types';
import { formatDateISO } from '../../../lib/data/dateUtils';
import { DayColumn } from './DayColumn';

export interface WeekGridProps {
  /** Monday of the viewed week, "YYYY-MM-DD". */
  weekStart: string;
  entriesByDate: Map<string, WorkoutLogEntry[]>;
  exercisesById: Map<string, Exercise>;
  onCreate: (input: {
    date: string;
    exerciseId: string;
    sets: SetEntry[];
    notes?: string;
  }) => Promise<unknown>;
  onUpdate: (id: string, patch: { sets?: SetEntry[]; notes?: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

/** Mon-Sun grid of DayColumns — stacks to one column on narrow screens. */
export function WeekGrid({
  weekStart,
  entriesByDate,
  exercisesById,
  onCreate,
  onUpdate,
  onDelete,
}: WeekGridProps) {
  const today = formatDateISO(new Date());
  const startDate = parseISO(weekStart);
  const days = Array.from({ length: 7 }, (_, i) => formatDateISO(addDays(startDate, i)));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((date) => (
        <DayColumn
          key={date}
          date={date}
          isToday={date === today}
          entries={entriesByDate.get(date) ?? []}
          exercisesById={exercisesById}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
