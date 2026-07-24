import React, { createContext, useContext, useState } from 'react';

const StudyContext = createContext(null);

export function StudyProvider({ children }) {
  const [participantId, setParticipantId] = useState(null);
  const [assignedGroup, setAssignedGroup] = useState(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const value = {
    participantId,
    setParticipantId,
    assignedGroup,
    setAssignedGroup,
    consentGiven,
    setConsentGiven,
    quizResult,
    setQuizResult,
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside StudyProvider');
  return ctx;
}
