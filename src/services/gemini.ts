
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

const API_KEY = 'AIzaSyDkGk86fdOpfG8GKWaxPb_NV09J6Vdu61Y'; // Google Gemini API Key

// Main function to generate interview questions
export const generateInterviewQuestions = async (config: InterviewConfig): Promise<Question[]> => {
  console.log('Generating interview questions with config:', config);
  toast.info('Generating interview questions...');
  
  try {
    // Build prompt based on interview type(s)
    const prompt = buildDynamicPrompt(config);
    
    // Call Google Gemini API with constructed prompt
    const response = await callGeminiAPI(prompt);
    
    // Parse the response and convert to Question[] format
    return parseQuestionsFromResponse(response, config);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate interview questions. Please try again.');
  }
};

// Dynamically select and build the appropriate prompt template based on question types
const buildDynamicPrompt = (config: InterviewConfig): string => {
  // If multiple types are selected, we'll create a compound prompt
  if (config.types.length > 1) {
    return buildMultiTypePrompt(config);
  }

  // Single question type scenario
  const type = config.types[0];
  
  switch (type) {
    case 'technical':
      return buildTechnicalPrompt(config);
    case 'behavioral':
      return buildBehavioralPrompt(config);
    case 'communication':
      return buildCommunicationPrompt(config);
    case 'language':
      return buildLanguagePrompt(config);
    default:
      return buildDefaultPrompt(config);
  }
};

// Technical interview prompt template
const buildTechnicalPrompt = (config: InterviewConfig): string => {
  return `You are an expert interviewer for ${config.domain || 'tech'} roles. Generate ${config.questions} high-quality technical interview questions in ${config.language} suitable for a candidate with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  The questions should test real-world problem-solving skills, domain expertise, algorithms, system thinking, and technical communication. Ensure questions cover a broad range of core subtopics in ${config.domain || 'the technical field'}.
  
  Include a MIX of different question formats:
  1. Coding questions (30-40% of questions) - Include test cases with example inputs and expected outputs
  2. Multiple choice questions (30-40% of questions) - Include 4-5 answer choices per question and mark which one is correct (but this won't be shown to the user)
  3. Short answer technical questions (20-40% of questions)
  
  Each question should be in the following format:
  - Question content: clear, structured, and concise instructions
  - Question type: specify "technical" 
  - Answer format: "code", "mcq", or "text" depending on the question type
  - For MCQs: include an array of answer choices and index of the correct answer (0-based)
  - For coding questions: include test cases with input and expected output examples
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "technical"
  - answerFormat: either "code", "mcq", or "text" depending on question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the correct option (only for MCQs)
  - testCases: array of objects with "input" and "expectedOutput" fields (only for coding questions)
  
  Make sure all content is professional and realistic for a technical interview. Do NOT include hints or answers in the question content.`;
};

// Behavioral interview prompt template
const buildBehavioralPrompt = (config: InterviewConfig): string => {
  return `You are an HR expert conducting behavioral interviews. Generate ${config.questions} behavioral interview questions in ${config.language} for a candidate applying to a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  These questions should evaluate:
  - Past behavior and mindset
  - Problem ownership and leadership potential
  - Conflict resolution and team interaction
  - Adaptability and decision-making
  
  Include a mix of formats:
  1. Open-ended STAR format questions (60-70% of questions) - Use answerFormat: "text"
  2. Multiple choice scenario questions (30-40% of questions) - Include 4-5 answer choices that represent different approaches to handling a situation, with one being the most appropriate. Use answerFormat: "mcq"
  
  Each question should follow the STAR (Situation, Task, Action, Result) framework where applicable. Avoid repetition and make questions challenging but realistic.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "behavioral"
  - answerFormat: either "text" or "mcq" depending on question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the best option (only for MCQs)`;
};

