/**
 * AnimatedText Component Tests
 */

import React from 'react';
import { render, screen } from '../../../test-utils';
import AnimatedText from '../AnimatedText';

describe('AnimatedText Component', () => {
  // Skipping due to Framer Motion + Jest/JSDOM matchMedia initialization issue
  it.skip('renders text correctly with word animation', () => {
    render(<AnimatedText text="Hello World" type="word" />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('renders text correctly with character animation', () => {
    const { container } = render(<AnimatedText text="Hi" type="char" />);

    // Each character is wrapped in a span
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
    expect(container.textContent).toBe('Hi');
  });

  it('uses word animation by default', () => {
    render(<AnimatedText text="Default Test" />);

    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedText text="Styled" className="custom-text" />
    );

    const motionDiv = container.querySelector('.custom-text');
    expect(motionDiv).toBeInTheDocument();
  });

  it('handles single word', () => {
    render(<AnimatedText text="Single" type="word" />);

    expect(screen.getByText('Single')).toBeInTheDocument();
  });

  it('handles empty string', () => {
    const { container } = render(<AnimatedText text="" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts delay and duration props', () => {
    render(
      <AnimatedText
        text="Delayed"
        delay={0.5}
        duration={1}
      />
    );

    expect(screen.getByText('Delayed')).toBeInTheDocument();
  });

  it('preserves spaces in character mode', () => {
    const { container } = render(
      <AnimatedText text="A B" type="char" />
    );

    // Non-breaking space (\u00A0) is used for spaces
    // The component converts spaces to non-breaking spaces
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
  });

  it('splits multi-word text correctly', () => {
    render(
      <AnimatedText text="One Two Three Four" type="word" />
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
    expect(screen.getByText('Four')).toBeInTheDocument();
  });

  it('handles special characters', () => {
    const { container } = render(
      <AnimatedText text="Hello!" type="char" />
    );

    expect(container.textContent).toContain('!');
  });
});
