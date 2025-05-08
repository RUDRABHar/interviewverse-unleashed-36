
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedButton from '../components/ui/design-system/AnimatedButton';
import GradientText from '../components/ui/design-system/GradientText';
import PremiumCard from '../components/ui/design-system/PremiumCard';
import ParticleBackground from '../components/ui/design-system/ParticleBackground';
import { ArrowRight, BarChart, Brain, Check, Cpu, LayoutDashboard, MessageCircle, Sparkles, Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

// Hero Section Component
const Hero = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <section className="relative min-h-screen flex items-center py-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-orange-100/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        
        {/* Background particles */}
        <ParticleBackground 
          count={30} 
          color="rgba(255, 107, 0, 0.4)" 
          minSize={2} 
          maxSize={6} 
        />
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/10 filter blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 filter blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            className="flex flex-col space-y-6"
          >
            <motion.span 
              className="text-sm md:text-base text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 w-fit px-4 py-1.5 rounded-full font-medium"
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight text-shadow-sm">
                Master Every Interview with <GradientText variant="orange">AI</GradientText>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl mt-4">
                AI-powered mock interviews tailored to your domain, difficulty & growth level. Get real-time feedback and improve your chances of landing your dream job.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-6">
                <AnimatedButton 
                  size="lg" 
                  glowEffect
                  gradientBg
                  iconRight={<ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                  className="rounded-full px-8 py-6 text-lg font-medium group"
                  asChild
                >
                  <Link to="/auth">Start Now</Link>
                </AnimatedButton>
                
                <AnimatedButton 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  asChild
                >
                  <Link to="#how-it-works">See How It Works</Link>
                </AnimatedButton>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 pt-4 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden shadow-md text-white">
                    <span className="text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <span>Join 10,000+ professionals preparing with InterviewXpert</span>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center lg:justify-end items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Decorative elements */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
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
                  <div className="rounded-lg bg-orange-500/10 dark:bg-orange-500/5 p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">InterviewXpert AI</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Technical Interview Round</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                        <p className="text-sm">Tell me about a challenging project you've worked on.</p>
                      </div>
                      <div className="bg-orange-500/10 p-3 rounded-lg ml-6 border border-orange-500/20">
                        <p className="text-sm">I led a team of 3 developers to create a real-time dashboard...</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <p className="text-sm">Analyzing your response...</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-500 dark:text-gray-400">Strong communication</span>
                        <div className="h-2 w-2 bg-yellow-500 rounded-full ml-3"></div>
                        <span className="text-gray-500 dark:text-gray-400">Add more specifics</span>
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

// Features Section Component
const Features = () => {
  const features = [
    {
      title: "AI-Powered Feedback",
      description: "Get instant, personalized feedback on your interview responses from our advanced AI model.",
      icon: <Brain className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Domain Expertise",
      description: "Practice interviews tailored to your specific industry, role, and experience level.",
      icon: <Star className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and identify areas for improvement.",
      icon: <BarChart className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Real-Time Insights",
      description: "Receive immediate insights on your responses, body language, and presentation style.",
      icon: <Cpu className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Comprehensive Dashboard",
      description: "Access all your practice sessions, feedback, and growth metrics in one place.",
      icon: <LayoutDashboard className="h-6 w-6" />,
      color: "from-amber-500 to-yellow-500",
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our responsive support team and AI assistant.",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "from-teal-500 to-green-500",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your <GradientText variant="orange">Interview Prep</GradientText>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Our platform combines cutting-edge AI with proven interview techniques to help you stand out from the competition.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ feature, index }: { feature: any, index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <PremiumCard
        variant="glassmorphic"
        hoverEffect
        className="h-full p-6"
      >
        <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
      </PremiumCard>
    </motion.div>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      title: "Select Your Interview Type",
      description: "Choose from technical, behavioral, case study, or industry-specific interviews.",
      color: "bg-orange-500",
      number: "1",
    },
    {
      title: "Customize Your Experience",
      description: "Set difficulty level, duration, and specific focus areas based on your needs.",
      color: "bg-blue-500",
      number: "2",
    },
    {
      title: "Practice & Receive Feedback",
      description: "Complete your interview and get instant AI-powered analysis of your performance.",
      color: "bg-purple-600",
      number: "3",
    },
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText>How InterviewXpert Works</GradientText>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Our simple 3-step process gets you interview-ready in no time
          </p>
        </div>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connect line between steps */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%-16px)] right-[calc(16.67%-16px)] h-0.5 bg-gradient-to-r from-orange-500 via-blue-500 to-purple-600"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 relative z-10`}>
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const Testimonials = () => {
  const testimonials = [
    {
      quote: "InterviewXpert helped me prepare for my technical interviews at top tech companies. The AI feedback was incredibly valuable.",
      author: "Alex Johnson",
      role: "Software Engineer at Google",
      avatar: "A",
    },
    {
      quote: "The analytics dashboard helped me identify my weaknesses and focus my preparation. Landed my dream job after just 2 weeks of practice!",
      author: "Sarah Chen",
      role: "Product Manager at Microsoft",
      avatar: "S",
    },
    {
      quote: "As someone who gets nervous during interviews, the realistic simulation and instant feedback helped me build confidence.",
      author: "Michael Rodriguez",
      role: "UX Designer at Adobe",
      avatar: "M",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users <GradientText>Say</GradientText>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Join thousands of professionals who've transformed their interview performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }: { testimonial: any, index: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <PremiumCard
        variant="glassmorphic"
        className="h-full p-6"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium mr-3">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
          </div>
        </div>
        <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
      </PremiumCard>
    </motion.div>
  );
};

// CTA Section
const CTASection = () => {
  const benefits = [
    "Personalized AI feedback on every answer",
    "Access to premium interview questions",
    "Detailed performance analytics",
    "Industry-specific practice interviews",
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50 relative">
      <div 
        ref={ref}
        className="container mx-auto px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <PremiumCard
            variant="elevated"
            glowEffect
            className="overflow-visible"
          >
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to <GradientText>Ace Your Interviews?</GradientText>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                Start practicing today and transform your interview performance
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full p-1 mr-3">
                      <Check className="h-4 w-4 text-orange-600 dark:text-orange-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              
              <AnimatedButton 
                size="lg" 
                glowEffect
                gradientBg
                iconRight={<ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                className="rounded-full px-8 py-6 text-lg font-medium group"
                asChild
              >
                <Link to="/auth">Get Started Now</Link>
              </AnimatedButton>
            </div>
          </PremiumCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Index;
