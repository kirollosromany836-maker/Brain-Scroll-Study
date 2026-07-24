const express = require('express');
const db = require('../db');
const { QUIZ_QUESTIONS, PUBLIC_QUESTIONS } = require('../quizBank');

const router = express.Router();

// GET /api/quiz/questions - answers are stripped before sending to the client
router.get('/questions', (req, res) => {
  res.json({ questions: PUBLIC_QUESTIONS });
});

/**
 * POST /api/quiz/:participantId/submit
 * body: {
 *   responses: [{ questionId, answer, timeSeconds }],
 *   totalTimeSeconds
 * }
 *
 * Scoring happens entirely server-side against the private answer key,
 * so a participant can never inflate their own score client-side.
 */
router.post('/:participantId/submit', (req, res) => {
  const { participantId } = req.params;
  const { responses, totalTimeSeconds } = req.body || {};

  const participant = db
    .prepare('SELECT * FROM participants WHERE participant_id = ?')
    .get(participantId);
  if (!participant) return res.status(404).json({ error: 'Participant not found.' });

  if (!Array.isArray(responses) || responses.length !== QUIZ_QUESTIONS.length) {
    return res.status(400).json({ error: `Expected ${QUIZ_QUESTIONS.length} responses.` });
  }

  const answerKey = Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, q]));
  const now = new Date().toISOString();

  let score = 0;
  const insertResponse = db.prepare(
    `INSERT INTO quiz_responses (participant_id, question_id, part, is_correct, time_seconds, submitted_answer, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const detailedResults = [];

  const insertAll = db.transaction((items) => {
    for (const r of items) {
      const q = answerKey[r.questionId];
      if (!q) continue; // ignore unknown question ids
      const isCorrect = q.answer === r.answer ? 1 : 0;
      score += isCorrect;
      insertResponse.run(
        participantId,
        q.id,
        q.part,
        isCorrect,
        Number(r.timeSeconds) || 0,
        String(r.answer ?? ''),
        now
      );
      detailedResults.push({
        questionId: q.id,
        part: q.part,
        correct: !!isCorrect,
        timeSeconds: Number(r.timeSeconds) || 0,
      });
    }
  });

  insertAll(responses);

  db.prepare(
    `UPDATE sessions
     SET quiz_completed_at = ?, total_score = ?, total_time_seconds = ?, status = 'complete'
     WHERE participant_id = ?`
  ).run(now, score, Number(totalTimeSeconds) || 0, participantId);

  // Group + overall averages for the results page
  const groupAvg = db
    .prepare(
      `SELECT AVG(total_score) as avgScore, AVG(total_time_seconds) as avgTime, COUNT(*) as n
       FROM sessions s JOIN participants p ON s.participant_id = p.participant_id
       WHERE s.status = 'complete' AND p.assigned_group = ?`
    )
    .get(participant.assigned_group);

  const overallAvg = db
    .prepare(
      `SELECT AVG(total_score) as avgScore, AVG(total_time_seconds) as avgTime, COUNT(*) as n
       FROM sessions WHERE status = 'complete'`
    )
    .get();

  res.json({
    score,
    totalQuestions: QUIZ_QUESTIONS.length,
    totalTimeSeconds: Number(totalTimeSeconds) || 0,
    detailedResults,
    groupAverage: {
      avgScore: groupAvg.avgScore ?? null,
      avgTimeSeconds: groupAvg.avgTime ?? null,
      participantCount: groupAvg.n ?? 0,
    },
    overallAverage: {
      avgScore: overallAvg.avgScore ?? null,
      avgTimeSeconds: overallAvg.avgTime ?? null,
      participantCount: overallAvg.n ?? 0,
    },
    assignedGroup: participant.assigned_group,
  });
});

module.exports = router;
