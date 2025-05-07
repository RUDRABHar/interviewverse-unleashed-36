
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [
  {
    name: 'Free',
    price: '0',
    description: 'For casual interview preparation',
    features: [
      'Limited to 3 mock interviews',
      'Basic feedback and scoring',
      'Standard question library',
      'Email support',
    ],
    limitations: [
      'No personalized recommendations',
      'No technical interview modules',
      'No interview recording'
    ],
    buttonText: 'Start Free',
    mostPopular: false,
  },
  {
    name: 'Premium',
    price: '19',
    description: 'For serious job seekers',
    features: [
      'Unlimited mock interviews',
      'Advanced real-time feedback',
      'Expanded question library',
      'Interview recording & playback',
      'Performance analytics',
      'Personalized improvement plan',
      'Priority support',
    ],
    limitations: [],
    buttonText: 'Get Premium',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    price: '49',
    description: 'For teams and organizations',
    features: [
      'Everything in Premium',
      'Custom interview scenarios',
      'Team analytics dashboard',
      'Integration with HR systems',
      'Dedicated account manager',
      'Custom branding',
      '24/7 phone support',
    ],
    limitations: [],
    buttonText: 'Contact Sales',
    mostPopular: false,
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  
  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Select the perfect plan for your interview preparation needs
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm ${!annual ? 'text-interview-primary font-medium' : 'text-gray-600'}`}>Monthly</span>
            <button 
              className="relative w-12 h-6 bg-gray-200 rounded-full p-1 transition duration-300 ease-in-out"
              onClick={() => setAnnual(!annual)}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition duration-300 ease-in-out ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm ${annual ? 'text-interview-primary font-medium' : 'text-gray-600'}`}>
              Annually <span className="text-xs text-interview-violet">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <div 
              key={index} 
              className={cn(
                "rounded-xl overflow-hidden shadow-md transition-all",
                tier.mostPopular ? 'ring-2 ring-interview-primary transform scale-105' : 'bg-white',
                "flex flex-col"
              )}
            >
              {tier.mostPopular && (
                <div className="bg-interview-primary text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={cn(
                "p-6 flex flex-col flex-grow",
                tier.mostPopular ? 'bg-white' : ''
              )}>
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${annual ? (parseInt(tier.price) * 0.8 * 12).toString() : tier.price}</span>
                  <span className="text-gray-600 ml-1">{annual ? '/year' : '/month'}</span>
                </div>
                <p className="text-gray-600 mb-6">{tier.description}</p>
                
                <ul className="mb-8 flex-grow">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center mb-3">
                      <Check className="h-5 w-5 mr-2 text-interview-primary flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                  
                  {tier.limitations.map((limitation, i) => (
                    <li key={i} className="flex items-center mb-3">
                      <X className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={cn(
                    "w-full",
                    tier.mostPopular ? 'bg-gradient-primary hover:shadow-button' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  )}
                >
                  {tier.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
