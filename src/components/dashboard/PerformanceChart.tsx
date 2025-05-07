
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export const PerformanceChart = () => {
  // Sample data for the performance chart
  const performanceData = [
    { date: 'Apr 1', score: 65 },
    { date: 'Apr 8', score: 68 },
    { date: 'Apr 15', score: 72 },
    { date: 'Apr 22', score: 70 },
    { date: 'Apr 29', score: 75 },
    { date: 'May 5', score: 78 },
  ];

  const config = {
    performance: {
      label: "Performance Score",
      color: "#FF6B00",
    },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#888' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="score"
            name="performance"
            stroke="#FF6B00"
            strokeWidth={2}
            dot={{ r: 4, fill: "#FF6B00", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#FF6B00", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
