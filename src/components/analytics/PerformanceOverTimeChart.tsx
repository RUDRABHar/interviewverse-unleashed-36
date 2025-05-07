
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, subMonths, subYears, isAfter, parseISO } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceOverTimeChartProps {
  data: any[];
  dateRange: 'week' | 'month' | 'year';
}

export const PerformanceOverTimeChart: React.FC<PerformanceOverTimeChartProps> = ({ data, dateRange }) => {
  const chartData = useMemo(() => {
    // Define the cutoff date based on the selected range
    const now = new Date();
    let cutoffDate;
    
    switch (dateRange) {
      case 'week':
        cutoffDate = subDays(now, 7);
        break;
      case 'month':
        cutoffDate = subMonths(now, 1);
        break;
      case 'year':
        cutoffDate = subYears(now, 1);
        break;
      default:
        cutoffDate = subMonths(now, 1);
    }
    
    // Filter and transform the data
    return data
      .filter(item => {
        const itemDate = parseISO(item.completed_at);
        return isAfter(itemDate, cutoffDate);
      })
      .map(item => ({
        date: format(parseISO(item.completed_at), 'yyyy-MM-dd'),
        score: item.score,
        interview_type: item.interview_type,
        formattedDate: format(parseISO(item.completed_at), 'MMM dd'),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, dateRange]);

  // Generate gradient ID
  const gradientId = useMemo(() => `score-gradient-${Math.random().toString(36).substring(2, 11)}`, []);

  const chartConfig = {
    score: {
      label: 'Score',
      theme: {
        light: '#ff5e00',
        dark: '#ff5e00',
      },
    },
  };

  // If no chart data is available
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">Not enough data for the selected time period.</p>
      </div>
    );
  }

  return (
    <ChartContainer className="h-full" config={chartConfig}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ff5e00" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#ff5e00" stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="formattedDate" 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis 
          domain={[0, 100]} 
          stroke="var(--muted-foreground)" 
          fontSize={12} 
          tickLine={false}
          axisLine={{ stroke: 'var(--border)' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          name="Score"
          stroke="var(--color-score)"
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          dot={{ r: 4 }}
          isAnimationActive={true}
        />
      </LineChart>
    </ChartContainer>
  );
};
