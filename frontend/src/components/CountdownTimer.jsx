import React, { useEffect, useRef, useState } from 'react';

/**
 * Simple countdown timer. Calls onComplete exactly once when it reaches 0.
 * durationSeconds: total countdown length
 * label: small caption shown above the readout
 */
export default function CountdownTimer({ durationSeconds, label, onComplete, onTick }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const completedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (onTick) onTick(next);
        if (next <= 0 && !completedRef.current) {
          completedRef.current = true;
          clearInterval(interval);
          if (onComplete) onComplete();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, '0');
  const secs = (remaining % 60).toString().padStart(2, '0');

  return (
    <div className="timer-ring-wrap">
      {label && <div className="timer-label">{label}</div>}
      <div className="timer-readout">
        {mins}:{secs}
      </div>
    </div>
  );
}
