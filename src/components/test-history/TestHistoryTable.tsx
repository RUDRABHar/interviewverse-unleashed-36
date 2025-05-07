
import React from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Download, 
  RefreshCw 
} from 'lucide-react';
import { TestHistoryCard } from './TestHistoryCard';
import { Badge } from '@/components/ui/badge';

interface TestHistoryTableProps {
  interviews: any[];
  isMobile: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    page: number;
    pageSize: number;
    total: number;
  }>>;
}

export const TestHistoryTable: React.FC<TestHistoryTableProps> = ({ 
  interviews, 
  isMobile,
  pagination,
  setPagination
}) => {
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Function to format duration
  const formatDuration = (duration: string) => {
    if (!duration) return 'N/A';
    
    // Parse PostgreSQL interval string (e.g., "00:12:34.567")
    const matches = duration.match(/(\d+):(\d+):(\d+)/);
    if (!matches) return duration;
    
    const hours = parseInt(matches[1]);
    const minutes = parseInt(matches[2]);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: <Badge variant="success">Completed</Badge>,
      pending: <Badge variant="warning">In Progress</Badge>,
      draft: <Badge variant="default">Draft</Badge>,
      failed: <Badge variant="destructive">Failed</Badge>,
      default: <Badge variant="secondary">{status}</Badge>
    };
    
    return variants[status as keyof typeof variants] || variants.default;
  };
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {interviews.map((interview, idx) => (
          <TestHistoryCard key={interview.id || idx} interview={interview} />
        ))}
        
        {/* Pagination for mobile */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
            disabled={pagination.page >= totalPages}
            className="h-8 w-8 p-0 flex items-center justify-center"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-luxury">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <TableHead className="w-[200px]">Interview Type</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Experience</TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead className="hidden sm:table-cell">Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview, idx) => (
              <TableRow 
                key={interview.id || idx}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-700/80 border-b border-gray-100 dark:border-gray-700"
              >
                <TableCell className="font-medium">
                  {interview.interview_type?.charAt(0).toUpperCase() + interview.interview_type?.slice(1)} - {interview.domain || 'General'}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400">
                  {interview.completed_at ? format(new Date(interview.completed_at), 'MMM d, yyyy') : '-'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(interview.status)}
                </TableCell>
                <TableCell className="hidden md:table-cell text-gray-600 dark:text-gray-400">
                  {interview.experience_level || 'N/A'}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-600 dark:text-gray-400">
                  {formatDuration(interview.duration_taken)}
                </TableCell>
                <TableCell className="hidden sm:table-cell font-medium">
                  {interview.score !== null ? (
                    <span className={`${parseInt(interview.score) >= 70 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {interview.score}%
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {interview.status === 'completed' && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} entries
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(totalPages, pagination.page + 1))}
            disabled={pagination.page >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
