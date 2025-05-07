
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { generateInterviewQuestions } from '@/services/gemini';

export interface Question {
  id: string;
  content: string;
  type: 'technical' | 'behavioral' | 'communication' | 'language';
  timeLimit?: number;
  answerFormat?: 'text' | 'code' | 'audio' | 'mcq';
  options?: string[];
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
  correctOption?: number;
}

export interface InterviewSession {
  id: string;
  dbSessionId: string; // Add dbSessionId to store the Supabase UUID
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
  scores: Record<string, boolean | null>;
}

interface UseInterviewSessionProps {
  id: string | undefined;
  retryCount: number;
  userId: string | null;
}

interface UseInterviewSessionResult {
  session: InterviewSession | null;
  loading: boolean;
  error: string | null;
  errorType?: 'profile' | 'general' | 'permissions';
  dbSessionId: string | null;
  generatingQuestions: boolean;
  handleAnswerSubmit: (questionId: string, answer: string, isCorrect?: boolean) => Promise<void>;
  handleTimeUp: () => Promise<void>;
  handleRetry: () => void;
}

export const useInterviewSession = ({ id, retryCount, userId }: UseInterviewSessionProps): UseInterviewSessionResult => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'profile' | 'general' | 'permissions'>('general');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [generatingQuestions, setGeneratingQuestions] = useState(true);
  const [dbSessionId, setDbSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchInterview = async () => {
      if (!id || !userId) return;

      try {
        // Check if user profile exists
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profileError || !userProfile) {
          console.error("User profile not found:", profileError);
          setError("Your profile setup is incomplete. Please complete your profile setup before starting an interview.");
          setErrorType('profile');
          setLoading(false);
          setGeneratingQuestions(false);
          return;
        }
        
        const storedConfig = localStorage.getItem(`interview_config_${id}`);
        
        if (!storedConfig) {
          throw new Error("Interview configuration not found");
        }
        
        const config = JSON.parse(storedConfig);
        setGeneratingQuestions(true);
        
        // Create Supabase interview session record
        const { data: sessionData, error: sessionError } = await supabase
          .from('interview_sessions')
          .insert({
            user_id: userId,
            interview_type: config.types.join(','),
            domain: config.domain || null,
            preferred_language: config.language || 'English',
            number_of_questions: config.numberOfQuestions || 5,
            difficulty_level: config.difficulty || 'Medium',
            experience_level: config.experienceLevel || null,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (sessionError) {
          console.error("Error creating interview session:", sessionError);
          if (sessionError.message?.includes('foreign key constraint')) {
            setError("Your profile setup is incomplete. Please complete your profile setup before starting an interview.");
            setErrorType('profile');
          } else {
            setError(`Failed to create interview session: ${sessionError.message}`);
            setErrorType('general');
          }
          setLoading(false);
          setGeneratingQuestions(false);
          return;
        }

        setDbSessionId(sessionData.id);
        
        // Generate questions using Gemini API
        try {
          console.log("Generating questions with config:", config);
          const questions = await generateInterviewQuestions(config);
          
          if (!questions || questions.length === 0) {
            throw new Error("No questions were generated. Please try again.");
          }
          
          console.log("Generated questions:", questions);
          
          // Store questions in Supabase
          const questionsToInsert = questions.map((q, index) => ({
            session_id: sessionData.id,
            question_text: q.content,
            question_type: q.type || 'descriptive',
            category: config.types[0] || 'general',
            question_meta: q.options ? { options: q.options } : null,
            expected_answer_format: q.answerFormat || null,
            question_order: index + 1
          }));

          const { error: questionsError } = await supabase
            .from('interview_questions')
            .insert(questionsToInsert);

          if (questionsError) {
            console.error("Error storing questions:", questionsError);
            
            // Check if this is a permission/RLS error
            if (questionsError.message?.includes('violates row-level security policy') || 
                questionsError.message?.includes('new row violates row-level security policy')) {
              setError("Failed to store interview questions: Database permission error");
              setErrorType('permissions');
              
              // Update the session status to error
              if (sessionData?.id) {
                await supabase
                  .from('interview_sessions')
                  .update({ status: 'error' })
                  .eq('id', sessionData.id);
              }
              
              throw new Error("Failed to store interview questions due to database permissions");
            } else {
              throw new Error("Failed to store interview questions");
            }
          }
          
          // Create session object with both local ID and database ID
          const session: InterviewSession = {
            id,
            dbSessionId: sessionData.id, // Store the database ID
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
          
          // Check if this is a permission error
          if (err.message?.includes('violates row-level security policy') || 
              err.message?.includes('permission') || 
              err.message?.includes('Failed to store interview questions')) {
            setError(`Failed to store interview questions: Database permission error`);
            setErrorType('permissions');
          } else {
            setError(`Failed to generate questions: ${err.message}`);
            setErrorType('general');
          }
          
          setGeneratingQuestions(false);
          
          // Update session status to error
          if (sessionData?.id) {
            await supabase
              .from('interview_sessions')
              .update({ status: 'error' })
              .eq('id', sessionData.id);
          }
        }
      } catch (err: any) {
        console.error("Error starting interview:", err);
        
        if (retryCount < 2) {
          toast.error("Error starting interview. Retrying...");
          // Let the parent component handle retry logic
          setError("Error starting interview");
          setErrorType('general');
        } else {
          setError("Unable to start interview at the moment. Please try again later.");
          setErrorType('general');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, retryCount, userId, navigate]);

  const handleAnswerSubmit = async (questionId: string, answer: string, isCorrect?: boolean) => {
    if (!session || !dbSessionId || !userId) return;

    // Store the answer in Supabase
    try {
      // Find the question in the database
      const { data: questionData } = await supabase
        .from('interview_questions')
        .select('id')
        .eq('session_id', dbSessionId)
        .eq('question_order', currentQuestionIndex + 1)
        .single();

      if (questionData) {
        // Store the answer
        await supabase
          .from('user_answers')
          .insert({
            question_id: questionData.id,
            session_id: dbSessionId,
            user_id: userId,
            answer_text: answer,
            is_correct: isCorrect !== undefined ? isCorrect : null,
            submitted_at: new Date().toISOString()
          });
      }
    } catch (err) {
      console.error("Error storing answer:", err);
      // Continue even if storage fails - don't block the user
    }

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
      // Complete interview in Supabase
      if (dbSessionId) {
        try {
          // Calculate score if applicable
          let score = null;
          const scorableAnswers = Object.values(updatedSession.scores).filter(val => val !== null);
          if (scorableAnswers.length > 0) {
            const correctAnswers = scorableAnswers.filter(val => val === true).length;
            score = (correctAnswers / scorableAnswers.length) * 100;
          }

          await supabase
            .from('interview_sessions')
            .update({ 
              status: 'completed',
              completed_at: new Date().toISOString(),
              score: score
            })
            .eq('id', dbSessionId);
        } catch (err) {
          console.error("Error updating session completion status:", err);
        }
      }

      // Navigate to results page using the database ID for consistency
      navigate(`/interviews/complete/${dbSessionId}`);
    }
  };

  const handleTimeUp = async () => {
    toast.warning("Time's up! Your interview session has ended.");
    
    // Update session status in Supabase
    if (dbSessionId) {
      try {
        await supabase
          .from('interview_sessions')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', dbSessionId);
          
        // Navigate to results page using the database ID
        navigate(`/interviews/complete/${dbSessionId}`);
      } catch (err) {
        console.error("Error updating session completion status:", err);
        
        // If error, still try to navigate to complete page with local ID as fallback
        navigate(`/interviews/complete/${id}`);
      }
    } else {
      // If no dbSessionId (rare case), use local ID as fallback
      navigate(`/interviews/complete/${id}`);
    }
  };
  
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  return {
    session,
    loading,
    error,
    errorType,
    dbSessionId,
    generatingQuestions,
    handleAnswerSubmit,
    handleTimeUp,
    handleRetry
  };
};
