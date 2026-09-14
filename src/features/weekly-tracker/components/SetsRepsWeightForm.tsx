import { useState } from 'react';
import type { FormEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Input } from '../../../components';
import type { SetEntry } from '../../../lib/data/types';

export interface SetsRepsWeightFormProps {
  exerciseName: string;
  initialSets?: SetEntry[];
  initialNotes?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  /** Show the "Repeat weekly" checkbox (only meaningful when logging a brand-new entry). */
  showRepeatOption?: boolean;
  onSubmit: (
    sets: SetEntry[],
    notes: string | undefined,
    repeatWeekly: boolean,
  ) => void | Promise<void>;
  onCancel: () => void;
}

interface DraftSet {
  reps: string;
  weight: string;
}

const emptyDraftSet: DraftSet = { reps: '', weight: '' };

function toDraftSets(sets?: SetEntry[]): DraftSet[] {
  if (!sets || sets.length === 0) return [{ ...emptyDraftSet }];
  return sets.map((s) => ({ reps: String(s.reps), weight: String(s.weight) }));
}

/**
 * Reusable set-entry form: one row of reps/weight per set, "add set",
 * per-row remove. Used both to log a new exercise (AddExerciseModal) and
 * to edit an existing entry's sets (LoggedExerciseRow).
 */
export function SetsRepsWeightForm({
  exerciseName,
  initialSets,
  initialNotes,
  submitLabel = 'Save',
  isSubmitting = false,
  showRepeatOption = false,
  onSubmit,
  onCancel,
}: SetsRepsWeightFormProps) {
  const [draftSets, setDraftSets] = useState<DraftSet[]>(() => toDraftSets(initialSets));
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [formError, setFormError] = useState<string>();

  const updateSet = (index: number, patch: Partial<DraftSet>) => {
    setDraftSets((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addSet = () => {
    setDraftSets((rows) => {
      const last = rows[rows.length - 1];
      return [...rows, last ? { ...last } : { ...emptyDraftSet }];
    });
  };

  const removeSet = (index: number) => {
    setDraftSets((rows) => rows.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormError(undefined);

    const sets: SetEntry[] = [];
    for (const row of draftSets) {
      const reps = Number(row.reps);
      const weight = row.weight.trim() === '' ? 0 : Number(row.weight);
      if (row.reps.trim() === '' || !Number.isFinite(reps) || reps <= 0) continue;
      if (!Number.isFinite(weight) || weight < 0) continue;
      sets.push({ setNumber: sets.length + 1, reps, weight });
    }

    if (sets.length === 0) {
      setFormError('Enter at least one set with reps greater than 0.');
      return;
    }

    void onSubmit(sets, notes.trim() === '' ? undefined : notes.trim(), repeatWeekly);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-text-secondary">{exerciseName}</p>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          <span>Reps</span>
          <span>Weight (kg)</span>
          <span className="sr-only">Remove</span>
        </div>
        {draftSets.map((row, index) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
            <Input
              type="number"
              min={1}
              inputMode="numeric"
              aria-label={`Set ${index + 1} reps`}
              value={row.reps}
              onChange={(e) => updateSet(index, { reps: e.target.value })}
            />
            <Input
              type="number"
              min={0}
              step="0.5"
              inputMode="decimal"
              aria-label={`Set ${index + 1} weight in kg`}
              value={row.weight}
              onChange={(e) => updateSet(index, { weight: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeSet(index)}
              disabled={draftSets.length === 1}
              aria-label={`Remove set ${index + 1}`}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addSet} className="self-start">
          <Plus size={14} />
          Add set
        </Button>
      </div>

      <Input
        label="Notes (optional)"
        placeholder="e.g. felt strong, form cue…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {showRepeatOption && (
        <label className="flex cursor-pointer items-start gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={repeatWeekly}
            onChange={(e) => setRepeatWeekly(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-bg accent-accent focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <span>
            Repeat weekly
            <span className="block text-xs text-text-tertiary">
              Automatically logs this exercise on this day every week.
            </span>
          </span>
        </label>
      )}

      {formError && <p className="text-xs text-muted-danger">{formError}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
