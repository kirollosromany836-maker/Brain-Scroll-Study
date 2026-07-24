import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './StudyContext.jsx';

import Landing from './pages/Landing.jsx';
import ParticipantInfo from './pages/ParticipantInfo.jsx';
import Activity from './pages/Activity/Activity.jsx';
import Recovery from './pages/Recovery.jsx';
import Quiz from './pages/Quiz.jsx';
import Results from './pages/Results.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return (
    <StudyProvider>
      <HashRouter>
        <div className="app-shell">
          <div className="pulse-bar" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/participant-info" element={<ParticipantInfo />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </HashRouter>
    </StudyProvider>
  );
}
