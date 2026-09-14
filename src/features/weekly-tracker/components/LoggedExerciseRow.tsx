import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, Modal } from '../../../components';
import { bodyPartColors } from '../../../theme/tokens';
import type { Exercise, SetEntry, WorkoutLogEntry } from '../../../lib/data/types';
import { SetsRepsWeightForm } from './SetsRepsWeightForm';

export interface LoggedExerciseRowProps {
  entry: WorkoutLogEntry;
  exercise: Exercise | undefined;
  onUpdate: (id: string, patch: { sets?: SetEntry[]; notes?: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
}

function formatSets(sets: SetEntry[]): string {
  return sets.map((s) => `${s.reps}×${s.weight}kg`).join(', ');
}

/** One logged exercise within a day: name, sets summary, edit + delete actions. */
export function LoggedExerciseRow({ entry, exercise, onUpdate, onDelete }: LoggedExerciseRowProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (sets: SetEntry[], notes: string | undefined) => {
    setIsSaving(true);
    try {
      await onUpdate(entry.id, { sets, notes });
      setIsEditOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(entry.id);
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group flex items-start justify-between gap-2 rounded-md border border-border bg-bg px-3 py-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {exercise && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: bodyPartColors[exercise.bodyPart] }}
              aria-hidden="true"
            />
          )}
          <span className="truncate text-sm font-medium text-text-primary">
            {exercise?.name ?? 'Unknown exercise'}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-text-secondary">{formatSets(entry.sets)}</p>
        {entry.notes && <p className="mt-0.5 truncate text-xs text-text-tertiary">{entry.notes}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsEditOpen(true)}
          aria-label={`Edit ${exercise?.name ?? 'exercise'}`}
        >
          <Pencil size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          aria-label={`Delete ${exercise?.name ?? 'exercise'}`}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit ${exercise?.name ?? 'exercise'}`}
      >
        <SetsRepsWeightForm
          exerciseName={exercise?.name ?? 'Exercise'}
          initialSets={entry.sets}
          initialNotes={entry.notes}
          submitLabel="Save changes"
          isSubmitting={isSaving}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete logged exercise?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          This removes {exercise?.name ?? 'this exercise'} ({formatSets(entry.sets)}) from{' '}
          {entry.date}. This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
