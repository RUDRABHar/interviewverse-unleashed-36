
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { useOnboardingActions } from './hooks/useOnboardingActions';
import OnboardingProgress from './components/OnboardingProgress';
import OnboardingNavigation from './components/OnboardingNavigation';
import EmailVerificationModal from './EmailVerificationModal';
import { useOnboarding } from './context/OnboardingContext';

// Onboarding Steps
import WelcomeStep from './steps/WelcomeStep';
import NameStep from './steps/NameStep';
import GoalStep from './steps/GoalStep';
import DomainStep from './steps/DomainStep';
import ExperienceStep from './steps/ExperienceStep';
import LanguageStep from './steps/LanguageStep';
import FinalStep from './steps/FinalStep';

interface OnboardingWizardProps {
  userId: string;
}

// This is the main onboarding content component
const OnboardingContent = ({ userId }: OnboardingWizardProps) => {
  const { currentStep, showVerificationModal, setShowVerificationModal } = useOnboarding();
  const navigate = useNavigate();
  
  // Define all steps
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
  
  // Get onboarding action handlers
  const { 
    handleNext, 
    handleBack, 
    handleSkip,
    resendVerificationEmail
  } = useOnboardingActions({ 
    userId, 
    totalSteps 
  });

  // Get current step component
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Progress indicators */}
      <OnboardingProgress steps={steps} />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl animate-fade-in">
          <CurrentStepComponent />
        </div>
      </div>

      {/* Navigation buttons */}
      <OnboardingNavigation 
        totalSteps={totalSteps}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
      />

      {/* Email verification modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          onClose={() => {
            setShowVerificationModal(false);
            navigate('/dashboard');
          }}
          onResend={resendVerificationEmail}
        />
      )}
    </div>
  );
};

// The main onboarding wizard component with provider
const OnboardingWizard = ({ userId }: OnboardingWizardProps) => {
  return (
    <OnboardingProvider>
      <OnboardingContent userId={userId} />
    </OnboardingProvider>
  );
};

export default OnboardingWizard;
