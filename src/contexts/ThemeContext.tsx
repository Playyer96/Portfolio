/**
 * Theme Context
 *
 * Manages theme state (light/dark/auto) across the application
 * Provides theme switching functionality with system preference detection
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

/**
 * Theme Type
 * - light: Force light theme
 * - dark: Force dark theme
 * - auto: Follow system preference
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Effective Theme (computed from Theme)
 */
export type EffectiveTheme = 'light' | 'dark';

/**
 * Theme Context Value Interface
 */
interface ThemeContextValue {
  theme: Theme;
  effectiveTheme: EffectiveTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * Theme Provider Props
 */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Context
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Local Storage Key
 */
const THEME_STORAGE_KEY = 'portfolio-theme';

/**
 * Get System Preference
 *
 * Detects the user's system color scheme preference
 */
const getSystemPreference = (): EffectiveTheme => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark'; // Default fallback
};

/**
 * Get Initial Theme from Local Storage
 */
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'auto') {
      return stored;
    }
  }
  return 'dark'; // Default to dark theme
};

/**
 * Theme Provider Component
 *
 * Wraps the application and provides theme context
 * Handles system preference detection and localStorage persistence
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [systemPreference, setSystemPreference] = useState<EffectiveTheme>(getSystemPreference);

  /**
   * Calculate Effective Theme
   *
   * If theme is 'auto', use system preference
   * Otherwise, use the selected theme
   */
  const effectiveTheme = useMemo<EffectiveTheme>(() => {
    if (theme === 'auto') {
      return systemPreference;
    }
    return theme;
  }, [theme, systemPreference]);

  /**
   * Set Theme
   *
   * Updates theme state and persists to localStorage
   */
  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  /**
   * Toggle Theme
   *
   * Cycles through: light → auto → dark → light
   */
  const toggleTheme = (): void => {
    const themeOrder: Theme[] = ['light', 'auto', 'dark'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  /**
   * Listen to System Preference Changes
   *
   * Updates effectiveTheme when system preference changes
   * Only relevant when theme is set to 'auto'
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  /**
   * Apply Theme to Document
   *
   * Sets data-theme attribute on <html> element
   */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  /**
   * Provide Theme Context
   */
  const value: ThemeContextValue = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * useTheme Hook
 *
 * Access theme context from any component
 *
 * @example
 * ```tsx
 * const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
