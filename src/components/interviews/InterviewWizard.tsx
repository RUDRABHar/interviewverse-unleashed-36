
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface InterviewWizardProps {
  onComplete: () => void;
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const InterviewWizard: React.FC<InterviewWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    types: [] as string[],
    questions: 10,
    duration: 30,
    difficulty: 'medium',
    language: 'english',
    domain: '',
    mode: 'ai-only'
  });
  
  const totalSteps = 7;
  
  const updateSelection = (key: string, value: any) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleType = (type: string) => {
    setSelections(prev => {
      const types = [...prev.types];
      if (types.includes(type)) {
        return { ...prev, types: types.filter(t => t !== type) };
      } else {
        return { ...prev, types: [...types, type] };
      }
    });
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final step - start interview
      startInterview();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(1);
    setSelections({
      types: [],
      questions: 10,
      duration: 30,
      difficulty: 'medium',
      language: 'english',
      domain: '',
      mode: 'ai-only'
    });
  };
  
  const startInterview = () => {
    // Validate selections
    if (selections.types.length === 0) {
      toast.error("Please select at least one interview type");
      return;
    }

    if (!selections.domain) {
      toast.error("Please select a domain");
      return;
    }
    
    try {
      // Generate a unique ID for this interview
      const interviewId = `interview-${Date.now()}`;
      
      // Store interview configuration in localStorage (in a real app, this would go to a database)
      localStorage.setItem(`interview_config_${interviewId}`, JSON.stringify(selections));
      
      // Notify parent component that configuration is complete
      onComplete();
      
      // Navigate to the interview screen - using the correct route path
      navigate(`/interviews/${interviewId}`);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast.error("Failed to start interview. Please try again.");
    }
  };
  
  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical',
      description: 'Domain-specific technical skills assessment',
      icon: '💻'
    },
    {
      id: 'behavioral',
      title: 'Behavioral',
      description: 'Assess soft skills and culture fit',
      icon: '🤝'
    },
    {
      id: 'communication',
      title: 'Communication',
      description: 'Evaluate clarity, tone, and articulation',
      icon: '💬'
    },
    {
      id: 'language',
      title: 'Language Proficiency',
      description: 'Test language skills for specific roles',
      icon: '🌐'
    }
  ];

  const domainOptions = [
    { value: "software_engineering", label: "Software Engineering" },
    { value: "data_science", label: "Data Science" },
    { value: "product_management", label: "Product Management" },
    { value: "ux_design", label: "UX/UI Design" },
    { value: "marketing", label: "Marketing" },
    { value: "sales", label: "Sales" },
    { value: "finance", label: "Finance" },
    { value: "hr", label: "Human Resources" },
    { value: "customer_success", label: "Customer Success" },
    { value: "operations", label: "Operations" },
    { value: "legal", label: "Legal" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" }
  ];
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold dark:text-white">Configure Your Interview</h2>
        <div className="flex space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-gradient-to-r from-orange-500 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step Content */}
      <div className="min-h-[400px] flex flex-col justify-between">
        <div className="flex-1">
          {currentStep === 1 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Select Interview Types</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose one or more interview formats</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewTypes.map(type => (
                  <div 
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg flex items-start space-x-4
                      ${selections.types.includes(type.id) 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className="text-3xl">{type.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium dark:text-white">{type.title}</h4>
                        {selections.types.includes(type.id) && (
                          <CheckIcon className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {currentStep === 2 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Number of Questions</h3>
              <p className="text-gray-600 dark:text-gray-300">Select how many questions you'd like in your interview</p>
              
              <div className="space-y-8">
                <Slider
                  defaultValue={[selections.questions]}
                  min={5}
                  max={20}
                  step={5}
                  onValueChange={(value) => updateSelection('questions', value[0])}
                  className="my-8"
                />
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">5</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">10</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">15</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">20</span>
                </div>
                
                <div className="text-center">
                  <span className="text-2xl font-bold dark:text-white">{selections.questions}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Estimated time: {selections.questions * 2} minutes
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <span className="font-bold">AI Recommendation:</span> 10 questions is optimal for a balanced interview experience.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {currentStep === 3 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Total Duration</h3>
              <p className="text-gray-600 dark:text-gray-300">How long would you like your interview to be?</p>
              
              <div className="space-y-6">
                <Select 
                  defaultValue={String(selections.duration)} 
                  onValueChange={(value) => updateSelection('duration', parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average time per question</span>
                    <span className="font-medium dark:text-white">
                      {(selections.duration / selections.questions).toFixed(1)} mins
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {currentStep === 4 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Difficulty Level</h3>
              <p className="text-gray-600 dark:text-gray-300">Select the experience level</p>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div 
                  onClick={() => updateSelection('difficulty', 'easy')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md
                    ${selections.difficulty === 'easy' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow' 
                      : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="text-center mb-2">
                    <span className="inline-block bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs px-2 py-1 rounded-full">EASY</span>
                  </div>
                  <h4 className="text-center font-medium dark:text-white">0-2 years experience</h4>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Ideal for freshers and juniors</p>
                </div>
                
                <div 
                  onClick={() => updateSelection('difficulty', 'medium')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md
                    ${selections.difficulty === 'medium' 
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow' 
                      : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="text-center mb-2">
                    <span className="inline-block bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 text-xs px-2 py-1 rounded-full">MEDIUM</span>
                  </div>
                  <h4 className="text-center font-medium dark:text-white">2-5 years experience</h4>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Mid-level professionals</p>
                </div>
                
                <div 
                  onClick={() => updateSelection('difficulty', 'hard')}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md
                    ${selections.difficulty === 'hard' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow' 
                      : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="text-center mb-2">
                    <span className="inline-block bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 text-xs px-2 py-1 rounded-full">HARD</span>
                  </div>
                  <h4 className="text-center font-medium dark:text-white">5+ years experience</h4>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">Senior-level positions</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Select Domain</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose the relevant professional field</p>
              
              <div className="space-y-4">
                <Select 
                  value={selections.domain} 
                  onValueChange={(value) => updateSelection('domain', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domainOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Domain selection</span> helps our AI generate more relevant questions aligned with your industry and role.
                  </p>
                </div>

                {selections.types.includes('technical') && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      <span className="font-medium">Note:</span> For technical interviews, domain selection determines the specific technical questions you'll receive.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {currentStep === 6 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Preferred Language</h3>
              <p className="text-gray-600 dark:text-gray-300">Select interview language</p>
              
              <div className="space-y-4">
                <Select 
                  defaultValue={selections.language} 
                  onValueChange={(value) => updateSelection('language', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">🇺🇸 English</SelectItem>
                    <SelectItem value="spanish">🇪🇸 Spanish</SelectItem>
                    <SelectItem value="french">🇫🇷 French</SelectItem>
                    <SelectItem value="german">🇩🇪 German</SelectItem>
                    <SelectItem value="chinese">🇨🇳 Chinese (Mandarin)</SelectItem>
                    <SelectItem value="hindi">🇮🇳 Hindi</SelectItem>
                    <SelectItem value="japanese">🇯🇵 Japanese</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Note:</span> Our AI provides the most comprehensive feedback in English. Other language support may have varying levels of depth.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {currentStep === 7 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium dark:text-white">Summary</h3>
              <p className="text-gray-600 dark:text-gray-300">Review your interview configuration</p>
              
              <div className="space-y-4 border rounded-lg p-4 dark:border-gray-700">
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Interview Types</span>
                  <span className="font-medium dark:text-white">
                    {selections.types.length > 0 
                      ? selections.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
                      : 'None selected'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Questions</span>
                  <span className="font-medium dark:text-white">{selections.questions}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Duration</span>
                  <span className="font-medium dark:text-white">{selections.duration} minutes</span>
                </div>
                
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Difficulty</span>
                  <span className="font-medium dark:text-white capitalize">{selections.difficulty}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">Domain</span>
                  <span className="font-medium dark:text-white">
                    {domainOptions.find(d => d.value === selections.domain)?.label || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-300">Language</span>
                  <span className="font-medium dark:text-white capitalize">{selections.language}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <div>
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            
            <Button 
              onClick={handleNext}
              className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white flex items-center space-x-2 ${
                (currentStep === 1 && selections.types.length === 0) || 
                (currentStep === 5 && !selections.domain)
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              disabled={
                (currentStep === 1 && selections.types.length === 0) ||
                (currentStep === 5 && !selections.domain)
              }
            >
              <span>{currentStep === totalSteps ? 'Start Interview' : 'Next'}</span>
              {currentStep !== totalSteps && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
