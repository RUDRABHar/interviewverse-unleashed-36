
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InterviewResult {
  id: string;
  title: string;
  duration: number;
  questionsAnswered: number;
  totalQuestions: number;
  completedAt: string;
}

export const InterviewComplete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<InterviewResult | null>(null);

  useEffect(() => {
    // Trigger confetti effect on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // In a real implementation, fetch the results from an API
    // For now, we'll simulate from localStorage
    const fetchResult = () => {
      try {
        const storedSession = localStorage.getItem(`interview_session_${id}`);
        
        if (storedSession) {
          const session = JSON.parse(storedSession);
          const answersCount = Object.keys(session.answers).length;
          
          setResult({
            id: session.id,
            title: session.title,
            duration: session.durationInMinutes,
            questionsAnswered: answersCount,
            totalQuestions: session.questions.length,
            completedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Error loading interview results:", err);
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
