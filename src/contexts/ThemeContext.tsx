
import React, { createContext, useContext, ReactNode } from 'react';
import { useThemeToggle } from '@/hooks/useThemeToggle';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  toggleTheme: () => {},
  setTheme: () => {},
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

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};
