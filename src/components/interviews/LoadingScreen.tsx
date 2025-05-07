
import React from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Preparing your interview experience..." 
}) => {
  // Customize loading steps based on domain/interview type
  const loadingSteps = [
    "Analyzing your preferences...",
    "Crafting personalized questions...",
    "Preparing domain-specific scenarios...",
    "Setting up your virtual interview..."
  ];
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="rounded-full p-3 bg-orange-500/10 dark:bg-orange-500/20"
          >
            <Loader className="w-12 h-12 text-orange-500 dark:text-orange-400" />
          </motion.div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 dark:text-white">
          {message}
        </h2>
        
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 space-y-2"
          >
            {loadingSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.5 }}
                className="flex items-center"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="text-sm text-gray-500 dark:text-gray-500">
          Powered by Google Gemini 2.0 Flash
        </div>
      </motion.div>
    </div>
  );
};
