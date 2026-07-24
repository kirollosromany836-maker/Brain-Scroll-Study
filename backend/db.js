/**
 * Database layer.
 *
 * Uses SQLite (via better-sqlite3) for local development and demos, since it
 * needs zero external setup. The schema below is intentionally plain SQL so
 * it ports almost unchanged to PostgreSQL/Supabase for production - see
 * README.md "Moving to PostgreSQL / Supabase" for the migration notes.
 *
 * No participant names are ever stored anywhere in this schema.
 */
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dbDir = path.dirname(process.env.SQLITE_PATH || './data/brainscroll.db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(process.env.SQLITE_PATH || './data/brainscroll.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS participants (
  participant_id TEXT PRIMARY KEY,      -- randomly generated, e.g. "BSS-7F2K9Q"
  age_enc TEXT,                         -- encrypted age
  grade_enc TEXT,                       -- encrypted grade level
  social_media_usage_enc TEXT,          -- encrypted, optional
  assigned_group INTEGER NOT NULL,      -- 1, 2, or 3
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  participant_id TEXT PRIMARY KEY REFERENCES participants(participant_id),
  activity_started_at TEXT,
  activity_ended_at TEXT,
  recovery_ended_at TEXT,
  quiz_started_at TEXT,
  quiz_completed_at TEXT,
  total_score INTEGER,                  -- out of 10
  total_time_seconds REAL,              -- total quiz completion time
  status TEXT NOT NULL DEFAULT 'assigned' -- assigned -> activity -> recovery -> quiz -> complete
);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  participant_id TEXT NOT NULL REFERENCES participants(participant_id),
  question_id TEXT NOT NULL,
  part TEXT NOT NULL,                   -- simple_math | simple_word | complex_math | complex_word
  is_correct INTEGER NOT NULL,          -- 0 or 1
  time_seconds REAL NOT NULL,
  submitted_answer TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS researchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`);

module.exports = db;
