
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { ParticlesBackground } from '@/components/auth/ParticlesBackground';
import { AuthTabs } from '@/components/auth/AuthTabs';

const Auth = () => {
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Check if onboarding is completed
        checkOnboardingStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Check if onboarding is completed
        checkOnboardingStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching onboarding status:', error);
        navigate('/');
        return;
      }
      
      if (data?.onboarding_completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      navigate('/onboarding');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      <ParticlesBackground />
      
      <div className="z-10 w-full max-w-md">
        <AuthTabs setVerificationEmailSent={setVerificationEmailSent} />
      </div>
      
      {verificationEmailSent && (
        <EmailVerificationPopup onClose={() => setVerificationEmailSent(false)} />
      )}
    </div>
  );
};

export default Auth;
