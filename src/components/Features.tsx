
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Brain, Globe, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from './ui/design-system/animations';
import GlassCard from './ui/design-system/GlassCard';
import BackgroundParticles from './ui/design-system/BackgroundParticles';

const features = [
  {
    icon: <Star className="h-10 w-10" />,
    title: 'Real-Time Feedback',
    description: 'Get instant analysis on your answers with detailed scoring on content, delivery, and confidence.',
    color: 'interview-primary',
    benefits: ['Content scoring', 'Delivery analysis', 'Confidence assessment']
  },
  {
    icon: <Brain className="h-10 w-10" />,
    title: 'Behavioral & Technical Assessments',
    description: 'Practice both soft skills and technical knowledge with specialized interview modules.',
    color: 'interview-blue',
    benefits: ['Domain-specific questions', 'Adaptive difficulty', 'Framework-based assessment']
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: 'Smart Adaptation',
    description: 'Our AI evolves with you, adjusting question difficulty based on your improving performance.',
    color: 'interview-primary',
    benefits: ['Personalized learning path', 'Weak areas focus', 'Progress tracking']
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: 'Skill Map Visualization',
    description: 'See a 3D visualization of your strengths and areas for improvement across different competencies.',
    color: 'interview-blue',
    benefits: ['Visual skill mapping', 'Comparative analysis', 'Growth trajectory']
  },
];

const Features = () => {
  return (
    <section id="features" className="section-padding py-24 relative overflow-hidden">
      {/* Subtle background particles */}
      <BackgroundParticles color="#9b87f5" count={10} className="opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-interview-primary bg-interview-primary/10 px-4 py-1 rounded-full text-sm font-medium">
            Powerful Tools
          </span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mt-4 mb-4">Feature Highlights</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover the tools that make InterviewXpert the most advanced interview preparation platform
          </p>
        </motion.div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <StaggerItem key={index}>
              <GlassCard 
                className="rounded-2xl p-8 h-full relative overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                glassOpacity="medium"
              >
                {/* Gradient corner decoration */}
                <div className={cn(
                  "absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10",
                  `bg-${feature.color}`
                )} />
                
                <div className={cn(
                  "w-16 h-16 rounded-full mb-6 flex items-center justify-center relative z-10",
                  `text-${feature.color}`,
                  `bg-${feature.color}/10`,
                )}>
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 font-sora">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                {/* Benefits list */}
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center text-white",
                        feature.color === 'interview-primary' ? "bg-interview-primary" : "bg-interview-blue"
                      )}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Subtle decoration line */}
                <div className={cn(
                  "absolute bottom-0 left-0 h-1 w-full",
                  feature.color === 'interview-primary' ? 
                    "bg-gradient-to-r from-interview-primary to-transparent" : 
                    "bg-gradient-to-r from-interview-blue to-transparent"
                )} />
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Features;
