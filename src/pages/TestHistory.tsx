
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TestHistoryHeader } from '@/components/test-history/TestHistoryHeader';
import { TestHistoryTable } from '@/components/test-history/TestHistoryTable';
import { TestHistoryFilters } from '@/components/test-history/TestHistoryFilters';
import { EmptyTestHistory } from '@/components/test-history/EmptyTestHistory';
import { useTestHistory } from '@/hooks/useTestHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const TestHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { 
    interviews, 
    loading: dataLoading, 
    filters, 
    setFilters, 
    pagination, 
    setPagination 
  } = useTestHistory();
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-interview-primary rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading interview history...</div>
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
              <TestHistoryHeader />
              <TestHistoryFilters filters={filters} setFilters={setFilters} />
              
              {dataLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="w-full h-24 rounded-lg" />
                  ))}
                </div>
              ) : interviews && interviews.length > 0 ? (
                <TestHistoryTable 
                  interviews={interviews} 
                  isMobile={isMobile}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              ) : (
                <EmptyTestHistory />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TestHistory;
