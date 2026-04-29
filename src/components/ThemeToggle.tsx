/**
 * Theme Toggle Component
 *
 * Button to switch between light/dark/auto themes
 * Shows appropriate icon based on current theme
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, Theme } from '../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MdBrightnessAuto } from 'react-icons/md';
import './ThemeToggle.scss';

/**
 * Theme Icon Map
 */
const themeIcons = {
  light: FaSun,
  dark: FaMoon,
  auto: MdBrightnessAuto,
};

/**
 * Theme Labels
 */
const themeLabels: Record<Theme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  auto: 'Auto mode (system preference)',
};

/**
 * Theme Toggle Component
 *
 * Displays a button with the current theme icon
 * Cycles through light → auto → dark on click
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const Icon = themeIcons[theme];
  const label = themeLabels[theme];

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={`Switch theme (current: ${label})`}
      title={label}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="theme-toggle__icon"
      >
        <Icon />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
