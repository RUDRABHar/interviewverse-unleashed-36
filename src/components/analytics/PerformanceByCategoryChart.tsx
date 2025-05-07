
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PerformanceByCategoryChartProps {
  data: any[];
}

export const PerformanceByCategoryChart: React.FC<PerformanceByCategoryChartProps> = ({ data }) => {
  // Process data to extract categories and their scores
  const chartData = useMemo(() => {
    // Get all unique categories from interview questions
    const categoriesMap: Record<string, { count: number, totalScore: number }> = {};
    
    // Process each interview session
    data.forEach(session => {
      const questions = Array.isArray(session.interview_questions) ? session.interview_questions : [];
      const sessionScore = session.score || 0;
      
      // Count questions by category for this session
      const sessionCategories: Record<string, number> = {};
      questions.forEach(q => {
        if (q.category) {
          sessionCategories[q.category] = (sessionCategories[q.category] || 0) + 1;
        }
      });
      
      // Calculate weighted score for each category
      Object.entries(sessionCategories).forEach(([category, count]) => {
        if (!categoriesMap[category]) {
          categoriesMap[category] = { count: 0, totalScore: 0 };
        }
        categoriesMap[category].count += count;
        categoriesMap[category].totalScore += sessionScore;
      });
    });
    
    // Convert to chart data format and calculate average score per category
    return Object.entries(categoriesMap)
      .map(([category, { count, totalScore }]) => ({
        category,
        score: Math.round(totalScore / (count || 1)),
      }))
      .sort((a, b) => b.score - a.score);  // Sort by score descending
  }, [data]);

  const chartConfig = {
    score: {
      label: 'Score',
      theme: {
        light: '#ff5e00',
        dark: '#ff5e00',
      },
    },
  };

  // Generate colors based on score
  const getBarColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green for high scores
    if (score >= 60) return '#f59e0b'; // Amber for medium scores
    return '#ef4444'; // Red for low scores
  };

  // If no chart data is available
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No category data available.</p>
      </div>
    );
  }

  return (
    <ChartContainer className="h-full" config={chartConfig}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="category" 
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
        <Bar dataKey="score" name="Score" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
};
