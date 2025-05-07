
import React, { useMemo } from 'react';
import { addDays, format, startOfWeek, differenceInDays, parseISO, startOfMonth, endOfMonth } from 'date-fns';

interface InterviewActivityCalendarProps {
  data: any[];
}

interface CalendarDay {
  date: Date;
  interviews: any[];
  score: number | null;
}

export const InterviewActivityCalendar: React.FC<InterviewActivityCalendarProps> = ({ data }) => {
  // Generate calendar data for the current month
  const calendarData = useMemo(() => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const firstDay = startOfWeek(monthStart);
    
    // Create array of days from first day of calendar to last day of month
    const totalDays = differenceInDays(monthEnd, firstDay) + 1;
    
    // Create calendar grid days
    const days: CalendarDay[] = Array.from({ length: 42 }, (_, i) => {
      const date = addDays(firstDay, i);
      return {
        date,
        interviews: [],
        score: null,
      };
    });
    
    // Fill in interview data
    data.forEach(interview => {
      const interviewDate = parseISO(interview.completed_at);
      const dayIndex = differenceInDays(interviewDate, firstDay);
      
      // Only include if the interview falls within our calendar range
      if (dayIndex >= 0 && dayIndex < days.length) {
        days[dayIndex].interviews.push(interview);
        
        // If there are multiple interviews on the same day, use the average score
        if (days[dayIndex].score === null) {
          days[dayIndex].score = interview.score;
        } else {
          days[dayIndex].score = (days[dayIndex].score + interview.score) / 2;
        }
      }
    });
    
    return {
      days: days.slice(0, totalDays + 7),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    };
  }, [data]);
  
  // Helper function to determine cell color based on score
  const getCellColor = (day: CalendarDay) => {
    if (day.interviews.length === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    const score = day.score;
    if (score === null) return 'bg-gray-100 dark:bg-gray-800';
    
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40';
    return 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40';
  };
  
  // Helper function to format cell content
  const getCellContent = (day: CalendarDay) => {
    const isCurrentMonth = day.date.getMonth() === new Date().getMonth();
    const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return (
      <div className={`relative h-full w-full p-1 ${isCurrentMonth ? '' : 'opacity-50'}`}>
        <div className={`absolute top-1 right-1 text-xs ${isToday ? 'font-bold text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {format(day.date, 'd')}
        </div>
        
        {day.interviews.length > 0 && (
          <div className="absolute bottom-1 left-1">
            <div className="flex gap-0.5">
              {day.interviews.length === 1 ? (
                <span className="text-xs font-medium">
                  {Math.round(day.score || 0)}%
                </span>
              ) : (
                <span className="text-xs font-medium">
                  {Math.round(day.score || 0)}% ({day.interviews.length})
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="text-sm font-medium mb-2">
        {format(new Date(), 'MMMM yyyy')}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Header row with day names */}
        {calendarData.weekDays.map((day) => (
          <div 
            key={day} 
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
        
        {/* Calendar cells */}
        {calendarData.days.map((day, index) => (
          <div
            key={index}
            className={`aspect-square rounded-md text-sm ${getCellColor(day)} transition-colors cursor-pointer`}
            title={`${format(day.date, 'MMM d, yyyy')}: ${day.interviews.length} interviews`}
          >
            {getCellContent(day)}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-end items-center mt-4 gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
          <span>No interviews</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/30"></div>
          <span>Good (80%+)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-yellow-100 dark:bg-yellow-900/30"></div>
          <span>Average (60-80%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-900/30"></div>
          <span>Needs work (&lt;60%)</span>
        </div>
      </div>
    </div>
  );
};
