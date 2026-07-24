import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import { api } from '../api.js';

const GROUP_COLORS = { 1: '#B9622A', 2: '#2C5F62', 3: '#6B5B95' };
const GROUP_NAMES = { 1: 'Social Media', 2: 'Reading', 3: 'Quiet Rest' };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const t = sessionStorage.getItem('brainscroll_token');
    if (!t) {
      navigate('/admin/login');
      return;
    }
    setToken(t);
  }, [navigate]);

  useEffect(() => {
    if (!token) return;
    Promise.all([api.adminParticipants(token), api.adminAnalytics(token)])
      .then(([p, a]) => {
        setParticipants(p.participants);
        setAnalytics(a);
      })
      .catch((err) => {
        setError(err.message);
        if (err.message.includes('expired') || err.message.includes('Invalid')) {
          sessionStorage.removeItem('brainscroll_token');
          navigate('/admin/login');
        }
      });
  }, [token, navigate]);

  function handleLogout() {
    sessionStorage.removeItem('brainscroll_token');
    navigate('/admin/login');
  }

  function handleExport(kind) {
    const url = api.exportUrl(kind);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `brainscroll_participants.${kind}`;
        link.click();
      });
  }

  if (!token) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <div className="dash-nav">
        <div className="brand">BrainScroll Study — Researcher Dashboard</div>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <div className="dash-body">
        {error && <p style={{ color: '#B9422A' }}>{error}</p>}

        {analytics && (
          <>
            <div className="stat-grid" style={{ marginBottom: 24 }}>
              <div className="stat-box">
                <div className="value">{analytics.totalParticipants}</div>
                <div className="label">Completed participants</div>
              </div>
              {analytics.byGroup.map((g) => (
                <div className="stat-box" key={g.group}>
                  <div className="value">{g.participantCount}</div>
                  <div className="label">{g.label}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom: 24 }}>
              <div className="chart-card">
                <h3 style={{ fontSize: 15 }}>Average score by group</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.byGroup}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => (v ? v.toFixed(2) : v)} />
                    <Bar dataKey="avgScore" radius={[6, 6, 0, 0]}>
                      {analytics.byGroup.map((g) => (
                        <Cell key={g.group} fill={GROUP_COLORS[g.group]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3 style={{ fontSize: 15 }}>Average completion time by group (s)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.byGroup}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => (v ? v.toFixed(1) : v)} />
                    <Bar dataKey="avgCompletionTimeSeconds" radius={[6, 6, 0, 0]}>
                      {analytics.byGroup.map((g) => (
                        <Cell key={g.group} fill={GROUP_COLORS[g.group]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15 }}>Score vs. completion time (all participants)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEE" />
                  <XAxis
                    type="number"
                    dataKey="completionTimeSeconds"
                    name="Completion time (s)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis type="number" dataKey="score" name="Score" domain={[0, 10]} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  {[1, 2, 3].map((g) => (
                    <Scatter
                      key={g}
                      name={GROUP_NAMES[g]}
                      data={analytics.scatter.filter((d) => d.group === g)}
                      fill={GROUP_COLORS[g]}
                    />
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, margin: 0 }}>Participant data</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => handleExport('csv')}>
              Export CSV
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport('xlsx')}>
              Export Excel
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Participant ID</th>
                <th>Age</th>
                <th>Grade</th>
                <th>Group</th>
                <th>Completed</th>
                <th>Score</th>
                <th>Time (s)</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <React.Fragment key={p.participantId}>
                  <tr>
                    <td>{p.participantId}</td>
                    <td>{p.age ?? '—'}</td>
                    <td>{p.grade ?? '—'}</td>
                    <td>
                      <span className={`badge badge-${p.assignedGroup}`}>
                        {GROUP_NAMES[p.assignedGroup]}
                      </span>
                    </td>
                    <td>{p.completedAt ? new Date(p.completedAt).toLocaleString() : '—'}</td>
                    <td>{p.score ?? '—'}</td>
                    <td>{p.completionTimeSeconds ? p.completionTimeSeconds.toFixed(1) : '—'}</td>
                    <td>{p.status}</td>
                    <td>
                      {p.questionResults?.length > 0 && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: 12 }}
                          onClick={() =>
                            setExpandedId(expandedId === p.participantId ? null : p.participantId)
                          }
                        >
                          {expandedId === p.participantId ? 'Hide' : 'Details'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === p.participantId && (
                    <tr>
                      <td colSpan={9} style={{ background: 'var(--paper)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '8px 0' }}>
                          {p.questionResults.map((q) => (
                            <div
                              key={q.questionId}
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: 12,
                                padding: '6px 10px',
                                borderRadius: 6,
                                background: q.correct ? 'var(--green-soft)' : '#F7DCD3',
                                color: q.correct ? 'var(--green)' : '#B9422A',
                              }}
                            >
                              {q.questionId} · {q.correct ? 'correct' : 'incorrect'} · {q.timeSeconds.toFixed(1)}s
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
