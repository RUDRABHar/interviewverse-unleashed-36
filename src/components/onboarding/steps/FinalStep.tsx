
import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useOnboarding } from '../context/OnboardingContext';

const FinalStep = () => {
  const { onboardingData } = useOnboarding();
  
  useEffect(() => {
    // Launch confetti when component mounts
    const launchConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    
    // Small delay to let animation complete
    const timer = setTimeout(launchConfetti, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-6 text-center">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          You're all set to begin!
        </h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          {onboardingData.full_name ? `${onboardingData.full_name}, your` : 'Your'} personalized interview experience is ready.
        </p>
      </div>
      
      <div className="my-6 bg-gray-50 rounded-lg p-6 max-w-lg mx-auto">
        <h3 className="font-semibold mb-4">Your Profile Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Goal</p>
            <p className="font-medium">{getReadableValue(onboardingData.goal, 'goal')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Domain</p>
            <p className="font-medium">{getReadableValue(onboardingData.domain, 'domain')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience</p>
            <p className="font-medium">{onboardingData.interview_experience}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Language</p>
            <p className="font-medium">{onboardingData.preferred_language}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get readable values
const getReadableValue = (value: string, type: 'goal' | 'domain') => {
  if (!value) return 'Not specified';
  
  const goals: {[key: string]: string} = {
    'faang': 'Crack FAANG Companies',
    'first-job': 'Land My First Job',
    'government': 'Government or PSU Role',
    'confidence': 'Improve Interview Confidence',
    'switch': 'Switch Career Path',
    'other': 'Other'
  };
  
  const domains: {[key: string]: string} = {
    'web-dev': 'Web Development',
    'ui-ux': 'UI/UX Design',
    'data-science': 'Data Science',
    'machine-learning': 'Machine Learning',
    'devops': 'DevOps',
    'cybersecurity': 'Cybersecurity',
    'product-management': 'Product Management',
    'other': 'Other'
  };
  
  if (type === 'goal') {
    return goals[value] || value;
  } else {
    return domains[value] || value;
  }
};

export default FinalStep;
