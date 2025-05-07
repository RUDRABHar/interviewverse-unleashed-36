
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Onboarding Steps
import WelcomeStep from './steps/WelcomeStep';
import GoalStep from './steps/GoalStep';
import DomainStep from './steps/DomainStep';
import LanguageStep from './steps/LanguageStep';
import ExperienceStep from './steps/ExperienceStep';
import FinalStep from './steps/FinalStep';

export interface OnboardingData {
  goal: string;
  domain: string;
  preferred_language: string;
  interview_experience: string;
}

interface OnboardingWizardProps {
  userId: string;
}

const OnboardingWizard = ({ userId }: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    goal: '',
    domain: '',
    preferred_language: 'English',
    interview_experience: 'Beginner'
  });

  const steps = [
    { id: 'welcome', component: WelcomeStep },
    { id: 'goal', component: GoalStep },
    { id: 'domain', component: DomainStep },
    { id: 'language', component: LanguageStep },
    { id: 'experience', component: ExperienceStep },
    { id: 'final', component: FinalStep }
  ];

  const totalSteps = steps.length;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      // If not the final step, just move to the next step
      setCurrentStep(currentStep + 1);
      
      // Save data to Supabase on each step except welcome
      if (currentStep > 0 && currentStep < totalSteps - 2) {
        await saveProgress(false);
      }
    } else {
      // Final step - complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const updateOnboardingData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData({
      ...onboardingData,
      [field]: value
    });
  };

  const saveProgress = async (completed: boolean = false) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...onboardingData,
          onboarding_completed: completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving progress",
        description: error.message || "Failed to save your onboarding data"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...onboardingData,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Onboarding Completed",
        description: "Your profile has been set up successfully!"
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error completing onboarding",
        description: error.message || "Failed to complete onboarding"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get current step component
  const CurrentStepComponent = steps[currentStep].component;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isSecondToLastStep = currentStep === totalSteps - 2;
  
  // Determine button text based on current step
  const nextButtonText = isLastStep 
    ? "Launch Dashboard" 
    : isFirstStep 
      ? "Get Started" 
      : "Next";
  
  // For progress indicator
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="glass rounded-xl shadow-lg backdrop-blur-lg border border-white/20 overflow-hidden transition-all duration-500">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 relative">
        <div 
          className="h-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-center pt-4">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
              index <= currentStep ? 'bg-interview-primary' : 'bg-gray-300'
            } ${index === currentStep ? 'w-3 h-3' : ''}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="min-h-[400px] flex flex-col justify-between">
          {/* Step content with animation */}
          <div className="flex-1 animate-fade-in">
            <CurrentStepComponent 
              onboardingData={onboardingData}
              updateOnboardingData={updateOnboardingData}
            />
          </div>

          {/* Navigation buttons */}
          <div className="pt-6 flex justify-between items-center">
            {/* Back button (hide on first step) */}
            {!isFirstStep ? (
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
            {!isFirstStep && !isLastStep && !isSecondToLastStep && (
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
                (currentStep === 1 && !onboardingData.goal) ||
                (currentStep === 2 && !onboardingData.domain)
              }
              className="bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-105"
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
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
