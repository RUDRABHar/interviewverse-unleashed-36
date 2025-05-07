
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmailVerificationModalProps {
  onClose: () => void;
  onResend: () => void;
}

const EmailVerificationModal = ({ onClose, onResend }: EmailVerificationModalProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF6B00] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Please Verify Your Email
          </DialogTitle>
          <DialogDescription>
            We've sent a verification link to your email. Please verify your account to unlock all features.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-[#FF6B00]/5 p-4 rounded-md border border-[#FF6B00]/20 text-sm">
          <p>You can continue to your dashboard, but some features may be limited until verification is complete.</p>
        </div>
        <DialogFooter className="flex sm:justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            Continue to Dashboard
          </Button>
          <Button onClick={onResend} variant="ghost" className="text-[#FF6B00]">
            Resend Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailVerificationModal;
