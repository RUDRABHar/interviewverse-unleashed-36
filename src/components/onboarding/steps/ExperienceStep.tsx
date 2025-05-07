
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Slider } from '@/components/ui/slider';

interface ExperienceStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const experienceLevels = [
  { id: 'Beginner', label: 'Beginner', description: 'No experience', emoji: '🐣' },
  { id: 'Intermediate', label: 'Intermediate', description: '1-3 interviews done', emoji: '🧗' },
  { id: 'Advanced', label: 'Advanced', description: 'Pro-level or already working', emoji: '🦾' }
];

const ExperienceStep = ({ onboardingData, updateOnboardingData }: ExperienceStepProps) => {
  // Map experience level to slider value
  const getSliderValue = () => {
    const index = experienceLevels.findIndex(level => level.id === onboardingData.interview_experience);
    return index === -1 ? 0 : index;
  };
  
  const handleSliderChange = (value: number[]) => {
    const index = value[0];
    if (experienceLevels[index]) {
      updateOnboardingData('interview_experience', experienceLevels[index].id);
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-sora font-semibold mb-2">
        How familiar are you with interviews?
      </h2>
      <p className="text-gray-600 mb-10">
        This helps us adjust the difficulty level of your mock interviews
      </p>

      <div className="px-4 mb-6">
        <Slider
          value={[getSliderValue()]}
          min={0}
          max={2}
          step={1}
          onValueChange={handleSliderChange}
          className="my-8"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {experienceLevels.map((level, index) => (
          <div 
            key={level.id}
            className={`transition-all duration-300 p-2 rounded-lg ${
              onboardingData.interview_experience === level.id 
                ? 'text-interview-primary font-medium scale-110' 
                : 'text-gray-500'
            }`}
          >
            <div className="text-2xl mb-1">{level.emoji}</div>
            <div className={`text-sm ${onboardingData.interview_experience === level.id ? 'font-medium' : ''}`}>
              {level.label}
            </div>
            <div className="text-xs">
              {level.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceStep;
