
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface PremiumCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glassOpacity?: 'light' | 'medium' | 'heavy';
  glowEffect?: boolean;
  hoverEffect?: boolean;
  borderEffect?: boolean;
  gradientBorder?: boolean;
  variant?: 'default' | 'elevated' | 'subtle' | 'flat';
}

export const PremiumCard = ({
  children,
  className = '',
  glassOpacity = 'medium',
  glowEffect = false,
  hoverEffect = false,
  borderEffect = false,
  gradientBorder = false,
  variant = 'default',
  ...props
}: PremiumCardProps) => {
  const opacityClasses = {
    light: 'bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm',
    medium: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-md',
    heavy: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg',
  };

  const variantClasses = {
    default: 'border border-gray-200/30 dark:border-white/10 shadow-md',
    elevated: 'border border-gray-200/30 dark:border-white/10 shadow-lg',
    subtle: 'border border-gray-100/20 dark:border-white/5 shadow-sm',
    flat: 'border-0'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hoverEffect ? { 
        y: -5, 
        boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)"
      } : {}}
      className={cn(
        'rounded-2xl transition-all duration-300',
        opacityClasses[glassOpacity],
        variantClasses[variant],
        glowEffect && 'shadow-[0_0_20px_rgba(155,135,245,0.3)]',
        borderEffect && 'hover:border-interview-primary/30',
        gradientBorder && 'border-gradient',
        className
      )}
      {...props}
    >
      {gradientBorder && (
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-br from-interview-primary/30 via-interview-blue/20 to-transparent -z-10 blur-[0.5px]"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default PremiumCard;
