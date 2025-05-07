
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className = '',
  gradientFrom = 'from-interview-primary',
  gradientTo = 'to-interview-blue',
  glowEffect = false,
  size = 'default',
  variant = 'default',
  asChild = false,
  ...props
}) => {
  // Only apply gradient styling when variant is default or gradient
  const shouldApplyGradient = variant === 'default' || variant === 'gradient';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        className={cn(
          shouldApplyGradient && `relative overflow-hidden bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`,
          'rounded-xl transition-all duration-300',
          glowEffect && 'hover:shadow-glow-primary',
          className
        )}
        size={size as any}
        variant={shouldApplyGradient ? 'default' : variant as any}
        asChild={asChild}
        {...props}
      >
        <div className="relative z-10 flex items-center">
          {children}
        </div>
        {shouldApplyGradient && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            initial={{ x: '-100%', opacity: 0 }}
            whileHover={{ x: '100%', opacity: 0.3 }}
            transition={{ duration: 0.7 }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default GradientButton;
