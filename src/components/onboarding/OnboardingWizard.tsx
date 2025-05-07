
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Onboarding Steps
import WelcomeStep from './steps/WelcomeStep';
import NameStep from './steps/NameStep';
import GoalStep from './steps/GoalStep';
import DomainStep from './steps/DomainStep';
import ExperienceStep from './steps/ExperienceStep';
import LanguageStep from './steps/LanguageStep';
import FinalStep from './steps/FinalStep';
import EmailVerificationModal from './EmailVerificationModal';

export interface OnboardingData {
  full_name: string;
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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    full_name: '',
    goal: '',
    domain: '',
    preferred_language: 'English',
    interview_experience: 'Beginner'
  });

  const steps = [
    { id: 'welcome', component: WelcomeStep },
    { id: 'name', component: NameStep },
    { id: 'goal', component: GoalStep },
    { id: 'domain', component: DomainStep },
    { id: 'experience', component: ExperienceStep },
    { id: 'language', component: LanguageStep },
    { id: 'final', component: FinalStep }
  ];

  const totalSteps = steps.length;

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      // If not the final step, just move to the next step
      setCurrentStep(currentStep + 1);
      
      // Save data to Supabase on each step except welcome
      if (currentStep > 0 && currentStep < totalSteps - 1) {
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
      
      // Check if email is verified and show verification modal if not
      const { data: { user } } = await supabase.auth.getUser();
      if (user && !user.email_confirmed_at) {
        setShowVerificationModal(true);
        return;
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
  const isNameStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps - 1;
  const showBackButton = !isFirstStep;
  
  // Determine button text based on current step
  const nextButtonText = isLastStep 
    ? "Go to Dashboard" 
    : isFirstStep 
      ? "Get Started" 
      : "Continue";

  // For progress indicator
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
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

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl animate-fade-in">
          <CurrentStepComponent 
            onboardingData={onboardingData}
            updateOnboardingData={updateOnboardingData}
          />
        </div>
      </div>

      {/* Navigation buttons */}
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

      {/* Email verification modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          onClose={() => {
            setShowVerificationModal(false);
            navigate('/dashboard');
          }}
          onResend={async () => {
            try {
              const { error } = await supabase.auth.resend({
                type: 'signup',
                email: (await supabase.auth.getUser()).data.user?.email || ''
              });
              if (error) throw error;
              toast({
                title: "Verification Email Sent",
                description: "Please check your inbox for the verification link."
              });
            } catch (error: any) {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to send verification email"
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default OnboardingWizard;
