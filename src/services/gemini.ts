
import { Question } from '@/components/interviews/InterviewQuestion';
import { toast } from 'sonner';

interface InterviewConfig {
  types: string[];
  questions: number;
  duration: number;
  difficulty: string;
  language: string;
  mode?: string;
  domain?: string;
}

// This is a mock implementation - in a real app, this would connect to Google's Gemini API
export const generateInterviewQuestions = async (config: InterviewConfig): Promise<Question[]> => {
  console.log('Generating interview questions with config:', config);
  toast.info('Generating interview questions...');
  
  try {
    // In a real implementation, this would make an API call to Google Gemini 2.0 Flash API
    // const response = await fetch('https://api.gemini.ai/v1/generate', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     prompt: buildPrompt(config),
    //     max_tokens: 2048,
    //   }),
    // });
    // const data = await response.json();
    // return parseQuestionsFromResponse(data);
    
    // For now, we'll simulate a response with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return generateMockQuestions(config);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate interview questions. Please try again.');
  }
};

// Helper to build a prompt for Gemini based on interview configuration
const buildPrompt = (config: InterviewConfig): string => {
  const difficultyMap: Record<string, string> = {
    'easy': '0-2 years of experience (entry level)',
    'medium': '2-5 years of experience (mid-level)',
    'hard': '5+ years of experience (senior level)'
  };

  return `
    Generate a set of ${config.questions} interview questions for a ${config.difficulty} level interview 
    (${difficultyMap[config.difficulty]}). 
    Question types should include: ${config.types.join(', ')}.
    Language: ${config.language}.
    ${config.domain ? `Domain/Field: ${config.domain}` : ''}
    
    Format each question as a JSON object with:
    - id: unique string
    - content: the question text
    - type: one of ${config.types.join(', ')}
    - answerFormat: "text", "code", or "audio"
    
    Ensure questions are appropriate for the difficulty level and varied within each selected type.
  `;
};

// Mock implementation for demonstration
const generateMockQuestions = (config: InterviewConfig): Question[] => {
  const questions: Question[] = [];
  const questionTypes = config.types;
  
  // Generate questions based on configuration
  for (let i = 0; i < config.questions; i++) {
    // Cycle through question types
    const type = questionTypes[i % questionTypes.length] as 'technical' | 'behavioral' | 'communication' | 'language';
    
    let question: Question = {
      id: `q-${i + 1}`,
      content: '',
      type: type,
      answerFormat: 'text',
    };
    
    // Generate question content based on type and difficulty
    switch (type) {
      case 'technical':
        if (config.difficulty === 'easy') {
          question.content = 'What is the difference between var, let, and const in JavaScript?';
          question.answerFormat = 'text';
        } else if (config.difficulty === 'medium') {
          question.content = 'Implement a function to find the longest substring without repeating characters.';
          question.answerFormat = 'code';
        } else {
          question.content = 'Design a distributed caching system with high availability and fault tolerance. Discuss your approach, potential issues, and how you would address them.';
          question.answerFormat = 'text';
        }
        break;
        
      case 'behavioral':
        if (config.difficulty === 'easy') {
          question.content = 'Tell me about a time when you had to work under pressure or with tight deadlines.';
        } else if (config.difficulty === 'medium') {
          question.content = 'Describe a situation where you had to resolve a conflict within your team. What was your approach and what was the outcome?';
        } else {
          question.content = 'Tell me about a time when you had to make a difficult decision that impacted your entire team or organization. What was your thought process and how did you handle the aftermath?';
        }
        break;
        
      case 'communication':
        if (config.difficulty === 'easy') {
          question.content = 'Explain the concept of cloud computing to someone without a technical background.';
        } else if (config.difficulty === 'medium') {
          question.content = 'You need to communicate a project delay to stakeholders. Draft a concise email explaining the situation, reasons for the delay, and proposed next steps.';
        } else {
          question.content = 'Present a complex technical solution to a mixed audience of technical and non-technical stakeholders. Ensure your explanation is clear and effective for both groups.';
        }
        break;
        
      case 'language':
        if (config.language.toLowerCase() !== 'english') {
          question.content = `Introduce yourself and describe your professional background in ${config.language}.`;
        } else {
          question.content = 'Describe a challenging project you worked on and what you learned from it.';
        }
        question.answerFormat = 'audio';
        break;
    }
    
    questions.push(question);
  }
  
  return questions;
};
