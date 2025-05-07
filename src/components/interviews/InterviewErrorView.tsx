
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface InterviewErrorViewProps {
  error: string;
  onRetry: () => void;
}

export const InterviewErrorView: React.FC<InterviewErrorViewProps> = ({ error, onRetry }) => {
  const navigate = useNavigate();
  
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
            onClick={onRetry}
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
};
