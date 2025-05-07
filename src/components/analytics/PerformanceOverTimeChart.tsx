
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

export const PerformanceOverTimeChart: React.FC<{ className?: string }> = ({ className }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  const chartConfig: ChartConfig = {
    score: {
      label: 'Performance Score',
      theme: {
        light: '#FF6B00',
        dark: '#FF8A3D',
      },
    },
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Performance Over Time</CardTitle>
        <CardDescription>
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
              data={mockData}
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

      <CardFooter className="border-t border-border p-4">
        <div className="text-sm text-muted-foreground">
          {mockData.length > 0 && (
            <>
              Most recent score: <span className="font-medium text-foreground">{mockData[mockData.length - 1].score}%</span> •
              Improvement: <span className="font-medium text-green-600 dark:text-green-400">+{mockData[mockData.length - 1].score - mockData[0].score}%</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
