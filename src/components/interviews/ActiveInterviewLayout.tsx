
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AlertOctagon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ActiveInterviewLayoutProps {
  children: React.ReactNode;
  interviewId: string;
}

export const ActiveInterviewLayout: React.FC<ActiveInterviewLayoutProps> = ({ children, interviewId }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  // Handle fullscreen mode
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.error("Couldn't enter fullscreen mode:", error);
        toast.error("Fullscreen mode is required for this interview");
      }
    };

    enterFullscreen();

    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    };
  }, []);

  // Monitor focus and visibility changes
  useEffect(() => {
    let warningsIssued = warningCount;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && warningsIssued < 2) {
        warningsIssued++;
        setWarningCount(warningsIssued);
        setShowWarning(true);
      } else if (document.visibilityState === 'hidden' && warningsIssued >= 2) {
        // Third strike - disqualify
        navigate(`/interviews/disqualified/${interviewId}`, { 
          state: { 
            reason: 'You exceeded the maximum allowed violations.' 
          }
        });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen && warningsIssued < 2) {
        warningsIssued++;
        setWarningCount(warningsIssued);
        setShowWarning(true);
      } else if (!document.fullscreenElement && isFullscreen && warningsIssued >= 2) {
        // Third strike - disqualify
        navigate(`/interviews/disqualified/${interviewId}`, { 
          state: { 
            reason: 'You exceeded the maximum allowed violations.' 
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [navigate, interviewId, warningCount, isFullscreen]);

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {children}
      
      {/* Focus Warning Modal */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-500">
              <AlertOctagon className="mr-2 h-5 w-5" />
              Focus Warning
            </DialogTitle>
            <DialogDescription>
              You've attempted to leave the interview session. Please stay focused. 
              {warningCount === 1 ? '1st warning.' : '2nd warning.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleCloseWarning}>
              Continue Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
