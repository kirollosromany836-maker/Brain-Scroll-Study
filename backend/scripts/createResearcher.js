/**
 * Usage:
 *   node scripts/createResearcher.js <username> <password>
 *
 * Creates a new researcher account, or updates the password if the
 * username already exists. Run this once after setup to create your
 * dashboard login, instead of hardcoding credentials anywhere.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');

const [, , username, password] = process.argv;

if (!username || !password) {
  console.error('Usage: node scripts/createResearcher.js <username> <password>');
  process.exit(1);
}

if (password.length < 10) {
  console.error('Please choose a password with at least 10 characters.');
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(password, 12);
const existing = db.prepare('SELECT id FROM researchers WHERE username = ?').get(username);

if (existing) {
  db.prepare('UPDATE researchers SET password_hash = ? WHERE username = ?').run(passwordHash, username);
  console.log(`Password updated for researcher "${username}".`);
} else {
  db.prepare(
    'INSERT INTO researchers (username, password_hash, created_at) VALUES (?, ?, ?)'
  ).run(username, passwordHash, new Date().toISOString());
  console.log(`Researcher account "${username}" created.`);
}
