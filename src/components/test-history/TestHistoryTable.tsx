
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestHistoryCard } from '@/components/test-history/TestHistoryCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { FileText, RefreshCw, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { TestHistoryPagination } from '@/hooks/useTestHistory';

interface TestHistoryTableProps {
  interviews: any[];
  isMobile: boolean;
  pagination: TestHistoryPagination;
  setPagination: React.Dispatch<React.SetStateAction<TestHistoryPagination>>;
}

export const TestHistoryTable: React.FC<TestHistoryTableProps> = ({ 
  interviews, 
  isMobile,
  pagination,
  setPagination
}) => {
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
  
  const changePage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxItems = 5; // Max number of page buttons to show
    
    // Always add first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink 
          isActive={pagination.page === 1} 
          onClick={() => changePage(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, pagination.page - Math.floor(maxItems / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxItems - 2);
    
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={pagination.page === i} 
            onClick={() => changePage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <span className="flex h-9 w-9 items-center justify-center">...</span>
        </PaginationItem>
      );
    }
    
    // Always add last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            isActive={pagination.page === totalPages} 
            onClick={() => changePage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Render cards for mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {interviews.map(interview => (
          <TestHistoryCard key={interview.id} interview={interview} />
        ))}
        
        {pagination.total > pagination.pageSize && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => changePage(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink isActive={true}>
                  {pagination.page} / {totalPages}
                </PaginationLink>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => changePage(Math.min(totalPages, pagination.page + 1))}
                  className={pagination.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  }

  // Render table for desktop view
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviews.map((interview) => (
              <TableRow key={interview.id}>
                <TableCell className="font-medium">
                  {interview.interview_type.charAt(0).toUpperCase() + interview.interview_type.slice(1)} - {interview.domain || 'General'}
                </TableCell>
                <TableCell>
                  {interview.completed_at ? (
                    <>
                      <div>{format(new Date(interview.completed_at), 'MMM d, yyyy')}</div>
                      <div className="text-xs text-gray-500">{format(new Date(interview.completed_at), 'h:mm a')}</div>
                    </>
                  ) : 'Not completed'}
                </TableCell>
                <TableCell>
                  <Badge variant={statusMap[interview.status as keyof typeof statusMap]?.variant || 'default'}>
                    {statusMap[interview.status as keyof typeof statusMap]?.label || interview.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDuration(interview.duration_taken)}</TableCell>
                <TableCell>
                  {interview.score !== null ? (
                    <span className={`font-medium ${
                      interview.score >= 80 ? 'text-green-600 dark:text-green-400' :
                      interview.score >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {interview.score}%
                    </span>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>{interview.experience_level || 'Not specified'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/interviews/results/${interview.id}`}>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    {interview.status === 'completed' && (
                      <Button variant="ghost" size="sm">
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
      
      {pagination.total > pagination.pageSize && (
        <div className="py-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => changePage(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {getPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => changePage(Math.min(totalPages, pagination.page + 1))}
                  className={pagination.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
