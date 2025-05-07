import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, ChevronRight, Clock, Lightbulb, BarChart, Calendar, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { ActivityCard } from '@/components/dashboard/ActivityCard';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { SkillsRadarChart } from '@/components/dashboard/SkillsRadarChart';
import { InterviewTypeChart } from '@/components/dashboard/InterviewTypeChart';
import { UpcomingInterview } from '@/components/dashboard/UpcomingInterview';
import { ProUpgradeCard } from '@/components/dashboard/ProUpgradeCard';
import { SidebarProvider } from '@/components/ui/sidebar';
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interviewActivities, setInterviewActivities] = useState([]);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);

      // Fetch user profile
      if (session.user) {
        const {
          data: profile,
          error
        } = await supabase.from('user_profiles').select('*').eq('id', session.user.id).single();
        if (!error && profile) {
          setProfile(profile);

          // Redirect to onboarding if not completed
          if (!profile.onboarding_completed) {
            navigate('/onboarding');
            return;
          }
        }
      }
      setLoading(false);
    };
    checkAuth();

    // Set up auth state listener
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Sample data for charts and cards
  const mockRecentActivity = [{
    id: '1',
    title: 'React JS Technical Round',
    score: 78,
    result: 'Pass',
    mode: 'AI',
    status: 'Completed',
    time: '32 mins',
    date: '2025-05-01'
  }, {
    id: '2',
    title: 'System Design Interview',
    score: 65,
    result: 'Needs Improvement',
    mode: 'AI',
    status: 'Completed',
    time: '45 mins',
    date: '2025-04-28'
  }];
  const mockRecommendations = [{
    id: '1',
    type: 'challenge',
    title: 'Try this next',
    content: 'Practice handling behavioral questions about conflict resolution',
    icon: <ArrowUpRight className="h-5 w-5 text-orange-500" />
  }, {
    id: '2',
    type: 'tip',
    title: 'Daily Tip',
    content: 'Speak 15% slower for clarity and to avoid rushing through important points',
    icon: <Lightbulb className="h-5 w-5 text-purple-500" />
  }, {
    id: '3',
    type: 'improvement',
    title: 'Profile Suggestion',
    content: 'Add more details about your recent project to strengthen your portfolio',
    icon: <ChevronRight className="h-5 w-5 text-blue-500" />
  }];
  const mockUpcomingInterviews = [{
    id: '1',
    title: 'Frontend Developer Mock Interview',
    datetime: '2025-05-10T13:00:00',
    type: 'Technical'
  }, {
    id: '2',
    title: 'Leadership Skills Assessment',
    datetime: '2025-05-15T15:30:00',
    type: 'Behavioral'
  }];
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading your dashboard...</div>
        </div>
      </div>;
  }
  return <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} profile={profile} />
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <WelcomeHero profile={profile} />
              
              {/* Recent Interview Activity */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Interview Activity</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockRecentActivity.length > 0 ? mockRecentActivity.map(activity => <ActivityCard key={activity.id} activity={activity} />) : <Card className="col-span-full bg-white dark:bg-gray-800 shadow-lg border-0">
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <div className="w-32 h-32 mb-4">
                          <img src="/placeholder.svg" alt="No interviews yet" className="w-full h-full" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Your journey starts here. No interviews yet.
                        </h3>
                        <Button className="mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                          Start Your First Interview
                        </Button>
                      </CardContent>
                    </Card>}
                </div>
              </section>
              
              {/* Data Visualizations */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Performance Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Progress Over Time</CardTitle>
                      <CardDescription>Your performance trajectory</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-[200px]">
                        <PerformanceChart />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Skill Mapping</CardTitle>
                      <CardDescription>Your strengths and areas to improve</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-[200px]">
                        <SkillsRadarChart />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white dark:bg-gray-800 shadow-lg border-0 overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Interview Categories</CardTitle>
                      <CardDescription>Types of interviews you've practiced</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="h-[200px]">
                        <InterviewTypeChart />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              {/* AI-Powered Recommendations */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  AI-Powered Recommendations
                </h2>
                <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {mockRecommendations.map(recommendation => <RecommendationCard key={recommendation.id} recommendation={recommendation} />)}
                </div>
              </section>
              
              {/* Two Column Layout for Upcoming Interviews and Pro Upgrade */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Upcoming Interviews
                  </h2>
                  <div className="space-y-4">
                    {mockUpcomingInterviews.map(interview => <UpcomingInterview key={interview.id} interview={interview} />)}
                  </div>
                </div>
                
                {/* Pro Upgrade CTA */}
                
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>;
};
export default Dashboard;