
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UpcomingInterviewProps {
  interview: {
    id: string;
    title: string;
    datetime: string;
    type: string;
  };
}

export const UpcomingInterview = ({ interview }: UpcomingInterviewProps) => {
  const { title, datetime, type } = interview;
  
  // Format the date and time
  const formatDateTime = (datetimeString: string) => {
    const date = new Date(datetimeString);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    return { dateStr, timeStr };
  };
  
  const { dateStr, timeStr } = formatDateTime(datetime);
  
  // Calculate time until interview
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
  
  const timeUntil = getTimeUntil(datetime);
  
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-interview-primary/10 dark:bg-interview-primary/20 p-2 rounded-lg text-interview-primary">
              <Calendar className="h-5 w-5" />
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span>{dateStr} at {timeStr}</span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span className="text-interview-primary">{timeUntil}</span>
              </div>
              
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                  {type}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="border-interview-primary text-interview-primary hover:bg-interview-primary/10">
            Prepare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
