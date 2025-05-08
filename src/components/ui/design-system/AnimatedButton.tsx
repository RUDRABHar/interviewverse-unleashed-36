
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

interface AnimatedButtonProps extends ButtonProps {
  glowEffect?: boolean;
  pulseEffect?: boolean;
  gradientText?: boolean;
  gradientBorder?: boolean;
  gradientBg?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(({
  className,
  variant = 'default',
  size = 'default',
  children,
  glowEffect = false,
  pulseEffect = false,
  gradientText = false,
  gradientBorder = false,
  gradientBg = false,
  iconLeft,
  iconRight,
  ...props
}, ref) => {
  
  // Handle hover animation for the glow
  const [isHovering, setIsHovering] = React.useState(false);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      {gradientBorder && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 -z-10 blur-[2px]"></div>
      )}
      
      <Button
        ref={ref}
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2",
          // Gradient background
          gradientBg && "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none",
          // Glow effect
          glowEffect && isHovering && "shadow-[0_0_15px_rgba(255,107,0,0.5)]",
          // Gradient text
          gradientText && "bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent",
          // Additional classes
          className
        )}
        variant={variant}
        size={size}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        {...props}
      >
        {/* Left icon */}
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        
        {/* Button content */}
        <span className="relative z-10">
          {children}
        </span>
        
        {/* Right icon */}
        {iconRight && <span className="ml-2">{iconRight}</span>}
        
        {/* Animated background gradient */}
        {gradientBg && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            initial={{ x: '-100%', opacity: 0 }}
            animate={isHovering ? { x: '100%', opacity: 0.3 } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
        )}
        
        {/* Pulse animation */}
        {pulseEffect && (
          <motion.div
            className="absolute inset-0 bg-orange-500 rounded-xl"
            animate={isHovering ? { 
              scale: [1, 1.05, 1], 
              opacity: [0.2, 0.3, 0.2] 
            } : {}}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity 
            }}
          />
        )}
      </Button>
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
