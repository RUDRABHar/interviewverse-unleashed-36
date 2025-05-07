
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBarBig, ChartColumnBig, Calendar, Target, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PerformanceOverTimeChart } from '@/components/analytics/PerformanceOverTimeChart';
import { PerformanceByCategoryChart } from '@/components/analytics/PerformanceByCategoryChart';
import { InterviewActivityCalendar } from '@/components/analytics/InterviewActivityCalendar';
import { PerformanceInsightsPanel } from '@/components/analytics/PerformanceInsightsPanel';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const [interviewData, setInterviewData] = useState<any[]>([]);

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          navigate('/auth');
          return;
        }
        
        setUser(session.user);

        // Fetch user profile
        if (session.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!profileError && profileData) {
            setProfile(profileData);
            
            // Redirect to onboarding if not completed
            if (!profileData.onboarding_completed) {
              navigate('/onboarding');
              return;
            }
          }
        }
        
        await fetchInterviewData(session.user.id);
      } catch (err) {
        console.error('Error checking auth:', err);
        toast.error('Authentication error');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Fetch interview data from Supabase
  const fetchInterviewData = async (userId: string) => {
    try {
      // Fetch completed interview sessions with score
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select(`
          id,
          interview_type,
          domain,
          difficulty_level,
          number_of_questions,
          score,
          completed_at,
          duration_taken,
          user_answers(count),
          interview_questions(question_type, category)
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .not('score', 'is', null)
        .order('completed_at', { ascending: false });
      
      if (sessionsError) {
        throw new Error(sessionsError.message);
      }
      
      if (sessions && sessions.length > 0) {
        setInterviewData(sessions);
      } else {
        console.log('No interview data found');
      }
    } catch (err) {
      console.error('Error fetching interview data:', err);
      toast.error('Failed to load interview data');
    }
  };
  
  const handleDateRangeChange = (range: 'week' | 'month' | 'year') => {
    setDateRange(range);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading your analytics...</div>
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
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Performance Analytics</h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Visualize your interview performance trends and insights</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={dateRange === 'week' ? 'default' : 'outline'} 
                    onClick={() => handleDateRangeChange('week')}
                    size="sm"
                  >
                    Week
                  </Button>
                  <Button 
                    variant={dateRange === 'month' ? 'default' : 'outline'} 
                    onClick={() => handleDateRangeChange('month')}
                    size="sm"
                  >
                    Month
                  </Button>
                  <Button 
                    variant={dateRange === 'year' ? 'default' : 'outline'} 
                    onClick={() => handleDateRangeChange('year')}
                    size="sm"
                  >
                    Year
                  </Button>
                </div>
              </div>
              
              {/* Data availability check */}
              {interviewData.length === 0 ? (
                <Card className="bg-white dark:bg-gray-800 shadow-lg border-0">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="w-32 h-32 mb-4">
                      <ChartColumnBig className="w-full h-full text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                      No interview data available yet
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                      Complete some interviews to see your performance analytics. More interviews will provide better insights.
                    </p>
                    <Button onClick={() => navigate('/interviews')}>
                      Start an Interview
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Analytics Tabs */}
                  <Tabs defaultValue="overview" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="by-category">By Category</TabsTrigger>
                      <TabsTrigger value="by-question-type">By Question Type</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    </TabsList>
                    
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Performance Over Time Chart */}
                        <Card className="xl:col-span-2 bg-white dark:bg-gray-800 shadow border-0">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Performance Over Time</CardTitle>
                                <CardDescription>Your interview scores over {dateRange}</CardDescription>
                              </div>
                              <TrendingUp className="h-5 w-5 text-gray-400" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-[350px]">
                              <PerformanceOverTimeChart 
                                data={interviewData} 
                                dateRange={dateRange} 
                              />
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Performance Insights Panel */}
                        <Card className="bg-white dark:bg-gray-800 shadow border-0">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Key Insights</CardTitle>
                                <CardDescription>Summary of your performance</CardDescription>
                              </div>
                              <Target className="h-5 w-5 text-gray-400" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <PerformanceInsightsPanel data={interviewData} />
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Category Performance Chart */}
                      <Card className="bg-white dark:bg-gray-800 shadow border-0">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Performance by Category</CardTitle>
                              <CardDescription>Your strengths and weaknesses</CardDescription>
                            </div>
                            <ChartBarBig className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <PerformanceByCategoryChart data={interviewData} />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* By Category Tab */}
                    <TabsContent value="by-category" className="space-y-6">
                      {/* We'll implement this tab in the next iteration */}
                      <Card className="bg-white dark:bg-gray-800 shadow border-0">
                        <CardContent className="py-10 text-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            Detailed category analysis will be implemented in the next update.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* By Question Type Tab */}
                    <TabsContent value="by-question-type" className="space-y-6">
                      {/* We'll implement this tab in the next iteration */}
                      <Card className="bg-white dark:bg-gray-800 shadow border-0">
                        <CardContent className="py-10 text-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            Question type analysis will be implemented in the next update.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Activity Tab */}
                    <TabsContent value="activity" className="space-y-6">
                      <Card className="bg-white dark:bg-gray-800 shadow border-0">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">Interview Activity</CardTitle>
                              <CardDescription>Your interview frequency and results</CardDescription>
                            </div>
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <InterviewActivityCalendar data={interviewData} />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Insights Tab */}
                    <TabsContent value="insights" className="space-y-6">
                      {/* We'll implement this tab in the next iteration */}
                      <Card className="bg-white dark:bg-gray-800 shadow border-0">
                        <CardContent className="py-10 text-center">
                          <p className="text-gray-500 dark:text-gray-400">
                            AI-powered insights will be implemented in the next update.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
