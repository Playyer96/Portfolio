/**
 * Navbar Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import { __setMockLocation, __resetMocks } from '../../__mocks__/react-router-dom';
import Navbar from '../Navbar';

// Use the manual mock for react-router-dom
jest.mock('react-router-dom');

describe('Navbar Component', () => {
  beforeEach(() => {
    __resetMocks();
  });

  describe('Desktop Navigation', () => {
    it('renders logo with correct text', () => {
      render(<Navbar />);

      expect(screen.getByText(/Dani/i)).toBeInTheDocument();
      expect(screen.getByText('<')).toBeInTheDocument();
      expect(screen.getByText('/>')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Navbar />);

      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('CV')).toBeInTheDocument();
    });

    it('highlights active link based on current route', () => {
      __setMockLocation('/projects');
      const { container } = render(<Navbar />);

      const projectsLink = container.querySelector('.navbar__link.active');
      expect(projectsLink).toBeInTheDocument();
      expect(projectsLink).toHaveTextContent('Projects');
    });

    it('applies scrolled class on scroll', () => {
      const { container } = render(<Navbar />);

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);

      waitFor(() => {
        const navbar = container.querySelector('.navbar.scrolled');
        expect(navbar).toBeInTheDocument();
      });
    });
  });

  describe('Mobile Navigation', () => {
    it('renders mobile toggle button', () => {
      render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens mobile menu when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);

      await user.click(toggleButton);

      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
        expect(toggleButton).toHaveClass('open');
      });
    });

    it('closes mobile menu when toggle is clicked again', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);

      // Open menu
      await user.click(toggleButton);
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      });

      // Close menu
      await user.click(toggleButton);
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('displays mobile navigation items when menu is open', async () => {
      const user = userEvent.setup();
      render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);
      await user.click(toggleButton);

      await waitFor(() => {
        const mobileMenu = screen.getByRole('navigation').querySelector('.navbar__mobile');
        expect(mobileMenu).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Links', () => {
    it('logo links to home page', () => {
      const { container } = render(<Navbar />);

      const logoLink = container.querySelector('.navbar__logo');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('all nav items have correct href attributes', () => {
      const { container } = render(<Navbar />);

      const projectsLink = screen.getByText('Projects').closest('a');
      const experienceLink = screen.getByText('Experience').closest('a');
      const cvLink = screen.getByText('CV').closest('a');

      expect(projectsLink).toHaveAttribute('href', '/projects');
      expect(experienceLink).toHaveAttribute('href', '/experience');
      expect(cvLink).toHaveAttribute('href', '/cv');
    });
  });

  describe('Active State', () => {
    it('shows active indicator for Projects page', () => {
      __setMockLocation('/projects');
      const { container } = render(<Navbar />);

      const activeIndicator = container.querySelector('.navbar__link-active');
      expect(activeIndicator).toBeInTheDocument();
    });

    it('shows active indicator for Experience page', () => {
      __setMockLocation('/experience');
      render(<Navbar />);

      const experienceLink = screen.getByText('Experience').closest('.navbar__link');
      expect(experienceLink).toHaveClass('active');
    });

    it('shows active indicator for CV page', () => {
      __setMockLocation('/cv');
      render(<Navbar />);

      const cvLink = screen.getByText('CV').closest('.navbar__link');
      expect(cvLink).toHaveClass('active');
    });

    it('shows mobile active indicator with arrow', async () => {
      __setMockLocation('/projects');
      const user = userEvent.setup();
      const { container } = render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);
      await user.click(toggleButton);

      await waitFor(() => {
        const mobileActiveIndicator = container.querySelector('.navbar__mobile-link-indicator');
        expect(mobileActiveIndicator).toBeInTheDocument();
        expect(mobileActiveIndicator).toHaveTextContent('→');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for mobile toggle', () => {
      render(<Navbar />);

      const toggleButton = screen.getByLabelText(/toggle menu/i);
      expect(toggleButton).toHaveAttribute('aria-label', 'Toggle menu');
      expect(toggleButton).toHaveAttribute('aria-expanded');
    });

    it('has semantic nav element', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });
  });
});
