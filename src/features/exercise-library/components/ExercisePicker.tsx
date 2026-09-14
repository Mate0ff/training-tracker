import { useEffect, useMemo, useState } from 'react';
import type { Exercise, ExercisePickerProps } from '../../../lib/data/types';
import { getApi } from '../../../lib/data/api';
import { Input, Modal } from '../../../components';
import { BodyPartAccordion } from './BodyPartAccordion';

// Implements ExercisePickerProps from src/lib/data/types.ts — same
// body-part-accordion -> exercise-list browsing as LibraryPage, but each
// exercise renders a "Select" action that calls onSelect then closes.
// Imported by Agent 3's Weekly Tracker for its "add exercise to day" flow.

export function ExercisePicker({ isOpen, onClose, onSelect }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    getApi()
      .then((api) => api.listExercises())
      .then((result) => {
        if (!cancelled) setExercises(result);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => {
      return (
        e.name.toLowerCase().includes(q) ||
        e.equipment?.toLowerCase().includes(q) ||
        e.bodyPart.replace('_', ' ').includes(q)
      );
    });
  }, [exercises, query]);

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setQuery('');
    onClose();
  };

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Select Exercise" className="max-w-2xl">
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Search by name, equipment, or muscle…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search exercises"
          autoFocus
        />
        <div className="max-h-[55vh] overflow-y-auto">
          {loading ? (
            <p className="py-6 text-center text-sm text-text-secondary">Loading exercises…</p>
          ) : (
            <BodyPartAccordion exercises={filtered} onSelectExercise={handleSelect} />
          )}
        </div>
      </div>
    </Modal>
  );
}
