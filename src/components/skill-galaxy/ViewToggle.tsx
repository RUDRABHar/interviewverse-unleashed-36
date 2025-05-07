
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ViewToggleProps {
  currentView: string;
  onChange: (view: string) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onChange }) => {
  return (
    <TooltipProvider>
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800">
        <div className="flex">
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() => onChange('galaxy')}
                className={`flex items-center justify-center px-4 py-2 ${
                  currentView === 'galaxy' ? 'bg-interview-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" y1="8" x2="12" y2="8"></line>
                  <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                  <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Galaxy View</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() => onChange('neural')}
                className={`flex items-center justify-center px-4 py-2 ${
                  currentView === 'neural' ? 'bg-interview-primary text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 3h5V7l6.4 3.2c.8.4 1.6.8 1.6 2.4 0 1.5-.7 2 1.6 2.4L15 18v4H9v-4l-6.4-3.2c-.8-.4-1.6-.8-1.6-2.4 0-1.5.7-2 1.6-2.4L9.5 7V3z"></path>
                  <circle cx="12" cy="8" r="2"></circle>
                  <circle cx="12" cy="16" r="2"></circle>
                  <path d="M12 10v4"></path>
                  <path d="m9 10-3 2 3 2"></path>
                  <path d="m15 10 3 2-3 2"></path>
                </svg>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Neural View</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
