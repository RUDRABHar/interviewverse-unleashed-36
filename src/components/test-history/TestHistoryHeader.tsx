
import React from 'react';
import { FileText } from 'lucide-react';

export const TestHistoryHeader = () => {
  return (
    <div className="space-y-2 animate-fade-in">
      <h1 className="text-3xl font-bold font-sora text-gray-800 dark:text-gray-100 flex items-center gap-3">
        <FileText className="h-7 w-7 text-interview-primary" />
        Your Interview History
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Track your performance, growth, and patterns. Review past interviews to identify strengths and areas for improvement.
      </p>
    </div>
  );
};
