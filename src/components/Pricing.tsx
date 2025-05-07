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
  return;
};
export default Pricing;