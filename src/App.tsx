
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GlobalLayout from './components/layout/GlobalLayout';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Interviews from './pages/Interviews';
import Analytics from './pages/Analytics';
import TestHistory from './pages/TestHistory';
import ScheduleInterview from './pages/ScheduleInterview';
import { InterviewInProgress } from './components/interviews/InterviewInProgress';
import NotFound from './pages/NotFound';
import { InterviewComplete } from './components/interviews/InterviewComplete';
import { InterviewResults } from './components/interviews/InterviewResults';
import SkillGalaxy from './pages/SkillGalaxy';
import Settings from './pages/Settings';
import Support from './pages/Support';

function App() {
  return (
    <Routes>
      {/* Landing page - no sidebar */}
      <Route path="/" element={
        <GlobalLayout hideSidebar hideFooter maxWidth="full">
          <Index />
        </GlobalLayout>
      } />
      
      {/* Auth page - minimal layout */}
      <Route path="/auth" element={
        <GlobalLayout hideSidebar hideNavbar hideFooter>
          <Auth />
        </GlobalLayout>
      } />
      
      {/* Standard layout pages with sidebar */}
      <Route path="/dashboard" element={
        <GlobalLayout>
          <Dashboard />
        </GlobalLayout>
      } />
      
      <Route path="/onboarding" element={
        <GlobalLayout hideSidebar>
          <Onboarding />
        </GlobalLayout>
      } />
      
      <Route path="/interviews" element={
        <GlobalLayout>
          <Interviews />
        </GlobalLayout>
      } />
      
      <Route path="/analytics" element={
        <GlobalLayout>
          <Analytics />
        </GlobalLayout>
      } />
      
      <Route path="/test-history" element={
        <GlobalLayout>
          <TestHistory />
        </GlobalLayout>
      } />
      
      <Route path="/schedule" element={
        <GlobalLayout>
          <ScheduleInterview />
        </GlobalLayout>
      } />
      
      <Route path="/progress-3d" element={
        <GlobalLayout>
          <SkillGalaxy />
        </GlobalLayout>
      } />
      
      <Route path="/settings" element={
        <GlobalLayout>
          <Settings />
        </GlobalLayout>
      } />
      
      <Route path="/support" element={
        <GlobalLayout>
          <Support />
        </GlobalLayout>
      } />
      
      {/* Interview views - fullscreen experience */}
      <Route path="/interviews/:id" element={
        <GlobalLayout hideSidebar hideNavbar hideFooter maxWidth="full">
          <InterviewInProgress />
        </GlobalLayout>
      } />
      
      <Route path="/interviews/active/:id" element={
        <GlobalLayout hideSidebar hideNavbar hideFooter maxWidth="full">
          <InterviewInProgress />
        </GlobalLayout>
      } />
      
      <Route path="/interviews/complete/:id" element={
        <GlobalLayout>
          <InterviewComplete />
        </GlobalLayout>
      } />
      
      <Route path="/interviews/results/:id" element={
        <GlobalLayout>
          <InterviewResults />
        </GlobalLayout>
      } />
      
      {/* 404 page */}
      <Route path="*" element={
        <GlobalLayout hideSidebar>
          <NotFound />
        </GlobalLayout>
      } />
    </Routes>
  );
}

export default App;
