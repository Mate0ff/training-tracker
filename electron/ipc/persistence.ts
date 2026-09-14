import { ipcMain } from 'electron';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db';
import { seedExercises } from '../../src/lib/data/mockApi';
import { computeMonthSummary, computeWeekSummary } from '../../src/lib/data/summaries';
import { getCurrentMonthRange, getCurrentWeekRange } from '../../src/lib/data/dateUtils';
import type { BodyPart, SetEntry, WorkoutLogEntry } from '../../src/lib/data/types';

// Real implementation of WorkoutTrackerApi, backed by better-sqlite3.
// Registered as ipcMain handlers here; bridged to the renderer as
// window.trackerApi by electron/preload.ts. Channel names below must match
// the ones invoked from preload.ts exactly.

interface LogEntryRow {
  id: string;
  date: string;
  exercise_id: string;
  sets: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToEntry(row: LogEntryRow): WorkoutLogEntry {
  return {
    id: row.id,
    date: row.date,
    exerciseId: row.exercise_id,
    sets: JSON.parse(row.sets) as SetEntry[],
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function bodyPartOf(exerciseId: string): BodyPart | undefined {
  return seedExercises.find((e) => e.id === exerciseId)?.bodyPart;
}

export function registerPersistenceHandlers() {
  const db = getDb();

  ipcMain.handle('trackerApi:listExercises', async () => seedExercises);

  ipcMain.handle('trackerApi:getExercise', async (_event, id: string) =>
    seedExercises.find((e) => e.id === id),
  );

  ipcMain.handle('trackerApi:listLogEntriesForDate', async (_event, date: string) => {
    const rows = db
      .prepare<[string], LogEntryRow>(
        'SELECT * FROM workout_log_entries WHERE date = ? ORDER BY created_at ASC',
      )
      .all(date);
    return rows.map(rowToEntry);
  });

  ipcMain.handle(
    'trackerApi:listLogEntriesForRange',
    async (_event, startDate: string, endDate: string) => {
      const rows = db
        .prepare<[string, string], LogEntryRow>(
          'SELECT * FROM workout_log_entries WHERE date >= ? AND date <= ? ORDER BY date ASC, created_at ASC',
        )
        .all(startDate, endDate);
      return rows.map(rowToEntry);
    },
  );

  ipcMain.handle(
    'trackerApi:createLogEntry',
    async (_event, entry: Omit<WorkoutLogEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = randomUUID();
      const now = new Date().toISOString();
      db.prepare(
        `INSERT INTO workout_log_entries (id, date, exercise_id, sets, notes, created_at, updated_at)
         VALUES (@id, @date, @exerciseId, @sets, @notes, @createdAt, @updatedAt)`,
      ).run({
        id,
        date: entry.date,
        exerciseId: entry.exerciseId,
        sets: JSON.stringify(entry.sets),
        notes: entry.notes ?? null,
        createdAt: now,
        updatedAt: now,
      });
      const created: WorkoutLogEntry = { ...entry, id, createdAt: now, updatedAt: now };
      return created;
    },
  );

  ipcMain.handle(
    'trackerApi:updateLogEntry',
    async (_event, id: string, patch: Partial<Pick<WorkoutLogEntry, 'sets' | 'notes'>>) => {
      const existing = db
        .prepare<[string], LogEntryRow>('SELECT * FROM workout_log_entries WHERE id = ?')
        .get(id);
      if (!existing) throw new Error(`Log entry not found: ${id}`);

      const now = new Date().toISOString();
      const sets = patch.sets ? JSON.stringify(patch.sets) : existing.sets;
      const notes = patch.notes !== undefined ? patch.notes : existing.notes;

      db.prepare(
        'UPDATE workout_log_entries SET sets = ?, notes = ?, updated_at = ? WHERE id = ?',
      ).run(sets, notes, now, id);

      const updated = db
        .prepare<[string], LogEntryRow>('SELECT * FROM workout_log_entries WHERE id = ?')
        .get(id)!;
      return rowToEntry(updated);
    },
  );

  ipcMain.handle('trackerApi:deleteLogEntry', async (_event, id: string) => {
    db.prepare('DELETE FROM workout_log_entries WHERE id = ?').run(id);
  });

  ipcMain.handle('trackerApi:getWeekSummary', async (_event, weekStartDate: string) => {
    const { end } = getCurrentWeekRange(new Date(`${weekStartDate}T00:00:00`));
    const rows = db
      .prepare<[string, string], LogEntryRow>(
        'SELECT * FROM workout_log_entries WHERE date >= ? AND date <= ?',
      )
      .all(weekStartDate, end);
    return computeWeekSummary(weekStartDate, end, rows.map(rowToEntry), bodyPartOf);
  });

  ipcMain.handle('trackerApi:getMonthSummary', async (_event, month: string) => {
    const reference = new Date(`${month}-01T00:00:00`);
    const { start, end } = getCurrentMonthRange(reference);
    const rows = db
      .prepare<[string, string], LogEntryRow>(
        'SELECT * FROM workout_log_entries WHERE date >= ? AND date <= ?',
      )
      .all(start, end);
    return computeMonthSummary(month, start, end, rows.map(rowToEntry), bodyPartOf);
  });
}
