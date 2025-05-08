
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
        <div className="flex items-center justify-center p-4 mb-2">
          <div className="flex items-center">
            <div className="text-2xl font-sora font-bold">
              <span className="text-interview-primary">Interview</span>
              <span className="text-interview-blue">Xpert</span>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.label}
                    className="flex w-full items-center px-3 py-2"
                  >
                    <Link to={item.href} className="flex w-full items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-3">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="block">© 2025 InterviewXpert</span>
          <span className="block mt-1">Version 2.0</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
