
import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientButton from '@/components/ui/design-system/GradientButton';

interface InterviewsHeaderProps {
  onNewInterview: () => void;
}

export const InterviewsHeader: React.FC<InterviewsHeaderProps> = ({ onNewInterview }) => {
  return (
    <motion.div 
      className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-sora">Interviews</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage your interview sessions</p>
      </div>
      
      <GradientButton 
        onClick={onNewInterview}
        size="lg"
        className="shrink-0"
        glowEffect
      >
        <Plus className="h-5 w-5 mr-1" /> New Interview
      </GradientButton>
    </motion.div>
  );
};
