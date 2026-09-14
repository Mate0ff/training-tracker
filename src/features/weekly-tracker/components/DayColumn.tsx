import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus } from 'lucide-react';
import clsx from 'clsx';
import { Button, Card } from '../../../components';
import type { Exercise, SetEntry, WorkoutLogEntry } from '../../../lib/data/types';
import { AddExerciseModal } from './AddExerciseModal';
import { LoggedExerciseRow } from './LoggedExerciseRow';

export interface DayColumnProps {
  date: string; // "YYYY-MM-DD"
  isToday: boolean;
  entries: WorkoutLogEntry[];
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

/** One day of the week: header, its logged exercises, and an "add exercise" action. */
export function DayColumn({
  date,
  isToday,
  entries,
  exercisesById,
  onCreate,
  onUpdate,
  onDelete,
}: DayColumnProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dayDate = parseISO(date);
  const sortedEntries = [...entries].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return (
    <Card
      className={clsx('flex h-full flex-col gap-3', isToday && 'border-accent/60')}
      data-today={isToday || undefined}
    >
      <div className="flex items-baseline justify-between">
        <span
          className={clsx(
            'text-xs font-semibold uppercase tracking-wide',
            isToday ? 'text-accent' : 'text-text-tertiary',
          )}
        >
          {format(dayDate, 'EEE')}
        </span>
        <span className={clsx('text-sm font-medium', isToday ? 'text-accent' : 'text-text-secondary')}>
          {format(dayDate, 'MMM d')}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {sortedEntries.length === 0 ? (
          <p className="py-4 text-center text-xs text-text-tertiary">No exercises logged</p>
        ) : (
          sortedEntries.map((entry) => (
            <LoggedExerciseRow
              key={entry.id}
              entry={entry}
              exercise={exercisesById.get(entry.exerciseId)}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="md"
        onClick={() => setIsAddOpen(true)}
        className="w-full"
      >
        <Plus size={14} />
        Add exercise
      </Button>

      <AddExerciseModal
        isOpen={isAddOpen}
        date={date}
        onClose={() => setIsAddOpen(false)}
        onCreate={onCreate}
      />
    </Card>
  );
}
