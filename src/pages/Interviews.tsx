
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { InterviewsHeader } from '@/components/interviews/InterviewsHeader';
import { InterviewsContent } from '@/components/interviews/InterviewsContent';
import { InterviewsWizardDialog } from '@/components/interviews/InterviewsWizardDialog';
import { useInterviewsList } from '@/hooks/useInterviewsList';

const Interviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // Use the custom hook for interview data
  const {
    loading: interviewsLoading,
    interviews,
    tabs,
    activeTab,
    handleTabChange,
    refreshInterviews
  } = useInterviewsList(user);

  // Fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      
      if (session.user) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && profile) {
          setProfile(profile);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleNewInterview = () => {
    setIsWizardOpen(true);
  };

  const handleInterviewCreated = () => {
    setIsWizardOpen(false);
    refreshInterviews();
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-interview-primary" />
          <div className="text-white font-sora text-xl">Loading interviews...</div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardSidebar />
        
        <div className="flex-1">
          <DashboardHeader user={user} profile={profile} />
          
          <main className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
            <InterviewsHeader onNewInterview={handleNewInterview} />
            
            <InterviewsContent
              tabs={tabs}
              activeTab={activeTab}
              loading={interviewsLoading}
              interviews={interviews}
              onTabChange={handleTabChange}
            />
          </main>
        </div>
      </div>
      
      <InterviewsWizardDialog
        isOpen={isWizardOpen}
        onOpenChange={setIsWizardOpen}
        onComplete={handleInterviewCreated}
      />
    </SidebarProvider>
  );
};

export default Interviews;
