import React from 'react';
import CountdownTimer from '../../components/CountdownTimer.jsx';

export default function RestActivity({ duration, onComplete }) {
  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Activity — Group 3</span>
        <h1 style={{ fontSize: '22px' }}>Quiet rest</h1>
        <p>
          Please sit quietly for the next 10 minutes. Avoid using your phone or other
          devices if possible. You may close your eyes or simply look away from the
          screen — the timer will continue running.
        </p>

        <div className="card" style={{ padding: '60px 28px' }}>
          <CountdownTimer durationSeconds={duration} label="Time remaining" onComplete={onComplete} />
        </div>
      </div>
    </div>
  );
}
