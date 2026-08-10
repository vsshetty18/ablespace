'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'ablespace-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Default matches the inline blocking script in layout.tsx so there's
  // no visible flash between server render and hydration.
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    // On mount, sync state with whatever the blocking script already
    // applied to <html> (which read localStorage before React ran).
    const current = document.documentElement.getAttribute('data-theme') as Theme | null;
    if (current) {
      setThemeState(current);
    }
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
