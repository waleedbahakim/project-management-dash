import { ReactNode, createContext, useContext, useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';

type ThemeContextType = {
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setThemeMode } = useUIStore();

  // Apply the theme based on storage or system preference
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme.mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(systemTheme);
    } else {
      root.classList.remove('light', 'dark');
      root.classList.add(theme.mode);
    }
  }, [theme.mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme.mode === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme.mode]);

  const toggleTheme = () => {
    if (theme.mode === 'light') {
      setThemeMode('dark');
    } else if (theme.mode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: theme.mode, 
      toggleTheme,
      setThemeMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider; 