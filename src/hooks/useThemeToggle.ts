
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export const useThemeToggle = (initialTheme: Theme = 'auto') => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const applyTheme = (newTheme: Theme) => {
      const root = window.document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('light', 'dark');
      
      // Handle auto theme based on user preference
      if (newTheme === 'auto') {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
          .matches ? 'dark' : 'light';
        root.classList.add(systemPreference);
      } else {
        // Apply specific theme
        root.classList.add(newTheme);
      }
    };

    // Apply initial theme
    applyTheme(theme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Handler for system preference changes
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [theme]);

  // Toggle between light, dark, and auto
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'auto';
      return 'light';
    });
  };

  // Set a specific theme
  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme
  };
};
