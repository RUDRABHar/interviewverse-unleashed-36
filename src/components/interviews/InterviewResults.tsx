
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Clock, 
  Calendar, 
  BarChart3, 
  Download, 
  ArrowUpRight,
  FileText,
  Bookmark,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScoreCircle } from '@/components/interviews/ScoreCircle';
import { SkillsRadarChart } from '@/components/dashboard/SkillsRadarChart';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface InterviewResult {
  id: string;
  title: string;
  completedAt: string;
  duration: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  partialAnswers: number;
  totalScore: number;
  interviewType: string;
  experienceLevel?: string;
  questions: QuestionResult[];
  aiSuggestions: string[];
  categoryPerformance: {
    [key: string]: number;
  };
}

interface QuestionResult {
  id: string;
  questionText: string;
  userAnswer: string;
  isCorrect: boolean | null;
  score: number;
  aiFeedback: string;
  category: string;
  type: string;
}

export const InterviewResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch interview session data
        const { data: sessionData, error: sessionError } = await supabase
          .from('interview_sessions')
          .select(`
            id, 
            number_of_questions,
            interview_type, 
            completed_at, 
            duration_taken,
            score,
            difficulty_level,
            experience_level,
            domain
          `)
          .eq('id', id)
          .single();

        if (sessionError) {
          throw sessionError;
        }

        // Fetch questions and answers
        const { data: answersData, error: answersError } = await supabase
          .from('user_answers')
          .select(`
            id,
            is_correct,
            time_taken,
            ai_feedback,
            answer_text,
            question_id,
            interview_questions(
              question_text,
              question_type,
              category
            )
          `)
          .eq('session_id', id);

        if (answersError) {
          throw answersError;
        }

        // Process and transform the data
        if (sessionData && answersData) {
          // Count correct/incorrect answers
          const correctAnswers = answersData.filter(a => a.is_correct === true).length;
          const incorrectAnswers = answersData.filter(a => a.is_correct === false).length;
          const partialAnswers = answersData.filter(a => a.is_correct === null).length;

          // Calculate category performance
          const categoryPerformance: { [key: string]: number } = {};
          answersData.forEach(answer => {
            const category = answer.interview_questions?.category || 'Unknown';
            if (!categoryPerformance[category]) {
              categoryPerformance[category] = 0;
            }
            const scoreContribution = answer.is_correct === true ? 1 : (answer.is_correct === null ? 0.5 : 0);
            categoryPerformance[category] += scoreContribution;
          });

          // Normalize category scores to percentages
          Object.keys(categoryPerformance).forEach(category => {
            const categoryAnswers = answersData.filter(a => a.interview_questions?.category === category).length;
            categoryPerformance[category] = categoryAnswers > 0 
              ? Math.round((categoryPerformance[category] / categoryAnswers) * 100) 
              : 0;
          });

          // Extract AI suggestions from feedback
          const allFeedback = answersData
            .map(a => a.ai_feedback || '')
            .filter(f => f.length > 0)
            .join(' ');

          // Simple extraction of suggestions (in a real app, this would be more sophisticated)
          const aiSuggestions = [
            "Practice answering questions more concisely while covering all key points.",
            "Review fundamental technical concepts to strengthen your base knowledge.",
            "Incorporate more specific examples from your experience in behavioral answers.",
            "Work on explaining complex concepts in simpler terms for better communication.",
            "Prepare structured answers using the STAR method for behavioral questions."
          ].slice(0, 4); // Limit to 4 suggestions

          // Format questions
          const questions: QuestionResult[] = answersData.map(answer => ({
            id: answer.question_id,
            questionText: answer.interview_questions?.question_text || 'Question not found',
            userAnswer: answer.answer_text || 'No answer provided',
            isCorrect: answer.is_correct,
            score: answer.is_correct === true ? 10 : (answer.is_correct === null ? 5 : 0),
            aiFeedback: answer.ai_feedback || 'No feedback available',
            category: answer.interview_questions?.category || 'General',
            type: answer.interview_questions?.question_type || 'Unknown'
          }));

          // Calculate duration in minutes
          const durationInMinutes = sessionData.duration_taken 
            ? Math.ceil(parseInt(sessionData.duration_taken.toString()) / 60) 
            : 30;

          setResult({
            id: sessionData.id,
            title: `${sessionData.interview_type} Interview - ${sessionData.domain || 'General'}`,
            completedAt: sessionData.completed_at,
            duration: durationInMinutes,
            totalQuestions: sessionData.number_of_questions,
            correctAnswers,
            incorrectAnswers,
            partialAnswers,
            totalScore: sessionData.score || Math.round((correctAnswers + (partialAnswers * 0.5)) / sessionData.number_of_questions * 100),
            interviewType: sessionData.interview_type,
            experienceLevel: sessionData.experience_level,
            questions,
            aiSuggestions,
            categoryPerformance
          });
        }
      } catch (error) {
        console.error('Error fetching interview results:', error);
        toast.error('Failed to load interview results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const handleDownloadReport = () => {
    toast.info('Generating PDF report...');
    // In a real app, we would generate and download a PDF here
    setTimeout(() => {
      toast.success('Report downloaded successfully');
    }, 1500);
  };

  const handleRetakeInterview = () => {
    navigate('/interviews');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Analyzing your interview results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Results Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">We couldn't find the interview results you're looking for.</p>
              <Button onClick={() => navigate('/interviews')} className="w-full">
                Return to Interviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper function to determine grade based on score
  const getGradeFromScore = (score: number): string => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  // Helper function to get status based on score
  const getStatusFromScore = (score: number): { text: string; color: string } => {
    if (score >= 70) return { text: 'Passed', color: 'text-green-500' };
    if (score >= 50) return { text: 'Needs Improvement', color: 'text-yellow-500' };
    return { text: 'Practice Required', color: 'text-red-500' };
  };

  const status = getStatusFromScore(result.totalScore);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section with main stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {result.title}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(new Date(result.completedAt), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{result.duration} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{result.interviewType} Interview</span>
                  </div>
                  {result.experienceLevel && (
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      <span>{result.experienceLevel} Level</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex flex-col items-center mr-6">
                  <ScoreCircle score={result.totalScore} size="lg" />
                  <span className="text-lg font-bold mt-1">{getGradeFromScore(result.totalScore)}</span>
                </div>
                <div className="flex flex-col">
                  <span className={`text-xl font-bold ${status.color}`}>{status.text}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Status</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-6">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                    <h3 className="text-2xl font-bold">{result.totalQuestions}</h3>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Correct</p>
                    <h3 className="text-2xl font-bold text-green-500">{result.correctAnswers}</h3>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Partial</p>
                    <h3 className="text-2xl font-bold text-yellow-500">{result.partialAnswers}</h3>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Incorrect</p>
                    <h3 className="text-2xl font-bold text-red-500">{result.incorrectAnswers}</h3>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </CardContent>
              </Card>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Performance Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="bg-white dark:bg-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>Category Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <SkillsRadarChart />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* AI Suggestions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white dark:bg-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>AI Improvement Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full mr-3">
                          <ArrowUpRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Deep Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  This section will contain detailed insights about your performance patterns, strengths, and areas for improvement.
                </p>
                <div className="flex justify-center items-center h-40">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    Advanced analytics available with Pro subscription
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Upgrade to Pro</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {result.questions.map((question, index) => (
                <AccordionItem 
                  key={question.id} 
                  value={question.id}
                  className="bg-white dark:bg-gray-800 mb-4 rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {question.isCorrect === true ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        ) : question.isCorrect === false ? (
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <XCircle className="h-5 w-5 text-red-500" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow text-left">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs sm:max-w-md md:max-w-xl">
                          {question.questionText}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded">
                          {question.category}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question:</h5>
                        <p className="text-gray-600 dark:text-gray-400">{question.questionText}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Answer:</h5>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-600 dark:text-gray-400">{question.userAnswer}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Feedback:</h5>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                          <p className="text-gray-700 dark:text-gray-300">{question.aiFeedback}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Bookmark className="h-3.5 w-3.5 mr-1" />
                          <span>Bookmark</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          <span>Add Note</span>
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
        
        {/* Action Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-4 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-wrap gap-3 justify-center"
        >
          <Button onClick={handleRetakeInterview} className="bg-orange-500 hover:bg-orange-600 text-white">
            Retake Similar Interview
          </Button>
          <Button variant="outline" onClick={handleDownloadReport} className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            <span>Download Report</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/interviews')}>
            Return to Interviews
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
