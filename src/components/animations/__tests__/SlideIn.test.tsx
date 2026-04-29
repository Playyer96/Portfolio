/**
 * SlideIn Component Tests
 */

import React from 'react';
import { render, screen } from '../../../test-utils';
import SlideIn from '../SlideIn';

describe('SlideIn Component', () => {
  // Skipping due to Framer Motion + Jest/JSDOM matchMedia initialization issue
  it.skip('renders children correctly', () => {
    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SlideIn className="slide-custom">
        <div>Content</div>
      </SlideIn>
    );

    const motionDiv = container.querySelector('.slide-custom');
    expect(motionDiv).toBeInTheDocument();
  });

  it('renders with default props (left direction)', () => {
    render(
      <SlideIn>
        <p>Default slide</p>
      </SlideIn>
    );

    expect(screen.getByText('Default slide')).toBeInTheDocument();
  });

  it('renders with different directions', () => {
    const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];

    directions.forEach(direction => {
      const { unmount } = render(
        <SlideIn direction={direction}>
          <div>Slide {direction}</div>
        </SlideIn>
      );

      expect(screen.getByText(`Slide ${direction}`)).toBeInTheDocument();
      unmount();
    });
  });

  it('accepts delay and duration props', () => {
    render(
      <SlideIn delay={0.3} duration={0.8}>
        <span>Delayed slide</span>
      </SlideIn>
    );

    expect(screen.getByText('Delayed slide')).toBeInTheDocument();
  });

  it('renders complex children structure', () => {
    render(
      <SlideIn>
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      </SlideIn>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });
});
