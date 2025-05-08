
import { useState, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    return localStorage.getItem('ai-assistant-voice') === 'true';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get available voices
    const populateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    populateVoices();
    
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }
    
    // Cleanup
    return () => {
      cancel();
    };
  }, []);
  
  // Save voice preference to localStorage
  useEffect(() => {
    localStorage.setItem('ai-assistant-voice', voiceEnabled.toString());
  }, [voiceEnabled]);

  const speak = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a good voice - prefer female voices with good quality
    const preferredVoices = voices.filter(
      voice => voice.lang.startsWith('en-')
    );
    
    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(prev => !prev);
    if (speaking) {
      cancel();
    }
  };

  return {
    speak,
    cancel,
    speaking,
    voices,
    voiceEnabled,
    toggleVoice
  };
};
