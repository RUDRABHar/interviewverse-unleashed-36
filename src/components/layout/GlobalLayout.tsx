
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import Footer from '../Footer';
import { Sun, Moon, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Handle theme icon and label
  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-5 w-5" />;
    if (theme === 'dark') return <Moon className="h-5 w-5" />;
    return <Laptop className="h-5 w-5" />;
  };

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
      
      {!hideNavbar && !isAuthPage && (
        <Navbar 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {!hideSidebar && !isAuthPage && (
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        )}
        
        <main className={cn(
          "flex-1 flex flex-col relative overflow-x-hidden overflow-y-auto",
          !isAuthPage && "pt-16", // Account for fixed navbar height
        )}>
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
        </main>
      </div>
      
      {/* Theme Switcher */}
      <Button 
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-50"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {getThemeIcon()}
      </Button>
    </div>
  );
};

export default GlobalLayout;
