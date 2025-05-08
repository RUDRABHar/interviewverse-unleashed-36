
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, Gem } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientButton from '@/components/ui/design-system/GradientButton';

export const ProUpgradeCard = () => {
  const features = [
    'Detailed performance analytics',
    'Unlimited practice interviews',
    'Advanced AI feedback',
    'Download interview reports',
    'Priority support'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-purple-500/10 to-transparent opacity-40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-blue-500/10 to-transparent opacity-40 blur-3xl"></div>
        
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }}
              className="absolute rounded-full bg-white"
            />
          ))}
        </div>
      </div>
      
      <CardContent className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mr-2"
            >
              <Gem className="h-5 w-5 text-orange-400" />
            </motion.div>
            <h3 className="text-lg font-semibold font-sora">InterviewAce Pro</h3>
          </div>
          <span className="bg-gradient-to-r from-orange-500/30 to-yellow-500/30 text-orange-300 text-xs font-medium px-2.5 py-1 rounded-full">Recommended</span>
        </div>
        
        <p className="text-gray-300 mb-6">Unlock premium features and take your interview skills to the next level.</p>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <motion.li 
              key={index} 
              className="flex items-center text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
        
        <div className="mb-6 pt-2 pb-4 border-y border-white/10">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-gray-400">Starting at</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">$12</span>
              <span className="text-gray-400 ml-1">/month</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Billed annually or $15 monthly
          </div>
        </div>
        
        <GradientButton 
          className="w-full font-medium flex items-center justify-center"
          gradientFrom="from-orange-500" 
          gradientTo="to-amber-500"
          glowEffect
        >
          <Sparkles className="w-4 h-4 mr-1" />
          <span>Upgrade to Pro</span>
        </GradientButton>
        
        <div className="text-center mt-3 text-xs text-gray-400">
          7-day money-back guarantee
        </div>
      </CardContent>
    </motion.div>
  );
};
