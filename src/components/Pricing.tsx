
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const tiers = [{
  name: 'Free',
  price: '0',
  description: 'For casual interview preparation',
  features: ['Limited to 3 mock interviews', 'Basic feedback and scoring', 'Standard question library', 'Email support'],
  limitations: ['No personalized recommendations', 'No technical interview modules', 'No interview recording'],
  buttonText: 'Start Free',
  mostPopular: false
}, {
  name: 'Premium',
  price: '19',
  description: 'For serious job seekers',
  features: ['Unlimited mock interviews', 'Advanced real-time feedback', 'Expanded question library', 'Interview recording & playback', 'Performance analytics', 'Personalized improvement plan', 'Priority support'],
  limitations: [],
  buttonText: 'Get Premium',
  mostPopular: true
}, {
  name: 'Enterprise',
  price: '49',
  description: 'For teams and organizations',
  features: ['Everything in Premium', 'Custom interview scenarios', 'Team analytics dashboard', 'Integration with HR systems', 'Dedicated account manager', 'Custom branding', '24/7 phone support'],
  limitations: [],
  buttonText: 'Contact Sales',
  mostPopular: false
}];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  
  return (
    <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for your career goals. All plans include access to our core interview platform.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <span className={cn("mr-3 text-sm font-medium", !annual ? "text-primary" : "text-gray-500")}>Monthly</span>
            <button 
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
              onClick={() => setAnnual(!annual)}
            >
              <span 
                className={cn(
                  "inline-block h-5 w-5 rounded-full bg-white dark:bg-gray-200 transform transition-transform duration-200 ease-in-out",
                  annual ? "translate-x-6" : "translate-x-1"
                )} 
              />
            </button>
            <span className={cn("ml-3 text-sm font-medium", annual ? "text-primary" : "text-gray-500")}>
              Annual <span className="text-green-500 text-xs font-semibold">Save 20%</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={cn(
                "relative rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm p-6",
                tier.mostPopular ? "border-primary ring-2 ring-primary" : "border-gray-200 dark:border-gray-800"
              )}
            >
              {tier.mostPopular && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl">
                  Most Popular
                </span>
              )}
              
              <div className="mb-5">
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{tier.description}</p>
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">${tier.price}</span>
                <span className="text-gray-500 ml-1">/{annual ? 'year' : 'month'}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limitation) => (
                  <li key={limitation} className="flex items-center text-gray-500">
                    <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={tier.mostPopular ? "default" : "outline"} 
                size="lg" 
                className="w-full"
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8 text-sm text-gray-500">
          All plans include a 14-day free trial. No credit card required.
        </div>
      </div>
    </section>
  );
};

export default Pricing;
