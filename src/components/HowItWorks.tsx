
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Brain, BarChart, Sparkles } from 'lucide-react';

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
  // Animation variants for staggering elements
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
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="how-it-works" className="section-padding bg-interview-primary/5">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our AI-driven process makes interview preparation intuitive and effective
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-md card-hover flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-interview-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="w-16 h-16 rounded-full bg-interview-primary/10 flex items-center justify-center mb-6 z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 font-sora">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-20">
                  <ArrowRight className="h-6 w-6 text-interview-primary/50" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
