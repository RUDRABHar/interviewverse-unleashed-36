
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import GradientButton from './ui/design-system/GradientButton';
import { Link } from 'react-router-dom';

const benefits = [
  "Ace interviews with real-time feedback",
  "Practice with industry-specific questions",
  "Improve your communication skills",
  "Boost your confidence"
];

const CallToAction = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-interview-primary to-interview-blue opacity-95 -z-10" />
      
      {/* Decorative particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 5
            }}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 translate-x-1/3 blur-2xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-6">
                Ready to Get Started?
              </span>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-sora font-bold mb-6">
                Your Next Interview Starts with a Mock
              </h2>
              
              <p className="text-xl text-white/90 mb-8">
                Begin your journey to interview mastery today and land the job of your dreams.
              </p>
              
              <ul className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-white/90" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
              
              <GradientButton 
                gradientFrom="from-white"
                gradientTo="to-gray-100"
                className="text-interview-primary hover:text-interview-blue text-lg px-8 py-6 rounded-full font-medium group shadow-xl"
              >
                <Link to="/auth" className="flex items-center">
                  Start Your Journey Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </GradientButton>
            </motion.div>
            
            {/* Right column - Card/visual */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-medium">InterviewXpert AI</h3>
                    <p className="text-white/70">Your personal interview coach</p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <p className="text-white">What's your greatest professional achievement?</p>
                  </div>
                  
                  <div className="bg-white/20 p-4 rounded-lg ml-4 backdrop-blur-sm">
                    <p className="text-white">I led a team that successfully launched a new product feature that increased user engagement by 45% and generated $1.2M in additional revenue.</p>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h4 className="text-white text-lg font-medium mb-3">Feedback</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <p className="text-white/90 text-sm">Strong quantifiable results</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <p className="text-white/90 text-sm">Clear leadership example</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <p className="text-white/90 text-sm">Could add more detail about challenges overcome</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
