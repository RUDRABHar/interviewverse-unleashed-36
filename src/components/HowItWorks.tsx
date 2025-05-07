
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Brain, BarChart, Sparkles } from 'lucide-react';
import { StaggerContainer, StaggerItem } from './ui/design-system/animations';
import GlassCard from './ui/design-system/GlassCard';

const steps = [
  {
    icon: <User className="h-8 w-8 text-interview-primary" />,
    title: 'Choose Role & Domain',
    description: 'Select from hundreds of job roles and interview types tailored to your career path.',
  },
  {
    icon: <Brain className="h-8 w-8 text-interview-blue" />,
    title: 'Answer AI-Powered Questions',
    description: 'Face realistic, adaptive interview questions asked by our AI interviewer.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-interview-primary" />,
    title: 'Get Real-Time Feedback',
    description: 'Receive immediate insights on your answers with detailed scoring and suggestions.',
  },
  {
    icon: <Sparkles className="h-8 w-8 text-interview-blue" />,
    title: 'Improve with Smart Recommendations',
    description: 'Get personalized learning paths based on your performance patterns.',
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-br from-gray-50/50 to-interview-primary/5 py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-interview-primary bg-interview-primary/10 px-4 py-1 rounded-full text-sm font-medium">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl md:text-4xl font-sora font-bold mt-4 mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our AI-driven process makes interview preparation intuitive and effective
          </p>
        </motion.div>
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <GlassCard 
                className="h-full p-6 flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1 transition-all duration-300"
                glassOpacity="light"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-interview-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="w-16 h-16 rounded-full bg-interview-primary/10 flex items-center justify-center mb-6 z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 font-sora">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Step number indicator */}
                <div className="absolute bottom-2 right-3 text-5xl font-bold text-gray-100 dark:text-gray-800/20 font-sora">
                  {index + 1}
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <ArrowRight className="h-6 w-6 text-interview-primary/50" />
                  </div>
                )}
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowItWorks;
