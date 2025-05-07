
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex justify-between items-start p-4">
            <div className="flex flex-col">
              <h3 className="font-medium text-lg text-gray-800 dark:text-gray-100">{title}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                <span>{mode} Interview</span>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <span>{time}</span>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <span>{formattedDate}</span>
              </div>
            </div>
            <div 
              className={cn(
                "text-2xl font-bold flex items-center justify-center rounded-full w-12 h-12",
                score >= 70 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : 
                "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              )}
            >
              {score}
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Badge 
                variant={result === "Pass" ? "default" : "secondary"}
                className={cn(
                  result === "Pass" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200" : 
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
                )}
              >
                {result}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">
                {status}
              </Badge>
            </div>
            <button className="text-interview-primary hover:text-interview-blue flex items-center text-sm font-medium">
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
