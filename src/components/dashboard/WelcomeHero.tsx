
import React from 'react';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/ui/design-system/GradientButton';
import EnhancedParticles from '@/components/ui/design-system/EnhancedParticles';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface WelcomeHeroProps {
  profile: any;
}

export const WelcomeHero = ({ profile }: WelcomeHeroProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-interview-primary/80 to-interview-blue/70 text-white"
    >
      {/* Enhanced particles */}
      <EnhancedParticles 
        color="#ffffff" 
        secondaryColor="#e0e7ff" 
        count={40} 
        depth={true}
        className="opacity-30"
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-[10%] left-[5%] w-40 h-40 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute bottom-[10%] right-[15%] w-60 h-60 bg-white/10 rounded-full blur-3xl"
        ></motion.div>
      </div>
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white font-sora"
          >
            Welcome to InterviewXpert
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl mb-6 text-white/90"
          >
            Your personalized AI interview coach is ready to help you master your next interview. 
            Practice, get feedback, and improve with every session.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <GradientButton 
              size="lg" 
              gradientFrom="from-white" 
              gradientTo="to-white/90"
              className="bg-white text-interview-primary hover:shadow-glow-primary transition-all duration-300 font-medium"
              glowEffect
            >
              <span>Start Mock Interview</span>
              <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </GradientButton>
            
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xs font-medium">
                    {i}
                  </div>
                ))}
              </div>
              <div className="ml-3 text-sm md:text-base text-white/90">
                3,204 users improved their skills this week
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 opacity-20 md:opacity-30">
        <motion.svg 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="white"/>
        </motion.svg>
      </div>
    </motion.div>
  );
};
