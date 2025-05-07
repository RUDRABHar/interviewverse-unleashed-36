
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/interviews/EmptyState';
import { InterviewCard } from '@/components/interviews/InterviewCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PremiumCard from '@/components/ui/design-system/PremiumCard';
import EnhancedParticles from '@/components/ui/design-system/EnhancedParticles';

interface InterviewHistoryProps {
  filter: 'all' | 'completed' | 'pending' | 'draft';
}

export const InterviewHistory: React.FC<InterviewHistoryProps> = ({ filter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Mock data - in a real app, this would come from an API
  const mockInterviews = [
    {
      id: '1',
      title: 'React JS Technical Round',
      types: ['technical'],
      score: 82,
      rating: 'Intermediate',
      status: 'completed',
      date: '2025-05-05T14:30:00',
      language: 'english',
      duration: 45
    },
    {
      id: '2',
      title: 'Leadership Skills Assessment',
      types: ['behavioral'],
      score: 75,
      rating: 'Advanced',
      status: 'completed',
      date: '2025-05-02T10:00:00',
      language: 'english',
      duration: 30
    },
    {
      id: '3',
      title: 'Frontend System Design',
      types: ['technical', 'communication'],
      score: 68,
      rating: 'Intermediate',
      status: 'pending',
      date: '2025-05-01T16:15:00',
      language: 'english',
      duration: 60
    }
  ];
  
  // Filter interviews based on selected filter
  const filteredInterviews = Array.isArray(mockInterviews) ? mockInterviews
    .filter(interview => {
      if (filter !== 'all' && interview.status !== filter) return false;
      if (typeFilter !== 'all' && !Array.isArray(interview.types)) return false;
      if (typeFilter !== 'all' && !interview.types.includes(typeFilter)) return false;
      if (searchQuery && !interview.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'highest') return b.score - a.score;
      if (sortBy === 'lowest') return a.score - b.score;
      return 0;
    }) : [];
  
  return (
    <PremiumCard 
      className="space-y-6 p-6 relative overflow-hidden" 
      glassOpacity="light"
      borderEffect
    >
      <EnhancedParticles count={15} className="opacity-30" />
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-interview-primary/50 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Select defaultValue={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="communication">Communication</SelectItem>
              <SelectItem value="language">Language</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Score</SelectItem>
              <SelectItem value="lowest">Lowest Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Interview Cards or Empty State */}
      <div className="relative z-10">
        {Array.isArray(filteredInterviews) && filteredInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </PremiumCard>
  );
};
