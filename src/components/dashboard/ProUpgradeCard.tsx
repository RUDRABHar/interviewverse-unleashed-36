
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

export const ProUpgradeCard = () => {
  return (
    <Card className="border-0 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-semibold">InterviewAce Pro</h3>
          </div>
          <span className="bg-orange-500/20 text-orange-300 text-xs font-medium px-2.5 py-0.5 rounded">Recommended</span>
        </div>
        
        <p className="text-sm text-gray-300 mb-4">Unlock advanced analytics, unlimited interviews, and AI-powered feedback.</p>
        
        <ul className="space-y-2 mb-5">
          {[
            'Detailed performance analytics',
            'Unlimited practice interviews',
            'Advanced AI feedback',
            'Download interview reports',
            'Priority support'
          ].map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0">
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
};
