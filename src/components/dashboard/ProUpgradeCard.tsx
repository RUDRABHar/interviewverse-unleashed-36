
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export const ProUpgradeCard = () => {
  return (
    <Card className="border-0 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <CardContent className="p-6 relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-interview-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-interview-blue/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="font-sora text-lg font-semibold text-white">InterviewXpert</span>
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Pro
              </span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-4">
            Elevate your interview preparation
          </h3>
          
          <ul className="space-y-3 mb-6">
            {[
              "Unlimited AI practice interviews",
              "Advanced analytics & insights",
              "Expert feedback on responses",
              "Interview recordings & transcripts",
              "Premium industry templates"
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                <span className="text-sm text-gray-100">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
            Upgrade to Pro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
