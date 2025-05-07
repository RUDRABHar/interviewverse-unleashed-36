
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/design-system/GradientButton';
import { StaggerContainer, StaggerItem } from '@/components/ui/design-system/animations';

export const EmptyTestHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 bg-white dark:bg-gray-800 overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-interview-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-interview-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <StaggerContainer className="relative z-10">
        <StaggerItem>
          <motion.div 
            className="w-32 h-32 mx-auto mb-8 bg-interview-primary/10 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FileText className="h-16 w-16 text-interview-primary" />
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <h3 className="text-2xl font-bold mb-4 dark:text-white font-sora">
            No interviews yet
          </h3>
        </StaggerItem>
        
        <StaggerItem>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
            Once you complete your first mock interview, it will appear here. Practice makes perfect!
            Start your journey towards interview mastery today.
          </p>
        </StaggerItem>
        
        <StaggerItem>
          <Link to="/interviews">
            <GradientButton 
              className="px-6 py-6 text-white rounded-xl shadow-md hover:shadow-xl text-base group"
            >
              Start Your First Interview
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </GradientButton>
          </Link>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
};
