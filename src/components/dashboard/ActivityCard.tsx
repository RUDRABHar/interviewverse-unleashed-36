
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock, Calendar, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import PremiumCard from '@/components/ui/design-system/PremiumCard';

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    score: number;
    result: string;
    mode: string;
    status: string;
    time: string;
    date: string;
  };
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const { title, score, result, mode, status, time, date } = activity;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <PremiumCard 
      className="overflow-hidden bg-white dark:bg-gray-800 border-gray-100/30 dark:border-gray-700/30"
      hoverEffect
      variant="elevated"
    >
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="p-5 border-b border-gray-100/50 dark:border-gray-700/50">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                  score >= 70 ? "bg-green-100/50 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                  "bg-amber-100/50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <BarChart2 className="h-6 w-6" />
                  </motion.div>
                </div>
                
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formattedDate}
                    </span>
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn(
                  "text-2xl font-bold flex items-center justify-center rounded-xl w-14 h-14",
                  score >= 70 ? "bg-green-100/80 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                  "bg-amber-100/80 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                )}
              >
                {score}
              </motion.div>
            </div>
          </div>
          
          <div className="px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary"
                className={cn(
                  "px-3 py-1",
                  result === "Pass" ? "bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200/80" : 
                  "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200/80"
                )}
              >
                {result}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 bg-gray-50/80 dark:bg-gray-800/80">
                {mode} Mode
              </Badge>
              <Badge variant="outline" className="px-3 py-1 bg-gray-50/80 dark:bg-gray-800/80">
                {status}
              </Badge>
            </div>
            <motion.button 
              whileHover={{ x: 3 }}
              className="text-interview-primary hover:text-interview-blue flex items-center text-sm font-medium"
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </motion.button>
          </div>
        </div>
      </CardContent>
    </PremiumCard>
  );
};
