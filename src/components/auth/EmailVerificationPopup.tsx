
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface EmailVerificationPopupProps {
  onClose: () => void;
}

export const EmailVerificationPopup = ({ onClose }: EmailVerificationPopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay the appearance for a smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for the animation to complete
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 max-w-sm transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <Alert className="bg-interview-light border border-interview-primary/20 shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-interview-primary">
              <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#EEF2FF" />
              <path d="M16 10L11 15L8.5 12.5" stroke="#4D47C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <AlertTitle className="text-interview-primary font-semibold text-base mb-1">
                Email Confirmation Required
              </AlertTitle>
              <AlertDescription className="text-gray-600 text-sm">
                We've sent a verification link to your email. Please confirm to activate your account.
              </AlertDescription>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={16} />
          </button>
        </div>
      </Alert>
    </div>
  );
};
