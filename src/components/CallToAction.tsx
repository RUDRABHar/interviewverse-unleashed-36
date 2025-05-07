
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with gradient and particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-interview-primary to-interview-violet opacity-95 -z-10" />
      
      {/* Decorative particles */}
      <div className="absolute inset-0 -z-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sora font-bold text-white mb-6">
            Your Next Interview Starts with a Mock
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Begin your journey to interview mastery today and land the job of your dreams.
          </p>
          <Button className="bg-white text-interview-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full font-medium group">
            Start Your Journey Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
