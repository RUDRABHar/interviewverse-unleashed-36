
import React from 'react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/design-system/GlassCard';
import { StaggerContainer, StaggerItem } from '@/components/ui/design-system/animations';

export const TestHistoryHeader = () => {
  return (
    <GlassCard 
      className="space-y-3 p-6 border border-gray-100 dark:border-gray-700"
      glassOpacity="light"
      borderEffect
    >
      <div className="flex items-start">
        <div className="h-12 w-12 rounded-lg bg-interview-primary/10 flex items-center justify-center mr-4">
          <FileText className="h-6 w-6 text-interview-primary" />
        </div>
        
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold font-sora text-gray-800 dark:text-gray-100 flex items-center gap-3"
          >
            Your Interview History
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mt-1"
          >
            Track your performance, growth, and patterns. Review past interviews to identify strengths and areas for improvement.
          </motion.p>
        </div>
      </div>
      
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StaggerItem>
          <div className="bg-gradient-to-br from-interview-primary/5 to-interview-primary/10 rounded-lg p-4 border border-interview-primary/20 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Interviews</div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">24</div>
          </div>
        </StaggerItem>
        
        <StaggerItem>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800/30 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">Average Score</div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">78%</div>
          </div>
        </StaggerItem>
        
        <StaggerItem>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30 hover:shadow-md transition-shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">Last Interview</div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Mar 12, 2025</div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </GlassCard>
  );
};
