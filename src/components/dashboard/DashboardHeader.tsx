
import React, { useState } from 'react';
import { Bell, User, Sun, Moon, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

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
    <header className="sticky top-0 z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="font-medium text-lg text-gray-800 dark:text-gray-100">
            <span>{getTimeOfDay()}, </span>
            <span className="text-interview-primary font-medium">{profile?.full_name || user?.email?.split('@')[0]}</span>
            <span className="hidden sm:inline text-gray-600 dark:text-gray-300"> — ready to level up?</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 bg-interview-primary rounded-full w-2 h-2"></span>
            <span className="sr-only">Notifications</span>
          </Button>
          
          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="sr-only">User menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 p-2">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-1">
                    <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="grid gap-0.5">
                    <p className="text-sm font-medium">{profile?.full_name || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                <Button variant="ghost" size="sm" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
