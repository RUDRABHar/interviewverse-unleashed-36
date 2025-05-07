
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { InterviewWizard } from '@/components/interviews/InterviewWizard';
import { InterviewHistory } from '@/components/interviews/InterviewHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Interviews = () => {
  const [user] = useState({ name: 'Rudraksh' }); // This would usually come from authentication
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleInterviewCreated = () => {
    toast({
      title: "Interview Created",
      description: "Your interview is ready to start",
      duration: 5000,
    });
    setWizardOpen(false);
  };

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
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Interviews</h1>
                <button
                  onClick={() => setWizardOpen(!wizardOpen)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  {wizardOpen ? 'Hide Wizard' : 'Create New Interview'}
                </button>
              </div>
              
              {wizardOpen && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-all duration-300 ease-in-out animate-fade-in">
                  <InterviewWizard onComplete={handleInterviewCreated} />
                </div>
              )}
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Interviews</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="draft">Drafts</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <InterviewHistory filter="all" />
                </TabsContent>
                <TabsContent value="completed">
                  <InterviewHistory filter="completed" />
                </TabsContent>
                <TabsContent value="pending">
                  <InterviewHistory filter="pending" />
                </TabsContent>
                <TabsContent value="draft">
                  <InterviewHistory filter="draft" />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Interviews;
