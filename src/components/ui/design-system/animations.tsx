
import { motion, Variants } from 'framer-motion';
import React from 'react';

export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

export const staggeredChildrenVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 20
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -20
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

export const FadeIn: React.FC<{
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ children, duration = 0.5, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<{
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}> = ({ children, duration = 0.5, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDuration?: number;
  className?: string;
  viewportOnce?: boolean;
}> = ({ children, staggerDuration = 0.2, className, viewportOnce = true }) => (
  <motion.div
    variants={staggeredChildrenVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: viewportOnce }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    variants={fadeInVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const FloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    animate={{ 
      y: [0, -10, 0],
    }}
    transition={{ 
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    className={className}
  >
    {children}
  </motion.div>
);
