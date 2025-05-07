
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useOnboarding } from '../context/OnboardingContext';

interface UseOnboardingActionsProps {
  userId: string;
  totalSteps: number;
}

export const useOnboardingActions = ({ userId, totalSteps }: UseOnboardingActionsProps) => {
  const navigate = useNavigate();
  const {
    onboardingData,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    setShowVerificationModal
  } = useOnboarding();

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

  const resendVerificationEmail = async () => {
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
  };

  return {
    handleNext,
    handleBack,
    handleSkip,
    resendVerificationEmail
  };
};
