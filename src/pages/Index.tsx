
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import DemoSection from '../components/DemoSection';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQs from '../components/FAQs';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Unified background with gradients and decorative elements */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-interview-primary/10 filter blur-[120px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-interview-blue/10 filter blur-[100px]"></div>
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-200/20 filter blur-[80px]"></div>
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-interview-primary/40 animate-pulse-soft"></div>
          <div className="absolute top-[40%] left-[80%] w-3 h-3 rounded-full bg-interview-blue/30 animate-float"></div>
          <div className="absolute top-[70%] left-[20%] w-2 h-2 rounded-full bg-interview-primary/30 animate-pulse-soft"></div>
        </div>
      </div>
      
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <HowItWorks />
        </div>
        <Features />
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
          <DemoSection />
        </div>
        <Testimonials />
        <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm">
          <Pricing />
        </div>
        <FAQs />
        <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
          <CallToAction />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
