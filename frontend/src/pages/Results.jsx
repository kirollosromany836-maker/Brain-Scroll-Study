import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext.jsx';

const GROUP_NAMES = {
  1: 'Short-form video scrolling',
  2: 'Reading',
  3: 'Quiet rest',
};

function fmtTime(seconds) {
  if (seconds === null || seconds === undefined) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function fmtScore(score) {
  if (score === null || score === undefined) return '—';
  return score.toFixed(1);
}

export default function Results() {
  const navigate = useNavigate();
  const { quizResult, participantId, assignedGroup } = useStudy();

  useEffect(() => {
    if (!quizResult) navigate('/');
  }, [quizResult, navigate]);

  if (!quizResult) return null;

  const { score, totalQuestions, totalTimeSeconds, groupAverage, overallAverage } = quizResult;

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Assessment complete</span>
        <h1 style={{ fontSize: '28px' }}>Thanks for participating</h1>
        <p>
          Participant ID <strong>{participantId}</strong> · Assigned activity:{' '}
          <span className={`badge badge-${assignedGroup}`}>{GROUP_NAMES[assignedGroup]}</span>
        </p>

        <div className="card">
          <h3 style={{ fontSize: '16px' }}>Your results</h3>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="value">{score} / {totalQuestions}</div>
              <div className="label">Score</div>
            </div>
            <div className="stat-box">
              <div className="value">{fmtTime(totalTimeSeconds)}</div>
              <div className="label">Completion time</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px' }}>How you compare</h3>
          <p style={{ fontSize: '13px' }}>
            Compared anonymously against other participants — no individual identities are shown.
          </p>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: 'var(--ink-soft)', fontSize: 12 }}>
                <th style={{ padding: '6px 0' }}></th>
                <th>Avg. score</th>
                <th>Avg. time</th>
                <th># participants</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>Your group</td>
                <td>{fmtScore(groupAverage.avgScore)} / {totalQuestions}</td>
                <td>{fmtTime(groupAverage.avgTimeSeconds)}</td>
                <td>{groupAverage.participantCount}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '8px 0', fontWeight: 600 }}>All participants</td>
                <td>{fmtScore(overallAverage.avgScore)} / {totalQuestions}</td>
                <td>{fmtTime(overallAverage.avgTimeSeconds)}</td>
                <td>{overallAverage.participantCount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="footer-note">
          You may now close this window. If you have questions about the study, please
          speak with the supervising researcher or teacher.
        </p>
      </div>
    </div>
  );
}
