
import React from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, size = 'md' }) => {
  // Calculate the color gradient based on score
  const getScoreColor = () => {
    if (score >= 80) return '#22c55e'; // Green for high scores
    if (score >= 65) return '#f59e0b'; // Amber for medium scores
    return '#ef4444'; // Red for low scores
  };
  
  // Calculate the radius based on size
  const getRadius = () => {
    switch(size) {
      case 'sm': return 14;
      case 'lg': return 22;
      default: return 18; // Medium is default
    }
  };
  
  // Calculate the circumference and stroke-dasharray
  const radius = getRadius();
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  // Set container size based on radius
  const containerSize = radius * 2 + 10; // Add some padding
  
  // Set font size based on size
  const fontSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-xs';
  
  return (
    <div className="relative flex items-center justify-center" style={{ width: containerSize, height: containerSize }}>
      <svg width={containerSize} height={containerSize} viewBox={`0 0 ${containerSize} ${containerSize}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={containerSize / 2}
          cy={containerSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-gray-200 dark:text-gray-800"
        />
        
        {/* Progress circle */}
        <circle
          cx={containerSize / 2}
          cy={containerSize / 2}
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
      <div className={`absolute ${fontSize} font-semibold dark:text-white`}>{score}</div>
    </div>
  );
};
