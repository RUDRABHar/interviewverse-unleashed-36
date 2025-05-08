
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  glowEffect?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon'; 
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  asChild?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(({
  children,
  className = '',
  gradientFrom = 'from-interview-primary',
  gradientTo = 'to-interview-blue',
  glowEffect = false,
  size = 'default',
  variant = 'default',
  asChild = false,
  ...props
}, ref) => {
  // Only apply gradient styling when variant is default or gradient
  const shouldApplyGradient = variant === 'default' || variant === 'gradient';
  
  const buttonClassName = cn(
    shouldApplyGradient && `relative overflow-hidden bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`,
    'rounded-xl transition-all duration-300',
    glowEffect && 'hover:shadow-glow-primary',
    className
  );
  
  // Using a different approach to handle the asChild prop
  if (asChild) {
    return (
      <Button
        className={buttonClassName}
        size={size as any}
        variant={shouldApplyGradient ? 'default' : variant as any}
        asChild
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        className={buttonClassName}
        size={size as any}
        variant={shouldApplyGradient ? 'default' : variant as any}
        ref={ref}
        {...props}
      >
        <div className="relative z-10 flex items-center">
          {children}
          {shouldApplyGradient && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              whileHover={{ x: '100%', opacity: 0.3 }}
              transition={{ duration: 0.7 }}
            />
          )}
        </div>
      </Button>
    </motion.div>
  );
});

GradientButton.displayName = 'GradientButton';

export default GradientButton;
