
import React, { useMemo } from 'react';
import { parseISO, differenceInDays } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PerformanceInsightsPanelProps {
  data: any[] | { performanceOverTime: any[], performanceByCategory: any[] };
}

export const PerformanceInsightsPanel: React.FC<PerformanceInsightsPanelProps> = ({ data }) => {
  const insights = useMemo(() => {
    // Convert data to array format if it's not already
    const dataArray = Array.isArray(data) ? data : (data?.performanceOverTime || []);
    
    // Sort data by completed_at (newest first)
    const sortedData = [...dataArray].sort((a, b) => {
      if (!a.completed_at || !b.completed_at) return 0;
      return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
    });
    
    // Calculate average score
    const totalScore = dataArray.reduce((sum, interview) => sum + (interview.score || 0), 0);
    const averageScore = dataArray.length > 0 ? Math.round(totalScore / dataArray.length) : 0;
    
    // Calculate recent trend (last 3 interviews compared to previous 3)
    const recentInterviews = sortedData.slice(0, 3);
    const previousInterviews = sortedData.slice(3, 6);
    
    const recentAvg = recentInterviews.length > 0 
      ? recentInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / recentInterviews.length 
      : 0;
    
    const previousAvg = previousInterviews.length > 0 
      ? previousInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / previousInterviews.length 
      : 0;
    
    let trend = 'neutral';
    let trendValue = 0;
    
    if (recentAvg > 0 && previousAvg > 0) {
      trendValue = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
      if (trendValue > 5) trend = 'up';
      else if (trendValue < -5) trend = 'down';
    }
    
    // Find best and worst categories
    const categoryScores: Record<string, { total: number, count: number }> = {};
    dataArray.forEach(session => {
      const questions = Array.isArray(session.interview_questions) ? session.interview_questions : [];
      const sessionScore = session.score || 0;
      
      // Count questions by category for this session
      const sessionCategories: Record<string, number> = {};
      questions.forEach(q => {
        if (q?.category) {
          sessionCategories[q.category] = (sessionCategories[q.category] || 0) + 1;
        }
      });
      
      // Calculate weighted score for each category
      Object.entries(sessionCategories).forEach(([category, count]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = { total: 0, count: 0 };
        }
        categoryScores[category].count += count;
        categoryScores[category].total += sessionScore;
      });
    });
    
    // Calculate average score for each category
    const categoryAverages = Object.entries(categoryScores).map(([category, { total, count }]) => ({
      category,
      averageScore: Math.round(total / count),
    }));
    
    // Sort categories by score
    categoryAverages.sort((a, b) => b.averageScore - a.averageScore);
    
    // Get best and worst categories
    const bestCategory = categoryAverages.length > 0 ? categoryAverages[0] : null;
    const worstCategory = categoryAverages.length > 0 ? categoryAverages[categoryAverages.length - 1] : null;
    
    // Calculate interview frequency
    let frequency = 'Low';
    if (dataArray.length >= 2) {
      const firstInterview = sortedData.length > 0 && sortedData[sortedData.length - 1].completed_at
        ? parseISO(sortedData[sortedData.length - 1].completed_at)
        : new Date();
      const lastInterview = sortedData.length > 0 && sortedData[0].completed_at
        ? parseISO(sortedData[0].completed_at)
        : new Date();
      const daysBetween = differenceInDays(lastInterview, firstInterview);
      const interviewsPerWeek = dataArray.length / (daysBetween / 7 || 1);
      
      if (interviewsPerWeek >= 3) frequency = 'High';
      else if (interviewsPerWeek >= 1) frequency = 'Medium';
    }
    
    return {
      totalInterviews: dataArray.length,
      averageScore,
      trend,
      trendValue: Math.abs(trendValue),
      bestCategory: bestCategory?.category,
      bestCategoryScore: bestCategory?.averageScore || 0,
      worstCategory: worstCategory?.category,
      worstCategoryScore: worstCategory?.averageScore || 0,
      frequency,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Interviews</p>
          <p className="text-2xl font-semibold">{insights.totalInterviews}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
          <p className="text-2xl font-semibold">{insights.averageScore}%</p>
        </div>
      </div>

      {/* Trend indicator */}
      {insights.totalInterviews > 3 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            {insights.trend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : insights.trend === 'down' ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <Minus className="h-5 w-5 text-gray-500" />
            )}
            <span className={`text-sm font-medium ${
              insights.trend === 'up' 
                ? 'text-green-600 dark:text-green-500' 
                : insights.trend === 'down' 
                  ? 'text-red-600 dark:text-red-500' 
                  : 'text-gray-600 dark:text-gray-400'
            }`}>
              {insights.trend === 'up' 
                ? `Up ${insights.trendValue}%` 
                : insights.trend === 'down' 
                  ? `Down ${insights.trendValue}%`
                  : 'No change'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {insights.trend === 'up' 
              ? 'Your recent interviews show improvement' 
              : insights.trend === 'down' 
                ? 'Your scores have declined recently'
                : 'Your performance is steady'}
          </p>
        </div>
      )}

      {/* Strengths and weaknesses */}
      {insights.bestCategory && insights.worstCategory && (
        <>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Strongest Category</p>
            <div className="flex justify-between items-center">
              <p className="font-medium">{insights.bestCategory}</p>
              <span className="text-green-600 dark:text-green-500 font-medium">{insights.bestCategoryScore}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Area for Improvement</p>
            <div className="flex justify-between items-center">
              <p className="font-medium">{insights.worstCategory}</p>
              <span className="text-red-600 dark:text-red-500 font-medium">{insights.worstCategoryScore}%</span>
            </div>
          </div>
        </>
      )}

      {/* Practice frequency */}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Practice Frequency</p>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700`}>
            <div 
              className={`h-2.5 rounded-full ${
                insights.frequency === 'High' ? 'bg-green-500 w-full' : 
                insights.frequency === 'Medium' ? 'bg-yellow-500 w-2/3' : 
                'bg-red-500 w-1/3'
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium">{insights.frequency}</span>
        </div>
      </div>
    </div>
  );
};
