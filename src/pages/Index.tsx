
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
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decorative elements for better text contrast */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.015] dark:opacity-[0.03]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-interview-primary/10 filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-interview-blue/10 filter blur-[100px]"></div>
      </div>
      
      {/* Main content with higher z-index */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <HowItWorks />
        <Features />
        <DemoSection />
        <Testimonials />
        <Pricing />
        <FAQs />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
