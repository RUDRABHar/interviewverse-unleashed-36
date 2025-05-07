
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InterviewCard } from '@/components/interviews/InterviewCard';
import { EmptyState } from '@/components/interviews/EmptyState';
import { Loader2 } from 'lucide-react';

// Define the animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

interface InterviewsContentProps {
  tabs: { id: string; name: string; active: boolean }[];
  activeTab: string;
  loading: boolean;
  interviews: any[];
  onTabChange: (value: string) => void;
}

export const InterviewsContent: React.FC<InterviewsContentProps> = ({
  tabs = [], // Provide a default empty array
  activeTab = 'all',
  loading,
  interviews = [], // Provide a default empty array
  onTabChange = () => {} // Provide a default function
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        {Array.isArray(tabs) && tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>{tab.name}</TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="h-64 rounded-xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : Array.isArray(interviews) && interviews.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {interviews.map(interview => (
              <motion.div key={interview.id} variants={itemVariants}>
                <InterviewCard interview={interview} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState />
        )}
      </TabsContent>
    </Tabs>
  );
};
