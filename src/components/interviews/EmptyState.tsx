
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import GradientButton from '@/components/ui/design-system/GradientButton';
import { StaggerContainer, StaggerItem } from '@/components/ui/design-system/animations';

export const EmptyState = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 text-center rounded-xl shadow-luxury glass-card p-8 overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-interview-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-interview-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
      
      <StaggerContainer className="relative z-10">
        <StaggerItem>
          <motion.div 
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-interview-primary/10 to-interview-blue/10 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <FileText className="h-12 w-12 text-interview-primary" />
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <h3 className="text-2xl font-bold mb-3 dark:text-white font-sora">
            No interviews yet
          </h3>
        </StaggerItem>
        
        <StaggerItem>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
            Create your first interview to get started. Take a practice interview to improve your skills 
            and track your progress over time.
          </p>
        </StaggerItem>
        
        <StaggerItem>
          <GradientButton 
            className="px-6 py-3 text-white rounded-xl shadow-luxury text-base group"
            glowEffect
            asChild
          >
            <Link to="/interviews" className="inline-flex items-center">
              Start Your First Interview
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </GradientButton>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
};
