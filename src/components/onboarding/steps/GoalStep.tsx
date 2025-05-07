
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Card } from '@/components/ui/card';

interface GoalStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const goals = [
  { id: 'interview', label: 'Crack an interview', icon: '🎯' },
  { id: 'communication', label: 'Improve communication', icon: '📈' },
  { id: 'practice', label: 'Practice real-time mock sessions', icon: '🎤' },
  { id: 'feedback', label: 'Get feedback from AI', icon: '🧠' }
];

const GoalStep = ({ onboardingData, updateOnboardingData }: GoalStepProps) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-sora font-semibold mb-2">
        What's your primary goal?
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
                ? 'border-interview-primary bg-interview-light shadow-md' 
                : 'hover:border-interview-blue hover:shadow-sm'
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
