
import React from 'react';
import { Button } from '@/components/ui/button';

interface OAuthButtonProps {
  provider: 'google';
  onClick: () => void;
  disabled?: boolean;
}

export const OAuthButton = ({ provider, onClick, disabled }: OAuthButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-6 bg-white hover:bg-gray-50 border border-gray-200 transition-all"
      disabled={disabled}
    >
      {provider === 'google' && (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.4001 8.116C15.4001 7.48225 15.3478 7.06675 15.2346 6.63672H8.2001V9.39119H12.3804C12.2935 10.0845 11.8149 11.143 10.7551 11.8434L10.7399 11.9458L12.9547 13.6572L13.1158 13.6731C14.4989 12.3949 15.4001 10.4379 15.4001 8.116Z" fill="#4285F4" />
            <path d="M8.2001 15.275C10.18 15.275 11.8289 14.6256 13.1158 13.6731L10.7551 11.8434C10.1396 12.2658 9.30544 12.5616 8.2001 12.5616C6.26866 12.5616 4.64272 11.3738 4.01379 9.70667L3.91555 9.71451L1.60886 11.4862L1.57617 11.5771C2.8532 13.8586 5.33418 15.275 8.2001 15.275Z" fill="#34A853" />
            <path d="M4.01382 9.70667C3.87082 9.27664 3.78644 8.81841 3.78644 8.34573C3.78644 7.87296 3.87082 7.41481 4.00477 6.98478L4.00055 6.8763L1.65578 5.07031L1.57621 5.11435C1.14559 6.11918 0.89978 7.2079 0.89978 8.34573C0.89978 9.48348 1.14559 10.5723 1.57621 11.5771L4.01382 9.70667Z" fill="#FBBC05" />
            <path d="M8.2001 4.12983C9.40236 4.12983 10.2074 4.73962 10.6622 5.15954L12.7793 3.16523C11.8236 2.31455 10.18 1.75 8.2001 1.75C5.33418 1.75 2.8532 3.16633 1.57617 5.1144L4.00473 6.98483C4.64272 5.31767 6.26866 4.12983 8.2001 4.12983Z" fill="#EB4335" />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
};
