
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Alert className="glass-card border-interview-primary/20 shadow-elegant overflow-hidden">
            <div className="flex justify-between items-start">
              <div className="flex">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                >
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-interview-primary">
                    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" fill="#EEF2FF" />
                    <path d="M16 10L11 15L8.5 12.5" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <div>
                  <AlertTitle className="text-interview-primary font-semibold text-base mb-1">
                    Email Confirmation Required
                  </AlertTitle>
                  <AlertDescription className="text-gray-600 dark:text-gray-300 text-sm">
                    We've sent a verification link to your email. Please confirm to activate your account.
                  </AlertDescription>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full"
              >
                <X size={16} />
              </motion.button>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
