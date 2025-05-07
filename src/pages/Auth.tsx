
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { EmailVerificationPopup } from '@/components/auth/EmailVerificationPopup';
import { ParticlesBackground } from '@/components/auth/ParticlesBackground';

const Auth = () => {
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      <ParticlesBackground />
      
      <div className="z-10 w-full max-w-md">
        <AuthForm setVerificationEmailSent={setVerificationEmailSent} />
      </div>
      
      {verificationEmailSent && (
        <EmailVerificationPopup onClose={() => setVerificationEmailSent(false)} />
      )}
    </div>
  );
};

export default Auth;
