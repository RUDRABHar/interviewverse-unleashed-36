
import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-40 h-40 mb-6">
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_8xmsndiu.json"
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop
          autoplay
        />
      </div>
      
      <h3 className="text-2xl font-semibold mb-2 dark:text-white">
        Your journey begins here
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Your journey begins here. Set up your first mock interview and take control of your success.
      </p>
      
      <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
        Start Now
      </button>
    </motion.div>
  );
};
