
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glassOpacity?: 'light' | 'medium' | 'heavy';
  glowEffect?: boolean;
  hoverEffect?: boolean;
  borderEffect?: boolean;
}

export const GlassCard = ({
  children,
  className = '',
  glassOpacity = 'medium',
  glowEffect = false,
  hoverEffect = false,
  borderEffect = false,
  ...props
}: GlassCardProps) => {
  const opacityClasses = {
    light: 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm',
    medium: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md',
    heavy: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg',
  };

  const hoverAnimationProps = hoverEffect ? {
    whileHover: { y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }
  } : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...hoverAnimationProps}
      className={cn(
        'rounded-2xl border border-gray-200/30 dark:border-white/10 shadow-md transition-all duration-300',
        opacityClasses[glassOpacity],
        glowEffect && 'shadow-[0_0_15px_rgba(155,135,245,0.3)]',
        borderEffect && 'hover:border-interview-primary/30',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
