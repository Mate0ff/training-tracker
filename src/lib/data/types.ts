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
