
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Home, 
  Users, 
  Calendar, 
  Star, 
  BarChart3, 
  Clock, 
  Settings, 
  HelpCircle,
  X,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Star, label: 'Interviews', path: '/interviews' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Clock, label: 'Test History', path: '/test-history' },
    { icon: Calendar, label: 'Schedule', path: '/schedule' },
    { icon: Users, label: '3D Skills View', path: '/progress-3d' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
  ];

  // Mobile overlay animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Sidebar animation
  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: '0%' }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: open ? 0 : '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 40
        }}
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 bg-white dark:bg-gray-900 shadow-xl",
          "border-r border-gray-200 dark:border-gray-800",
          "transition-transform lg:translate-x-0 lg:relative",
          "glass-effect-strong overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-500">
              InterviewXpert
            </div>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden"
            onClick={() => setOpen(false)}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        
        {/* Nav links */}
        <nav className="px-4 pb-8">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive ? 
                        "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 font-medium" : 
                        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute right-0 w-1 h-6 bg-orange-500 rounded-l-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
