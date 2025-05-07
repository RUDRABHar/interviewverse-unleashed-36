
import React, { useState } from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { TestHistoryFilters as FilterType } from '@/hooks/useTestHistory';
import { motion } from 'framer-motion';

interface TestHistoryFiltersProps {
  filters: FilterType;
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
}

export const TestHistoryFilters: React.FC<TestHistoryFiltersProps> = ({ filters, setFilters }) => {
  const [searchValue, setSearchValue] = useState(filters.search);
  const [dateOpen, setDateOpen] = useState(false);
  
  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchValue }));
  };
  
  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value as FilterType['type'] }));
  };
  
  const handleStatusChange = (value: string) => {
    setFilters(prev => ({ ...prev, status: value as FilterType['status'] }));
  };
  
  const handleDateChange = (range: { from: Date; to: Date | undefined }) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        from: range.from,
        to: range.to || null
      }
    }));
    if (range.to) {
      setDateOpen(false);
    }
  };
  
  const clearFilters = () => {
    setSearchValue('');
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateRange: {
        from: null,
        to: null
      }
    });
  };
  
  const formatDateRange = () => {
    if (!filters.dateRange.from) return 'Select dates';
    if (!filters.dateRange.to) return `From ${format(filters.dateRange.from, 'PP')}`;
    return `${format(filters.dateRange.from, 'PP')} - ${format(filters.dateRange.to, 'PP')}`;
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.dateRange.from;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-md"
    >
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by domain or title..."
            className="pl-10 bg-gray-50 dark:bg-gray-900 transition-colors hover:bg-white focus:bg-white dark:hover:bg-gray-800 dark:focus:bg-gray-800 border-gray-200 dark:border-gray-700"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="h-4 w-4 absolute top-3 left-3 text-gray-500 dark:text-gray-400" />
          {searchValue && (
            <button 
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" 
              onClick={() => {
                setSearchValue('');
                if (filters.search) {
                  setFilters(prev => ({ ...prev, search: '' }));
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-interview-primary" />
                <SelectValue placeholder="Interview Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="language">Language</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[200px] justify-start text-left font-normal bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                <Calendar className="mr-2 h-4 w-4 text-interview-primary" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from || undefined}
                selected={{
                  from: filters.dateRange.from || undefined,
                  to: filters.dateRange.to || undefined
                }}
                onSelect={(range: any) => handleDateChange(range || { from: null, to: null })}
                numberOfMonths={2}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-2">Active filters:</span>
          {filters.search && (
            <span className="bg-interview-primary/10 text-interview-primary px-2 py-1 rounded-full text-xs mr-2">
              Search: {filters.search}
            </span>
          )}
          {filters.type !== 'all' && (
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs mr-2">
              Type: {filters.type}
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs mr-2">
              Status: {filters.status}
            </span>
          )}
          {filters.dateRange.from && (
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-xs">
              Date: {formatDateRange()}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
