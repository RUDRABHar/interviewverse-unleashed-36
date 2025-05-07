
import React from 'react';

interface ScoreCircleProps {
  score: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  // Calculate the color gradient based on score
  const getScoreColor = () => {
    if (score >= 80) return '#22c55e'; // Green for high scores
    if (score >= 65) return '#f59e0b'; // Amber for medium scores
    return '#ef4444'; // Red for low scores
  };
  
  // Calculate the circumference and stroke-dasharray
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg width="50" height="50" viewBox="0 0 50 50" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200 dark:text-gray-800"
        />
        
        {/* Progress circle */}
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke={getScoreColor()}
          strokeWidth="4"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute text-xs font-semibold dark:text-white">{score}</div>
    </div>
  );
};
