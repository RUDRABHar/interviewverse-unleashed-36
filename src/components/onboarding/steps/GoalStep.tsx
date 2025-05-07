
import React from 'react';
import { Card } from '@/components/ui/card';
import { useOnboarding } from '../context/OnboardingContext';

const goals = [
  { id: 'faang', label: 'Crack FAANG Companies', icon: '🚀' },
  { id: 'first-job', label: 'Land My First Job', icon: '🎯' },
  { id: 'government', label: 'Government or PSU Role', icon: '🏛️' },
  { id: 'confidence', label: 'Improve Interview Confidence', icon: '💪' },
  { id: 'switch', label: 'Switch Career Path', icon: '🔄' },
  { id: 'other', label: 'Other', icon: '✨' }
];

const GoalStep = () => {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  
  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-2">
        What's your primary career goal?
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us tailor mock interviews and suggestions
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card 
            key={goal.id}
            onClick={() => updateOnboardingData('goal', goal.id)}
            className={`p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              onboardingData.goal === goal.id 
                ? 'border-[#FF6B00] shadow-md bg-[#FF6B00]/5' 
                : 'hover:border-[#FF6B00]/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center">
              <div className="text-3xl mr-3">{goal.icon}</div>
              <div className="font-medium">{goal.label}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalStep;
