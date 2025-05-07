
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface Question {
  id: string;
  content: string;
  type: 'technical' | 'behavioral' | 'communication' | 'language';
  timeLimit?: number; // Optional per-question time limit in seconds
  answerFormat?: 'text' | 'code' | 'audio';
}

interface InterviewQuestionProps {
  question: Question;
  onAnswerSubmit: (questionId: string, answer: string) => void;
  currentIndex: number;
  totalQuestions: number;
}

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  question,
  onAnswerSubmit,
  currentIndex,
  totalQuestions
}) => {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSubmit = () => {
    onAnswerSubmit(question.id, answer);
  };

  const toggleRecording = () => {
    // In a real implementation, this would use the Web Audio API
    // to handle voice recording
    setIsRecording(!isRecording);
  };

  // Determine which type of input to render based on question type
  const renderAnswerInput = () => {
    switch (question.type) {
      case 'technical':
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm">{question.content}</pre>
            </div>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your solution here..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        );
      
      case 'behavioral':
      case 'communication':
        return (
          <div className="space-y-4">
            <p className="text-gray-800 dark:text-gray-200 text-lg">{question.content}</p>
            <div className="flex space-x-2">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 min-h-[150px]"
              />
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
                className="h-10 w-10"
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        );
          
      case 'language':
        return (
          <div className="space-y-4">
            <p className="text-gray-800 dark:text-gray-200 text-lg">{question.content}</p>
            <div className="flex flex-col space-y-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Listen to the prompt and respond:
                </p>
                {/* Audio player would go here in a real implementation */}
                <div className="bg-gray-200 dark:bg-gray-700 h-12 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Audio Player</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleRecording}
                  className="h-10 w-10"
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        );
            
      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-800 dark:text-gray-200">{question.content}</p>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[150px]"
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
            {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        {renderAnswerInput()}
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit}>
            Submit Answer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
