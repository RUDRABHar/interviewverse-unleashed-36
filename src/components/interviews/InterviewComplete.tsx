
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

  useEffect(() => {
    // Trigger confetti effect on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fetch the interview results from Supabase and local storage
    const fetchResult = async () => {
      try {
        setLoading(true);
        const storedSession = localStorage.getItem(`interview_session_${id}`);
        
        if (storedSession) {
          const session = JSON.parse(storedSession);
          const answersCount = Object.keys(session.answers).length;
          
          // Get data from Supabase
          const { data: sessionData, error } = await supabase
            .from('interview_sessions')
            .select('*, interview_questions(count)')
            .eq('id', id)
            .maybeSingle();
          
          if (error) {
            console.error("Error fetching interview data:", error);
            toast.error("Failed to load interview results");
            return;
          }
          
          if (sessionData) {
            // Convert duration_taken from interval to minutes if it exists
            const durationInMinutes = sessionData.duration_taken 
              ? Math.ceil(parseInt(sessionData.duration_taken.toString()) / 60) 
              : (session.durationInMinutes || 30);
              
            setResult({
              id: session.id,
              title: session.title || `Interview ${new Date(sessionData.created_at).toLocaleString()}`,
              duration: durationInMinutes,
              questionsAnswered: answersCount,
              totalQuestions: session.questions.length,
              completedAt: sessionData.completed_at || new Date().toISOString(),
              score: sessionData.score,
            });
          } else {
            // Fallback to local data if no database record
            setResult({
              id: session.id,
              title: session.title,
              duration: session.durationInMinutes,
              questionsAnswered: answersCount,
              totalQuestions: session.questions.length,
              completedAt: new Date().toISOString(),
              score: null,
            });
          }
        } else {
          toast.error("Interview session data not found");
        }
      } catch (err) {
        console.error("Error loading interview results:", err);
        toast.error("Error loading interview results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

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
