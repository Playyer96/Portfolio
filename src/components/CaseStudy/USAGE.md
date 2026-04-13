# CaseStudy Components - Usage Guide

## Overview

The CaseStudy component suite provides a complete solution for displaying project case studies with metrics, timelines, and structured sections. All components follow the design system and use Framer Motion for animations.

## Components

### 1. MetricsCard

Display a single metric with animated number counter, icon, and trend indicator.

```jsx
import { MetricsCard } from './CaseStudy';

<MetricsCard
  label="Performance Gain"
  value={45}
  unit="%"
  icon={<FiTrendingUp />}
  context="vs previous version"
  trend="up"
  delay={0}
  glow={true}
/>
```

**Props:**
- `label` (string): Metric label
- `value` (number | string): Display value
- `unit` (string): Optional unit suffix
- `icon` (ReactNode): Optional icon component
- `context` (string): Optional context description
- `trend` ('up' | 'down'): Optional trend indicator
- `delay` (number): Animation delay in seconds
- `glow` (boolean): Enable glow effect (default: true)

### 2. MetricsGrid

Container for metrics with responsive grid layout and stagger animation.

```jsx
import { MetricsGrid } from './CaseStudy';

<MetricsGrid
  metrics={[
    { label: "Users", value: 10000, unit: "K", trend: "up" },
    { label: "Growth", value: 250, unit: "%", trend: "up" },
    { label: "Load Time", value: 2.3, unit: "s", trend: "down" }
  ]}
/>
```

**Props:**
- `metrics` (array): Array of metric objects (MetricsCard props)
- `className` (string): Optional CSS class

**Responsive Layout:**
- Desktop (1024px+): 3+ columns (auto-fit)
- Tablet (768px): 2 columns
- Mobile: 1 column

### 3. TimelineStep

Single phase in a timeline with dot, connector line, and content.

```jsx
import { TimelineStep } from './CaseStudy';

<TimelineStep
  phase="Design Phase"
  duration="2 weeks"
  description="Conducted user research and created wireframes"
  index={0}
  isLast={false}
  delay={0}
/>
```

**Props:**
- `phase` (string): Phase title
- `duration` (string): Duration text
- `description` (string): Phase description
- `index` (number): Step index
- `isLast` (boolean): Hide connector line if last step
- `delay` (number): Animation delay

### 4. Timeline

Complete vertical timeline with animated background line and steps.

```jsx
import { Timeline } from './CaseStudy';

<Timeline
  phases={[
    { phase: "Planning", duration: "1 week", description: "..." },
    { phase: "Development", duration: "4 weeks", description: "..." },
    { phase: "Testing", duration: "1 week", description: "..." }
  ]}
/>
```

**Props:**
- `phases` (array): Array of phase objects (TimelineStep props)
- `className` (string): Optional CSS class

### 5. CaseStudySection

Wrapper section with optional accent styling and title.

```jsx
import { CaseStudySection } from './CaseStudy';

<CaseStudySection
  title="Problem Statement"
  subtitle="Challenge we faced"
  delay={0}
  accent={false}
>
  {/* Content goes here */}
</CaseStudySection>
```

**Props:**
- `title` (string): Section title
- `subtitle` (string): Optional subtitle
- `children` (ReactNode): Section content
- `delay` (number): Animation delay
- `accent` (boolean): Use gradient background
- `className` (string): Optional CSS class

## Example Case Study Structure

```jsx
import {
  MetricsCard,
  MetricsGrid,
  Timeline,
  CaseStudySection
} from './CaseStudy';
import { FiUsers, FiZap, FiTrendingUp } from 'react-icons/fi';

export default function ProjectCaseStudy() {
  const metrics = [
    {
      label: "Users",
      value: 50000,
      icon: <FiUsers />,
      trend: "up"
    },
    {
      label: "Performance",
      value: 3.2,
      unit: "s",
      trend: "down"
    },
    {
      label: "Engagement",
      value: 85,
      unit: "%",
      icon: <FiZap />
    }
  ];

  const timeline = [
    {
      phase: "Research",
      duration: "2 weeks",
      description: "User interviews and market analysis"
    },
    {
      phase: "Development",
      duration: "8 weeks",
      description: "Full-stack implementation with testing"
    },
    {
      phase: "Launch",
      duration: "1 week",
      description: "Beta launch and user feedback collection"
    }
  ];

  return (
    <div className="case-study">
      <CaseStudySection
        title="Project Overview"
        subtitle="A modern approach to game distribution"
        accent={true}
      >
        <p>Project description here...</p>
      </CaseStudySection>

      <CaseStudySection
        title="Key Metrics"
        delay={0.2}
      >
        <MetricsGrid metrics={metrics} />
      </CaseStudySection>

      <CaseStudySection
        title="Development Timeline"
        delay={0.4}
      >
        <Timeline phases={timeline} />
      </CaseStudySection>

      <CaseStudySection
        title="Learnings"
        delay={0.6}
      >
        <ul className="case-study__list">
          <li>First learning point</li>
          <li>Second learning point</li>
          <li>Third learning point</li>
        </ul>
      </CaseStudySection>
    </div>
  );
}
```

## Design System Integration

All components use design system tokens:

**Colors:**
- `$color-primary`: Primary gradient color
- `$color-accent`: Accent color for highlights
- `$color-secondary`: Secondary color for contrasts

**Spacing:**
- `$spacing-md`, `$spacing-lg`, `$spacing-xl` for consistent whitespace

**Typography:**
- `$font-heading`: Heading font
- `$font-mono`: Monospace for values
- `$font-size-*`: Responsive font sizes

**Effects:**
- `@include liquid-glass-glow()`: Glassmorphism with glow
- `@include text-gradient()`: Gradient text
- Framer Motion for all animations

## Animation Features

- **Stagger animations**: Children animate sequentially
- **Number counters**: Animated number counting (SkillBar pattern)
- **Scroll triggers**: All animations trigger on viewport entry
- **GPU acceleration**: Using transform and opacity only
- **Responsive timing**: Delays adjust based on device

## Responsive Behavior

All components are mobile-first and responsive:
- Metrics grid: 1→2→3+ columns
- Timeline: Adjusted spacing and sizing
- Sections: Padding and gap adjustments
- Typography: Responsive font sizes

## CSS Classes for Styling

Add custom styling with these utility classes:

- `.case-study__grid`: Grid layout helper
- `.case-study__list`: Styled list with arrows
- `.case-study__highlight`: Highlighted text box
- `.learning-card`: Reusable learning card

## Notes

- All animations use Framer Motion with `whileInView` for scroll triggers
- Number counters animate on scroll into viewport
- Timeline connector lines scale from top to bottom
- Icons support hover rotation and scale effects
- Glow effects respond to design system color tokens
