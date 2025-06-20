
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { toast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Check if onboarding already completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }

          if (data?.onboarding_completed) {
            navigate('/dashboard');
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not check onboarding status"
          });
        }
      }
    };

    if (session && !loading) {
      checkOnboardingStatus();
    }
  }, [session, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#FF6B00] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {session && <OnboardingWizard userId={session.user.id} />}
    </div>
  );
};

export default Onboarding;
