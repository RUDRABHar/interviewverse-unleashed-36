
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ActiveInterviewLayout } from './ActiveInterviewLayout';
import { InterviewQuestion, Question } from './InterviewQuestion';
import { InterviewTimer } from './InterviewTimer';
import { LoadingScreen } from './LoadingScreen';
import { generateInterviewQuestions } from '@/services/gemini';
import { AlertCircle } from 'lucide-react';

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
  scores: Record<string, boolean | null>; // Track correct/incorrect answers for MCQs
}

export const InterviewInProgress: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [generatingQuestions, setGeneratingQuestions] = useState(true);

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
        setGeneratingQuestions(true);
        
        // Generate questions using Gemini API
        try {
          console.log("Generating questions with config:", config);
          const questions = await generateInterviewQuestions(config);
          
          if (!questions || questions.length === 0) {
            throw new Error("No questions were generated. Please try again.");
          }
          
          console.log("Generated questions:", questions);
          
          // Create session object
          const session: InterviewSession = {
            id,
            title: `Interview Session ${new Date().toLocaleString()}`,
            durationInMinutes: config.duration || 30,
            questions,
            config,
            answers: {},
            scores: {}
          };
          
          // Save session
          setSession(session);
          localStorage.setItem(`interview_session_${id}`, JSON.stringify(session));
          setGeneratingQuestions(false);
          setError(null);
        } catch (err: any) {
          console.error("Error generating interview questions:", err);
          toast.error("Error generating interview questions");
          setError(`Failed to generate questions: ${err.message}`);
          setGeneratingQuestions(false);
        }
      } catch (err: any) {
        console.error("Error starting interview:", err);
        
        if (retryCount < 2) {
          toast.error("Error starting interview. Retrying...");
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

  const handleAnswerSubmit = (questionId: string, answer: string, isCorrect?: boolean) => {
    if (!session) return;

    // Store the answer and score (if provided)
    const updatedSession = { 
      ...session,
      answers: {
        ...session.answers,
        [questionId]: answer
      },
      scores: {
        ...session.scores,
        [questionId]: isCorrect !== undefined ? isCorrect : null
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
  
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
    window.location.reload();
  };

  if (loading || generatingQuestions) {
    return <LoadingScreen message={generatingQuestions ? "Generating personalized interview questions..." : undefined} />;
  }

  if (error || !session) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Interview Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleRetry}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/interviews')}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all duration-300"
            >
              Return to Interviews
            </button>
          </div>
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
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={session.questions.length}
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
