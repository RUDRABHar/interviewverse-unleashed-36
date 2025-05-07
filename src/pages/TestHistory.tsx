
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TestHistoryHeader } from '@/components/test-history/TestHistoryHeader';
import { TestHistoryTable } from '@/components/test-history/TestHistoryTable';
import { TestHistoryFilters } from '@/components/test-history/TestHistoryFilters';
import { EmptyTestHistory } from '@/components/test-history/EmptyTestHistory';
import { useTestHistory } from '@/hooks/useTestHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { useMediaQuery } from '@/hooks/use-mobile';

const TestHistory = () => {
  const [user] = useState({ name: 'User' });
  const { 
    interviews, 
    loading, 
    filters, 
    setFilters, 
    pagination, 
    setPagination 
  } = useTestHistory();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader 
            user={{ id: '1', email: 'user@example.com' }} 
            profile={{ full_name: user.name }} 
          />
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <TestHistoryHeader />
              <TestHistoryFilters filters={filters} setFilters={setFilters} />
              
              {loading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="w-full h-24 rounded-lg" />
                  ))}
                </div>
              ) : interviews && interviews.length > 0 ? (
                <TestHistoryTable 
                  interviews={interviews} 
                  isMobile={isMobile}
                  pagination={pagination}
                  setPagination={setPagination}
                />
              ) : (
                <EmptyTestHistory />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TestHistory;
