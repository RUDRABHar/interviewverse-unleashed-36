
import React from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  color?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

const BackgroundParticles: React.FC<ParticleProps> = ({
  color = '#9b87f5',
  count = 20,
  minSize = 5,
  maxSize = 15,
  speed = 20,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * (maxSize - minSize) + minSize;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const duration = Math.random() * speed + speed / 2;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              top: `${initialY}%`,
              left: `${initialX}%`,
              filter: 'blur(2px)'
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        );
      })}
    </div>
  );
};

export default BackgroundParticles;
