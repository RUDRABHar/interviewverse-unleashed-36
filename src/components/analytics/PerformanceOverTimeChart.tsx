
import React, { ReactElement } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartConfig {
  score: {
    label: string;
    theme: {
      light: string;
      dark: string;
    };
  };
}

interface ChartProps {
  className?: string;
  config: ChartConfig;
  children: ReactElement;
  data?: any;
}

// Common chart component with flexible props
const Chart: React.FC<ChartProps> = ({ children, className, config }) => {
  return (
    <div className={cn('chart relative', className)}>
      {children}
    </div>
  );
};

const mockData = [
  { date: '01/22', score: 65 },
  { date: '01/29', score: 58 },
  { date: '02/05', score: 72 },
  { date: '02/12', score: 78 },
  { date: '02/19', score: 74 },
  { date: '02/26', score: 85 },
  { date: '03/05', score: 82 },
  { date: '03/12', score: 91 },
];

export const PerformanceOverTimeChart: React.FC<{ className?: string; data?: any }> = ({ className, data = mockData }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const chartConfig: ChartConfig = {
    score: {
      label: 'Performance Score',
      theme: {
        light: '#9b87f5',
        dark: '#b09dfb',
      },
    },
  };

  return (
    <Card className={cn("overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl", className)}>
      <CardHeader className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 dark:from-gray-800/50 dark:to-gray-900/50 border-b dark:border-gray-800">
        <CardTitle className="font-sora text-gray-800 dark:text-gray-100">Performance Over Time</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Your interview scores over the past 3 months
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <Chart 
          className="h-[300px] w-full p-4" 
          config={chartConfig}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="date" 
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#1F2937' : '#ffffff',
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                }} 
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name="Performance"
                stroke={isDarkMode ? chartConfig.score.theme.dark : chartConfig.score.theme.light}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </CardContent>

      <CardFooter className="border-t border-gray-100 dark:border-gray-800 p-4 bg-gray-50/80 dark:bg-gray-800/30">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {data.length > 0 && (
            <>
              Most recent score: <span className="font-medium text-gray-800 dark:text-gray-200">{data[data.length - 1].score}%</span> •
              Improvement: <span className="font-medium text-green-600 dark:text-green-400">+{data[data.length - 1].score - data[0].score}%</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
