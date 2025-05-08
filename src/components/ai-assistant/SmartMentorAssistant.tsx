
import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Send, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import PremiumCard from '@/components/ui/design-system/PremiumCard';
import GradientText from '@/components/ui/design-system/GradientText';
import { cn } from '@/lib/utils';
import { useAssistantMessages } from '@/hooks/useAssistantMessages';
import { useUserPerformanceSummary } from '@/hooks/useUserPerformanceSummary';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const SmartMentorAssistant = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const { messages, addMessage, clearMessages } = useAssistantMessages();
  const { performanceSummary, isLoadingSummary } = useUserPerformanceSummary();
  const { speak, cancel, speaking, toggleVoice, voiceEnabled } = useSpeechSynthesis();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      if (messages.length === 0) {
        // Add initial greeting when opening for the first time
        setTimeout(() => {
          const greeting = getGreeting();
          addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content: greeting,
            timestamp: new Date()
          });
          
          if (voiceEnabled) {
            speak(greeting);
          }
        }, 500);
      }
    } else {
      // Cancel any ongoing speech when closing
      if (speaking) {
        cancel();
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = performanceSummary?.full_name?.split(' ')[0] || 'there';
    
    if (hour < 12) {
      return `Good morning, ${name}! I'm your InterviewXpert AI assistant. How can I help you with your interview preparation today?`;
    } else if (hour < 17) {
      return `Good afternoon, ${name}! I'm your InterviewXpert AI assistant. What would you like to know about your interview progress?`;
    } else {
      return `Good evening, ${name}! I'm your InterviewXpert AI assistant. Let me know how I can assist with your interview journey today.`;
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    if (isLoading) return;
    
    // Cancel any ongoing speech
    if (speaking) {
      cancel();
    }
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini via Edge Function
      const response = await fetch('/api/generate-mentor-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          performanceData: performanceSummary
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from assistant');
      }
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date()
      };
      
      addMessage(assistantMessage);
      
      // Read response aloud if voice is enabled
      if (voiceEnabled) {
        speak(data.response);
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    autoResize(e);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg bg-interview-primary text-white hover:bg-interview-primary/90 backdrop-blur-sm z-50 h-12 w-12"
        onClick={toggleChat}
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
        {isLoadingSummary && (
          <span className="absolute top-0 right-0 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        )}
      </Button>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed bottom-20 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800",
              isExpanded ? "w-[90vw] h-[80vh] md:w-[600px] md:h-[70vh]" : "w-[90vw] h-[60vh] md:w-[400px] md:h-[500px]"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-interview-primary/10 to-interview-primary/5">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 bg-interview-primary/20">
                  <Bot className="h-5 w-5 text-interview-primary" />
                </Avatar>
                <div>
                  <GradientText className="font-semibold">
                    Interview Mentor AI
                  </GradientText>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by Gemini 1.5
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={toggleVoice}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={toggleExpand}
                >
                  {isExpanded ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={toggleChat}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <PremiumCard className="p-6 max-w-sm mx-auto text-center" glassOpacity="light">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-interview-primary" />
                    <h3 className="text-lg font-medium mb-2">Interview Mentor AI</h3>
                    <p className="text-sm text-muted-foreground">
                      I'll provide personalized interview insights and coaching based on your performance data. Ask me anything!
                    </p>
                  </PremiumCard>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-interview-primary text-white rounded-tr-none"
                            : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
                        )}
                      >
                        {message.content.split('\n').map((text, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {text}
                          </p>
                        ))}
                        <div
                          className={cn(
                            "text-xs mt-1",
                            message.role === "user"
                              ? "text-gray-200"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-tl-none">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your interview performance..."
                    className="min-h-[44px] max-h-[120px] resize-none pr-10"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-10 w-10 rounded-full bg-interview-primary hover:bg-interview-primary/90 text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartMentorAssistant;
