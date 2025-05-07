
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart, 
  Settings, 
  HelpCircle,
  FileText,
  Calendar,
  Stars
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from '@/components/ui/sidebar';

export const DashboardSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/dashboard',
      active: currentPath === '/dashboard'
    },
    {
      icon: MessageSquare,
      label: 'My Interviews',
      href: '/interviews',
      active: currentPath === '/interviews'
    },
    {
      icon: Calendar,
      label: 'Schedule Interview',
      href: '/schedule',
      active: currentPath === '/schedule'
    },
    {
      icon: FileText,
      label: 'Test History',
      href: '/test-history',
      active: currentPath === '/test-history'
    },
    {
      icon: BarChart,
      label: 'Analytics',
      href: '/analytics',
      active: currentPath.includes('/analytics')
    },
    {
      icon: Stars,
      label: 'Skill Galaxy',
      href: '/progress-3d',
      active: currentPath === '/progress-3d'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      active: currentPath.includes('/settings')
    },
    {
      icon: HelpCircle,
      label: 'Support',
      href: '/support',
      active: currentPath.includes('/support')
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-lg backdrop-filter">
      <SidebarContent>
        {/* Logo and app name */}
        <div className="flex items-center justify-center p-5">
          <div className="flex items-center space-x-1">
            <div className="text-2xl font-sora font-bold">
              <span className="text-interview-primary">Interview</span>
              <span className="text-interview-blue">Xpert</span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.label}
                  >
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <span className="block">© 2025 InterviewXpert</span>
          <span className="block mt-1">Version 2.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
