import { useRef, useState } from 'react';
import { Modal } from '../../../components';
import { ExercisePicker } from '../../exercise-library';
import type { Exercise, SetEntry } from '../../../lib/data/types';
import { SetsRepsWeightForm } from './SetsRepsWeightForm';

export interface AddExerciseModalProps {
  isOpen: boolean;
  /** "YYYY-MM-DD" — the day this exercise is being logged against. */
  date: string;
  onClose: () => void;
  onCreate: (input: {
    date: string;
    exerciseId: string;
    sets: SetEntry[];
    notes?: string;
  }) => Promise<unknown>;
  onCreateRecurring: (input: {
    date: string;
    exerciseId: string;
    sets: SetEntry[];
    notes?: string;
  }) => Promise<unknown>;
}

/**
 * Two-step "+" flow for a day: pick an exercise (ExercisePicker, owned by
 * Agent 2), then enter its sets (SetsRepsWeightForm) and save.
 */
export function AddExerciseModal({
  isOpen,
  date,
  onClose,
  onCreate,
  onCreateRecurring,
}: AddExerciseModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [isSaving, setIsSaving] = useState(false);
  // ExercisePicker's handleSelect calls onSelect(exercise) then onClose()
  // synchronously — both state updates land in the same batch, so a plain
  // onClose={handleClose} would immediately clobber the just-picked
  // exercise back to undefined. This ref lets handlePickerClose tell "closed
  // because a selection was made" apart from "closed via cancel/backdrop".
  const justSelectedRef = useRef(false);

  const handleClose = () => {
    setSelectedExercise(undefined);
    onClose();
  };

  const handlePickerSelect = (exercise: Exercise) => {
    justSelectedRef.current = true;
    setSelectedExercise(exercise);
  };

  const handlePickerClose = () => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return; // selection in progress — move to the sets-form step, don't close the flow
    }
    handleClose();
  };

  const handleSubmit = async (
    sets: SetEntry[],
    notes: string | undefined,
    repeatWeekly: boolean,
  ) => {
    if (!selectedExercise) return;
    setIsSaving(true);
    try {
      // Repeat weekly materializes this day's instance itself (via
      // ensureWeekMaterialized) — don't also call onCreate, or it'd double up.
      if (repeatWeekly) {
        await onCreateRecurring({ date, exerciseId: selectedExercise.id, sets, notes });
      } else {
        await onCreate({ date, exerciseId: selectedExercise.id, sets, notes });
      }
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (selectedExercise) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title={`Log ${selectedExercise.name}`}>
        <SetsRepsWeightForm
          exerciseName={selectedExercise.name}
          submitLabel="Add to day"
          isSubmitting={isSaving}
          showRepeatOption
          onSubmit={handleSubmit}
          onCancel={() => setSelectedExercise(undefined)}
        />
      </Modal>
    );
  }

  return <ExercisePicker isOpen={isOpen} onClose={handlePickerClose} onSelect={handlePickerSelect} />;
}
