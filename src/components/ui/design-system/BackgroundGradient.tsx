
import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'orange' | 'blue' | 'purple' | 'subtle';
  animate?: boolean;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  className,
  variant = 'primary',
  animate = false,
}) => {
  const gradientVariants = {
    primary: 'from-orange-500/20 via-orange-500/10 to-transparent',
    orange: 'from-orange-500/20 via-amber-500/10 to-transparent',
    blue: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    purple: 'from-purple-600/20 via-pink-500/10 to-transparent',
    subtle: 'from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-950',
  };
  
  return (
    <div className="relative overflow-hidden">
      <div 
        className={cn(
          'absolute inset-0 -z-10 bg-gradient-radial',
          gradientVariants[variant],
          animate && 'animate-pulse-slow',
          className
        )}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};

export default BackgroundGradient;
