import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext.jsx';
import { api } from '../api.js';

export default function ParticipantInfo() {
  const navigate = useNavigate();
  const { consentGiven, setParticipantId, setAssignedGroup } = useStudy();
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [socialMediaUsage, setSocialMediaUsage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!consentGiven) navigate('/');
  }, [consentGiven, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.createParticipant({
        age,
        grade,
        socialMediaUsage: socialMediaUsage || undefined,
      });
      setParticipantId(result.participantId);
      setAssignedGroup(result.assignedGroup);
      navigate('/activity');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">Step 1 of 4</span>
        <h1 style={{ fontSize: '28px' }}>A few quick details</h1>
        <p>
          We only ask for what the research needs. No name, email, or other identifying
          information is collected — you'll receive an anonymous participant ID.
        </p>

        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              min="10"
              max="20"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>

          <div className="field">
            <label htmlFor="grade">Grade level</label>
            <select id="grade" required value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Select grade</option>
              <option value="9">9th grade</option>
              <option value="10">10th grade</option>
              <option value="11">11th grade</option>
              <option value="12">12th grade</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="social">Average daily social media usage (optional)</label>
            <select
              id="social"
              value={socialMediaUsage}
              onChange={(e) => setSocialMediaUsage(e.target.value)}
            >
              <option value="">Prefer not to say</option>
              <option value="<30min">Less than 30 minutes</option>
              <option value="30-60min">30–60 minutes</option>
              <option value="1-2hr">1–2 hours</option>
              <option value="2-4hr">2–4 hours</option>
              <option value="4hr+">More than 4 hours</option>
            </select>
            <div className="hint">This helps us understand context, not to identify you.</div>
          </div>

          {error && (
            <p style={{ color: '#B9422A', fontSize: '14px' }}>{error}</p>
          )}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Assigning your activity…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
