
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const EmptyTestHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 p-8 animate-fade-in"
    >
      <div className="w-40 h-40 mb-6 text-interview-primary/50">
        <FileText className="h-24 w-24 mx-auto mb-6" />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2 dark:text-white font-sora">
        No interviews yet
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Once you complete your first mock interview, it will appear here. Practice makes perfect!
      </p>
      
      <Link to="/interviews">
        <Button className="px-6 py-2.5 bg-gradient-to-r from-interview-primary to-interview-primary/80 hover:from-interview-primary/90 hover:to-interview-primary text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
          Start Your First Interview
        </Button>
      </Link>
    </motion.div>
  );
};
