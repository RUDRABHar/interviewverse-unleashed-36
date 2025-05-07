
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export const useInterviewsList = (user: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [tabs] = useState([
    { id: 'all', name: 'All Interviews', active: true },
    { id: 'technical', name: 'Technical', active: false },
    { id: 'behavioral', name: 'Behavioral', active: false },
    { id: 'system_design', name: 'System Design', active: false }
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

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
        
        setInterviews(data || []);
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
