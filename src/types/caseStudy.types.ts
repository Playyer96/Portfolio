/**
 * Case Study Type Definitions
 *
 * Detailed project case studies with challenges, solutions, and results
 */

// ============================================================================
// Challenge Types
// ============================================================================

/**
 * Individual Challenge
 *
 * A specific problem or obstacle encountered during the project
 */
export interface Challenge {
  title: string;
  description: string;
  tags?: string[];
  impact?: string;
}

// ============================================================================
// Solution Types
// ============================================================================

/**
 * Individual Solution
 *
 * How a specific challenge was addressed
 */
export interface Solution {
  title: string;
  description: string;
  technicalDetails?: string;
  codeSnippet?: string;
  language?: string; // Programming language for syntax highlighting
  approach?: string;
}

// ============================================================================
// Result Types
// ============================================================================

/**
 * Measurable Result
 *
 * Quantifiable outcome or achievement
 */
export interface Result {
  metric: string;
  value: string;
  description?: string;
  improvement?: string;
}

/**
 * Project Metric
 *
 * Key performance indicator
 */
export interface Metric {
  label: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

// ============================================================================
// Case Study Type
// ============================================================================

/**
 * Complete Case Study
 *
 * In-depth project documentation with problem, solution, and outcomes
 */
export interface CaseStudy {
  /**
   * Problem Statement
   *
   * High-level overview of the problem being solved
   */
  problemStatement: string;

  /**
   * Project Context
   *
   * Background information, constraints, and goals
   */
  context?: string;

  /**
   * Target Audience
   *
   * Who the project was built for
   */
  targetAudience?: string;

  /**
   * Timeline
   *
   * Project duration
   */
  timeline?: string;

  /**
   * Team Size
   *
   * Number of people involved
   */
  teamSize?: number;

  /**
   * Role
   *
   * Your specific role in the project
   */
  role?: string;

  /**
   * Challenges
   *
   * Problems and obstacles encountered
   */
  challenges: Challenge[];

  /**
   * Solutions
   *
   * How challenges were addressed
   */
  solutions: Solution[];

  /**
   * Results
   *
   * Measurable outcomes and achievements
   */
  results: Result[];

  /**
   * Key Learnings
   *
   * Important takeaways from the project
   */
  learnings: string[];

  /**
   * Metrics
   *
   * Key performance indicators
   */
  metrics?: Metric[];

  /**
   * Future Improvements
   *
   * Potential enhancements or next steps
   */
  futureImprovements?: string[];

  /**
   * Testimonial
   *
   * Client or user feedback
   */
  testimonial?: {
    quote: string;
    author: string;
    role?: string;
    company?: string;
  };
}
