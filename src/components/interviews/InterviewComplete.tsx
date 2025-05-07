
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InterviewResult {
  id: string;
  title: string;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
  completedAt: string;
  score: number | null;
}

export const InterviewComplete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    // Trigger confetti effect on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch the interview results from Supabase and local storage
    const fetchResult = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        console.log("Fetching results for ID:", id);
        
        // First try to get the database record directly
        const { data: sessionData, error: sessionError } = await supabase
          .from('interview_sessions')
          .select('*, interview_questions(count)')
          .eq('id', id)
          .maybeSingle();
        
        if (sessionError) {
          console.error("Error fetching database session:", sessionError);
          // Don't throw here, we'll try local storage next
        }
        
        // Now we need to handle both cases: database ID or local ID
        if (sessionData) {
          // Found database record, let's check if we have local state with answers
          console.log("Found database record:", sessionData);
          
          // Look for local storage data by iterating through all potential local IDs
          // This is necessary because the local ID might not match the database ID
          const localStorageItems = Object.keys(localStorage).filter(key => 
            key.startsWith('interview_session_'));
          
          let session = null;
          
          // Check all local sessions to find one with matching dbSessionId
          for (const key of localStorageItems) {
            try {
              const storedItem = localStorage.getItem(key);
              if (storedItem) {
                const parsedSession = JSON.parse(storedItem);
                if (parsedSession.dbSessionId === id) {
                  session = parsedSession;
                  console.log("Found matching local session with answers:", key);
                  break;
                }
              }
            } catch (err) {
              console.error("Error parsing local storage item:", err);
            }
          }
          
          // Convert duration_taken from interval to minutes if it exists
          const durationInMinutes = sessionData.duration_taken 
            ? Math.ceil(parseInt(sessionData.duration_taken.toString()) / 60) 
            : (session?.durationInMinutes || 30);
            
          setResult({
            id: sessionData.id,
            title: session?.title || `Interview ${new Date(sessionData.created_at).toLocaleString()}`,
            duration: durationInMinutes,
            questionsAnswered: session?.answers ? Object.keys(session.answers).length : 0,
            totalQuestions: sessionData.number_of_questions || (session?.questions?.length || 0),
            completedAt: sessionData.completed_at || new Date().toISOString(),
            score: sessionData.score,
          });

          // Begin analysis after fetching results - only if we have questions and answers
          if (session?.questions && session?.answers) {
            setAnalyzing(true);
            await analyzeAnswers(session, id);
          } else {
            // If we don't have local data, try to see if answers are already in the database
            const { data: answersData } = await supabase
              .from('user_answers')
              .select('*')
              .eq('session_id', id);
              
            if (answersData && answersData.length > 0) {
              console.log("Found existing answers in database, skipping analysis");
              // Answers already exist, no need to analyze
              setAnalyzing(false);
            } else if (sessionData.status === 'completed' && sessionData.score !== null) {
              console.log("Session already complete with score, skipping analysis");
              setAnalyzing(false);
            } else {
              console.log("No local session with answers found, but will still proceed to results");
              setAnalyzing(false);
            }
          }
        } else {
          // If we couldn't find a database record, check if there's a local session with this ID
          const storedSession = localStorage.getItem(`interview_session_${id}`);
          
          if (storedSession) {
            // We have a local session
            const session = JSON.parse(storedSession);
            const answersCount = Object.keys(session.answers || {}).length;
            const dbId = session.dbSessionId || id;
            
            console.log("Using local session with dbSessionId:", dbId);
            
            // If we have a database ID in the session, try to get that record
            if (session.dbSessionId && session.dbSessionId !== id) {
              const { data: dbSession } = await supabase
                .from('interview_sessions')
                .select('*')
                .eq('id', session.dbSessionId)
                .maybeSingle();
                
              if (dbSession) {
                console.log("Found database session using local dbSessionId");
                
                // Navigate to the correct URL with the database ID
                navigate(`/interviews/complete/${session.dbSessionId}`, { replace: true });
                return;
              }
            }
            
            // Fallback to local data
            setResult({
              id: dbId,
              title: session.title,
              duration: session.durationInMinutes,
              questionsAnswered: answersCount,
              totalQuestions: session.questions.length,
              completedAt: new Date().toISOString(),
              score: null,
            });
            
            setAnalyzing(true);
            await analyzeAnswers(session, dbId);
          } else {
            console.log("No local session found and no database record");
            toast.error("Interview session data not found");
            setAnalyzing(false);
          }
        }
      } catch (err) {
        console.error("Error loading interview results:", err);
        toast.error("Error loading interview results");
        setAnalyzing(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id, navigate]);

  // Function to analyze answers using Gemini AI
  const analyzeAnswers = async (session: any, sessionId: string) => {
    try {
      const questions = session.questions;
      const answers = session.answers;

      let totalAnalyzed = 0;
      const totalToAnalyze = Object.keys(answers).length;
      
      toast.info(`Analyzing ${totalToAnalyze} answers with AI...`);

      // Process each answer with Gemini
      for (const questionId in answers) {
        if (answers.hasOwnProperty(questionId)) {
          try {
            const userAnswer = answers[questionId];
            
            // Call the edge function to analyze this answer
            const response = await fetch(`${window.location.origin}/api/analyze-interview-answers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                session_id: sessionId,
                question_id: questionId,
                user_answer: userAnswer
              })
            });
            
            if (!response.ok) {
              console.error(`Error analyzing answer for question ${questionId}:`, await response.text());
              continue;
            }
            
            totalAnalyzed++;
            
            // Update progress if many questions
            if (totalToAnalyze > 3 && totalAnalyzed % 3 === 0) {
              toast.info(`Analyzed ${totalAnalyzed}/${totalToAnalyze} answers...`);
            }
          } catch (error) {
            console.error(`Error processing question ${questionId}:`, error);
          }
        }
      }

      // Calculate final score after all answers are analyzed
      const { data, error } = await supabase
        .from('user_answers')
        .select('is_correct')
        .eq('session_id', sessionId);
      
      if (error) {
        console.error('Error fetching answers for score calculation:', error);
      } else if (data && data.length > 0) {
        const correct = data.filter(a => a.is_correct === true).length;
        const partial = data.filter(a => a.is_correct === null).length;
        const total = data.length;
        
        // Calculate score: correct answers + half points for partial answers
        const finalScore = Math.round(((correct + (partial * 0.5)) / total) * 100);
        
        // Update session with final score
        await supabase
          .from('interview_sessions')
          .update({ score: finalScore })
          .eq('id', sessionId);
      }
      
      toast.success('Analysis complete!');
      setAnalyzing(false);
      
      // Navigate to results page after analysis is complete
      navigate(`/interviews/results/${sessionId}`);
    } catch (err) {
      console.error('Error in answer analysis process:', err);
      toast.error('Error analyzing answers');
      setAnalyzing(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/interviews/results/${id}`);
  };

  const handleReturnToDashboard = () => {
    navigate('/interviews');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your answers with AI...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">This may take a minute</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Interview Complete!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Great job! You've completed your interview session.
        </p>
        
        {result && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                <p className="font-medium dark:text-white">{result.questionsAnswered}/{result.totalQuestions}</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-medium dark:text-white">{result.duration} minutes</p>
              </div>
              {result.score !== null && (
                <div className="text-left col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
                  <p className="font-medium dark:text-white">{Math.round(result.score)}%</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Button onClick={handleViewResults} className="w-full">
            View Detailed Results
          </Button>
          <Button variant="outline" onClick={handleReturnToDashboard} className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
