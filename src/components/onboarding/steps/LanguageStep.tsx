
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Card } from '@/components/ui/card';

interface LanguageStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const languages = [
  { id: 'English', label: 'English', flag: '🇺🇸' },
  { id: 'Hindi', label: 'Hindi', flag: '🇮🇳' },
  { id: 'Tamil', label: 'Tamil', flag: '🇮🇳' },
  { id: 'Telugu', label: 'Telugu', flag: '🇮🇳' },
  { id: 'Bengali', label: 'Bengali', flag: '🇮🇳' },
  { id: 'Kannada', label: 'Kannada', flag: '🇮🇳' }
];

const LanguageStep = ({ onboardingData, updateOnboardingData }: LanguageStepProps) => {
  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-2">
        Which language should your interviews be conducted in?
      </h2>
      <p className="text-gray-600 mb-8">
        Choose your preferred language for interview practice
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {languages.map((language) => (
          <Card 
            key={language.id}
            onClick={() => updateOnboardingData('preferred_language', language.id)}
            className={`p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              onboardingData.preferred_language === language.id 
                ? 'border-[#FF6B00] shadow-md bg-[#FF6B00]/5' 
                : 'hover:border-[#FF6B00]/50 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-2">{language.flag}</div>
              <div className="font-medium">{language.label}</div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        More languages coming soon
      </div>
    </div>
  );
};

export default LanguageStep;
