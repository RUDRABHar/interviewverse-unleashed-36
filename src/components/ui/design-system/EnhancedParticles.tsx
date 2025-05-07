
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from 'framer-motion';

interface ParticleProps {
  color?: string;
  secondaryColor?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  depth?: boolean;
  className?: string;
}

const EnhancedParticles: React.FC<ParticleProps> = ({
  color = '#9b87f5',
  secondaryColor = '#0EA5E9',
  count = 30,
  minSize = 5,
  maxSize = 20,
  speed = 20,
  depth = true,
  className = ''
}) => {
  const [animationState, cycleAnimation] = useCycle(0, 1);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * (maxSize - minSize) + minSize;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * speed + speed / 2;
        const delay = Math.random() * 2;
        const zIndex = depth ? Math.floor(Math.random() * 10) : 0;
        const particleColor = Math.random() > 0.5 ? color : secondaryColor;
        const opacity = depth ? 0.1 + (zIndex / 20) : 0.2;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: particleColor,
              width: size,
              height: size,
              top: `${initialY}%`,
              left: `${initialX}%`,
              filter: `blur(${Math.random() * 2 + 1}px)`,
              zIndex,
              opacity
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [opacity, opacity * 1.4, opacity],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay,
            }}
          />
        );
      })}
      
      {/* Add floating gradient orbs for luxury effect */}
      <div className="absolute top-1/4 -left-[10%] w-[30%] h-[40%] rounded-full bg-gradient-radial from-interview-primary/10 to-transparent blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-[5%] w-[25%] h-[30%] rounded-full bg-gradient-radial from-interview-blue/10 to-transparent blur-3xl"></div>
    </div>
  );
};

export default EnhancedParticles;
