
import React from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeHeroProps {
  profile: any;
}

export const WelcomeHero = ({ profile }: WelcomeHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-interview-primary/90 to-interview-blue/80 text-white">
      {/* Particle effect background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-xl"></div>
      </div>
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Welcome to InterviewXpert
          </h1>
          <p className="text-lg md:text-xl mb-6 text-white/90">
            Your personalized AI interview coach is ready to help you master your next interview. 
            Practice, get feedback, and improve with every session.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              size="lg" 
              className="bg-white text-interview-primary hover:bg-white/90 hover:shadow-lg transition-all duration-300"
            >
              Start Mock Interview
            </Button>
            <div className="text-sm md:text-base text-white/80">
              3,204 users improved their skills this week
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 opacity-20 md:opacity-30">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};
