import {
  Activity,
  ArrowUpFromLine,
  BicepsFlexed,
  Dumbbell,
  Footprints,
  HeartPulse,
  PersonStanding,
  Shield,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';
import type { BodyPart, Exercise } from '../../../lib/data/types';
import { bodyPartColors, bodyPartLabels } from '../../../theme/tokens';
import { Accordion, Badge } from '../../../components';
import { ExerciseCard } from './ExerciseCard';

// Fixed display order for the 8 body parts, independent of catalog order.
const BODY_PART_ORDER: BodyPart[] = [
  'chest',
  'back',
  'shoulders',
  'legs',
  'arms',
  'core',
  'cardio',
  'full_body',
];

// Fallback icon per body part — used instead of exercise photos, see
// ../assets/LICENSE_NOTES.md.
const bodyPartIcons: Record<
  BodyPart,
  ComponentType<{ size?: number; className?: string; style?: CSSProperties }>
> = {
  chest: Dumbbell,
  back: Shield,
  shoulders: ArrowUpFromLine,
  legs: Footprints,
  arms: BicepsFlexed,
  core: Activity,
  cardio: HeartPulse,
  full_body: PersonStanding,
};

export interface BodyPartAccordionProps {
  exercises: Exercise[];
  /** When provided, each ExerciseCard renders a "Select" action instead of being read-only. */
  onSelectExercise?: (exercise: Exercise) => void;
  allowMultiple?: boolean;
  className?: string;
}

/** Groups exercises by body part into an Accordion, one section per body part that has matches. */
export function BodyPartAccordion({
  exercises,
  onSelectExercise,
  allowMultiple = true,
  className,
}: BodyPartAccordionProps) {
  const items = BODY_PART_ORDER.map((bodyPart) => {
    const inBodyPart = exercises.filter((e) => e.bodyPart === bodyPart);
    return { bodyPart, exercises: inBodyPart };
  }).filter((group) => group.exercises.length > 0);

  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-text-secondary">No exercises match your search.</p>;
  }

  return (
    <Accordion
      className={className}
      allowMultiple={allowMultiple}
      defaultOpenIds={items.length === 1 ? [items[0].bodyPart] : []}
      items={items.map(({ bodyPart, exercises: groupExercises }) => {
        const Icon = bodyPartIcons[bodyPart];
        return {
          id: bodyPart,
          title: (
            <span className="flex items-center gap-2">
              <Icon size={16} className="shrink-0" style={{ color: bodyPartColors[bodyPart] }} />
              <span>{bodyPartLabels[bodyPart]}</span>
              <Badge colorHex={bodyPartColors[bodyPart]}>{groupExercises.length}</Badge>
            </span>
          ),
          content: (
            <div className="space-y-2">
              {groupExercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} onSelect={onSelectExercise} />
              ))}
            </div>
          ),
        };
      })}
    />
  );
}
