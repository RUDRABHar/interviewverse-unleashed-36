
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

export const InterviewTypeChart = () => {
  // Sample data for the interview types pie chart
  const interviewTypesData = [
    { name: 'Technical', value: 45 },
    { name: 'Behavioral', value: 30 },
    { name: 'HR', value: 15 },
    { name: 'Domain', value: 10 },
  ];

  const COLORS = ['#805AD5', '#FF6B00', '#38B2AC', '#4299E1'];
  
  const config = {
    technical: {
      label: "Technical",
      color: "#805AD5",
    },
    behavioral: {
      label: "Behavioral",
      color: "#FF6B00",
    },
    hr: {
      label: "HR",
      color: "#38B2AC",
    },
    domain: {
      label: "Domain",
      color: "#4299E1",
    },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Pie
            data={interviewTypesData}
            cx="50%"
            cy="45%"
            innerRadius={45}
            outerRadius={65}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {interviewTypesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
