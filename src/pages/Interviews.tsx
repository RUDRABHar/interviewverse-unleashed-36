
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
import { Plus, X, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} profile={profile} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6 animate-fade-in">
            <motion.div 
              className="max-w-7xl mx-auto space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-interview-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-interview-primary" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold font-sora text-gray-800 dark:text-gray-100">My Interviews</h1>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Create, manage and track your interview practice sessions</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => navigate('/schedule')}
                      variant="outline"
                      className="gap-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-800"
                    >
                      <Calendar className="h-5 w-5 text-interview-primary" />
                      Schedule Interview
                    </Button>
                    
                    <Button
                      onClick={() => setWizardOpen(!wizardOpen)}
                      className="px-4 py-2 bg-interview-primary hover:bg-interview-primary/90 text-white rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
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
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              {wizardOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out"
                >
                  <InterviewWizard onComplete={handleInterviewCreated} />
                </motion.div>
              )}
              
              <motion.div variants={itemVariants}>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4 bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger value="all">All Interviews</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="animate-fade-in">
                    <InterviewHistory filter="all" />
                  </TabsContent>
                  <TabsContent value="completed" className="animate-fade-in">
                    <InterviewHistory filter="completed" />
                  </TabsContent>
                  <TabsContent value="pending" className="animate-fade-in">
                    <InterviewHistory filter="pending" />
                  </TabsContent>
                  <TabsContent value="draft" className="animate-fade-in">
                    <InterviewHistory filter="draft" />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Interviews;
