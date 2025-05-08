
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '../Navbar';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import Footer from '../Footer';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SidebarInset } from '@/components/ui/sidebar';
import SmartMentorAssistant from '../ai-assistant/SmartMentorAssistant';

interface GlobalLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
  hideSidebar = false,
  hideNavbar = false,
  hideFooter = false,
  maxWidth = '2xl',
  className,
}) => {
  const { theme } = useTheme();
  const location = useLocation();
  
  // Max width class mapping
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    'full': 'max-w-full',
  };
  
  // Authentication pages should have minimal layout
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950"></div>
      <div className="fixed inset-0 -z-10 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
      
      <div className="flex flex-1 overflow-hidden">
        {!hideSidebar && !isAuthPage && <DashboardSidebar />}
        
        <SidebarInset className={cn("flex-1 flex flex-col relative")}>
          {!hideNavbar && !isAuthPage && <Navbar />}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex-1 mx-auto w-full px-4 sm:px-6 md:px-8 py-6",
                maxWidthClasses[maxWidth],
                className
              )}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          
          {!hideFooter && !isAuthPage && <Footer />}
        </SidebarInset>
      </div>
      
      {/* Replace Theme Switcher with AI Assistant */}
      <SmartMentorAssistant />
    </div>
  );
};

export default GlobalLayout;