// Communication skills interview prompt template
const buildCommunicationPrompt = (config: InterviewConfig): string => {
  return `You are assessing professional communication skills. Generate ${config.questions} interview questions in ${config.language} that evaluate communication ability for a candidate in a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  The questions should assess:
  - Clarity of thought
  - Verbal articulation
  - Active listening and empathy
  - Presentation or storytelling abilities
  
  Include a mix of formats:
  1. Scenario-based open questions (50-60% of questions) - Use answerFormat: "text"
  2. Multiple choice questions about communication strategies (40-50% of questions) - Include 4-5 answer choices with one best answer. Use answerFormat: "mcq"
  
  Use realistic workplace scenarios or client-facing situations. Avoid yes/no questions.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "communication"
  - answerFormat: either "text" or "mcq" depending on question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the best option (only for MCQs)`;
};

// Language proficiency interview prompt template
const buildLanguagePrompt = (config: InterviewConfig): string => {
  return `You are testing practical language proficiency of a candidate in ${config.language}. Generate ${config.questions} language-based interview questions suitable for a ${config.domain || 'professional'} professional with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  Questions should assess:
  - Grammar, vocabulary, sentence construction
  - Listening comprehension (if audio questions enabled)
  - Reading understanding
  - Spoken expression and fluency
  
  Include a mix of formats:
  1. Open-ended questions requiring detailed responses (40-50%) - Use answerFormat: "text"
  2. Multiple choice language questions (30-40%) - Include 4-5 answer choices with one correct answer. Use answerFormat: "mcq"
  3. Audio-based response questions (20-30%) - Questions where the candidate would respond via audio. Use answerFormat: "audio"
  
  Use context from ${config.domain || 'the professional field'} to make it professionally relevant. Mix question types such as sentence correction, audio comprehension, short paragraph responses, and spoken tasks. Format should be suitable for digital UI delivery.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "language"
  - answerFormat: "text", "mcq", or "audio" depending on question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the correct option (only for MCQs)`;
};

// Default prompt as a fallback
const buildDefaultPrompt = (config: InterviewConfig): string => {
  return `Generate ${config.questions} professional interview questions in ${config.language} for a ${config.domain || 'professional'} position with difficulty level ${config.difficulty}.
  
  Include a mix of question formats:
  1. Open-ended questions (50%) - Use answerFormat: "text"
  2. Multiple choice questions (50%) - Include 4-5 answer choices with one best answer. Use answerFormat: "mcq"
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: one of ${config.types.join(', ')}
  - answerFormat: "text" or "mcq" depending on the question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the correct option (only for MCQs)`;
};

// Handle multiple question types by splitting the requested questions among the types
const buildMultiTypePrompt = (config: InterviewConfig): string => {
  const questionsPerType = Math.floor(config.questions / config.types.length);
  let remainingQuestions = config.questions % config.types.length;
  
  let combinedPrompt = `Generate ${config.questions} professional interview questions divided across ${config.types.length} different question types for a ${config.domain || 'professional'} role. 

  Questions should be in ${config.language} and suitable for a candidate with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).
  
  For ALL question types, include a mix of formats:
  1. Open-ended questions requiring detailed responses - Use answerFormat: "text"
  2. Multiple choice questions - Include 4-5 answer choices with one best answer. Use answerFormat: "mcq"
  
  For technical questions:
  - Include some coding questions with example test cases - Use answerFormat: "code"
  
  For language proficiency questions:
  - Include some audio response questions - Use answerFormat: "audio"
  
  Please generate questions divided as follows:`;
  
  config.types.forEach(type => {
    const typeQuestions = questionsPerType + (remainingQuestions > 0 ? 1 : 0);
    if (remainingQuestions > 0) remainingQuestions--;
    
    combinedPrompt += `
    - ${typeQuestions} "${type}" type questions`;
  });
  
  combinedPrompt += `
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: the question type (one of ${config.types.join(', ')})
  - answerFormat: "text", "code", "mcq", or "audio" depending on question type
  - options: array of strings for MCQ choices (only for MCQs)
  - correctOption: integer index of the correct option (only for MCQs)
  - testCases: array of objects with "input" and "expectedOutput" fields (only for coding questions)`;
  
  return combinedPrompt;
};

