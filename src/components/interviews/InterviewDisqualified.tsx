
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const InterviewDisqualified: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const reason = location.state?.reason || 'This interview session has been disqualified due to multiple violations.';

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
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
            <AlertTriangle className="h-16 w-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Interview Disqualified
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {reason}
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our system detected multiple attempts to exit the interview or switch between applications, which is not allowed during a proctored session.
          </p>
        </div>
        
        <Button onClick={handleReturnToDashboard} className="w-full">
          Return to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};
