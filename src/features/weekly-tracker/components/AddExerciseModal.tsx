import { useState } from 'react';
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
}

/**
 * Two-step "+" flow for a day: pick an exercise (ExercisePicker, owned by
 * Agent 2), then enter its sets (SetsRepsWeightForm) and save.
 */
export function AddExerciseModal({ isOpen, date, onClose, onCreate }: AddExerciseModalProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    setSelectedExercise(undefined);
    onClose();
  };

  const handleSubmit = async (sets: SetEntry[], notes: string | undefined) => {
    if (!selectedExercise) return;
    setIsSaving(true);
    try {
      await onCreate({ date, exerciseId: selectedExercise.id, sets, notes });
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
          onSubmit={handleSubmit}
          onCancel={() => setSelectedExercise(undefined)}
        />
      </Modal>
    );
  }

  return <ExercisePicker isOpen={isOpen} onClose={handleClose} onSelect={setSelectedExercise} />;
}
