
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'account' | 'interview' | 'voice' | 'analytics' | 'billing';
}

export interface SupportTicket {
  id?: string;
  category: 'bug' | 'feedback' | 'billing' | 'performance';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  fileUrl?: string;
  status?: 'open' | 'in_progress' | 'resolved';
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useSupportCenter = (userId: string | undefined) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [filteredFAQs, setFilteredFAQs] = useState<FAQItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your InterviewXpert assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch FAQs and user profile
  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // In a real implementation, we would fetch FAQs from Supabase
        // Mock FAQ data for now
        const mockFAQs: FAQItem[] = [
          {
            id: '1',
            question: 'How do I reset my password?',
            answer: 'Go to the Settings page, click on the Security tab, and use the password reset form. You\'ll need to enter your current password for verification.',
            category: 'account'
          },
          {
            id: '2',
            question: 'How can I schedule an interview?',
            answer: 'Navigate to the Interviews page and click on "Schedule New Interview". Follow the wizard to set up your preferred time and interview type.',
            category: 'interview'
          },
          {
            id: '3',
            question: 'Can I retake an interview?',
            answer: 'Yes! Go to your interview history and click the "Retry" button next to any completed interview to take it again with new questions.',
            category: 'interview'
          },
          {
            id: '4',
            question: 'How does voice recognition work?',
            answer: 'Our system uses advanced speech recognition to transcribe your spoken answers. Make sure your microphone is enabled and speak clearly for best results.',
            category: 'voice'
          },
          {
            id: '5',
            question: 'Where can I see my progress over time?',
            answer: 'Check the Analytics page to view detailed charts and insights about your performance trends, strengths, and areas for improvement.',
            category: 'analytics'
          },
          {
            id: '6',
            question: 'How do I upgrade to a premium plan?',
            answer: 'Visit the Billing section in your account settings to see available plans and upgrade options that fit your needs.',
            category: 'billing'
          },
          {
            id: '7',
            question: 'Why can\'t I hear the audio?',
            answer: 'Make sure your device volume is turned up and that you\'ve allowed browser permissions for audio. Try using headphones for a better experience.',
            category: 'voice'
          },
          {
            id: '8',
            question: 'How are interview scores calculated?',
            answer: 'Scores are based on multiple factors including answer completeness, accuracy, communication clarity, and technical correctness relative to industry standards.',
            category: 'interview'
          }
        ];
        
        setFaqItems(mockFAQs);
        setFilteredFAQs(mockFAQs);
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading support data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  // Filter FAQs based on search query and category
  useEffect(() => {
    if (faqItems.length === 0) return;
    
    let filtered = [...faqItems];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory, faqItems]);
  
  // Submit support ticket
  const submitTicket = async (ticket: SupportTicket) => {
    if (!userId) return null;
    
    try {
      setSubmitting(true);
      
      // In a real implementation, we would store the ticket in a Supabase table
      // For now, let's simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a random ticket ID
      const ticketId = `TICKET-${Math.floor(Math.random() * 10000)}`;
      
      toast({
        title: 'Ticket Submitted',
        description: `Your ticket (ID: ${ticketId}) has been submitted successfully.`,
      });
      
      return ticketId;
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit support ticket',
        variant: 'destructive',
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };
  
  // Add a chat message from the user
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Generate a simple response based on keywords in the message
      let response = "I'm not sure how to help with that. Could you please provide more details?";
      
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('password')) {
        response = "To reset your password, go to the Settings page and select the Security tab. You'll find the password reset form there.";
      } else if (lowerMsg.includes('interview') || lowerMsg.includes('practice')) {
        response = "You can schedule a new interview practice session from the Interviews page. We offer technical, behavioral, and system design interviews.";
      } else if (lowerMsg.includes('payment') || lowerMsg.includes('billing')) {
        response = "For billing questions, please visit your Account Settings and go to the Billing tab. You can view your current plan and payment history there.";
      } else if (lowerMsg.includes('feedback')) {
        response = "We value your feedback! You can submit detailed feedback through our ticket system in the Support Center.";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        response = "Hello! How can I assist you with InterviewXpert today?";
      }
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  return {
    loading,
    submitting,
    faqItems,
    filteredFAQs,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    chatMessages,
    sendMessage,
    userProfile,
    submitTicket
  };
};
