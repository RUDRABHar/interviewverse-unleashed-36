
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewTimerProps {
  durationInMinutes: number;
  onTimeUp: () => void;
  className?: string;
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({ 
  durationInMinutes, 
  onTimeUp,
  className
}) => {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Set warning state when less than 10% of time remains
    if (timeLeft <= durationInMinutes * 60 * 0.1) {
      setIsWarning(true);
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, durationInMinutes, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={cn(
        "flex items-center px-3 py-1.5 rounded-lg font-medium transition-colors",
        isWarning 
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" 
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        className
      )}
    >
      <Timer className="w-4 h-4 mr-2" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};