// Map difficulty level to years of experience
const mapDifficultyToExperience = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '0-2';
    case 'medium':
      return '2-5';
    case 'hard':
      return '5+';
    default:
      return '2-5';
  }
};

// Call the Gemini API with the constructed prompt
const callGeminiAPI = async (prompt: string): Promise<any> => {
  try {
    console.log('Calling Gemini API with prompt:', prompt);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    console.log('Gemini API response:', data);
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // For testing purposes, if API fails, fall back to mock data
    console.warn('Falling back to mock questions');
    return generateMockResponse();
  }
};

// Parse the response from Gemini API and convert to Question[] format
const parseQuestionsFromResponse = (response: any, config: InterviewConfig): Question[] => {
  try {
    // Try to extract JSON from the response
    let questionsData;
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      const content = response.candidates[0].content.parts[0]?.text;
      
      // Try to find JSON in the content
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questionsData = JSON.parse(jsonMatch[0]);
      } else {
        // If no JSON array found, try to parse the entire content
        try {
          questionsData = JSON.parse(content);
        } catch (e) {
          console.error('Failed to parse JSON from content:', e);
          // Extract question-like structures from text if JSON parsing fails
          questionsData = extractQuestionsFromText(content, config);
        }
      }
    } else if (response.questions) {
      // This is for mock response format
      questionsData = response.questions;
    } else {
      throw new Error('Unexpected response format from API');
    }
    
    // Convert parsed data to Question[] format
    return questionsData.map((q: any, index: number) => {
      const questionObj: Question = {
        id: q.id || `q-${index + 1}`,
        content: q.content || q.question || `Question ${index + 1}`,
        type: q.type || config.types[0] || 'technical',
        answerFormat: q.answerFormat || getDefaultAnswerFormat(q.type || config.types[0])
      };
      
      // Add MCQ options if available
      if (q.options && Array.isArray(q.options) && q.options.length > 0) {
        questionObj.options = q.options;
        
        // Add correct option if available (only used internally)
        if (q.correctOption !== undefined) {
          questionObj.correctOption = q.correctOption;
        }
      }
      
      // Add test cases for coding questions if available
      if (q.testCases && Array.isArray(q.testCases)) {
        questionObj.testCases = q.testCases;
      }
      
      return questionObj;
    }).slice(0, config.questions); // Ensure we only return the requested number of questions
  } catch (error) {
    console.error('Error parsing questions from response:', error);
    // Fall back to mock questions if parsing fails
    return generateMockQuestions(config);
  }
};

// Extract questions from unstructured text when JSON parsing fails
const extractQuestionsFromText = (text: string, config: InterviewConfig): any[] => {
  const questions = [];
  const questionLines = text.split(/\d+[\.\)]\s/).filter(line => line.trim().length > 0);
  
  for (let i = 0; i < Math.min(questionLines.length, config.questions); i++) {
    const content = questionLines[i].trim();
    if (content) {
      const type = determineQuestionType(content, config.types[0]);
      const answerFormat = determineAnswerFormat(content, type);
      
      // Create base question object
      const question: any = {
        id: `q-${i + 1}`,
        content: content,
        type: type,
        answerFormat: answerFormat
      };
      
      // For MCQs, try to extract options from content
      if (answerFormat === 'mcq') {
        const options = extractMCQOptions(content);
        if (options && options.length > 0) {
          question.options = options;
          question.correctOption = 0; // Default to first option as correct
        }
      }
      
      // For code questions, create simple test cases
      if (answerFormat === 'code') {
        question.testCases = [
          { input: "example input", expectedOutput: "expected output" }
        ];
      }
      
      questions.push(question);
    }
  }
  
  return questions;
};

