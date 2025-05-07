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
    toast.error('Failed to generate interview questions. Please try again.');
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
  let domainContext = "";
  
  // Domain-specific customization
  if (config.domain) {
    switch (config.domain.toLowerCase()) {
      case 'web development':
        domainContext = "Focus on frontend/backend technologies like React, Node.js, API design, and full-stack concepts. Include questions about web performance, accessibility, and responsive design.";
        break;
      case 'data science':
        domainContext = "Focus on data analysis, machine learning, statistical methods, and data visualization. Include questions about Python libraries like pandas, scikit-learn, and real-world data problems.";
        break;
      case 'mobile development':
        domainContext = "Focus on mobile app architecture, React Native, Swift, Kotlin, and mobile UX/UI concepts. Include questions about performance optimization for mobile and offline capabilities.";
        break;
      case 'devops':
        domainContext = "Focus on CI/CD pipelines, containerization (Docker, Kubernetes), infrastructure as code, and cloud platforms (AWS, Azure, GCP). Include questions about scaling and monitoring systems.";
        break;
      case 'cybersecurity':
        domainContext = "Focus on security principles, threat modeling, encryption, penetration testing, and secure coding practices. Include questions about common vulnerabilities and mitigation strategies.";
        break;
      default:
        domainContext = `Focus on ${config.domain} specific knowledge including best practices, common tools, and industry standards.`;
    }
  }

  return `You are an expert technical interviewer for ${config.domain || 'tech'} roles. Generate ${config.questions} high-quality technical interview questions in ${config.language} suitable for a candidate with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  ${domainContext}

  The questions should test real-world problem-solving skills, domain expertise, algorithms, system thinking, and technical communication. Ensure questions cover a broad range of core subtopics in ${config.domain || 'the technical field'}.
  
  Include a MIX of different question formats with the following EXACT distribution:
  1. Coding questions (40% of questions) - Include test cases with specific example inputs and expected outputs
  2. Multiple choice questions (30% of questions) - Include 4-5 answer choices per question and mark which one is correct (but this won't be shown to the user)
  3. Short answer technical questions (30% of questions)
  
  IMPORTANT: Make questions COMPLETELY DISTINCT from other question types like behavioral, communication, or language. Focus EXCLUSIVELY on technical skills and knowledge.
  
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
  let domainContext = "";
  
  // Domain-specific customization
  if (config.domain) {
    switch (config.domain.toLowerCase()) {
      case 'leadership':
        domainContext = "Focus on leadership challenges, team management, mentoring junior employees, and handling complex stakeholder situations.";
        break;
      case 'customer service':
        domainContext = "Focus on handling difficult customer interactions, service recovery, managing expectations, and maintaining composure under pressure.";
        break;
      case 'project management':
        domainContext = "Focus on managing project deadlines, resource allocation, scope creep, and cross-functional team coordination.";
        break;
      case 'sales':
        domainContext = "Focus on relationship building, negotiation scenarios, handling rejections, and adapting sales strategies to different clients.";
        break;
      case 'healthcare':
        domainContext = "Focus on patient care scenarios, medical ethics, interdisciplinary collaboration, and handling sensitive health information.";
        break;
      default:
        domainContext = `Focus on ${config.domain} specific behavioral scenarios including typical workplace challenges in this field.`;
    }
  }

  return `You are an HR expert conducting behavioral interviews. Generate ${config.questions} behavioral interview questions in ${config.language} for a candidate applying to a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  ${domainContext}
  
  These questions should evaluate:
  - Past behavior and mindset
  - Problem ownership and leadership potential
  - Conflict resolution and team interaction
  - Adaptability and decision-making
  
  Include a mix of formats with the following EXACT distribution:
  1. Open-ended STAR format questions (60% of questions) - Use answerFormat: "text"
  2. Multiple choice scenario questions (40% of questions) - Include 4-5 answer choices that represent different approaches to handling a situation, with one being the most appropriate. Use answerFormat: "mcq"
  
  IMPORTANT: Make questions COMPLETELY DISTINCT from other question types like technical, communication, or language. Focus EXCLUSIVELY on past behaviors and situations.
  
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
  let domainContext = "";
  
  // Domain-specific customization
  if (config.domain) {
    switch (config.domain.toLowerCase()) {
      case 'marketing':
        domainContext = "Focus on brand messaging, campaign communication, audience targeting, and persuasive content creation.";
        break;
      case 'teaching':
        domainContext = "Focus on explaining complex concepts, adapting communication styles to different learning needs, and providing constructive feedback.";
        break;
      case 'management':
        domainContext = "Focus on team announcements, performance reviews, delegating tasks, and building rapport with direct reports.";
        break;
      case 'public relations':
        domainContext = "Focus on crisis communications, media interactions, spokesperson responsibilities, and maintaining brand voice.";
        break;
      case 'customer success':
        domainContext = "Focus on onboarding communications, troubleshooting guidance, upselling conversations, and maintaining customer relationships.";
        break;
      default:
        domainContext = `Focus on ${config.domain} specific communication challenges including how to effectively convey information in this field.`;
    }
  }

  return `You are assessing professional communication skills. Generate ${config.questions} interview questions in ${config.language} that evaluate communication ability for a candidate in a ${config.domain || 'professional'} role with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  ${domainContext}
  
  The questions should assess:
  - Clarity of thought
  - Verbal articulation
  - Active listening and empathy
  - Presentation or storytelling abilities
  
  Include a mix of formats with the following EXACT distribution:
  1. Scenario-based open questions (50% of questions) - Use answerFormat: "text"
  2. Multiple choice questions about communication strategies (30% of questions) - Include 4-5 answer choices with one best answer. Use answerFormat: "mcq"
  3. Role-play scenarios requiring response preparation (20% of questions) - Use answerFormat: "text"
  
  IMPORTANT: Make questions COMPLETELY DISTINCT from other question types like technical, behavioral, or language. Focus EXCLUSIVELY on communication skills.
  
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
  let domainContext = "";
  const targetLanguage = config.language || 'English';
  
  // Domain-specific customization
  if (config.domain) {
    switch (config.domain.toLowerCase()) {
      case 'international business':
        domainContext = "Focus on business negotiation vocabulary, formal email writing, and cross-cultural communication norms.";
        break;
      case 'tourism':
        domainContext = "Focus on hospitality phrases, local cultural knowledge explanation, and handling diverse customer requests.";
        break;
      case 'academia':
        domainContext = "Focus on academic vocabulary, presenting research findings, and scholarly discussion phrases.";
        break;
      case 'technology':
        domainContext = "Focus on technical documentation, explaining technical concepts to non-technical audiences, and industry-specific terminology.";
        break;
      case 'healthcare':
        domainContext = "Focus on medical terminology, patient communication, and explaining treatments in accessible language.";
        break;
      default:
        domainContext = `Focus on ${config.domain} specific language usage including specialized vocabulary and communication styles in this field.`;
    }
  }

  return `You are testing practical ${targetLanguage} language proficiency of a candidate. Generate ${config.questions} language-based interview questions suitable for a ${config.domain || 'professional'} professional with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).

  ${domainContext}
  
  Questions should assess:
  - Grammar, vocabulary, sentence construction
  - Reading understanding
  - Written expression
  - Language usage in professional contexts
  
  Include a mix of formats with the following EXACT distribution:
  1. Open-ended questions requiring detailed responses (40% of questions) - Use answerFormat: "text"
  2. Multiple choice language questions (40% of questions) - Include 4-5 answer choices with one correct answer. Use answerFormat: "mcq"
  3. Reading comprehension questions (20% of questions) - Include a short passage followed by questions. Use answerFormat: "text" or "mcq"
  
  IMPORTANT: Make questions COMPLETELY DISTINCT from other question types like technical, behavioral, or communication. Focus EXCLUSIVELY on language proficiency.
  
  Use context from ${config.domain || 'the professional field'} to make it professionally relevant. Format should be suitable for digital UI delivery.
  
  Return the response as a valid JSON array of objects, where each object has these properties:
  - id: a unique string identifier
  - content: the full question text
  - type: "language"
  - answerFormat: "text" or "mcq" depending on question type
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
  
  // Domain-specific instructions
  let domainInstructions = "";
  if (config.domain) {
    domainInstructions = `
    Apply the following domain-specific focus based on the question type:
    
    - For technical questions about ${config.domain}: Focus on technical skills, tools, and knowledge specific to ${config.domain}.
    - For behavioral questions about ${config.domain}: Focus on typical workplace situations and challenges in ${config.domain} environments.
    - For communication questions about ${config.domain}: Focus on communication scenarios common in ${config.domain} contexts.
    - For language questions about ${config.domain}: Focus on vocabulary and expressions commonly used in ${config.domain}.
    
    Each question type should be CLEARLY DISTINCT from other types, with no overlap in content or format.`;
  }
  
  let combinedPrompt = `Generate ${config.questions} professional interview questions divided across ${config.types.length} different question types for a ${config.domain || 'professional'} role. 

  Questions should be in ${config.language} and suitable for a candidate with ${mapDifficultyToExperience(config.difficulty)} years of experience (Difficulty: ${config.difficulty}).
  
  ${domainInstructions}
  
  IMPORTANT: Ensure that each question type is DISTINCTLY DIFFERENT from others:
  - Technical questions should focus EXCLUSIVELY on skills, knowledge, and problem-solving
  - Behavioral questions should focus EXCLUSIVELY on past actions and reactions to situations
  - Communication questions should focus EXCLUSIVELY on articulation, presentation, and interpersonal skills
  - Language questions should focus EXCLUSIVELY on grammar, vocabulary, and language usage
  
  For ALL question types, include a mix of formats:
  1. Open-ended questions requiring detailed responses - Use answerFormat: "text"
  2. Multiple choice questions - Include 4-5 answer choices with one best answer. Use answerFormat: "mcq"
  
  For technical questions only:
  - Include some coding questions with example test cases - Use answerFormat: "code"
  
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
  - answerFormat: "text", "code", or "mcq" depending on question type
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
    toast.info('Connecting to Gemini AI...');
    
    // Updated to use gemini-2.0-flash model instead of gemini-pro
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
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
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || 'Unknown API error';
      } catch (e) {
        errorMessage = `API error: ${response.status} - ${errorText || 'Unknown error'}`;
      }
      
      toast.error(`Gemini API error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Gemini API response:', data);
    
    // Check if the response contains expected data structure
    if (!data.candidates || !data.candidates[0]?.content?.parts) {
      console.error('Invalid response format from Gemini API:', data);
      toast.error('Received invalid response format from Gemini API');
      throw new Error('Invalid response format from Gemini API');
    }
    
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    toast.error(`API error: ${error instanceof Error ? error.message : 'Connection failed'}`);
    
    // For testing purposes, only fall back to mock data in development
    if (import.meta.env.DEV) {
      console.warn('Development mode: Falling back to mock questions');
      toast.warning('Using mock questions for development');
      return generateMockResponse();
    } else {
      // In production, we should inform the user and fail properly
      throw error;
    }
  }
};

