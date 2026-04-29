import React from 'react';
import './SkipLink.scss';

/**
 * Skip-to-Content Link
 *
 * Accessibility feature that allows keyboard users to skip navigation
 * and jump directly to main content
 *
 * Hidden by default, visible on keyboard focus
 */
const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
