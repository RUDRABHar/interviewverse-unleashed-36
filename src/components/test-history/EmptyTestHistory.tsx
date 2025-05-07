
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export const EmptyTestHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 animate-fade-in bg-white dark:bg-gray-800 overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-interview-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-interview-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <div className="relative z-10">
        <div className="w-32 h-32 mx-auto mb-8 bg-interview-primary/10 rounded-full flex items-center justify-center">
          <FileText className="h-16 w-16 text-interview-primary" />
        </div>
        
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-4 dark:text-white font-sora"
        >
          No interviews yet
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 max-w-md mb-8"
        >
          Once you complete your first mock interview, it will appear here. Practice makes perfect!
          Start your journey towards interview mastery today.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/interviews">
            <Button className="px-6 py-6 bg-interview-primary hover:bg-interview-primary/90 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-xl flex items-center gap-2 text-base">
              Start Your First Interview
              <ArrowRight className="h-5 w-5 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
