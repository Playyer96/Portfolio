/**
 * Case Study Section Component
 *
 * Main container for displaying a complete project case study
 * Includes problem statement, challenges, solutions, results, and learnings
 */

import React from 'react';
import { CaseStudy } from '../../types';
import { FadeIn, StaggerContainer } from '../animations';
import ChallengeCard from './ChallengeCard';
import SolutionCard from './SolutionCard';
import ResultsGrid from './ResultsGrid';
import LearningsList from './LearningsList';
import './CaseStudySection.scss';

/**
 * Case Study Section Props
 */
interface CaseStudySectionProps {
  caseStudy: CaseStudy;
}

/**
 * Case Study Section Component
 *
 * Displays a detailed case study with all its components
 */
const CaseStudySection: React.FC<CaseStudySectionProps> = ({ caseStudy }) => {
  const {
    problemStatement,
    context,
    targetAudience,
    timeline,
    teamSize,
    role,
    challenges,
    solutions,
    results,
    learnings,
    metrics,
    futureImprovements,
    testimonial,
  } = caseStudy;

  return (
    <div className="case-study">
      {/* Problem Statement */}
      <FadeIn className="case-study__section">
        <h2 className="case-study__heading">The Challenge</h2>
        <p className="case-study__problem">{problemStatement}</p>

        {context && (
          <div className="case-study__context">
            <h3 className="case-study__subheading">Context</h3>
            <p>{context}</p>
          </div>
        )}

        {/* Project Details */}
        {(targetAudience || timeline || teamSize || role) && (
          <div className="case-study__details">
            {targetAudience && (
              <div className="case-study__detail">
                <span className="case-study__detail-label">Target Audience:</span>
                <span className="case-study__detail-value">{targetAudience}</span>
              </div>
            )}
            {timeline && (
              <div className="case-study__detail">
                <span className="case-study__detail-label">Timeline:</span>
                <span className="case-study__detail-value">{timeline}</span>
              </div>
            )}
            {teamSize && (
              <div className="case-study__detail">
                <span className="case-study__detail-label">Team Size:</span>
                <span className="case-study__detail-value">{teamSize} people</span>
              </div>
            )}
            {role && (
              <div className="case-study__detail">
                <span className="case-study__detail-label">My Role:</span>
                <span className="case-study__detail-value">{role}</span>
              </div>
            )}
          </div>
        )}
      </FadeIn>

      {/* Challenges */}
      {challenges && challenges.length > 0 && (
        <div className="case-study__section">
          <FadeIn>
            <h2 className="case-study__heading">Key Challenges</h2>
          </FadeIn>
          <StaggerContainer className="case-study__challenges">
            {challenges.map((challenge, index) => (
              <ChallengeCard key={index} challenge={challenge} index={index} />
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Solutions */}
      {solutions && solutions.length > 0 && (
        <div className="case-study__section">
          <FadeIn>
            <h2 className="case-study__heading">Solutions & Approach</h2>
          </FadeIn>
          <StaggerContainer className="case-study__solutions">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </StaggerContainer>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="case-study__section">
          <FadeIn>
            <h2 className="case-study__heading">Results & Impact</h2>
          </FadeIn>
          <ResultsGrid results={results} metrics={metrics} />
        </div>
      )}

      {/* Key Learnings */}
      {learnings && learnings.length > 0 && (
        <div className="case-study__section">
          <FadeIn>
            <h2 className="case-study__heading">Key Learnings</h2>
          </FadeIn>
          <LearningsList learnings={learnings} />
        </div>
      )}

      {/* Future Improvements */}
      {futureImprovements && futureImprovements.length > 0 && (
        <FadeIn className="case-study__section">
          <h2 className="case-study__heading">Future Improvements</h2>
          <ul className="case-study__improvements">
            {futureImprovements.map((improvement, index) => (
              <li key={index} className="case-study__improvement">
                {improvement}
              </li>
            ))}
          </ul>
        </FadeIn>
      )}

      {/* Testimonial */}
      {testimonial && (
        <FadeIn className="case-study__section">
          <div className="case-study__testimonial">
            <blockquote className="case-study__quote">
              "{testimonial.quote}"
            </blockquote>
            <div className="case-study__author">
              <p className="case-study__author-name">{testimonial.author}</p>
              {testimonial.role && (
                <p className="case-study__author-role">
                  {testimonial.role}
                  {testimonial.company && `, ${testimonial.company}`}
                </p>
              )}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

export default CaseStudySection;
