import { useState } from 'react';
import { Pencil, Repeat, Trash2 } from 'lucide-react';
import { Button, Modal } from '../../../components';
import { bodyPartColors } from '../../../theme/tokens';
import type { Exercise, SetEntry, WorkoutLogEntry } from '../../../lib/data/types';
import { SetsRepsWeightForm } from './SetsRepsWeightForm';

export interface LoggedExerciseRowProps {
  entry: WorkoutLogEntry;
  exercise: Exercise | undefined;
  onUpdate: (id: string, patch: { sets?: SetEntry[]; notes?: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  /** Deactivates the RecurringPlan behind this entry — future weeks stop; this and past entries are untouched. */
  onStopRepeating: (recurringPlanId: string) => Promise<void>;
}

type RowView = 'detail' | 'edit' | 'delete';

/**
 * One logged exercise within a day: a compact name-only chip. Clicking it
 * opens a modal with the set/rep/weight detail, plus edit and delete
 * actions — keeps the day card itself to just exercise names.
 */
export function LoggedExerciseRow({
  entry,
  exercise,
  onUpdate,
  onDelete,
  onStopRepeating,
}: LoggedExerciseRowProps) {
  const [view, setView] = useState<RowView>();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStoppingRepeat, setIsStoppingRepeat] = useState(false);
  const [hasStoppedRepeat, setHasStoppedRepeat] = useState(false);

  const exerciseName = exercise?.name ?? 'Unknown exercise';
  const close = () => setView(undefined);

  const handleUpdate = async (sets: SetEntry[], notes: string | undefined) => {
    setIsSaving(true);
    try {
      await onUpdate(entry.id, { sets, notes });
      close();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
      close();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStopRepeating = async () => {
    if (!entry.recurringPlanId) return;
    setIsStoppingRepeat(true);
    try {
      await onStopRepeating(entry.recurringPlanId);
      setHasStoppedRepeat(true);
    } finally {
      setIsStoppingRepeat(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setView('detail')}
        title={exerciseName}
        className="flex w-full items-start gap-2 rounded-md border border-border bg-bg px-3 py-2 text-left transition-colors hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {exercise && (
          <span
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: bodyPartColors[exercise.bodyPart] }}
            aria-hidden="true"
          />
        )}
        <span className="line-clamp-2 flex-1 text-sm font-medium text-text-primary">
          {exerciseName}
        </span>
        {entry.recurringPlanId && (
          <Repeat size={12} className="mt-1 shrink-0 text-text-tertiary" aria-label="Repeats weekly" />
        )}
      </button>

      <Modal
        isOpen={view === 'detail'}
        onClose={close}
        title={exerciseName}
        footer={
          <>
            <Button variant="ghost" onClick={() => setView('delete')}>
              <Trash2 size={14} />
              Delete
            </Button>
            <Button variant="secondary" onClick={() => setView('edit')}>
              <Pencil size={14} />
              Edit
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          {entry.recurringPlanId && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface-hover px-3 py-2 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Repeat size={13} className="shrink-0 text-text-tertiary" />
                {hasStoppedRepeat
                  ? "Stopped — won't be added automatically anymore."
                  : 'Repeats weekly. Stopping only affects future weeks — this and past entries stay.'}
              </span>
              {!hasStoppedRepeat && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleStopRepeating}
                  disabled={isStoppingRepeat}
                >
                  {isStoppingRepeat ? 'Stopping…' : 'Stop repeating'}
                </Button>
              )}
            </div>
          )}
          <ul className="flex flex-col gap-1.5">
            {entry.sets.map((s) => (
              <li key={s.setNumber} className="flex items-center justify-between text-sm">
                <span className="text-text-tertiary">Set {s.setNumber}</span>
                <span className="font-medium text-text-primary">
                  {s.reps} reps × {s.weight} kg
                </span>
              </li>
            ))}
          </ul>
          {entry.notes && <p className="text-xs text-text-tertiary">{entry.notes}</p>}
        </div>
      </Modal>

      <Modal isOpen={view === 'edit'} onClose={() => setView('detail')} title={`Edit ${exerciseName}`}>
        <SetsRepsWeightForm
          exerciseName={exerciseName}
          initialSets={entry.sets}
          initialNotes={entry.notes}
          submitLabel="Save changes"
          isSubmitting={isSaving}
          onSubmit={handleUpdate}
          onCancel={() => setView('detail')}
        />
      </Modal>

      <Modal
        isOpen={view === 'delete'}
        onClose={() => setView('detail')}
        title="Delete logged exercise?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setView('detail')} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          This removes {exerciseName} from {entry.date}. This can't be undone.
        </p>
      </Modal>
    </>
  );
}
