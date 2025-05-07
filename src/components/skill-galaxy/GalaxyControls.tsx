
import React from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface GalaxyControlsProps {
  lowPerformanceMode: boolean;
  setLowPerformanceMode: (mode: boolean) => void;
}

export const GalaxyControls: React.FC<GalaxyControlsProps> = ({ 
  lowPerformanceMode, 
  setLowPerformanceMode 
}) => {
  return (
    <TooltipProvider>
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center">
              <span className="text-xs text-gray-400 mr-2">Performance</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!lowPerformanceMode}
                  onChange={() => setLowPerformanceMode(!lowPerformanceMode)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-interview-primary"></div>
              </label>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{lowPerformanceMode ? 'Low Detail Mode' : 'High Detail Mode'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
