
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Interviews from './pages/Interviews';
import Analytics from './pages/Analytics';
import TestHistory from './pages/TestHistory';
import { InterviewInProgress } from './components/interviews/InterviewInProgress';
import NotFound from './pages/NotFound';
import { InterviewComplete } from './components/interviews/InterviewComplete';
import { InterviewResults } from './components/interviews/InterviewResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/interviews" element={<Interviews />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/test-history" element={<TestHistory />} />
      <Route path="/interviews/:id" element={<InterviewInProgress />} />
      <Route path="/interviews/active/:id" element={<InterviewInProgress />} />
      <Route path="/interviews/complete/:id" element={<InterviewComplete />} />
      <Route path="/interviews/results/:id" element={<InterviewResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
