
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InterviewWizard } from '@/components/interviews/InterviewWizard';

interface InterviewsWizardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export const InterviewsWizardDialog: React.FC<InterviewsWizardDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onComplete 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold font-sora">Create New Interview</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <InterviewWizard onComplete={onComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
