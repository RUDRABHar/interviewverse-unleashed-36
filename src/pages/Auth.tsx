
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { ParticlesBackground } from '@/components/auth/ParticlesBackground';
import { AuthForm } from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

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
      {/* Enhanced background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.06]"></div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-interview-primary/10 filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-interview-blue/10 filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-200/20 filter blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      <ParticlesBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <AuthForm setVerificationEmailSent={setVerificationEmailSent} />
      </motion.div>
      
      {verificationEmailSent && (
        <EmailVerificationPopup onClose={() => setVerificationEmailSent(false)} />
      )}
    </div>
  );
};

export default Auth;
