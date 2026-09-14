// Shared data contracts for Training Tracker.
//
// OWNERSHIP: this file is owned by Agent 1 (scaffold). Other agents code
// against these types but do not modify them here. If a type needs to
// change, flag it to the orchestrator rather than editing directly.
// See docs/CONTRACTS.md for the full folder-ownership rules.

export type BodyPart =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'full_body';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: BodyPart;
  secondaryMuscles?: string[];
  equipment?: string;
  instructions: string[];
  imageUrl?: string; // optional, UI falls back to a body-part icon
  youtubeSearchUrl: string; // e.g. youtube.com/results?search_query=... — NOT a hardcoded video link
}

export interface SetEntry {
  setNumber: number;
  reps: number;
  weight: number; // weight in kg
}

export interface WorkoutLogEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  exerciseId: string;
  sets: SetEntry[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Set when this entry was auto-created from a RecurringPlan by ensureWeekMaterialized(). Undefined = one-off manual entry. */
  recurringPlanId?: string;
}

/**
 * A "repeat weekly" plan: a template that auto-materializes into a
 * WorkoutLogEntry on the same weekday every week going forward, via
 * ensureWeekMaterialized(). Creating a plan does not itself create any
 * WorkoutLogEntry.
 */
export interface RecurringPlan {
  id: string;
  exerciseId: string;
  /**
   * 0 = Monday ... 6 = Sunday — matches the week grid's Mon-Sun column
   * ordering. This is NOT the same as JS's `Date.getDay()` (0 = Sunday) —
   * convert carefully at every boundary.
   */
  dayOfWeek: number;
  sets: SetEntry[];
  notes?: string;
  /** False once the user "stops repeating". Inactive plans no longer materialize new entries; past materialized entries are untouched. */
  isActive: boolean;
  createdAt: string;
}

export interface DaySummary {
  date: string;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  bodyParts: BodyPart[];
}

export interface WeekSummary {
  weekStart: string;
  weekEnd: string;
  days: DaySummary[];
  totalWorkoutDays: number;
  totalSets: number;
  totalVolume: number;
}

export interface MonthSummary {
  month: string;
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  volumeByDay: { date: string; volume: number }[];
  bodyPartBreakdown: { bodyPart: BodyPart; setCount: number }[];
  mostTrainedBodyPart?: BodyPart;
}

export interface ExercisePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
}
