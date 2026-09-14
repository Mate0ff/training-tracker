import { app } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

// better-sqlite3 is a native addon (a compiled .node binary). It is loaded
// via a runtime require (rather than a static ESM import) so the Vite/
// Rolldown build for the main process never tries to bundle the binary —
// it just leaves this require call in place and Node resolves it directly
// from node_modules at runtime, same as electron-builder's asarUnpack.
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Database = require('better-sqlite3') as typeof import('better-sqlite3');

export type WorkoutDatabase = InstanceType<typeof Database>;

let db: WorkoutDatabase | undefined;

/** Lazily opens (and migrates) the app's single SQLite database file. */
export function getDb(): WorkoutDatabase {
  if (db) return db;

  const userDataDir = app.getPath('userData');
  fs.mkdirSync(userDataDir, { recursive: true });
  const dbPath = path.join(userDataDir, 'training-tracker.db');

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  migrate(db);
  return db;
}

function migrate(database: WorkoutDatabase) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS workout_log_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      sets TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_workout_log_entries_date ON workout_log_entries (date);

    -- "Repeat weekly" plans — see RecurringPlan in src/lib/data/types.ts.
    -- day_of_week: 0 = Monday ... 6 = Sunday (NOT JS Date.getDay()'s 0 = Sunday).
    CREATE TABLE IF NOT EXISTS recurring_plans (
      id TEXT PRIMARY KEY,
      exercise_id TEXT NOT NULL,
      day_of_week INTEGER NOT NULL,
      sets TEXT NOT NULL,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
  `);

  // recurring_plan_id was added after workout_log_entries already shipped,
  // so it's applied via ALTER TABLE (not the CREATE TABLE above) — that
  // keeps existing databases intact on upgrade. Guarded via PRAGMA
  // table_info so this stays idempotent on both a fresh db and one that
  // already has the column.
  const columns = database.prepare('PRAGMA table_info(workout_log_entries)').all() as {
    name: string;
  }[];
  if (!columns.some((c) => c.name === 'recurring_plan_id')) {
    database.exec('ALTER TABLE workout_log_entries ADD COLUMN recurring_plan_id TEXT');
  }
  database.exec(
    'CREATE INDEX IF NOT EXISTS idx_workout_log_entries_recurring_plan_id ON workout_log_entries (recurring_plan_id)',
  );
}

export function closeDb() {
  db?.close();
  db = undefined;
}
