
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { type ButtonProps } from '@/components/ui/button';

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
  asChild?: boolean;
  glowEffect?: boolean;
}

const GradientButton = ({
  children,
  gradientFrom = 'from-interview-primary',
  gradientTo = 'to-interview-blue',
  className = '',
  asChild = false,
  glowEffect = false,
  ...props
}: GradientButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={glowEffect ? "animate-glow" : ""}
    >
      <Button
        className={cn(
          `relative bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden`,
          className
        )}
        asChild={asChild}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </Button>
    </motion.div>
  );
};

export default GradientButton;
