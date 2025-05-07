
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, CircleSlash, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ScheduledInterview {
  id: string;
  interview_type: string;
  domain: string | null;
  difficulty_level: string;
  number_of_questions: number;
  scheduled_for: string;
  reminder_type: string | null;
  reminder_time: string | null;
  status: string;
  created_at: string;
}

interface UpcomingInterviewsProps {
  userId: string;
  limit?: number;
}

export function UpcomingInterviews({ userId, limit = 3 }: UpcomingInterviewsProps) {
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUpcomingInterviews = async () => {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('scheduled_sessions')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'scheduled')
          .gt('scheduled_for', now)
          .order('scheduled_for', { ascending: true })
          .limit(limit);
          
        if (error) {
          throw error;
        }
        
        setInterviews(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your scheduled interviews.",
        });
        setLoading(false);
      }
    };
    
    fetchUpcomingInterviews();
  }, [userId, limit, toast]);
  
  const getTimeUntil = (datetimeString: string) => {
    const now = new Date();
    const interviewDate = new Date(datetimeString);
    const diffTime = interviewDate.getTime() - now.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    } else {
      return 'Less than an hour';
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="bg-gray-50 dark:bg-gray-800/30 animate-pulse">
            <CardContent className="p-6 h-24"></CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (interviews.length === 0) {
    return (
      <Card className="border border-dashed bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <CircleSlash className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-2" />
          <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-1">No upcoming interviews</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You don't have any interviews scheduled yet
          </p>
          <Button asChild>
            <Link to="/schedule">Schedule Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <Card key={interview.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-interview-primary/10 dark:bg-interview-primary/20 p-2 rounded-lg text-interview-primary">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">
                    {interview.interview_type} Interview
                    {interview.domain && ` - ${interview.domain}`}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span>{format(new Date(interview.scheduled_for), 'PPP')}</span>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <span>{format(new Date(interview.scheduled_for), 'p')}</span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                      {interview.difficulty_level}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                      {interview.number_of_questions} questions
                    </Badge>
                    <Badge className="bg-interview-primary/10 text-interview-primary border-interview-primary/20">
                      <Clock className="mr-1 h-3 w-3" />
                      {getTimeUntil(interview.scheduled_for)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {limit && interviews.length >= limit && (
        <div className="text-center">
          <Button variant="link" asChild>
            <Link to="/schedule">View All Scheduled Interviews</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
