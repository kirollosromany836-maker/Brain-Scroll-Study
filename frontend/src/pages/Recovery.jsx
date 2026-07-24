import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext.jsx';
import { api } from '../api.js';
import CountdownTimer from '../components/CountdownTimer.jsx';

export default function Recovery() {
  const navigate = useNavigate();
  const { participantId } = useStudy();

  useEffect(() => {
    if (!participantId) navigate('/');
  }, [participantId, navigate]);

  async function handleComplete() {
    try {
      await api.endRecovery(participantId);
    } catch {
      /* non-fatal */
    }
    navigate('/quiz');
  }

  if (!participantId) return null;

  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Brief pause</span>
        <h1 style={{ fontSize: '24px' }}>Please prepare for the problem-solving assessment.</h1>
        <p>Take a moment to settle in. The assessment will begin automatically.</p>

        <div className="card" style={{ padding: '60px 28px' }}>
          <CountdownTimer durationSeconds={40} label="Assessment begins in" onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
}
