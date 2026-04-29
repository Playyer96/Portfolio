/**
 * ScaleIn Component Tests
 */

import React from 'react';
import { render, screen } from '../../../test-utils';
import ScaleIn from '../ScaleIn';

describe('ScaleIn Component', () => {
  // Skipping due to Framer Motion + Jest/JSDOM matchMedia initialization issue
  it.skip('renders children correctly', () => {
    render(
      <ScaleIn>
        <div>Test Content</div>
      </ScaleIn>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScaleIn className="scale-custom">
        <div>Content</div>
      </ScaleIn>
    );

    const motionDiv = container.querySelector('.scale-custom');
    expect(motionDiv).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(
      <ScaleIn>
        <p>Default scale</p>
      </ScaleIn>
    );

    expect(screen.getByText('Default scale')).toBeInTheDocument();
  });

  it('accepts custom scale value', () => {
    render(
      <ScaleIn scale={0.5}>
        <span>Half scale start</span>
      </ScaleIn>
    );

    expect(screen.getByText('Half scale start')).toBeInTheDocument();
  });

  it('accepts delay and duration props', () => {
    render(
      <ScaleIn delay={0.2} duration={0.6}>
        <div>Delayed scale</div>
      </ScaleIn>
    );

    expect(screen.getByText('Delayed scale')).toBeInTheDocument();
  });

  it('renders nested elements', () => {
    render(
      <ScaleIn>
        <article>
          <h2>Heading</h2>
          <p>Description</p>
        </article>
      </ScaleIn>
    );

    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