// Parse the response from Gemini API and convert to Question[] format
const parseQuestionsFromResponse = (response: any, config: InterviewConfig): Question[] => {
  try {
    // Try to extract JSON from the response
    let questionsData;
    
    if (response.candidates && response.candidates[0]?.content?.parts) {
      const content = response.candidates[0].content.parts[0]?.text;
      
      if (!content) {
        console.error('Empty response content from Gemini API');
        toast.error('Received empty response from Gemini API');
        throw new Error('Empty response from Gemini API');
      }
      
      console.log('Parsing response content:', content);
      
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
          toast.error('Failed to parse questions from API response');
          // Extract question-like structures from text if JSON parsing fails
          questionsData = extractQuestionsFromText(content, config);
        }
      }
    } else if (response.questions) {
      // This is for mock response format
      questionsData = response.questions;
    } else {
      toast.error('Unexpected response format from Gemini API');
      throw new Error('Unexpected response format from API');
    }
    
    if (!questionsData || !Array.isArray(questionsData) || questionsData.length === 0) {
      console.error('No questions found in API response');
      toast.error('No questions found in API response');
      throw new Error('No questions found in API response');
    }
    
    console.log('Successfully parsed questions:', questionsData.length);
    toast.success(`Generated ${questionsData.length} interview questions`);
    
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
    toast.error('Failed to parse questions from the API response');
    
    // In development, fall back to mock questions
    if (import.meta.env.DEV) {
      toast.warning('Using mock questions instead');
      return generateMockQuestions(config);
    }
    
    // In production, fail properly
    throw error;
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
  
  return 'text';
};

