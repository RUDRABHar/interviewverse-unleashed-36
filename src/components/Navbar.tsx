
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 left-0 right-0 h-16 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          
          <Link to="/" className="flex items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Interview<span className="text-interview-primary">Xpert</span>
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Bell className="h-4 w-4" />
          </Button>
          
          <div className="h-8 w-8 rounded-full bg-interview-primary/10 flex items-center justify-center text-interview-primary font-medium">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
