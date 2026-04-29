/**
 * StaggerContainer Component Tests
 */

import React from 'react';
import { render, screen } from '../../../test-utils';
import StaggerContainer from '../StaggerContainer';

describe('StaggerContainer Component', () => {
  // Skipping due to Framer Motion + Jest/JSDOM matchMedia initialization issue
  it.skip('renders children correctly', () => {
    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerContainer>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StaggerContainer className="stagger-custom">
        <div>Content</div>
      </StaggerContainer>
    );

    const motionDiv = container.querySelector('.stagger-custom');
    expect(motionDiv).toBeInTheDocument();
  });

  it('renders with default stagger delay', () => {
    render(
      <StaggerContainer>
        <p>Item 1</p>
        <p>Item 2</p>
      </StaggerContainer>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('accepts custom stagger delay', () => {
    render(
      <StaggerContainer staggerDelay={0.2}>
        <span>Fast stagger 1</span>
        <span>Fast stagger 2</span>
      </StaggerContainer>
    );

    expect(screen.getByText('Fast stagger 1')).toBeInTheDocument();
    expect(screen.getByText('Fast stagger 2')).toBeInTheDocument();
  });

  it('renders single child', () => {
    render(
      <StaggerContainer>
        <div>Single child</div>
      </StaggerContainer>
    );

    expect(screen.getByText('Single child')).toBeInTheDocument();
  });

  it('renders complex nested structure', () => {
    render(
      <StaggerContainer>
        <div>
          <h3>Item 1</h3>
          <p>Description 1</p>
        </div>
        <div>
          <h3>Item 2</h3>
          <p>Description 2</p>
        </div>
      </StaggerContainer>
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });
});