// Extract MCQ options from text
const extractMCQOptions = (content: string): string[] | null => {
  // Look for patterns like "a) option" or "A. option" or "1. option"
  const optionMatches = content.match(/(?:^|\n)(?:[a-d][\)\.]|[A-D][\)\.:]|[1-4][\)\.:])\s*(.+?)(?=(?:\n(?:[a-d][\)\.]|[A-D][\)\.:]|[1-4][\)\.:])|$))/g);
  
  if (optionMatches && optionMatches.length > 0) {
    // Extract just the option text without the prefix
    return optionMatches.map(option => {
      return option.replace(/(?:^|\n)(?:[a-d][\)\.]|[A-D][\)\.:]|[1-4][\)\.:])\s*/, '').trim();
    });
  }
  
  // If no structured options found, create generic ones
  return [
    "Option A", 
    "Option B", 
    "Option C", 
    "Option D"
  ];
};

// Determine question type from content
const determineQuestionType = (content: string, defaultType: string): string => {
  const content_lower = content.toLowerCase();
  
  if (content_lower.includes('code') || content_lower.includes('algorithm') || 
      content_lower.includes('implement') || content_lower.includes('function')) {
    return 'technical';
  }
  
  if (content_lower.includes('describe a time') || content_lower.includes('tell me about') || 
      content_lower.includes('how would you handle') || content_lower.includes('situation where')) {
    return 'behavioral';
  }
  
  if (content_lower.includes('explain') || content_lower.includes('describe') || 
      content_lower.includes('communicate') || content_lower.includes('present')) {
    return 'communication';
  }
  
  return defaultType;
};

// Determine answer format from content or type
const determineAnswerFormat = (content: string, type: string): string => {
  const content_lower = content.toLowerCase();
  
  // Check for MCQ patterns
  if (content_lower.match(/(?:^|\n)(?:[a-d][\)\.]|[A-D][\)\.:]|[1-4][\)\.:])\s*(.+?)(?=(?:\n(?:[a-d][\)\.]|[A-D][\)\.:]|[1-4][\)\.:])|$))/)) {
    return 'mcq';
  }
  
  if (content_lower.includes('code') || content_lower.includes('implement function') || 
      content_lower.includes('write a program') || 
      (type === 'technical' && content_lower.includes('algorithm'))) {
    return 'code';
  }
  
  if (type === 'language' || content_lower.includes('pronounce') || 
      content_lower.includes('speak') || content_lower.includes('audio')) {
    return 'audio';
  }
  
  return 'text';
};

// Get default answer format based on question type
const getDefaultAnswerFormat = (type: string): string => {
  switch (type) {
    case 'technical':
      return Math.random() > 0.5 ? 'code' : 'text';
    case 'language':
      return Math.random() > 0.5 ? 'audio' : 'text';
    default:
      return 'text';
  }
};

// Generate mock response for testing or API fallback
const generateMockResponse = () => {
  return {
    questions: [
      {
        id: "q-1",
        content: "Implement a function to find the longest substring without repeating characters.",
        type: "technical",
        answerFormat: "code",
        testCases: [
          { input: "abcabcbb", expectedOutput: "abc" },
          { input: "bbbbb", expectedOutput: "b" },
          { input: "pwwkew", expectedOutput: "wke" }
        ]
      },
      {
        id: "q-2",
        content: "Which data structure would be most appropriate for implementing a task scheduler with priority levels?",
        type: "technical",
        answerFormat: "mcq",
        options: [
          "Array",
          "Priority Queue",
          "Hash Table",
          "Linked List"
        ],
        correctOption: 1
      },
      {
        id: "q-3", 
        content: "Tell me about a time when you had to resolve a conflict within your team. What was your approach and what was the outcome?",
        type: "behavioral",
        answerFormat: "text"
      },
      {
        id: "q-4",
        content: "In a team meeting, a colleague presents an idea that you believe has serious flaws. How would you handle this situation?",
        type: "behavioral",
        answerFormat: "mcq",
        options: [
          "Wait until after the meeting and speak to them privately",
          "Immediately point out all the flaws in front of everyone",
          "Ask probing questions to help them discover the flaws themselves",
          "Say nothing and let them figure it out later"
        ],
        correctOption: 2
      },
      {
        id: "q-5",
        content: "Explain the concept of cloud computing to someone without a technical background.",
        type: "communication",
        answerFormat: "text"
      },
      {
        id: "q-6",
        content: "Record yourself pronouncing these technical terms correctly: API, SQL, HTTPS, and IoT.",
        type: "language",
        answerFormat: "audio"
      }
    ]
  };
};

