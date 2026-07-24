const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  createParticipant: (payload) =>
    request('/participants', { method: 'POST', body: JSON.stringify(payload) }),
  startActivity: (id) => request(`/participants/${id}/activity/start`, { method: 'POST' }),
  endActivity: (id) => request(`/participants/${id}/activity/end`, { method: 'POST' }),
  endRecovery: (id) => request(`/participants/${id}/recovery/end`, { method: 'POST' }),
  getQuestions: () => request('/quiz/questions'),
  submitQuiz: (id, payload) =>
    request(`/quiz/${id}/submit`, { method: 'POST', body: JSON.stringify(payload) }),

  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  adminParticipants: (token) =>
    request('/admin/participants', { headers: { Authorization: `Bearer ${token}` } }),
  adminAnalytics: (token) =>
    request('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),

  exportUrl: (kind) => `${BASE_URL}/admin/export.${kind}`,
};

export { BASE_URL };
