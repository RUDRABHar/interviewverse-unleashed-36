
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Card } from '@/components/ui/card';

interface LanguageStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const languages = [
  { id: 'English', label: 'English', flag: '🇬🇧' },
  { id: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'Tamil', label: 'Tamil', flag: '🇮🇳' },
  { id: 'Telugu', label: 'Telugu', flag: '🇮🇳' },
  { id: 'Bengali', label: 'Bengali', flag: '🇮🇳' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
];

const LanguageStep = ({ onboardingData, updateOnboardingData }: LanguageStepProps) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-sora font-semibold mb-2">
        Which language would you like to practice interviews in?
      </h2>
      <p className="text-gray-600 mb-8">
        Choose your preferred language for mock interviews
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {languages.map((language) => (
          <Card 
            key={language.id}
            onClick={() => updateOnboardingData('preferred_language', language.id)}
            className={`p-3 cursor-pointer transition-all duration-300 ${
              onboardingData.preferred_language === language.id 
                ? 'border-interview-primary bg-interview-light shadow-md' 
                : 'hover:border-interview-blue hover:shadow-sm hover:-translate-y-1'
            }`}
          >
            <div className="flex items-center">
              <div className="text-xl mr-2">{language.flag}</div>
              <div className="font-medium">{language.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-4 italic">
        * More languages coming soon!
      </p>
    </div>
  );
};

export default LanguageStep;
