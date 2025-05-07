
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Define an interface for the transformed interview data
interface TransformedInterview {
  id: string;
  title: string;
  types: string[];
  score: number;
  rating: string;
  status: string;
  date: string;
  language: string;
  duration: number;
}

export const useInterviewsList = (user: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<TransformedInterview[]>([]);
  const [tabs] = useState([
    { id: 'all', name: 'All Interviews', active: true },
    { id: 'technical', name: 'Technical', active: false },
    { id: 'behavioral', name: 'Behavioral', active: false },
    { id: 'system_design', name: 'System Design', active: false }
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Helper function to determine rating based on score
  const getRatingFromScore = (score: number | null): string => {
    if (!score) return 'Beginner';
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    return 'Beginner';
  };
  
  // Fetch interviews when tab changes or refresh key updates
  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
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
        
        // Transform the raw data to match the InterviewCard component's expected format
        const transformedData = (data || []).map(interview => ({
          id: interview.id,
          title: interview.domain 
            ? `${interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1)} Interview: ${interview.domain}`
            : `${interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1)} Interview`,
          types: [interview.interview_type], // Convert single string to array
          score: interview.score || 0,
          rating: getRatingFromScore(interview.score),
          status: interview.status || 'pending',
          date: interview.created_at,
          language: interview.preferred_language || 'english',
          duration: interview.duration_taken 
            ? Math.round((interview.duration_taken as any)?.minutes || 30)
            : 30
        }));
        
        setInterviews(transformedData);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchInterviews();
    } else {
      setLoading(false); // Make sure loading is set to false if no user
    }
  }, [user, activeTab, refreshKey]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const refreshInterviews = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    loading,
    interviews: interviews || [],
    tabs,
    activeTab,
    handleTabChange,
    refreshInterviews
  };
};
