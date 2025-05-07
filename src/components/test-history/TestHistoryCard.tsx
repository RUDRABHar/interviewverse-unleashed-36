
import React from 'react';
import { format, formatDistance } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/interviews/ScoreCircle';
import { FileText, RefreshCw, Clock, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TestHistoryCardProps {
  interview: any;
}

export const TestHistoryCard: React.FC<TestHistoryCardProps> = ({ interview }) => {
  const statusMap: Record<string, { variant: "default" | "success" | "warning" | "destructive" | "secondary" | "outline", label: string }> = {
    completed: { variant: 'success', label: 'Completed' },
    pending: { variant: 'warning', label: 'In Progress' },
    draft: { variant: 'default', label: 'Draft' }
  };

  const formatDuration = (duration: string) => {
    if (!duration) return 'N/A';
    
    // Parse PostgreSQL interval string (e.g., "00:12:34.567")
    const matches = duration.match(/(\d+):(\d+):(\d+)/);
    if (!matches) return duration;
    
    const hours = parseInt(matches[1]);
    const minutes = parseInt(matches[2]);
    const seconds = parseInt(matches[3]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg border border-gray-100 dark:border-gray-800 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/60 border-b dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold dark:text-white line-clamp-1" title={interview.interview_type}>
            {interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1)} - {interview.domain || 'General'}
          </h3>
          <Badge variant={statusMap[interview.status as keyof typeof statusMap]?.variant || 'default'}>
            {statusMap[interview.status as keyof typeof statusMap]?.label || interview.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {interview.completed_at ? format(new Date(interview.completed_at), 'MMM d, yyyy') : 'Not completed'}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {interview.completed_at ? format(new Date(interview.completed_at), 'h:mm a') : ''}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {interview.score !== null ? (
              <ScoreCircle score={interview.score} />
            ) : (
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">No Score</div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Experience Level</div>
            <div className="text-sm font-medium dark:text-white">
              {interview.experience_level || 'Not specified'}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <Clock className="inline h-3 w-3 mr-1" />Duration
            </div>
            <div className="text-sm font-medium dark:text-white">
              {formatDuration(interview.duration_taken) || 'N/A'}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Difficulty</div>
            <div className="text-sm font-medium dark:text-white">
              {interview.difficulty_level || 'Standard'}
            </div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Questions</div>
            <div className="text-sm font-medium dark:text-white">
              {interview.number_of_questions}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800/30 border-t dark:border-gray-800 flex justify-between">
        <Link to={`/interviews/results/${interview.id}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            <span>View Report</span>
          </Button>
        </Link>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Retake</span>
          </Button>
          
          {interview.status === 'completed' && (
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
