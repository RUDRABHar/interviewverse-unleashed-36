
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ActiveInterviewLayout } from './ActiveInterviewLayout';
import { InterviewQuestion, Question } from './InterviewQuestion';
import { InterviewTimer } from './InterviewTimer';
import { LoadingScreen } from './LoadingScreen';
import { generateInterviewQuestions } from '@/services/gemini';

interface InterviewSession {
  id: string;
  title: string;
  durationInMinutes: number;
  questions: Question[];
  config: {
    types: string[];
    difficulty: string;
    language: string;
    domain?: string;
    experienceLevel?: string;
  };
  answers: Record<string, string>;
}

export const InterviewInProgress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch interview session data and generate questions
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id) return;

      try {
        // In a real implementation, this would load from an API
        // For now, we'll simulate from localStorage
        const storedConfig = localStorage.getItem(`interview_config_${id}`);
        
        if (!storedConfig) {
          throw new Error("Interview configuration not found");
        }
        
        const config = JSON.parse(storedConfig);
        
        // Generate questions using Gemini API
        const questions = await generateInterviewQuestions(config);
        
        // Create session object
        const session: InterviewSession = {
          id,
          title: `Interview Session ${new Date().toLocaleString()}`,
          durationInMinutes: config.duration || 30,
          questions,
          config,
          answers: {}
        };
        
        // Save session
        setSession(session);
        localStorage.setItem(`interview_session_${id}`, JSON.stringify(session));
      } catch (err: any) {
        console.error("Error starting interview:", err);
        
        if (retryCount < 2) {
          toast.error("Generating interview questions, please wait...");
          setRetryCount(prev => prev + 1);
          // Retry after a delay
          setTimeout(() => fetchInterview(), 3000);
        } else {
          setError("Unable to start interview at the moment. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, retryCount]);

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    if (!session) return;

    // Store the answer
    const updatedSession = { 
      ...session,
      answers: {
        ...session.answers,
        [questionId]: answer
      }
    };
    
    setSession(updatedSession);
    localStorage.setItem(`interview_session_${id}`, JSON.stringify(updatedSession));
    
    // Move to next question or complete interview
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete interview
      navigate(`/interviews/complete/${id}`);
    }
  };

  const handleTimeUp = () => {
    toast.warning("Time's up! Your interview session has ended.");
    // Navigate to results page
    navigate(`/interviews/complete/${id}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Interview Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/interviews')}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300"
          >
            Return to Interviews
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];

  return (
    <ActiveInterviewLayout interviewId={id || ''}>
      <div className="h-full flex flex-col">
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {session.title}
            </h1>
            <InterviewTimer 
              durationInMinutes={session.durationInMinutes} 
              onTimeUp={handleTimeUp} 
            />
          </div>
        </header>
        
        <main className="flex-1 overflow-auto py-8">
          <InterviewQuestion 
            question={currentQuestion}
            onAnswerSubmit={handleAnswerSubmit}
            currentIndex={currentQuestionIndex}
            totalQuestions={session.questions.length}
          />
        </main>
      </div>
    </ActiveInterviewLayout>
  );
};
