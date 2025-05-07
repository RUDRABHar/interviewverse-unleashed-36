
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useOnboarding } from '../context/OnboardingContext';

interface OnboardingProgressProps {
  steps: Array<{ id: string; component: React.ComponentType<any> }>;
}

const OnboardingProgress = ({ steps }: OnboardingProgressProps) => {
  const { currentStep } = useOnboarding();
  
  // Calculate progress percentage
  const progress = Math.round((currentStep / (steps.length - 1)) * 100);

  return (
    <>
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-100">
        <Progress value={progress} className="h-full bg-[#FF6B00]" />
      </div>
      
      {/* Step indicators */}
      <div className="container mx-auto px-4 py-2 flex justify-center">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              index <= currentStep ? 'bg-[#FF6B00]' : 'bg-gray-300'
            } ${index === currentStep ? 'w-3 h-3' : ''}`}
          />
        ))}
      </div>
    </>
  );
};

export default OnboardingProgress;
