import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../StudyContext.jsx';

export default function Landing() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { setConsentGiven } = useStudy();

  function handleContinue() {
    setConsentGiven(true);
    navigate('/participant-info');
  }

  return (
    <div className="page">
      <div className="container">
        <span className="eyebrow">High School Research Study</span>
        <h1 style={{ fontSize: '38px' }}>BrainScroll Study</h1>
        <p>
          This study investigates how short, everyday activities — scrolling short-form
          video, reading, or simply resting — affect problem-solving performance right
          afterward. You'll spend 10 minutes on one randomly assigned activity, then
          complete a short cognitive assessment.
        </p>

        <div className="card">
          <h3 style={{ fontSize: '16px' }}>What to expect</h3>
          <div className="stat-grid">
            <div className="stat-box">
              <div className="value">~15</div>
              <div className="label">Minutes total</div>
            </div>
            <div className="stat-box">
              <div className="value">10</div>
              <div className="label">Assessment questions</div>
            </div>
            <div className="stat-box">
              <div className="value">1 of 3</div>
              <div className="label">Random activity group</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px' }}>Privacy statement</h3>
          <p>
            We do not collect your name or any directly identifying information. You'll
            be assigned an anonymous participant ID. The only information collected is
            your age, grade level, optional social media usage estimate, your assigned
            activity, and your assessment results. Data is encrypted at rest and used
            only in aggregate for educational research purposes. You may stop at any time
            without penalty.
          </p>
        </div>

        <div className="consent-box">
          <input
            type="checkbox"
            id="consent"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label htmlFor="consent">
            I understand that participation is voluntary and my anonymous data may be
            used for educational research purposes.
          </label>
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={!checked}
          onClick={handleContinue}
        >
          Continue
        </button>

        <p className="footer-note">
          Researcher access is separate.{' '}
          <a href="#/admin/login">Go to researcher login →</a>
        </p>
      </div>
    </div>
  );
}
