
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { InterviewWizard } from '@/components/interviews/InterviewWizard';
import { InterviewHistory } from '@/components/interviews/InterviewHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';

const Interviews = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);

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

  const handleInterviewCreated = () => {
    toast({
      title: "Interview Created",
      description: "Your interview is ready to start",
      duration: 5000,
    });
    setWizardOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-interview-primary rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading interviews...</div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} profile={profile} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-sora text-gray-800 dark:text-gray-100">My Interviews</h1>
                <button
                  onClick={() => setWizardOpen(!wizardOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-interview-primary to-interview-primary/80 hover:from-interview-primary/90 hover:to-interview-primary text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  {wizardOpen ? (
                    <>
                      <X className="h-5 w-5" /> Hide Wizard
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" /> Create New Interview
                    </>
                  )}
                </button>
              </div>
              
              {wizardOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out animate-fade-in">
                  <InterviewWizard onComplete={handleInterviewCreated} />
                </div>
              )}
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="all">All Interviews</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <InterviewHistory filter="all" />
                </TabsContent>
                <TabsContent value="completed">
                  <InterviewHistory filter="completed" />
                </TabsContent>
                <TabsContent value="pending">
                  <InterviewHistory filter="pending" />
                </TabsContent>
                <TabsContent value="draft">
                  <InterviewHistory filter="draft" />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Interviews;
