
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface OnboardingData {
  full_name: string;
  goal: string;
  domain: string;
  preferred_language: string;
  interview_experience: string;
}

interface OnboardingContextType {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showVerificationModal: boolean;
  setShowVerificationModal: (show: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
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

  const updateOnboardingData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData({
      ...onboardingData,
      [field]: value
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        onboardingData,
        updateOnboardingData,
        currentStep,
        setCurrentStep,
        isLoading,
        setIsLoading,
        showVerificationModal,
        setShowVerificationModal,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