// Get default answer format based on question type
const getDefaultAnswerFormat = (type: string): string => {
  switch (type) {
    case 'technical':
      return Math.random() > 0.5 ? 'code' : 'text';
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
        content: "Which of the following is the most effective way to begin a presentation to senior executives?",
        type: "communication",
        answerFormat: "mcq",
        options: [
          "Start with a lengthy introduction about yourself and your team",
          "Begin with a detailed explanation of the methodology used",
          "Open with the key findings and recommendations upfront",
          "Start with an unrelated joke to break the ice"
        ],
        correctOption: 2
      },
      {
        id: "q-7",
        content: "Select the grammatically correct sentence:",
        type: "language",
        answerFormat: "mcq",
        options: [
          "The team discussed about the new project.",
          "The team discussed the new project.",
          "The team were discussing about the new project.",
          "The team was discussing on the new project."
        ],
        correctOption: 1
      },
      {
        id: "q-8",
        content: "Write a professional email requesting additional resources for your project, explaining why they are necessary.",
        type: "language",
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
    
    // Decide on answer format - mix it up
    let answerFormat: 'text' | 'code' | 'mcq';
    
    if (i % 3 === 0) {
      answerFormat = 'mcq'; // Every 3rd question is MCQ
    } else if (type === 'technical' && i % 2 === 0) {
      answerFormat = 'code'; // Half of technical questions are code
    } else {
      answerFormat = 'text'; // Default to text
    }
    
    let question: Question = {
      id: `q-${i + 1}`,
      content: '',
      type: type,
      answerFormat: answerFormat,
    };
    
    // Generate domain-specific question content
    const domain = config.domain || 'general';
    
    // Generate question content based on type, domain, difficulty and answer format
    switch (type) {
      case 'technical':
        if (domain === 'web development') {
          if (answerFormat === 'mcq') {
            question.content = 'Which of the following is NOT a valid CSS selector?';
            question.options = [
              '#myId',
              '.myClass',
              ':hover',
              '/myElement/'
            ];
            question.correctOption = 3;
          } else if (answerFormat === 'code') {
            question.content = 'Write a JavaScript function that fetches data from an API and handles both success and error cases using Promises.';
            question.testCases = [
              { input: "fetchData('https://api.example.com/data')", expectedOutput: "Returns a promise that resolves with data or rejects with error" }
            ];
          } else {
            question.content = 'Explain the difference between server-side rendering and client-side rendering in web applications.';
          }
        } else if (domain === 'data science') {
          if (answerFormat === 'mcq') {
            question.content = 'Which algorithm is most appropriate for detecting outliers in a dataset?';
            question.options = [
              'Linear Regression',
              'K-means Clustering',
              'Isolation Forest',
              'Naive Bayes'
            ];
            question.correctOption = 2;
          } else if (answerFormat === 'code') {
            question.content = 'Write a Python function to perform a simple linear regression using NumPy.';
            question.testCases = [
              { input: "X = np.array([1, 2, 3, 4, 5]), y = np.array([2, 4, 5, 4, 5])", expectedOutput: "Model with slope and intercept" }
            ];
          } else {
            question.content = 'Explain the bias-variance tradeoff in machine learning models.';
          }
        } else {
          // Generic technical questions
          if (answerFormat === 'mcq') {
            question.content = 'Which of the following is NOT a valid way to improve algorithm efficiency?';
            question.options = [
              'Memoization',
              'Using appropriate data structures',
              'Always using recursion instead of iteration',
              'Time-space tradeoffs'
            ];
            question.correctOption = 2;
          } else if (answerFormat === 'code') {
            question.content = 'Implement a function to check if a string is a palindrome.';
            question.testCases = [
              { input: "racecar", expectedOutput: "true" },
              { input: "hello", expectedOutput: "false" }
            ];
          } else {
            question.content = 'Explain the difference between HTTP and HTTPS protocols.';
          }
        }
        break;
        
      case 'behavioral':
        if (domain === 'leadership') {
          if (answerFormat === 'mcq') {
            question.content = 'Your team member is consistently underperforming. What would be your first approach?';
            question.options = [
              'Immediately escalate to HR',
              'Have a private conversation to understand any challenges they might be facing',
              'Reduce their responsibilities without discussion',
              'Ignore the issue hoping it resolves itself'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'Describe a time when you had to make a difficult decision as a leader. What was the situation, and how did you handle it?';
          }
        } else if (domain === 'customer service') {
          if (answerFormat === 'mcq') {
            question.content = 'A customer is extremely angry about a problem that was not caused by your company. What is the best approach?';
            question.options = [
              'Tell them it\'s not your company\'s fault',
              'Listen empathetically, acknowledge their frustration, and offer solutions',
              'Transfer them to another department',
              'Ask them to calm down before you can help them'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'Tell me about a time when you went above and beyond for a customer. What was the situation and what was the outcome?';
          }
        } else {
          // Generic behavioral questions
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
        }
        break;
        
      case 'communication':
        if (domain === 'marketing') {
          if (answerFormat === 'mcq') {
            question.content = 'You need to explain a complex marketing analytics report to a non-technical client. Which approach is most effective?';
            question.options = [
              'Send the full technical report with all data points',
              'Simplify key insights with visual aids and relate them to business outcomes',
              'Have a technical specialist explain the methodology in detail',
              'Focus only on positive results to keep the client happy'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'How would you craft a message about a product price increase to minimize negative customer reactions?';
          }
        } else if (domain === 'teaching') {
          if (answerFormat === 'mcq') {
            question.content = 'A student is struggling to understand a concept you\'ve explained multiple times. The best approach is:';
            question.options = [
              'Repeat the exact same explanation but louder',
              'Try a completely different approach using visual aids or analogies',
              'Tell them to study harder on their own time',
              'Move on to the next topic and come back later'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'Explain how you would adapt your communication style for students with different learning preferences.';
          }
        } else {
          // Generic communication questions
          if (answerFormat === 'mcq') {
            question.content = 'A non-technical stakeholder asks you why a project is taking longer than expected. The best approach to communicate this is:';
            question.options = [
              'Provide a detailed technical explanation of all the challenges',
              'Simply state it\'s more complicated than initially thought',
              'Explain the key challenges in non-technical terms and provide a revised timeline',
              'Suggest they speak to your manager instead'
            ];
            question.correctOption = 2;
          } else {
            question.content = 'How would you explain a complex technical concept to someone with no technical background?';
          }
        }
        break;
        
      case 'language':
        if (domain === 'international business') {
          if (answerFormat === 'mcq') {
            question.content = 'Which sentence is most appropriate for a formal business email to an international client?';
            question.options = [
              'Hey there, just checking in on that order!',
              'I wanted to follow up regarding your recent purchase.',
              'You need to confirm your order ASAP.',
              'As per my last email, please respond immediately.'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'Write a professional email to a potential international business partner introducing your company and proposing a collaboration.';
          }
        } else if (domain === 'healthcare') {
          if (answerFormat === 'mcq') {
            question.content = 'Which phrase would be most appropriate when explaining a medical procedure to a patient?';
            question.options = [
              'We\'re going to do a bilateral myringotomy with tympanostomy tube insertion.',
              'There\'s a small chance this could be fatal.',
              'We\'ll be making small openings in both eardrums to place tiny tubes that help drain fluid.',
              'It\'s just a standard procedure, don\'t worry about the details.'
            ];
            question.correctOption = 2;
          } else {
            question.content = 'Write a paragraph explaining a common medication\'s side effects in language that would be clear to patients.';
          }
        } else {
          // Generic language questions
          if (answerFormat === 'mcq') {
            question.content = 'Which sentence is grammatically correct?';
            question.options = [
              'Between you and I, this project is challenging.',
              'Between you and me, this project is challenging.',
              'Between yourself and I, this project is challenging.',
              'Between yourself and me, this project is challenging.'
            ];
            question.correctOption = 1;
          } else {
            question.content = 'Write a professional email requesting additional resources for your project, explaining why they are necessary.';
          }
        }
        break;
    }
    
    questions.push(question);
  }
  
  return questions;
};
