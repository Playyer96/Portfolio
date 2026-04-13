import React from 'react';
import FadeIn from '../animations/FadeIn';

const CaseStudySection = ({
  title,
  subtitle = '',
  children,
  delay = 0,
  className = '',
  accent = false
}) => {
  return (
    <FadeIn
      delay={delay}
      duration={0.6}
      direction="up"
      className={`case-study-section ${accent ? 'case-study-section--accent' : ''} ${className}`}
    >
      <div className="case-study-section__header">
        <h3 className="case-study-section__title">{title}</h3>
        {subtitle && (
          <p className="case-study-section__subtitle">{subtitle}</p>
        )}
      </div>

      <div className="case-study-section__content">
        {children}
      </div>
    </FadeIn>
  );
};

export default CaseStudySection;
