
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type InterviewType = 'all' | 'technical' | 'behavioral' | 'communication' | 'language';
export type InterviewStatus = 'all' | 'completed' | 'pending' | 'draft';

export interface TestHistoryFilters {
  search: string;
  type: InterviewType;
  status: InterviewStatus;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface TestHistoryPagination {
  page: number;
  pageSize: number;
  total: number;
}

export const useTestHistory = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TestHistoryFilters>({
    search: '',
    type: 'all',
    status: 'all',
    dateRange: {
      from: null,
      to: null
    }
  });
  const [pagination, setPagination] = useState<TestHistoryPagination>({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchInterviews();
  }, [filters, pagination.page, pagination.pageSize]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      
      // Start building the query
      let query = supabase
        .from('interview_sessions')
        .select('*, user_profiles!inner(*)', { count: 'exact' });
      
      // Apply filters
      if (filters.search) {
        query = query.ilike('domain', `%${filters.search}%`);
      }
      
      if (filters.type !== 'all') {
        query = query.eq('interview_type', filters.type);
      }
      
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.dateRange.from) {
        query = query.gte('completed_at', filters.dateRange.from.toISOString());
      }
      
      if (filters.dateRange.to) {
        query = query.lte('completed_at', filters.dateRange.to.toISOString());
      }
      
      // Apply pagination
      const from = (pagination.page - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      // Apply sorting
      query = query
        .order('completed_at', { ascending: false })
        .range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setInterviews(data);
        setPagination(prev => ({ ...prev, total: count || 0 }));
      }
    } catch (error: any) {
      console.error('Error fetching interview history:', error);
      toast({
        title: "Error fetching history",
        description: error.message || "Failed to load interview history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    interviews,
    loading,
    filters,
    setFilters,
    pagination,
    setPagination,
    refresh: fetchInterviews
  };
};
