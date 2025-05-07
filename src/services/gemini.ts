
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
  
  Each question should be in the following format:
  - Question Title
  - Question Description (clear, structured, and concise)
  - Optional code snippet or input/output format (if relevant)
  - What interviewer expects as a good answer (answer not shown to user)
  
  Use clear formatting and do not include any hints or answers.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "technical"
  - answerFormat: either "text" or "code" depending on whether coding is required`;
};

// Behavioral interview prompt template
const buildBehavioralPrompt = (config: InterviewConfig): string => {
  return `You are an HR expert conducting behavioral interviews. Generate ${config.questions} behavioral interview questions in ${config.language} for a candidate applying to a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  These questions should evaluate:
  - Past behavior and mindset
  - Problem ownership and leadership potential
  - Conflict resolution and team interaction
  - Adaptability and decision-making
  
  Each question should follow the STAR (Situation, Task, Action, Result) framework where applicable. Avoid repetition and make questions challenging but realistic. Do not include sample answers or explanations.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "behavioral"
  - answerFormat: "text"`;
};

// Communication skills interview prompt template
const buildCommunicationPrompt = (config: InterviewConfig): string => {
  return `You are assessing professional communication skills. Generate ${config.questions} interview questions in ${config.language} that evaluate communication ability for a candidate in a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  The questions should assess:
  - Clarity of thought
  - Verbal articulation
  - Active listening and empathy
  - Presentation or storytelling abilities
  
  Use realistic workplace scenarios or client-facing situations. Include a variety of formats (e.g., scenario-based, response-based). Avoid yes/no questions. Do not include answers.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "communication"
  - answerFormat: "text"`;
};

// Language proficiency interview prompt template
const buildLanguagePrompt = (config: InterviewConfig): string => {
  return `You are testing practical language proficiency of a candidate in ${config.language}. Generate ${config.questions} language-based interview questions suitable for a ${config.domain || 'professional'} professional with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  Questions should assess:
  - Grammar, vocabulary, sentence construction
  - Listening comprehension (if audio questions enabled)
  - Reading understanding
  - Spoken expression and fluency
  
  Use context from ${config.domain || 'the professional field'} to make it professionally relevant. Mix question types such as sentence correction, audio comprehension, short paragraph responses, and spoken tasks. Format should be suitable for digital UI delivery. Do not include correct answers.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "language"
  - answerFormat: "audio"`;
};

// Default prompt as a fallback
const buildDefaultPrompt = (config: InterviewConfig): string => {
  return `Generate ${config.questions} professional interview questions in ${config.language} for a ${config.domain || 'professional'} position with difficulty level ${config.difficulty}.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: one of ${config.types.join(', ')}
  - answerFormat: "text"`;
};

// Handle multiple question types by splitting the requested questions among the types
const buildMultiTypePrompt = (config: InterviewConfig): string => {
  const questionsPerType = Math.floor(config.questions / config.types.length);
  let remainingQuestions = config.questions % config.types.length;
  
  let combinedPrompt = `Generate ${config.questions} professional interview questions divided across ${config.types.length} different question types for a ${config.domain || 'professional'} role. 

  Questions should be in ${config.language} and suitable for a candidate with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).
  
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
  - answerFormat: "text", "code", or "audio" depending on question type`;
  
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
      return {
        id: q.id || `q-${index + 1}`,
        content: q.content || q.question || `Question ${index + 1}`,
        type: q.type || config.types[0] || 'technical',
        answerFormat: q.answerFormat || getDefaultAnswerFormat(q.type || config.types[0])
      };
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
      questions.push({
        id: `q-${i + 1}`,
        content: content,
        type: determineQuestionType(content, config.types[0]),
        answerFormat: determineAnswerFormat(content, config.types[0])
      });
    }
  }
  
  return questions;
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
  
  if (content_lower.includes('code') || content_lower.includes('implement function') || 
      content_lower.includes('write a program') || type === 'technical') {
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
      return 'code';
    case 'language':
      return 'audio';
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
        answerFormat: "code"
      },
      {
        id: "q-2",
        content: "Tell me about a time when you had to resolve a conflict within your team. What was your approach and what was the outcome?",
        type: "behavioral",
        answerFormat: "text"
      },
      {
        id: "q-3",
        content: "Explain the concept of cloud computing to someone without a technical background.",
        type: "communication",
        answerFormat: "text"
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
