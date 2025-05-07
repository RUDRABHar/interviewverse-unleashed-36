
import React, { useState } from 'react';
import { OnboardingData } from '../OnboardingWizard';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface DomainStepProps {
  onboardingData: OnboardingData;
  updateOnboardingData: (field: keyof OnboardingData, value: string) => void;
}

const domains = [
  'Software Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Mobile Developer',
  'UI Designer'
];

const DomainStep = ({ onboardingData, updateOnboardingData }: DomainStepProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDomains = searchQuery 
    ? domains.filter(domain => 
        domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : domains;

  const handleSelect = (domain: string) => {
    updateOnboardingData('domain', domain);
    setSearchQuery(domain);
    setShowSuggestions(false);
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-sora font-semibold mb-2">
        Which domain or role are you targeting?
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us create relevant interview scenarios for you
      </p>

      <div className="relative mb-8">
        <Input
          placeholder="Search domains (e.g. Software Developer)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
            if (e.target.value) {
              updateOnboardingData('domain', e.target.value);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full bg-white/50 py-6 text-base"
        />

        {showSuggestions && searchQuery && (
          <div className="absolute w-full mt-1 max-h-60 overflow-y-auto z-10 bg-white rounded-md shadow-lg border border-gray-200">
            {filteredDomains.length > 0 ? (
              filteredDomains.map((domain, index) => (
                <div
                  key={index}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                    onboardingData.domain === domain ? 'bg-interview-light text-interview-primary' : ''
                  }`}
                  onClick={() => handleSelect(domain)}
                >
                  <span>{domain}</span>
                  {onboardingData.domain === domain && (
                    <Check size={18} className="text-interview-primary" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500">
                No matches found. You can use your custom input.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div className="text-sm text-gray-500">
          Popular domains:
        </div>
        <div className="flex flex-wrap ml-2">
          {['Software Developer', 'Product Manager', 'Data Scientist'].map((domain) => (
            <div
              key={domain}
              className="text-sm bg-gray-100 hover:bg-interview-light text-gray-700 hover:text-interview-primary px-3 py-1 rounded-full mr-2 mb-2 cursor-pointer transition-colors"
              onClick={() => handleSelect(domain)}
            >
              {domain}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DomainStep;
