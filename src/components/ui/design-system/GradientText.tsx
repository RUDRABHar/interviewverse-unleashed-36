
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  variant?: 'primary' | 'secondary' | 'orange' | 'blue' | 'purple';
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className,
  as: Component = 'span',
  variant = 'primary',
}) => {
  const gradientStyles = {
    primary: 'from-orange-500 to-orange-600',
    secondary: 'from-orange-500 to-blue-500',
    orange: 'from-orange-500 to-yellow-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-600 to-pink-500',
  };
  
  return (
    <Component 
      className={cn(
        'bg-gradient-to-br bg-clip-text text-transparent inline-block',
        gradientStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default GradientText;
