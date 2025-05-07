
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, Database, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface InterviewErrorViewProps {
  error: string;
  onRetry: () => void;
  errorType?: 'profile' | 'general' | 'permissions';
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

  const getIcon = () => {
    switch (errorType) {
      case 'profile':
        return <Info className="h-12 w-12 text-blue-500" />;
      case 'permissions':
        return <ShieldAlert className="h-12 w-12 text-red-500" />;
      default:
        return <AlertCircle className="h-12 w-12 text-orange-500" />;
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case 'profile':
        return 'Profile Setup Required';
      case 'permissions':
        return 'Database Permission Error';
      default:
        return 'Interview Error';
    }
  };

  const getActionButton = () => {
    switch (errorType) {
      case 'profile':
        return (
          <Button 
            onClick={handleOnboarding}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
          >
            Complete Profile Setup
          </Button>
        );
      case 'permissions':
        return (
          <Button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
          >
            Reload Application
          </Button>
        );
      default:
        return (
          <Button 
            onClick={onRetry}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300"
          >
            Retry
          </Button>
        );
    }
  };

  // Check if error is related to row-level security
  const isPermissionError = error.includes('row-level security') || 
                            error.includes('violates row-level security policy') || 
                            error.includes('Failed to store interview questions');

  // If we detect a permissions error but it wasn't explicitly set as the error type
  const effectiveErrorType = isPermissionError && errorType === 'general' ? 'permissions' : errorType;

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          {getTitle()}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {effectiveErrorType === 'permissions' 
            ? "There was a database permissions error. This typically happens when the database security policies are preventing the operation. Please try again or contact support if the issue persists."
            : error}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {getActionButton()}
          
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
