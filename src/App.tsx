import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Interviews from './pages/Interviews';
import ActiveInterviewLayout from './layouts/ActiveInterviewLayout';
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
      <Route path="/interviews/:id" element={<ActiveInterviewLayout />} />
      <Route path="/interviews/complete/:id" element={<InterviewComplete />} />
      <Route path="/interviews/results/:id" element={<InterviewResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
