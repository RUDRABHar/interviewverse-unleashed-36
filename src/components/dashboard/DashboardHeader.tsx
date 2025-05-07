
import React, { useState } from 'react';
import { Bell, User, Sun, Moon, Settings, LogOut, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PremiumCard from '@/components/ui/design-system/PremiumCard';

interface DashboardHeaderProps {
  user: any;
  profile: any;
}

export const DashboardHeader = ({ user, profile }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="font-sora text-lg text-gray-800 dark:text-gray-100">
            <span>{getTimeOfDay()}, </span>
            <span className="text-interview-primary font-semibold">{profile?.full_name || user?.email?.split('@')[0]}</span>
            <span className="hidden sm:inline text-gray-600 dark:text-gray-300"> — ready to level up?</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-auto hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search interviews, skills, or resources..." 
              className="pl-9 bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-interview-primary/30"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
          >
            {isDarkMode ? (
              <motion.div
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="h-5 w-5 text-gray-600" />
              </motion.div>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Notifications */}
          <Popover>
            <PopoverTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 bg-interview-primary rounded-full w-2 h-2 animate-pulse-soft"></span>
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <PremiumCard className="border-0 shadow-none">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="font-semibold">Notifications</h4>
                </div>
                <div className="py-2">
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-interview-primary/20 rounded-full flex items-center justify-center text-interview-primary">
                        <Bell className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New feature available</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Try our new AI feedback system</p>
                        <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Interview reminder</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Technical interview in 2 hours</p>
                        <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="ghost" size="sm" className="w-full justify-center text-interview-primary">
                    View all notifications
                  </Button>
                </div>
              </PremiumCard>
            </PopoverContent>
          </Popover>
          
          {/* User Menu */}
          <Popover>
            <PopoverTrigger>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="sr-only">User menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <PremiumCard className="border-0 shadow-none">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 p-2">
                    <div className="rounded-full bg-interview-primary/10 dark:bg-interview-primary/20 p-1">
                      <User className="h-6 w-6 text-interview-primary" />
                    </div>
                    <div className="grid gap-0.5">
                      <p className="text-sm font-medium">{profile?.full_name || user?.email?.split('@')[0]}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200/50 dark:bg-gray-700/50 my-1" />
                  <Button variant="ghost" size="sm" className="justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </Button>
                </div>
              </PremiumCard>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </motion.header>
  );
};
