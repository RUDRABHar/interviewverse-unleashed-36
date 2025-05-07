
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Brain, Globe, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Star className="h-10 w-10" />,
    title: 'Real-Time Feedback',
    description: 'Get instant analysis on your answers with detailed scoring on content, delivery, and confidence.',
    color: 'interview-primary',
  },
  {
    icon: <Brain className="h-10 w-10" />,
    title: 'Behavioral & Technical Assessments',
    description: 'Practice both soft skills and technical knowledge with specialized interview modules.',
    color: 'interview-blue',
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: 'Smart Adaptation',
    description: 'Our AI evolves with you, adjusting question difficulty based on your improving performance.',
    color: 'interview-primary',
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: 'Skill Map Visualization',
    description: 'See a 3D visualization of your strengths and areas for improvement across different competencies.',
    color: 'interview-blue',
  },
];

const Features = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    }
  };

  return (
    <section id="features" className="section-padding">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">Feature Highlights</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover the tools that make InterviewXpert the most advanced interview preparation platform
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="rounded-xl p-8 card-hover relative overflow-hidden border border-gray-100 shadow-md content-card"
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
              
              <h3 className="text-xl font-semibold mb-4 font-sora">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              
              {/* Subtle decoration line */}
              <div className={cn(
                "absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r",
                feature.color === 'interview-primary' ? 
                  "from-interview-primary/30 to-transparent" : 
                  "from-interview-blue/30 to-transparent"
              )} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
