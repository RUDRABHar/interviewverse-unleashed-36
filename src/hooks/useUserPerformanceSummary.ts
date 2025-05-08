
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type PerformanceSummary = {
  user_id: string;
  full_name: string;
  interview_stats: {
    total_interviews: number;
    avg_score: number;
    strong_domains: string[];
    weak_domains: string[];
    avg_response_time: string;
    confidence_trend: string;
  };
  recent_issues: string[];
};

export const useUserPerformanceSummary = () => {
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceSummary = async () => {
      try {
        setIsLoadingSummary(true);
        setError(null);

        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoadingSummary(false);
          return; // No user logged in
        }

        const userId = session.user.id;

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;

        // Fetch interview sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from('interview_sessions')
          .select('*')
          .eq('user_id', userId);

        if (sessionsError) throw sessionsError;

        // Process sessions to extract insights
        const totalInterviews = sessions?.length || 0;
        
        // Calculate average score for completed interviews
        const completedSessions = sessions?.filter(s => s.status === 'completed' && s.score !== null) || [];
        const avgScore = completedSessions.length > 0 
          ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score || 0), 0) / completedSessions.length) 
          : 0;

        // Extract domains and calculate performance by domain
        const domainPerformance: Record<string, { count: number, totalScore: number }> = {};
        
        completedSessions.forEach(session => {
          if (session.domain) {
            if (!domainPerformance[session.domain]) {
              domainPerformance[session.domain] = { count: 0, totalScore: 0 };
            }
            domainPerformance[session.domain].count++;
            domainPerformance[session.domain].totalScore += session.score || 0;
          }
        });

        // Sort domains by average score
        const sortedDomains = Object.entries(domainPerformance)
          .map(([domain, stats]) => ({
            domain,
            avgScore: stats.count > 0 ? stats.totalScore / stats.count : 0
          }))
          .sort((a, b) => b.avgScore - a.avgScore);

        const strongDomains = sortedDomains
          .slice(0, 2)
          .filter(d => d.avgScore > 60)
          .map(d => d.domain);

        const weakDomains = sortedDomains
          .slice(-2)
          .filter(d => d.avgScore < 70)
          .map(d => d.domain);

        // Calculate average response time (mock for now)
        const avgResponseTime = "2.4 min";

        // Determine confidence trend (mock for now)
        const confidenceTrend = "increasing";

        // Identify recent issues (mock for now)
        const recentIssues = ["skips many HR questions", "low scores in system design"];

        // Create performance summary
        const summary: PerformanceSummary = {
          user_id: userId,
          full_name: profile?.full_name || "User",
          interview_stats: {
            total_interviews: totalInterviews,
            avg_score: avgScore,
            strong_domains: strongDomains,
            weak_domains: weakDomains,
            avg_response_time: avgResponseTime,
            confidence_trend: confidenceTrend
          },
          recent_issues: recentIssues
        };

        setPerformanceSummary(summary);
      } catch (err: any) {
        console.error('Error fetching performance summary:', err);
        setError(err.message || 'Failed to fetch performance data');
      } finally {
        setIsLoadingSummary(false);
      }
    };

    fetchPerformanceSummary();
  }, []);

  return { performanceSummary, isLoadingSummary, error };
};
