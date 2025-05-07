
import React from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DomainStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const domains = [
  { id: 'web-dev', label: 'Web Development', icon: '🌐' },
  { id: 'ui-ux', label: 'UI/UX Design', icon: '🎨' },
  { id: 'data-science', label: 'Data Science', icon: '📊' },
  { id: 'machine-learning', label: 'Machine Learning', icon: '🤖' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' },
  { id: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
  { id: 'product-management', label: 'Product Management', icon: '📱' },
  { id: 'other', label: 'Other', icon: '✨' }
];

const DomainStep = ({ onboardingData, updateOnboardingData }: DomainStepProps) => {
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  
  const handleDomainSelect = (domainId: string) => {
    updateOnboardingData('domain', domainId);
    setShowCustomInput(domainId === 'other');
  };

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-2">
        Which field are you preparing for?
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us provide relevant interview questions and feedback
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-6">
        {domains.map((domain) => (
          <Card 
            key={domain.id}
            onClick={() => handleDomainSelect(domain.id)}
            className={`p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              onboardingData.domain === domain.id 
                ? 'border-[#FF6B00] shadow-md bg-[#FF6B00]/5' 
                : 'hover:border-[#FF6B00]/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center">
              <div className="text-3xl mr-3">{domain.icon}</div>
              <div className="font-medium">{domain.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom domain input for "Other" */}
      {showCustomInput && (
        <div className="mt-6 animate-fade-in">
          <Label htmlFor="customDomain" className="block text-sm font-medium mb-1">
            Please specify your field
          </Label>
          <Input
            id="customDomain"
            placeholder="Enter your field"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent"
            onChange={(e) => updateOnboardingData('domain', e.target.value)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default DomainStep;
