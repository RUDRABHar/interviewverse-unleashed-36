
import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glassmorphic' | 'bordered' | 'minimal';
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

const PremiumCard = forwardRef<HTMLDivElement, PremiumCardProps>(({
  children,
  className,
  variant = 'default',
  hoverEffect = false,
  glowEffect = false,
  ...props
}, ref) => {
  const variantStyles = {
    default: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm',
    elevated: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg',
    glassmorphic: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 shadow-lg',
    bordered: 'bg-white dark:bg-gray-800 border-2 border-orange-500/40 dark:border-orange-400/40 shadow-sm',
    minimal: 'bg-transparent border border-gray-100 dark:border-gray-800',
  };

  const hoverEffectStyles = hoverEffect 
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg' 
    : '';
  
  const glowEffectStyles = glowEffect
    ? 'hover:shadow-[0_0_15px_rgba(255,107,0,0.3)]'
    : '';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        'rounded-xl overflow-hidden',
        variantStyles[variant],
        hoverEffectStyles,
        glowEffectStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

PremiumCard.displayName = 'PremiumCard';

export default PremiumCard;
