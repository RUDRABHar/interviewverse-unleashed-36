
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PerformanceOverTimeChart } from '@/components/analytics/PerformanceOverTimeChart';
import { PerformanceByCategoryChart } from '@/components/analytics/PerformanceByCategoryChart';
import { PerformanceInsightsPanel } from '@/components/analytics/PerformanceInsightsPanel';
import { InterviewActivityCalendar } from '@/components/analytics/InterviewActivityCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    performanceOverTime: [],
    performanceByCategory: []
  });
  
  const [activityData, setActivityData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");
  
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
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);
  
  useEffect(() => {
    if (!user) return;
    
    // Mock data generation
    const generateMockData = () => {
      // Generate mock performance over time data
      const performanceOverTime = Array.from({ length: 12 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - 11 + i);
        
        return {
          date: month.toISOString().split('T')[0],
          score: Math.floor(Math.random() * 30) + 60,
          average: Math.floor(Math.random() * 10) + 70
        };
      });
      
      // Generate mock performance by category data
      const categories = [
        'Technical', 'Communication', 'Problem Solving', 
        'System Design', 'Algorithms', 'Databases'
      ];
      
      const performanceByCategory = categories.map(category => ({
        category,
        score: Math.floor(Math.random() * 40) + 60,
        average: Math.floor(Math.random() * 20) + 65
      }));
      
      // Generate activity calendar data
      const activityData = [];
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 180); // 6 months back
      
      for (let i = 0; i < 40; i++) {
        const interviewDate = new Date(startDate);
        interviewDate.setDate(startDate.getDate() + Math.floor(Math.random() * 180));
        
        if (interviewDate <= today) {
          activityData.push({
            completed_at: interviewDate.toISOString(),
            score: Math.floor(Math.random() * 40) + 60,
            count: Math.floor(Math.random() * 3) + 1
          });
        }
      }
      
      setAnalyticsData({
        performanceOverTime,
        performanceByCategory
      });
      
      setActivityData(activityData);
    };
    
    generateMockData();
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-interview-primary rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading analytics...</div>
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
              className="max-w-7xl mx-auto space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-interview-primary/10 flex items-center justify-center">
                    <BarChart className="h-6 w-6 text-interview-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight font-sora mb-1 text-gray-800 dark:text-white">Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">
                      Track your interview performance and improvement over time
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-full lg:col-span-2 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <TrendingUp className="h-5 w-5 text-interview-primary" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Performance Over Time</h2>
                      </div>
                      <Tabs defaultValue="month" className="w-full sm:w-auto">
                        <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700">
                          <TabsTrigger value="week">Week</TabsTrigger>
                          <TabsTrigger value="month">Month</TabsTrigger>
                          <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="h-[300px]">
                      <PerformanceOverTimeChart data={analyticsData.performanceOverTime} />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-full lg:col-span-1 transition-all duration-300 hover:shadow-lg">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-full border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-interview-primary/10 flex items-center justify-center">
                        <span className="text-interview-primary text-xs font-bold">%</span>
                      </div>
                      Performance by Category
                    </h2>
                    <div className="h-[300px]">
                      <PerformanceByCategoryChart data={analyticsData.performanceByCategory} />
                    </div>
                  </div>
                </div>
                
                <motion.div variants={itemVariants} className="col-span-full transition-all duration-300 hover:shadow-lg">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <Calendar className="h-5 w-5 text-interview-primary" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Interview Activity Calendar</h2>
                      </div>
                      <Tabs 
                        defaultValue="month" 
                        onValueChange={(value) => setDateRange(value as "week" | "month" | "year")}
                        className="w-full sm:w-auto"
                      >
                        <TabsList className="grid grid-cols-3 w-full sm:w-auto bg-gray-100 dark:bg-gray-700">
                          <TabsTrigger value="week">Week</TabsTrigger>
                          <TabsTrigger value="month">Month</TabsTrigger>
                          <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    {/* Pass the activity data and dateRange to the calendar component */}
                    <InterviewActivityCalendar data={activityData} dateRange={dateRange} />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="col-span-full transition-all duration-300 hover:shadow-lg">
                  <PerformanceInsightsPanel data={analyticsData} />
                </motion.div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
