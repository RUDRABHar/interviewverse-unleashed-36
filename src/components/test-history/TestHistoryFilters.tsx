
import React from 'react';
import { Search, CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import PremiumCard from '@/components/ui/design-system/PremiumCard';

interface TestHistoryFiltersProps {
  filters: {
    search: string;
    status: string;
    type: string;
    dateRange: { from: Date | undefined; to: Date | undefined };
    sortBy: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    status: string;
    type: string;
    dateRange: { from: Date | undefined; to: Date | undefined };
    sortBy: string;
  }>>;
}

export const TestHistoryFilters: React.FC<TestHistoryFiltersProps> = ({ filters, setFilters }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value }));
  };
  
  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
  };
  
  const handleDateRangeChange = (dateRange: { from: Date | undefined; to: Date | undefined }) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };
  
  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
  };
  
  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      dateRange: { from: undefined, to: undefined },
      sortBy: 'newest'
    });
  };

  return (
    <PremiumCard 
      className="p-6 shadow-md backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50" 
      glassOpacity="medium"
    >
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by interview type, domain..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-2 focus:ring-interview-primary/50 shadow-sm backdrop-blur-sm transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DatePicker
              value={filters.dateRange}
              onChange={handleDateRangeChange}
            />
            
            <Button 
              variant="outline" 
              className="flex-shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Status filter */}
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">In Progress</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Interview type filter */}
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[150px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <SelectValue placeholder="Interview Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="system_design">System Design</SelectItem>
              <SelectItem value="mock">Mock Interview</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort By */}
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[150px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="score_high">Highest Score</SelectItem>
              <SelectItem value="score_low">Lowest Score</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </PremiumCard>
  );
};
