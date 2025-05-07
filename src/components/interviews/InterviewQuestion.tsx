
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Code, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface Question {
  id: string;
  content: string;
  type: 'technical' | 'behavioral' | 'communication' | 'language';
  timeLimit?: number; // Optional per-question time limit in seconds
  answerFormat?: 'text' | 'code' | 'audio' | 'mcq';
  options?: string[]; // For multiple choice questions
  testCases?: Array<{
    input: string;
    expectedOutput: string;
  }>;
  correctOption?: number; // Index of correct option for MCQs (not shown to user)
}

interface InterviewQuestionProps {
  question: Question;
  onAnswerSubmit: (questionId: string, answer: string, isCorrect?: boolean) => void;
  currentIndex: number;
  totalQuestions: number;
}

export const InterviewQuestion: React.FC<InterviewQuestionProps> = ({
  question,
  onAnswerSubmit,
  currentIndex,
  totalQuestions
}) => {
  // Safety check - if question is undefined, return a fallback UI
  if (!question || !question.type) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-6"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Question Data Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was a problem loading this question. Please try again or continue to the next question.
          </p>
          <Button onClick={() => onAnswerSubmit('error', 'Question could not be loaded')}>
            Continue
          </Button>
        </div>
      </motion.div>
    );
  }

  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const handleSubmit = () => {
    let finalAnswer = answer;
    let isCorrect = undefined;
    
    // For MCQ questions, construct answer from selected option
    if (question.answerFormat === 'mcq' && selectedOption !== null) {
      finalAnswer = question.options?.[selectedOption] || '';
      isCorrect = selectedOption === question.correctOption;
    }
    
    onAnswerSubmit(question.id, finalAnswer, isCorrect);
  };

  const toggleRecording = () => {
    // In a real implementation, this would use the Web Audio API
    // to handle voice recording
    setIsRecording(!isRecording);
  };

  const validateCode = () => {
    if (!question.testCases || question.testCases.length === 0) return;
    
    setIsValidating(true);
    
    // This is a simplified validation - in a real app, this would run the code against test cases
    try {
      // Simple mock evaluation for demonstration
      const passed = Math.random() > 0.3; // Just for demo purposes
      
      setCodeOutput(
        passed 
          ? "✓ All test cases passed!" 
          : "✖ Some test cases failed. Review your solution."
      );
      
      setTimeout(() => setIsValidating(false), 1000);
    } catch (error) {
      setCodeOutput(`Error: ${error}`);
      setIsValidating(false);
    }
  };

  // Determine which type of input to render based on question type and answer format
  const renderAnswerInput = () => {
    // Handle MCQ questions
    if (question.answerFormat === 'mcq' && question.options && question.options.length > 0) {
      return (
        <div className="space-y-4">
          <p className="text-gray-800 dark:text-gray-200 text-lg">{question.content}</p>
          
          <RadioGroup 
            value={selectedOption !== null ? selectedOption.toString() : undefined} 
            onValueChange={(value) => setSelectedOption(parseInt(value))}
            className="space-y-2"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }
  
    switch (question.type) {
      case 'technical':
        return (
          <div className="space-y-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm">{question.content}</pre>
            </div>
            
            {question.testCases && question.testCases.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium mb-2 text-sm text-gray-700 dark:text-gray-300">Test Cases:</h4>
                <div className="space-y-2">
                  {question.testCases.map((testCase, i) => (
                    <div key={i} className="text-xs font-mono">
                      <div><span className="text-gray-500">Input:</span> {testCase.input}</div>
                      <div><span className="text-gray-500">Expected:</span> {testCase.expectedOutput}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your solution here..."
              className="min-h-[200px] font-mono text-sm"
            />
            
            {question.testCases && question.testCases.length > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={validateCode}
                    disabled={isValidating || !answer.trim()}
                  >
                    {isValidating ? "Validating..." : "Validate Solution"}
                  </Button>
                  
                  {codeOutput && (
                    <div className={`text-sm ${codeOutput.includes("✓") ? "text-green-600" : "text-red-600"}`}>
                      {codeOutput}
                    </div>
                  )}
                </div>
              </>
            )}
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
          <Button 
            onClick={handleSubmit} 
            disabled={(question.answerFormat === 'mcq' && selectedOption === null) || 
                     (!question.answerFormat && !answer.trim())}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
