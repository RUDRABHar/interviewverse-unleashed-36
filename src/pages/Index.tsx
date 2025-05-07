
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
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-gray-900">
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
  );
};

export default Index;
