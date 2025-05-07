
import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { TestHistoryFilters as FilterType } from '@/hooks/useTestHistory';

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by domain or title..."
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="h-4 w-4 absolute top-3 left-3 text-gray-500" />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Interview Type" />
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
            <SelectTrigger className="w-[130px]">
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
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDateRange()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
              />
            </PopoverContent>
          </Popover>
          
          {(filters.search || filters.type !== 'all' || filters.status !== 'all' || filters.dateRange.from) && (
            <Button variant="ghost" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
