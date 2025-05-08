
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useThemeToggle } from '@/hooks/useThemeToggle';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  toggleTheme: () => {},
  setTheme: () => {},
  resolvedTheme: 'light',
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'auto' 
}) => {
  const themeState = useThemeToggle(initialTheme);
  
  // Add a class to the body for animation disabling if needed
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduce-motion');
    }
    
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        document.body.classList.add('reduce-motion');
      } else {
        document.body.classList.remove('reduce-motion');
      }
    };
    
    prefersReducedMotion.addEventListener('change', handleChange);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};