// Generate mock questions (fallback if API fails)
const generateMockQuestions = (config: InterviewConfig): Question[] => {
  const questions: Question[] = [];
  const questionTypes = config.types;
  
  // Generate questions based on configuration
  for (let i = 0; i < config.questions; i++) {
    // Cycle through question types
    const type = questionTypes[i % questionTypes.length] as 'technical' | 'behavioral' | 'communication' | 'language';
    
    // Decide on answer format - mix it up
    let answerFormat: 'text' | 'code' | 'mcq' | 'audio';
    
    if (i % 3 === 0) {
      answerFormat = 'mcq'; // Every 3rd question is MCQ
    } else if (type === 'technical' && i % 2 === 0) {
      answerFormat = 'code'; // Half of technical questions are code
    } else if (type === 'language' && i % 2 === 0) {
      answerFormat = 'audio'; // Half of language questions are audio
    } else {
      answerFormat = 'text'; // Default to text
    }
    
    let question: Question = {
      id: `q-${i + 1}`,
      content: '',
      type: type,
      answerFormat: answerFormat,
    };
    
    // Generate question content based on type, difficulty and answer format
    switch (type) {
      case 'technical':
        if (answerFormat === 'mcq') {
          question.content = 'Which of the following is NOT a valid way to declare a variable in JavaScript?';
          question.options = [
            'let x = 5;',
            'const y = 10;',
            'var z = 15;',
            'int w = 20;'
          ];
          question.correctOption = 3;
        } else if (answerFormat === 'code') {
          question.content = 'Implement a function to find the longest substring without repeating characters.';
          question.testCases = [
            { input: "abcabcbb", expectedOutput: "abc" },
            { input: "bbbbb", expectedOutput: "b" }
          ];
        } else {
          question.content = 'Explain the differences between REST and GraphQL APIs and when you would choose one over the other.';
        }
        break;
        
      case 'behavioral':
        if (answerFormat === 'mcq') {
          question.content = 'Your team is falling behind on a critical project deadline. What would be your FIRST action?';
          question.options = [
            'Work overtime to complete your tasks',
            'Analyze the bottlenecks and suggest process improvements',
            'Ask management to extend the deadline',
            'Blame the team members who are underperforming'
          ];
          question.correctOption = 1;
        } else {
          question.content = 'Tell me about a time when you had to deal with a team member who wasn\'t pulling their weight. How did you handle the situation?';
        }
        break;
        
      case 'communication':
        if (answerFormat === 'mcq') {
          question.content = 'A non-technical stakeholder asks you why a feature is taking longer than expected. The best approach to communicate this is:';
          question.options = [
            'Provide a detailed technical explanation of all the challenges',
            'Simply state it\'s more complicated than initially thought',
            'Explain the key challenges in non-technical terms and provide a revised timeline',
            'Suggest they speak to your manager instead'
          ];
          question.correctOption = 2;
        } else {
          question.content = 'Explain the concept of cryptocurrency to a non-technical person in under 2 minutes.';
        }
        break;
        
      case 'language':
        if (answerFormat === 'mcq') {
          question.content = 'Which sentence is grammatically correct?';
          question.options = [
            'Between you and I, this project is challenging.',
            'Between you and me, this project is challenging.',
            'Between yourself and I, this project is challenging.',
            'Between yourself and me, this project is challenging.'
          ];
          question.correctOption = 1;
        } else if (answerFormat === 'audio') {
          question.content = 'Record yourself explaining what you would do if you encountered a difficult technical problem that you couldn\'t solve immediately.';
        } else {
          question.content = 'Write a professional email requesting additional resources for your project, explaining why they are necessary.';
        }
        break;
    }
    
    questions.push(question);
  }
  
  return questions;
};
