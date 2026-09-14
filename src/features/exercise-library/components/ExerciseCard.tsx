import { ExternalLink } from 'lucide-react';
import type { Exercise } from '../../../lib/data/types';
import { Badge, Button } from '../../../components';

export interface ExerciseCardProps {
  exercise: Exercise;
  /** When provided, renders a "Select" action (used by ExercisePicker). Omit for read-only display (LibraryPage). */
  onSelect?: (exercise: Exercise) => void;
}

export function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <div className="rounded-md border border-border bg-bg p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-text-primary">{exercise.name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {exercise.equipment && <Badge variant="default">{exercise.equipment}</Badge>}
            {exercise.secondaryMuscles?.map((muscle) => (
              <Badge key={muscle} variant="default">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
        {onSelect && (
          <Button size="sm" variant="primary" onClick={() => onSelect(exercise)}>
            Select
          </Button>
        )}
      </div>

      <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-text-secondary">
        {exercise.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <a
        href={exercise.youtubeSearchUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent-light hover:text-accent"
      >
        Watch tutorials on YouTube
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
