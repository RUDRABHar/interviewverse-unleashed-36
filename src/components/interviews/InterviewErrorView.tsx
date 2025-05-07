
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface InterviewErrorViewProps {
  error: string;
  onRetry: () => void;
  errorType?: 'profile' | 'general';
}

export const InterviewErrorView: React.FC<InterviewErrorViewProps> = ({ 
  error, 
  onRetry,
  errorType = 'general' 
}) => {
  const navigate = useNavigate();
  
  const handleOnboarding = () => {
    toast.info("Redirecting to onboarding");
    navigate('/onboarding');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          {errorType === 'profile' 
            ? <Info className="h-12 w-12 text-blue-500" /> 
            : <AlertCircle className="h-12 w-12 text-orange-500" />}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {errorType === 'profile' ? 'Profile Setup Required' : 'Interview Error'}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {errorType === 'profile' ? (
            <Button 
              onClick={handleOnboarding}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
            >
              Complete Profile Setup
            </Button>
          ) : (
            <Button 
              onClick={onRetry}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300"
            >
              Retry
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/interviews')}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all duration-300"
          >
            Return to Interviews
          </Button>
        </div>
      </div>
    </div>
  );
};
