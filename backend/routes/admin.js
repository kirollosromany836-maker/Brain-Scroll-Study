const express = require('express');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');
const db = require('../db');
const { requireResearcher } = require('../middleware/auth');
const { decryptField } = require('../utils/crypto');

const router = express.Router();
router.use(requireResearcher);

function loadFullDataset() {
  const rows = db
    .prepare(
      `SELECT p.participant_id, p.age_enc, p.grade_enc, p.social_media_usage_enc, p.assigned_group,
              p.created_at, s.quiz_completed_at, s.total_score, s.total_time_seconds, s.status
       FROM participants p JOIN sessions s ON p.participant_id = s.participant_id
       ORDER BY p.created_at DESC`
    )
    .all();

  return rows.map((r) => ({
    participantId: r.participant_id,
    age: r.age_enc ? Number(decryptField(r.age_enc)) : null,
    grade: r.grade_enc ? decryptField(r.grade_enc) : null,
    socialMediaUsage: r.social_media_usage_enc ? decryptField(r.social_media_usage_enc) : null,
    assignedGroup: r.assigned_group,
    completedAt: r.quiz_completed_at,
    score: r.total_score,
    completionTimeSeconds: r.total_time_seconds,
    status: r.status,
  }));
}

function questionBreakdownFor(participantId) {
  return db
    .prepare(
      `SELECT question_id, part, is_correct, time_seconds FROM quiz_responses WHERE participant_id = ? ORDER BY id ASC`
    )
    .all(participantId)
    .map((q) => ({
      questionId: q.question_id,
      part: q.part,
      correct: !!q.is_correct,
      timeSeconds: q.time_seconds,
    }));
}

// GET /api/admin/participants - full table incl. per-question breakdown
router.get('/participants', (req, res) => {
  const data = loadFullDataset().map((p) => ({
    ...p,
    questionResults: questionBreakdownFor(p.participantId),
  }));
  res.json({ participants: data });
});

// GET /api/admin/analytics - aggregate stats for the dashboard + charts
router.get('/analytics', (req, res) => {
  const completed = loadFullDataset().filter((p) => p.status === 'complete');

  const byGroup = [1, 2, 3].map((g) => {
    const group = completed.filter((p) => p.assignedGroup === g);
    const n = group.length;
    const avgScore = n ? group.reduce((s, p) => s + (p.score || 0), 0) / n : null;
    const avgTime = n ? group.reduce((s, p) => s + (p.completionTimeSeconds || 0), 0) / n : null;
    return {
      group: g,
      label: g === 1 ? 'Social Media Scrolling' : g === 2 ? 'Reading' : 'Quiet Rest',
      participantCount: n,
      avgScore,
      avgCompletionTimeSeconds: avgTime,
    };
  });

  const scatter = completed.map((p) => ({
    group: p.assignedGroup,
    score: p.score,
    completionTimeSeconds: p.completionTimeSeconds,
  }));

  // Score distribution 0-10
  const distribution = Array.from({ length: 11 }, (_, score) => ({
    score,
    count: completed.filter((p) => p.score === score).length,
  }));

  res.json({
    totalParticipants: completed.length,
    byGroup,
    scatter,
    scoreDistribution: distribution,
  });
});

// GET /api/admin/export.csv
router.get('/export.csv', (req, res) => {
  const data = loadFullDataset();
  const fields = [
    'participantId',
    'age',
    'grade',
    'socialMediaUsage',
    'assignedGroup',
    'completedAt',
    'score',
    'completionTimeSeconds',
    'status',
  ];
  const parser = new Parser({ fields });
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment('brainscroll_participants.csv');
  res.send(csv);
});

// GET /api/admin/export.xlsx
router.get('/export.xlsx', (req, res) => {
  const data = loadFullDataset();
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  res.header(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.attachment('brainscroll_participants.xlsx');
  res.send(buffer);
});

module.exports = router;
