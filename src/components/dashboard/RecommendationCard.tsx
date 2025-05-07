
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface RecommendationCardProps {
  recommendation: {
    id: string;
    type: string;
    title: string;
    content: string;
    icon: ReactNode;
  };
}

export const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const { type, title, content, icon } = recommendation;
  
  return (
    <Card className="flex-shrink-0 w-[320px] snap-center border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start">
          <div className="mr-4 mt-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              {icon}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm">
              {title}
            </h3>
            <p className="mt-1 text-base text-gray-800 dark:text-gray-200">
              {content}
            </p>
            
            <button className="mt-3 text-interview-primary hover:text-interview-violet text-sm font-medium">
              {type === 'challenge' ? 'Start Challenge' : 
               type === 'tip' ? 'Learn More' : 
               'Apply Suggestion'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
