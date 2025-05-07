
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';

interface WelcomeStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const WelcomeStep = ({ onboardingData, updateOnboardingData }: WelcomeStepProps) => {
  return (
    <div className="py-6 text-center">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Welcome to <span className="text-[#FF6B00]">InterviewXpert</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-lg mx-auto">
          Master Your Dream Job with the Power of AI.
        </p>
      </div>
      
      <div className="my-10">
        <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        
        <p className="text-gray-600 max-w-md mx-auto">
          Let's personalize your experience so we can provide the most relevant interview practice and feedback.
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
