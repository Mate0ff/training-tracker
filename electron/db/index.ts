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
  `);
}

export function closeDb() {
  db?.close();
  db = undefined;
}
