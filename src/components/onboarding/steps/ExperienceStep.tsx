
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ExperienceStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const experiences = [
  { id: 'Beginner', label: 'Beginner', description: 'No prior interview experience' },
  { id: 'Intermediate', label: 'Intermediate', description: '1-3 interviews done' },
  { id: 'Advanced', label: 'Advanced', description: 'Pro-level or already working' }
];

const ExperienceStep = ({ onboardingData, updateOnboardingData }: ExperienceStepProps) => {
  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-2">
        What's your current level of interview experience?
      </h2>
      <p className="text-gray-600 mb-8">
        We'll adjust the difficulty of practice interviews accordingly
      </p>

      <div className="space-y-6">
        <ToggleGroup 
          type="single" 
          value={onboardingData.interview_experience}
          onValueChange={(value) => {
            if (value) updateOnboardingData('interview_experience', value);
          }}
          className="flex flex-col space-y-4"
        >
          {experiences.map((exp) => (
            <ToggleGroupItem 
              key={exp.id} 
              value={exp.id}
              className={`w-full p-4 border rounded-lg text-left flex items-center justify-between ${
                onboardingData.interview_experience === exp.id
                  ? 'border-[#FF6B00] bg-[#FF6B00]/5'
                  : 'hover:border-[#FF6B00]/50'
              }`}
            >
              <div>
                <div className="font-medium text-lg">{exp.label}</div>
                <div className="text-sm text-gray-500">{exp.description}</div>
              </div>
              {onboardingData.interview_experience === exp.id && (
                <div className="h-6 w-6 rounded-full bg-[#FF6B00] flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              )}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default ExperienceStep;
