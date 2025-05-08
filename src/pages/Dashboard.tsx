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
import { UpcomingInterviews } from '@/components/schedules/UpcomingInterviews';
import { ProUpgradeCard } from '@/components/dashboard/ProUpgradeCard';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/design-system/animations';
import PremiumCard from '@/components/ui/design-system/PremiumCard';
import GradientButton from '@/components/ui/design-system/GradientButton';
import EnhancedParticles from '@/components/ui/design-system/EnhancedParticles';

// Import the CSS styles
import '@/styles/gradients.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interviewActivities, setInterviewActivities] = useState([]);
  
  // Animation variants
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
  const mockRecentActivity = [
    {
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
    }
  ];
  const mockRecommendations = [
    {
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
    }
  ];
  const mockUpcomingInterviews = [
    {
      id: '1',
      title: 'Frontend Developer Mock Interview',
      datetime: '2025-05-10T13:00:00',
      type: 'Technical'
    }, {
      id: '2',
      title: 'Leadership Skills Assessment',
      datetime: '2025-05-15T15:30:00',
      type: 'Behavioral'
    }
  ];
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 border-t-4 border-b-4 border-orange-500 rounded-full animate-spin"></div>
          <div className="text-white font-sora text-xl">Loading your dashboard...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-gradient-luxury dark:from-gray-900 dark:to-gray-800">
      <EnhancedParticles
        count={20}
        minSize={4}
        maxSize={12}
        depth={true}
        speed={30}
        className="opacity-50"
      />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <DashboardSidebar />
          
          <div className="flex-1 flex flex-col">
            <DashboardHeader user={user} profile={profile} />
            
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <motion.div 
                className="max-w-7xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <WelcomeHero profile={profile} />
                </motion.div>
                
                {/* Recent Interview Activity */}
                <motion.section variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-sora">Recent Interview Activity</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockRecentActivity && mockRecentActivity.length > 0 ? mockRecentActivity.map(activity => (
                      <ActivityCard key={activity.id} activity={activity} />
                    )) : (
                      <PremiumCard className="col-span-full" glassOpacity="medium" hoverEffect>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                          <motion.div 
                            className="w-36 h-36 mb-4 bg-interview-primary/10 dark:bg-interview-primary/20 rounded-full flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          >
                            <motion.div
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                            >
                              <BarChart className="w-16 h-16 text-interview-primary dark:text-interview-primary/80" />
                            </motion.div>
                          </motion.div>
                          <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-200 mb-3 font-sora">
                            Your journey starts here. No interviews yet.
                          </h3>
                          <p className="text-muted-foreground mb-6 max-w-md text-center">
                            Complete your first interview to see your performance data and get personalized recommendations.
                          </p>
                          <GradientButton className="group">
                            <div className="flex items-center">
                              Start Your First Interview
                              <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                          </GradientButton>
                        </CardContent>
                      </PremiumCard>
                    )}
                  </div>
                </motion.section>
                
                {/* Data Visualizations */}
                <motion.section variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-sora">Your Performance Insights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <PremiumCard glassOpacity="light" hoverEffect borderEffect gradientBorder>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-sora flex items-center">
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mr-2"
                          >
                            <BarChart3 className="h-5 w-5 text-interview-primary" />
                          </motion.div>
                          Progress Over Time
                        </CardTitle>
                        <CardDescription>Your performance trajectory</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[200px]">
                          <PerformanceChart />
                        </div>
                      </CardContent>
                    </PremiumCard>
                    
                    <PremiumCard glassOpacity="light" hoverEffect borderEffect gradientBorder>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-sora flex items-center">
                          <motion.div
                            animate={{ rotate: [-5, 5, -5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mr-2"
                          >
                            <Lightbulb className="h-5 w-5 text-interview-primary" />
                          </motion.div>
                          Skill Mapping
                        </CardTitle>
                        <CardDescription>Your strengths and areas to improve</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[200px]">
                          <SkillsRadarChart />
                        </div>
                      </CardContent>
                    </PremiumCard>
                    
                    <PremiumCard glassOpacity="light" hoverEffect borderEffect gradientBorder>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-sora flex items-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mr-2"
                          >
                            <BarChart className="h-5 w-5 text-interview-primary" />
                          </motion.div>
                          Interview Categories
                        </CardTitle>
                        <CardDescription>Types of interviews you've practiced</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="h-[200px]">
                          <InterviewTypeChart />
                        </div>
                      </CardContent>
                    </PremiumCard>
                  </div>
                </motion.section>
                
                {/* AI-Powered Recommendations */}
                <motion.section variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-sora">
                    AI-Powered Recommendations
                  </h2>
                  <div className="flex space-x-5 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {mockRecommendations && mockRecommendations.map(recommendation => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                </motion.section>
                
                {/* Two Column Layout for Upcoming Interviews and Pro Upgrade */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Upcoming Interviews */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 font-sora">
                        Upcoming Interviews
                      </h2>
                      <GradientButton 
                        variant="outline" 
                        size="sm" 
                        gradientFrom="from-interview-blue/10" 
                        gradientTo="to-interview-blue/10"
                        className="bg-white dark:bg-gray-800 text-interview-blue border border-interview-blue/30"
                      >
                        <Link to="/schedule" className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Schedule New</span>
                        </Link>
                      </GradientButton>
                    </div>
                    
                    <PremiumCard glassOpacity="light" variant="elevated">
                      {user && <UpcomingInterviews userId={user.id} limit={3} />}
                    </PremiumCard>
                  </div>
                  
                  {/* Pro Upgrade CTA */}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 font-sora">
                      Upgrade
                    </h2>
                    <ProUpgradeCard />
                  </div>
                </motion.div>
              </motion.div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
