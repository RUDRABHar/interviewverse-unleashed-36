
import React from 'react';
import { format } from 'date-fns';
import { FileText, RefreshCw, Download } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreCircle } from '@/components/interviews/ScoreCircle';
import { motion } from 'framer-motion';
import PremiumCard from '@/components/ui/design-system/PremiumCard';

interface InterviewCardProps {
  interview: {
    id: string;
    title: string;
    types: string[];
    score: number;
    rating: string;
    status: string;
    date: string;
    language: string;
    duration: number;
  };
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const statusColor = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300',
  };
  
  const typeColor = {
    technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    behavioral: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    communication: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    language: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  };
  
  const ratingColor = {
    Beginner: 'text-blue-600 dark:text-blue-400',
    Intermediate: 'text-purple-600 dark:text-purple-400',
    Advanced: 'text-orange-600 dark:text-orange-400',
  };

  // Format date safely with validation
  const formatDateSafely = (dateString: string, formatStr: string) => {
    try {
      // Check if dateString is valid
      if (!dateString || dateString === 'Invalid date') {
        return 'N/A';
      }
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return format(date, formatStr);
    } catch (error) {
      console.error("Error formatting date:", error, "Date string was:", dateString);
      return 'Invalid date';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PremiumCard 
        className="overflow-hidden border-gray-200/50 dark:border-gray-700/50"
        glassOpacity="heavy"
        hoverEffect
        variant="elevated"
      >
        <CardHeader className="px-4 py-3 bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/60 dark:to-gray-900/60 border-b dark:border-gray-800/50">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold dark:text-white line-clamp-1 text-gray-800" title={interview.title}>
              {interview.title}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[interview.status as keyof typeof statusColor]}`}>
              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {formatDateSafely(interview.date, 'MMM d, yyyy')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDateSafely(interview.date, 'h:mm a')} • {interview.duration} min
              </div>
            </div>
            
            <ScoreCircle score={interview.score} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {interview.types.map(type => (
              <span 
                key={type} 
                className={`text-xs px-2 py-0.5 rounded-full ${typeColor[type as keyof typeof typeColor] || 'bg-gray-100 text-gray-800 dark:bg-gray-800/80 dark:text-gray-200'}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
            
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800/80 dark:text-gray-200">
              {interview.language.charAt(0).toUpperCase() + interview.language.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm font-medium dark:text-white">AI Rating:</span>
            <span className={`ml-2 text-sm font-medium ${ratingColor[interview.rating as keyof typeof ratingColor] || ''}`}>
              {interview.rating}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-gray-50/80 dark:bg-gray-800/30 border-t dark:border-gray-800/50 flex justify-between">
          <Button variant="outline" size="sm" className="gap-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <FileText className="h-4 w-4" />
            <span>Report</span>
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100/80 dark:hover:bg-gray-800/80">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-8 w-8 hover:bg-gray-100/80 dark:hover:bg-gray-800/80">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </PremiumCard>
    </motion.div>
  );
};
