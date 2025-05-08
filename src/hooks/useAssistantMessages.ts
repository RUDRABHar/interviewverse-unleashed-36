import { useState, useEffect } from 'react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export const useAssistantMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const storedMessages = localStorage.getItem('assistant-messages');
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
        // Reset if there's an error
        localStorage.removeItem('assistant-messages');
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      // Only keep the 10 most recent messages
      const recentMessages = messages.slice(-10);
      localStorage.setItem('assistant-messages', JSON.stringify(recentMessages));
    }
  }, [messages]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('assistant-messages');
  };

  return { messages, addMessage, clearMessages };
};
