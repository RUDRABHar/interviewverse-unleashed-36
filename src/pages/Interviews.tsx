import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { InterviewCard } from '@/components/interviews/InterviewCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/interviews/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InterviewWizard } from '@/components/interviews/InterviewWizard';
import GradientButton from '@/components/ui/design-system/GradientButton';
import { Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define the animation variants
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

const Interviews = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [tabs, setTabs] = useState([
    { id: 'all', name: 'All Interviews', active: true },
    { id: 'technical', name: 'Technical', active: false },
    { id: 'behavioral', name: 'Behavioral', active: false },
    { id: 'system_design', name: 'System Design', active: false }
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user data and interviews
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

  // Fetch interviews when tab changes or refresh key updates
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        let query = supabase
          .from('interview_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (activeTab !== 'all') {
          query = query.eq('interview_type', activeTab);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setInterviews(data || []);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchInterviews();
    }
  }, [user, activeTab, refreshKey]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleNewInterview = () => {
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
  };

  // Handle interview created
  const handleInterviewCreated = () => {
    setIsWizardOpen(false);
    setRefreshKey(prev => prev + 1);
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
            <motion.div 
              className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">Interviews</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage your interview sessions</p>
              </div>
              
              <GradientButton 
                onClick={handleNewInterview}
                size="lg"
                className="shrink-0"
                glowEffect
              >
                <Plus className="h-5 w-5 mr-1" /> New Interview
              </GradientButton>
            </motion.div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>{tab.name}</TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div 
                        key={i} 
                        className="h-64 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : interviews.length > 0 ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {interviews.map(interview => (
                      <motion.div key={interview.id} variants={itemVariants}>
                        <InterviewCard interview={interview} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold font-sora">Create New Interview</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6">
            <InterviewWizard onComplete={handleInterviewCreated} />
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Interviews;
