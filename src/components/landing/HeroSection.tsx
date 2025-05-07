
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/design-system/GradientButton';
import BackgroundParticles from '../ui/design-system/BackgroundParticles';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20">
      {/* Background particles */}
      <BackgroundParticles color="#9b87f5" count={20} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col space-y-6"
          >
            <motion.span 
              className="text-sm md:text-base text-interview-primary bg-interview-primary/10 w-fit px-4 py-1.5 rounded-full font-medium"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              AI-Powered Interview Preparation
            </motion.span>
            
            <motion.div 
              className="content-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sora leading-tight text-shadow-sm">
                Master Every Interview with <span className="text-interview-primary">AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl mt-4">
                AI-powered mock interviews tailored to your domain, difficulty & growth level. Get real-time feedback and improve your chances of landing your dream job.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6">
                <GradientButton 
                  size="lg" 
                  className="rounded-full px-8 py-6 text-lg font-medium group"
                >
                  <Link to="/auth" className="flex items-center">
                    Start Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </GradientButton>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-medium border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  asChild
                >
                  <Link to="#how-it-works" className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    See How It Works
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-500 pt-4 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden shadow-md">
                    <span className="text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <span>Join 10,000+ professionals preparing with InterviewXpert</span>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Decorative elements */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-interview-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-interview-blue/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
              
              {/* Main image container */}
              <motion.div 
                className="relative p-8"
                animate={{ 
                  y: [0, -10, 0], 
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  repeatType: "reverse", 
                  ease: "easeInOut"
                }}
              >
                <div className="glass-effect-strong rounded-2xl shadow-2xl p-4">
                  <div className="rounded-lg bg-interview-primary/10 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-interview-primary/20 flex items-center justify-center">
                        <span className="text-interview-primary text-xl font-bold">AI</span>
                      </div>
                      <div>
                        <h3 className="font-medium">InterviewXpert AI</h3>
                        <p className="text-sm text-gray-500">Technical Interview Round</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                        <p className="text-sm">Tell me about a challenging project you've worked on.</p>
                      </div>
                      <div className="bg-interview-primary/10 p-3 rounded-lg ml-6">
                        <p className="text-sm">I led a team of 3 developers to create a real-time dashboard...</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <p className="text-sm">Analyzing your response...</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-500">Strong communication</span>
                        <div className="h-2 w-2 bg-yellow-500 rounded-full ml-3"></div>
                        <span className="text-gray-500">Add more specifics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
