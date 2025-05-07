
import React from 'react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '../context/OnboardingContext';

interface OnboardingNavigationProps {
  totalSteps: number;
  handleNext: () => void;
  handleBack: () => void;
  handleSkip: () => void;
}

const OnboardingNavigation = ({ 
  totalSteps, 
  handleNext, 
  handleBack, 
  handleSkip 
}: OnboardingNavigationProps) => {
  const { currentStep, onboardingData, isLoading } = useOnboarding();
  
  const isFirstStep = currentStep === 0;
  const isNameStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps - 1;
  const showBackButton = !isFirstStep;
  
  // Determine button text based on current step
  const nextButtonText = isLastStep 
    ? "Go to Dashboard" 
    : isFirstStep 
      ? "Get Started" 
      : "Continue";

  return (
    <div className="container mx-auto px-4 py-6 flex justify-between items-center">
      {/* Back button (hide on first step) */}
      {showBackButton ? (
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={isLoading}
          className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          Back
        </Button>
      ) : (
        <div></div> // Empty div to maintain spacing
      )}
      
      {/* Skip button (only until experience step) */}
      {!isFirstStep && !isLastStep && !isNameStep && (
        <Button
          variant="ghost"
          onClick={handleSkip}
          disabled={isLoading}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Skip for now
        </Button>
      )}
      
      {/* Next button */}
      <Button
        onClick={handleNext}
        disabled={
          isLoading || 
          (isNameStep && !onboardingData.full_name) ||
          (currentStep === 2 && !onboardingData.goal) ||
          (currentStep === 3 && !onboardingData.domain)
        }
        className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white transition-all duration-300 hover:shadow-md"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : nextButtonText}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;
