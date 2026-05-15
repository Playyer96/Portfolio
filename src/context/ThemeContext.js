import React, { createContext, useContext, useState } from 'react';
import { VALID_ACCENTS } from '../constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState(() =>
    VALID_ACCENTS[Math.floor(Math.random() * VALID_ACCENTS.length)]
  );

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const updateAccent = (newAccent) => {
    if (VALID_ACCENTS.includes(newAccent)) {
      setAccent(newAccent);
    }
  };

  const value = {
    theme,
    accent,
    toggleTheme,
    setAccent: updateAccent,
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-accent', accent);
  }, [theme, accent]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};
