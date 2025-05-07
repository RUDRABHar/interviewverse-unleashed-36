
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);
      
      // Fetch user profile
      if (session.user) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-interview-primary font-sora text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Temporary navbar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-sora font-bold">
            <span className="text-interview-primary">Interview</span>
            <span className="text-interview-blue">Xpert</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {profile?.full_name || user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to your dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-full bg-white">
            <CardHeader>
              <CardTitle>Your InterviewXpert Profile</CardTitle>
              <CardDescription>
                Your interview preferences based on onboarding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Primary Goal</div>
                  <div className="font-medium">{getReadableGoal(profile?.goal)}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Domain/Role</div>
                  <div className="font-medium">{profile?.domain || 'Not specified'}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Language</div>
                  <div className="font-medium">{profile?.preferred_language || 'English'}</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Experience Level</div>
                  <div className="font-medium">{profile?.interview_experience || 'Beginner'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Placeholder for future dashboard content */}
          <Card>
            <CardHeader>
              <CardTitle>Start a Mock Interview</CardTitle>
              <CardDescription>
                Practice with our AI interviewer
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button className="bg-gradient-primary hover:shadow-button transition-all">
                Start Interview
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interview History</CardTitle>
              <CardDescription>
                Review your past interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                No interviews yet
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
              <CardDescription>
                Get insights from your interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Complete an interview to get feedback
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Helper function to get readable goal values
const getReadableGoal = (goal: string): string => {
  const goals: {[key: string]: string} = {
    'interview': 'Crack an interview',
    'communication': 'Improve communication',
    'practice': 'Practice real-time mock sessions',
    'feedback': 'Get feedback from AI'
  };
  
  return goals[goal] || goal || 'Not specified';
};

export default Dashboard;
