
import React, { useEffect, useRef } from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Card } from '@/components/ui/card';

interface FinalStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const FinalStep = ({ onboardingData }: FinalStepProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Create a starfield animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const stars: Array<{ x: number; y: number; size: number; speed: number }> = [];
    
    // Initialize stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.1
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update stars
      stars.forEach(star => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Move stars to create warping effect
        star.x -= star.speed;
        
        // Reset star if it moves off screen
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="py-6 text-center relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
      
      <div className="relative z-10">
        <div className="w-24 h-24 mx-auto mb-5">
          <div className="w-full h-full relative">
            <div className="absolute inset-0 rounded-full bg-interview-primary opacity-20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-interview-primary opacity-30 animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="absolute inset-4 rounded-full bg-interview-primary opacity-50 animate-pulse" style={{ animationDelay: '0.6s' }} />
            <div className="absolute inset-6 rounded-full bg-interview-primary flex items-center justify-center text-white text-2xl font-bold">✓</div>
          </div>
        </div>
        
        <h2 className="text-3xl font-sora font-bold mb-3">
          You're all set!
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your personalized InterviewXpert experience starts now.
        </p>
        
        <div className="mb-8">
          <Card className="bg-white/80 p-4 shadow-sm max-w-md mx-auto">
            <h3 className="font-medium text-lg mb-3">Your Profile</h3>
            <div className="grid grid-cols-2 gap-3 text-left text-sm">
              <div className="text-gray-500">Goal:</div>
              <div className="font-medium">{getReadableValue('goal', onboardingData.goal)}</div>
              
              <div className="text-gray-500">Domain:</div>
              <div className="font-medium">{onboardingData.domain}</div>
              
              <div className="text-gray-500">Language:</div>
              <div className="font-medium">{onboardingData.preferred_language}</div>
              
              <div className="text-gray-500">Experience:</div>
              <div className="font-medium">{onboardingData.interview_experience}</div>
            </div>
          </Card>
        </div>
        
        <p className="text-sm text-gray-500">
          Click "Launch Dashboard" to start your interview journey!
        </p>
      </div>
    </div>
  );
};

// Helper function to get readable values for the final display
const getReadableValue = (field: string, value: string): string => {
  if (field === 'goal') {
    const goals: {[key: string]: string} = {
      'interview': 'Crack an interview',
      'communication': 'Improve communication',
      'practice': 'Practice real-time mock sessions',
      'feedback': 'Get feedback from AI'
    };
    return goals[value] || value;
  }
  
  return value;
};

export default FinalStep;
