
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const NameStep = ({ onboardingData, updateOnboardingData }: NameStepProps) => {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-2">What should we call you?</h1>
      <p className="text-gray-600 mb-8">We'll use this to personalize your experience.</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={onboardingData.full_name}
            onChange={(e) => updateOnboardingData('full_name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent transition-all"
            autoFocus
          />
        </div>
      </div>

      {onboardingData.full_name && (
        <div className="mt-8 animate-fade-in">
          <h2 className="text-xl font-medium text-gray-700">
            Hi {onboardingData.full_name}, let's set up your journey.
          </h2>
        </div>
      )}
    </div>
  );
};

export default NameStep;
