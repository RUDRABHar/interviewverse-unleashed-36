
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
}

const GradientButton = ({
  children,
  gradientFrom = 'from-interview-primary',
  gradientTo = 'to-interview-blue',
  className = '',
  asChild = false,
  ...props
}: GradientButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        className={cn(
          `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-xl shadow-lg hover:shadow-xl transition-all`,
          className
        )}
        asChild={asChild}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default GradientButton;
