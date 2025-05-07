
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ActiveInterviewLayout } from './ActiveInterviewLayout';
import { LoadingScreen } from './LoadingScreen';
import { InterviewErrorView } from './InterviewErrorView';
import { ActiveInterviewContent } from './ActiveInterviewContent';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { supabase } from '@/integrations/supabase/client';

export const InterviewInProgress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [retryCount, setRetryCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Get the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      if (data.session) {
        setUserId(data.session.user.id);
      } else {
        // Handle case where user is not logged in
        setUserId(null);
      }
    };

    getCurrentUser();
  }, []);

  // Use the interview session hook
  const {
    session,
    loading,
    error,
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
    setRetryCount(prev => prev + 1);
    hookHandleRetry();
  };

  // Show loading screen while initializing
  if (loading || generatingQuestions) {
    return <LoadingScreen message={generatingQuestions ? "Generating personalized interview questions..." : undefined} />;
  }

  // Show error view if something went wrong
  if (error || !session) {
    return <InterviewErrorView error={error || "Session not found"} onRetry={handleRetry} />;
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
