
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ActiveInterviewLayout } from './ActiveInterviewLayout';
import { LoadingScreen } from './LoadingScreen';
import { InterviewErrorView } from './InterviewErrorView';
import { ActiveInterviewContent } from './ActiveInterviewContent';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const InterviewInProgress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [retryCount, setRetryCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Get the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          toast.error("Error fetching user session");
          setAuthChecked(true);
          return;
        }
        
        if (data.session) {
          console.log("User authenticated:", data.session.user.id);
          setUserId(data.session.user.id);
        } else {
          console.log("No active session found");
          // Handle case where user is not logged in
          setUserId(null);
          toast.error("You must be logged in to access interviews");
        }
        setAuthChecked(true);
      } catch (err) {
        console.error("Unexpected error in getCurrentUser:", err);
        setAuthChecked(true);
      }
    };

    getCurrentUser();
  }, []);

  // Use the interview session hook
  const {
    session,
    loading,
    error,
    errorType,
    generatingQuestions,
    handleAnswerSubmit,
    handleTimeUp,
    handleRetry: hookHandleRetry
  } = useInterviewSession({ 
    id, 
    retryCount, 
    userId 
  });

  // Handle retry with local state
  const handleRetry = () => {
    console.log("Retrying interview...");
    setRetryCount(prev => prev + 1);
    hookHandleRetry();
  };

  // Debug logs
  useEffect(() => {
    console.log("Current interview state:", { 
      loading, error, errorType, generatingQuestions, 
      sessionExists: !!session,
      authChecked,
      userId
    });
  }, [loading, error, errorType, generatingQuestions, session, authChecked, userId]);

  // Show loading screen until auth is checked
  if (!authChecked) {
    return <LoadingScreen message="Verifying your account..." />;
  }

  // Show error if no user is logged in
  if (authChecked && !userId) {
    return <InterviewErrorView 
      error="You must be logged in to access interviews" 
      onRetry={() => window.location.href = "/auth"} 
      errorType="permissions"
    />;
  }

  // Show loading screen while initializing
  if (loading || generatingQuestions) {
    return <LoadingScreen message={generatingQuestions ? "Generating personalized interview questions..." : "Loading your interview..."} />;
  }

  // Show error view if something went wrong
  if (error || !session) {
    // Check if error is related to permissions/RLS
    const isPermissionError = error?.includes('row-level security') || 
                              error?.includes('violates row-level security policy') || 
                              error?.includes('Failed to store interview questions');

    return <InterviewErrorView 
      error={error || "Session not found"} 
      onRetry={handleRetry} 
      errorType={isPermissionError ? 'permissions' : errorType}
    />;
  }

  // Get the current question
  const currentQuestionIndex = Object.keys(session.answers).length;
  const currentQuestion = session.questions[currentQuestionIndex];

  // Render the interview
  return (
    <ActiveInterviewLayout interviewId={id || ''}>
      <ActiveInterviewContent
        sessionTitle={session.title}
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={session.questions.length}
        durationInMinutes={session.durationInMinutes}
        onAnswerSubmit={handleAnswerSubmit}
        onTimeUp={handleTimeUp}
      />
    </ActiveInterviewLayout>
  );
};
