/**
 * React Router DOM Mock for Jest
 *
 * Provides minimal mock implementation for testing
 */

import React from 'react';

// Mock location object
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Mock navigate function
const mockNavigate = jest.fn();

// Mock MemoryRouter
export const MemoryRouter: React.FC<{
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({ children, initialEntries = ['/'] }) => {
  // Update mock location based on initialEntries
  if (initialEntries.length > 0) {
    mockLocation.pathname = initialEntries[0];
  }
  return <>{children}</>;
};

// Mock BrowserRouter
export const BrowserRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

// Mock Link component
export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className, onClick }) => (
  <a href={to} className={className} onClick={onClick}>
    {children}
  </a>
);

// Mock NavLink component
export const NavLink = Link;

// Mock useLocation hook
export const useLocation = jest.fn(() => mockLocation);

// Mock useNavigate hook
export const useNavigate = jest.fn(() => mockNavigate);

// Mock useParams hook
export const useParams = jest.fn(() => ({}));

// Mock Routes and Route components
export const Routes: React.FC<{ children: React.ReactNode; location?: any }> = ({ children }) => (
  <>{children}</>
);

export const Route: React.FC<{ path?: string; element?: React.ReactNode }> = ({ element }) => (
  <>{element}</>
);

// Helper to update mock location for tests
export const __setMockLocation = (pathname: string) => {
  mockLocation.pathname = pathname;
  useLocation.mockReturnValue(mockLocation);
};

// Helper to reset mocks
export const __resetMocks = () => {
  mockLocation.pathname = '/';
  mockNavigate.mockClear();
  useLocation.mockReturnValue(mockLocation);
};
