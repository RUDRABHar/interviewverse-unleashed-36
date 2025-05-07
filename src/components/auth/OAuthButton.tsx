
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface OAuthButtonProps {
  provider: 'google';
  onClick: () => void;
  disabled?: boolean;
}

export const OAuthButton = ({ provider, onClick, disabled }: OAuthButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onClick}
        className="w-full flex items-center justify-center gap-3 py-6 bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200/70 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all"
        disabled={disabled}
      >
        {provider === 'google' && (
          <>
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.3251 9.13068C17.3251 8.4175 17.2664 8.01258 17.139 7.46631H9.22511V10.5651H13.9279C13.8279 11.4385 13.2781 12.7861 12.0849 13.6981L12.0679 13.8139L14.7363 15.8642L14.9179 15.8822C16.6104 14.3209 17.3251 11.9672 17.3251 9.13068Z" fill="#4285F4"/>
                <path d="M9.22507 17.1844C11.5313 17.1844 13.4574 16.4406 14.9179 15.8822L12.0849 13.6981C11.3902 14.1743 10.4419 14.5027 9.22507 14.5027C7.05225 14.5027 5.2231 12.9953 4.51552 10.9195L4.40499 10.9289L1.63498 13.0719L1.59819 13.1742C3.16985 15.5909 5.9974 17.1844 9.22507 17.1844Z" fill="#34A853"/>
                <path d="M4.5155 10.9195C4.35467 10.3863 4.25972 9.81819 4.25972 9.23394C4.25972 8.64959 4.35467 8.08156 4.50536 7.54836L4.50061 7.42559L1.68774 5.2041L1.59818 5.29365C1.11878 6.3841 0.825073 7.60888 0.825073 8.89893C0.825073 10.189 1.11878 11.4138 1.59818 12.5042L4.5155 10.9195Z" fill="#FBBC05"/>
                <path d="M9.22511 3.96513C10.5747 3.96513 11.4834 4.59584 12.0047 5.06968L14.5262 2.68604C13.453 1.72706 11.5313 1 9.22511 1C5.9974 1 3.16985 2.59354 1.59819 5.01023L4.50537 7.54839C5.22311 5.47261 7.05226 3.96513 9.22511 3.96513Z" fill="#EB4335"/>
              </svg>
            </motion.div>
            <span className="font-medium">Continue with Google</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};
