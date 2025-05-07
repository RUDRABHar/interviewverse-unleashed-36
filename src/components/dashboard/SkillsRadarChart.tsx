
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

export const SkillsRadarChart = () => {
  // Sample data for the skills radar chart
  const skillsData = [
    { skill: 'Communication', value: 80 },
    { skill: 'Technical', value: 75 },
    { skill: 'Problem-solving', value: 65 },
    { skill: 'Leadership', value: 60 },
    { skill: 'Teamwork', value: 85 }
  ];

  const config = {
    skills: {
      label: "Skills Score",
      color: "#805AD5",
    },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#888', fontSize: 10 }}
          />
          <Radar
            name="skills"
            dataKey="value"
            stroke="#805AD5"
            fill="#805AD5"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
