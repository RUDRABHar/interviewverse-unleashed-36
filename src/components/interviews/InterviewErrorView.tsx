
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, Database, ShieldAlert, ArrowLeftCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface InterviewErrorViewProps {
  error: string;
  onRetry: () => void;
  errorType?: 'profile' | 'general' | 'permissions' | 'data';
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
      case 'data':
        return <Database className="h-12 w-12 text-yellow-500" />;
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
      case 'data':
        return 'Interview Data Error';
      default:
        return 'Interview Error';
    }
  };

  const getErrorDescription = () => {
    if (errorType === 'permissions') {
      return "There was a database permissions error. This typically happens when the database security policies are preventing the operation. Please try again or contact support if the issue persists.";
    }
    
    if (errorType === 'data') {
      return "There was an error with the interview data. This could happen if questions weren't properly loaded or if the session data became corrupted. Please try starting a new interview session.";
    }
    
    if (error.includes("row-level security") || error.includes("violates row-level security policy")) {
      return "A database permission error occurred. Your login session may have expired or you don't have permission to access this interview. Please try logging in again.";
    }
    
    return error;
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
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300"
          >
            Login Again
          </Button>
        );
      case 'data':
        return (
          <Button 
            onClick={() => navigate('/interviews')}
            className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Start New Interview
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
          {getErrorDescription()}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {getActionButton()}
          
          <Button 
            onClick={() => navigate('/interviews')}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-all duration-300"
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Return to Interviews
          </Button>
        </div>
      </div>
    </div>
  );
};
