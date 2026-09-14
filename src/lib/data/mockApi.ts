import { v4 as uuidv4 } from 'uuid';
import type { WorkoutLogEntry } from './types';
import type { WorkoutTrackerApi } from './api';
import { formatDateISO, getCurrentMonthRange, getCurrentWeekRange } from './dateUtils';
import { computeMonthSummary, computeWeekSummary } from './summaries';
import { exercisesSeedProposal } from '../../features/exercise-library/data/exercisesSeedProposal';

// In-memory implementation of WorkoutTrackerApi. Lets Agents 2-4 build and
// run their features in isolation (`npm run dev` in a browser, or wired
// into the app) without needing the Electron/better-sqlite3 layer.
// Data resets on reload — it is not persisted anywhere.

// The single exercise catalog (see docs/CONTRACTS.md), reused by
// electron/ipc/persistence.ts for the real API implementation too. Curated
// by Agent 2 (Exercise Library) in exercisesSeedProposal.ts — 5 exercises
// per BodyPart. Its first 8 entries are byte-identical (same ids) to the
// original seed, so seedLogEntries() below keeps working unchanged.
export const seedExercises = exercisesSeedProposal;

function seedLogEntries(): WorkoutLogEntry[] {
  const today = new Date();
  const makeEntry = (
    daysAgo: number,
    exerciseId: string,
    sets: { reps: number; weight: number }[],
  ): WorkoutLogEntry => {
    const date = formatDateISO(new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000));
    const now = new Date().toISOString();
    return {
      id: uuidv4(),
      date,
      exerciseId,
      sets: sets.map((s, i) => ({ setNumber: i + 1, ...s })),
      createdAt: now,
      updatedAt: now,
    };
  };

  return [
    makeEntry(0, 'ex-barbell-bench-press', [
      { reps: 8, weight: 60 },
      { reps: 8, weight: 60 },
      { reps: 6, weight: 65 },
    ]),
    makeEntry(0, 'ex-pull-up', [
      { reps: 10, weight: 0 },
      { reps: 8, weight: 0 },
    ]),
    makeEntry(1, 'ex-back-squat', [
      { reps: 5, weight: 80 },
      { reps: 5, weight: 85 },
      { reps: 5, weight: 85 },
    ]),
    makeEntry(3, 'ex-overhead-press', [
      { reps: 8, weight: 35 },
      { reps: 8, weight: 35 },
    ]),
    makeEntry(3, 'ex-plank', [{ reps: 1, weight: 0 }]),
    makeEntry(6, 'ex-treadmill-run', [{ reps: 1, weight: 0 }]),
  ];
}

let logEntries: WorkoutLogEntry[] = seedLogEntries();

function bodyPartOf(exerciseId: string) {
  return seedExercises.find((e) => e.id === exerciseId)?.bodyPart;
}

export const mockApi: WorkoutTrackerApi = {
  async listExercises() {
    return seedExercises;
  },

  async getExercise(id) {
    return seedExercises.find((e) => e.id === id);
  },

  async listLogEntriesForDate(date) {
    return logEntries.filter((e) => e.date === date);
  },

  async listLogEntriesForRange(startDate, endDate) {
    return logEntries.filter((e) => e.date >= startDate && e.date <= endDate);
  },

  async createLogEntry(entry) {
    const now = new Date().toISOString();
    const created: WorkoutLogEntry = { ...entry, id: uuidv4(), createdAt: now, updatedAt: now };
    logEntries.push(created);
    return created;
  },

  async updateLogEntry(id, patch) {
    const idx = logEntries.findIndex((e) => e.id === id);
    if (idx === -1) throw new Error(`Log entry not found: ${id}`);
    const updated: WorkoutLogEntry = {
      ...logEntries[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    logEntries[idx] = updated;
    return updated;
  },

  async deleteLogEntry(id) {
    logEntries = logEntries.filter((e) => e.id !== id);
  },

  async getWeekSummary(weekStartDate) {
    const { end } = getCurrentWeekRange(new Date(weekStartDate));
    const entries = logEntries.filter((e) => e.date >= weekStartDate && e.date <= end);
    return computeWeekSummary(weekStartDate, end, entries, bodyPartOf);
  },

  async getMonthSummary(month) {
    const reference = new Date(`${month}-01T00:00:00`);
    const { start, end } = getCurrentMonthRange(reference);
    const entries = logEntries.filter((e) => e.date >= start && e.date <= end);
    return computeMonthSummary(month, start, end, entries, bodyPartOf);
  },
};
