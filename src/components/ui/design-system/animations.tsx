
import React from 'react';
import { motion } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '',
  delay = 0.2,
  staggerDelay = 0.1
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

// Fade in animation component
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}> = ({ children, delay = 0, duration = 0.5, className = '', direction = 'up' }) => {
  const getDirectionProps = () => {
    switch (direction) {
      case 'up':
        return { y: 20 };
      case 'down':
        return { y: -20 };
      case 'left':
        return { x: 20 };
      case 'right':
        return { x: -20 };
      default:
        return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getDirectionProps() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale in animation component
export const ScaleIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.4, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, type: "spring", stiffness: 200, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Slide in animation component
export const SlideIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
}> = ({ children, delay = 0, duration = 0.5, direction = 'left', className = '' }) => {
  const getDirectionProps = () => {
    switch (direction) {
      case 'left':
        return { x: -50, initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'right':
        return { x: 50, initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } };
      case 'top':
        return { y: -50, initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case 'bottom':
        return { y: 50, initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      default:
        return { x: 0, initial: { opacity: 0 }, animate: { opacity: 1 } };
    }
  };

  const { initial, animate } = getDirectionProps();

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration, delay, type: "tween", ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
