
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const EmptyTestHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-40 h-40 mb-6">
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_khzniaya.json"
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
        />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2 dark:text-white">
        No interviews yet
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Once you complete your first mock interview, it will appear here. Practice makes perfect!
      </p>
      
      <Link to="/interviews">
        <Button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
          Start Your First Interview
        </Button>
      </Link>
    </motion.div>
  );
};
