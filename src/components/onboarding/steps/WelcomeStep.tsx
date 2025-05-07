
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';

interface WelcomeStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const WelcomeStep = ({ onboardingData, updateOnboardingData }: WelcomeStepProps) => {
  return (
    <div className="text-center py-10">
      <div className="mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          {/* AI avatar with pulsing animation */}
          <div className="w-full h-full rounded-full bg-gradient-primary shadow-glow animate-pulse-soft flex items-center justify-center">
            <span className="text-white text-xl font-semibold">AI</span>
          </div>
          {/* Orbiting particles */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-interview-violet rounded-full opacity-70"
                style={{
                  animation: `float ${4 + i}s infinite ease-in-out ${i * 0.8}s`,
                  top: `${10 + i * 30}%`,
                  left: `${70 + i * 10}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-sora font-bold mb-4">
        Welcome to <span className="gradient-text">InterviewXpert</span>
      </h1>
      
      <p className="text-gray-700 mb-8 max-w-md mx-auto">
        Let's customize your experience so we can create the perfect mock interviews just for you. This will only take a minute.
      </p>

      <div className="flex justify-center">
        <div className="w-12 h-12 relative">
          {/* Animated arrow pointing down */}
          <div className="w-full h-full flex items-center justify-center animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20M12 20L5 13M12 20L19 13" stroke="#4D47C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;
