const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { encryptField } = require('../utils/crypto');

const router = express.Router();

function generateParticipantId() {
  // Short, anonymous, non-guessable-enough ID. Not derived from any PII.
  const token = uuidv4().split('-')[0].toUpperCase();
  return `BSS-${token}`;
}

/**
 * Stratified random assignment: assign each new participant to whichever
 * of the 3 groups currently has the fewest participants, breaking ties
 * randomly. This keeps group sizes balanced over the course of the study
 * while still being random - a standard approach to avoid the selection
 * bias that pure coin-flip randomization can produce in small samples.
 */
function assignGroup() {
  const counts = db
    .prepare(
      `SELECT assigned_group, COUNT(*) as n FROM participants GROUP BY assigned_group`
    )
    .all();

  const tally = { 1: 0, 2: 0, 3: 0 };
  counts.forEach((row) => {
    tally[row.assigned_group] = row.n;
  });

  const minCount = Math.min(tally[1], tally[2], tally[3]);
  const candidates = [1, 2, 3].filter((g) => tally[g] === minCount);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// POST /api/participants  { age, grade, socialMediaUsage? }
router.post('/', (req, res) => {
  const { age, grade, socialMediaUsage } = req.body || {};

  const ageNum = Number(age);
  if (!ageNum || ageNum < 10 || ageNum > 20) {
    return res.status(400).json({ error: 'Please provide a valid age between 10 and 20.' });
  }
  if (!grade || typeof grade !== 'string') {
    return res.status(400).json({ error: 'Please provide a grade level.' });
  }

  let participantId = generateParticipantId();
  // Extremely unlikely collision, but guard anyway
  while (db.prepare('SELECT 1 FROM participants WHERE participant_id = ?').get(participantId)) {
    participantId = generateParticipantId();
  }

  const group = assignGroup();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO participants (participant_id, age_enc, grade_enc, social_media_usage_enc, assigned_group, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    participantId,
    encryptField(ageNum),
    encryptField(grade),
    socialMediaUsage ? encryptField(socialMediaUsage) : null,
    group,
    now
  );

  db.prepare(
    `INSERT INTO sessions (participant_id, status) VALUES (?, 'assigned')`
  ).run(participantId);

  res.status(201).json({ participantId, assignedGroup: group });
});

// POST /api/participants/:id/activity/start
router.post('/:id/activity/start', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare(`UPDATE sessions SET activity_started_at = ?, status = 'activity' WHERE participant_id = ?`)
    .run(new Date().toISOString(), id);
  if (result.changes === 0) return res.status(404).json({ error: 'Participant not found.' });
  res.json({ ok: true });
});

// POST /api/participants/:id/activity/end
router.post('/:id/activity/end', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare(`UPDATE sessions SET activity_ended_at = ?, status = 'recovery' WHERE participant_id = ?`)
    .run(new Date().toISOString(), id);
  if (result.changes === 0) return res.status(404).json({ error: 'Participant not found.' });
  res.json({ ok: true });
});

// POST /api/participants/:id/recovery/end
router.post('/:id/recovery/end', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare(`UPDATE sessions SET recovery_ended_at = ?, status = 'quiz', quiz_started_at = ? WHERE participant_id = ?`)
    .run(new Date().toISOString(), new Date().toISOString(), id);
  if (result.changes === 0) return res.status(404).json({ error: 'Participant not found.' });
  res.json({ ok: true });
});

// GET /api/participants/:id  (minimal status check, no PII returned)
router.get('/:id', (req, res) => {
  const row = db
    .prepare(
      `SELECT p.participant_id, p.assigned_group, s.status
       FROM participants p JOIN sessions s ON p.participant_id = s.participant_id
       WHERE p.participant_id = ?`
    )
    .get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Participant not found.' });
  res.json(row);
});

module.exports = router;
