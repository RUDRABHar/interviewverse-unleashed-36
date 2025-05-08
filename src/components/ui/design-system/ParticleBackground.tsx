
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ParticleBackgroundProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  count = 50,
  color = '#FF6B00',
  minSize = 2,
  maxSize = 8,
  speed = 50,
  className,
}) => {
  const particles = useRef<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
    duration: number;
  }>>([]);

  // Generate particles on component mount
  useEffect(() => {
    particles.current = [];
    for (let i = 0; i < count; i++) {
      particles.current.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: minSize + Math.random() * (maxSize - minSize),
        opacity: 0.1 + Math.random() * 0.4,
        delay: Math.random() * 4,
        duration: 15 + Math.random() * 20
      });
    }
  }, [count, minSize, maxSize]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity
          }}
          animate={{
            y: ['0%', `${-speed}%`],
            opacity: [particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
