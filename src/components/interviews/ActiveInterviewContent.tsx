
import React from 'react';
import { InterviewQuestion } from './InterviewQuestion';
import { InterviewTimer } from './InterviewTimer';
import { Question } from '@/hooks/useInterviewSession';

interface ActiveInterviewContentProps {
  sessionTitle: string;
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  durationInMinutes: number;
  onAnswerSubmit: (questionId: string, answer: string, isCorrect?: boolean) => Promise<void>;
  onTimeUp: () => Promise<void>;
}

export const ActiveInterviewContent: React.FC<ActiveInterviewContentProps> = ({
  sessionTitle,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  durationInMinutes,
  onAnswerSubmit,
  onTimeUp
}) => {
  return (
    <div className="h-full flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {sessionTitle}
          </h1>
          <InterviewTimer 
            durationInMinutes={durationInMinutes} 
            onTimeUp={onTimeUp} 
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
          />
        </div>
      </header>
      
      <main className="flex-1 overflow-auto py-8">
        <InterviewQuestion 
          question={currentQuestion}
          onAnswerSubmit={onAnswerSubmit}
          currentIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      </main>
    </div>
  );
};
