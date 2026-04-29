/**
 * Jest Setup Configuration
 *
 * This file is automatically executed before each test file
 * Sets up testing library and global test utilities
 */

import '@testing-library/jest-dom';
import { MotionGlobalConfig } from 'framer-motion';

// Disable Framer Motion animations in tests
MotionGlobalConfig.skipAnimations = true;

// Mock window.matchMedia (for theme system and framer-motion)
// This must be defined before any components are imported
const matchMediaMock = jest.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: matchMediaMock,
});

// Also set on global for good measure
global.matchMedia = matchMediaMock;

// Re-apply mock before each test to ensure it's not cleared
beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: matchMediaMock,
  });
});

// Mock IntersectionObserver (used in scroll animations)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Suppress console errors/warnings in tests (optional)
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args) => {
    // Allow certain errors through
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  });

  console.warn = jest.fn((...args) => {
    // Suppress React Router warnings in tests
    if (
      typeof args[0] === 'string' &&
      args[0].includes('React Router')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
