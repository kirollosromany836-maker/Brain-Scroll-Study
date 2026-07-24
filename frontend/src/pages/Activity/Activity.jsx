import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudy } from '../../StudyContext.jsx';
import { api } from '../../api.js';
import SocialMediaActivity from './SocialMediaActivity.jsx';
import ReadingActivity from './ReadingActivity.jsx';
import RestActivity from './RestActivity.jsx';

const ACTIVITY_SECONDS = 10 * 60;

export default function Activity() {
  const navigate = useNavigate();
  const { participantId, assignedGroup } = useStudy();

  useEffect(() => {
    if (!participantId) {
      navigate('/');
      return;
    }
    api.startActivity(participantId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleActivityComplete() {
    try {
      await api.endActivity(participantId);
    } catch {
      /* non-fatal for the participant flow */
    }
    navigate('/recovery');
  }

  if (!participantId) return null;

  if (assignedGroup === 1) {
    return <SocialMediaActivity duration={ACTIVITY_SECONDS} onComplete={handleActivityComplete} />;
  }
  if (assignedGroup === 2) {
    return <ReadingActivity duration={ACTIVITY_SECONDS} onComplete={handleActivityComplete} />;
  }
  return <RestActivity duration={ACTIVITY_SECONDS} onComplete={handleActivityComplete} />;
}
