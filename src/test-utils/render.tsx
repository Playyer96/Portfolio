/**
 * Custom Render Utility for Tests
 *
 * Wraps components with necessary providers
 * Re-exports everything from @testing-library/react
 */

import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

/**
 * All Providers Wrapper
 *
 * Wraps children with all necessary context providers
 * Add more providers here as they're implemented (ThemeProvider, etc.)
 */
interface AllProvidersProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

const AllProviders: React.FC<AllProvidersProps> = ({
  children,
  initialEntries = ['/']
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
    </MemoryRouter>
  );
};

/**
 * Custom Render Options
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

/**
 * Custom Render Function
 *
 * Wraps @testing-library/react's render with providers
 * Use this instead of the default render in tests
 *
 * @example
 * ```tsx
 * import { render, screen } from '../test-utils/render';
 *
 * test('renders component', () => {
 *   render(<MyComponent />);
 *   expect(screen.getByText('Hello')).toBeInTheDocument();
 * });
 *
 * test('renders at specific route', () => {
 *   render(<MyComponent />, { initialEntries: ['/projects'] });
 * });
 * ```
 */
const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialEntries, ...renderOptions } = options || {};

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllProviders initialEntries={initialEntries}>
      {children}
    </AllProviders>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render with our custom version
export { customRender as render };
