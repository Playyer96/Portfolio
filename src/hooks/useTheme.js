import { useState, useEffect } from 'react';

const useTheme = () => {
  const [theme, setTheme] = useState('dark');
  const [accent, setAccent] = useState('lime');

  useEffect(() => {
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
      rootDiv.setAttribute('data-theme', theme);
      rootDiv.setAttribute('data-accent', accent);
    }
  }, [theme, accent]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  const setAccentColor = (color) => {
    if (['lime', 'cyan', 'amber', 'magenta'].includes(color)) {
      setAccent(color);
    }
  };

  return {
    theme,
    accent,
    toggleTheme,
    setAccent: setAccentColor,
  };
};

export default useTheme;
