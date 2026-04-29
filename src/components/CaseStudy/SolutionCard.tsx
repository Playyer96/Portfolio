/**
 * Solution Card Component
 *
 * Displays an individual solution with technical details and optional code snippet
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Solution } from '../../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCode } from 'react-icons/fa';
import './SolutionCard.scss';

/**
 * Solution Card Props
 */
interface SolutionCardProps {
  solution: Solution;
  index: number;
}

/**
 * Solution Card Component
 */
const SolutionCard: React.FC<SolutionCardProps> = ({ solution, index }) => {
  const { title, description, technicalDetails, codeSnippet, language, approach } = solution;
  const [showCode, setShowCode] = useState(false);

  const toggleCode = () => setShowCode(!showCode);

  return (
    <motion.div
      className="solution-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="solution-card__header">
        <span className="solution-card__number">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="solution-card__title">{title}</h3>
      </div>

      <p className="solution-card__description">{description}</p>

      {approach && (
        <div className="solution-card__approach">
          <span className="solution-card__approach-label">Approach:</span>
          <p className="solution-card__approach-value">{approach}</p>
        </div>
      )}

      {technicalDetails && (
        <div className="solution-card__technical">
          <h4 className="solution-card__technical-title">Technical Implementation</h4>
          <p className="solution-card__technical-details">{technicalDetails}</p>
        </div>
      )}

      {codeSnippet && (
        <div className="solution-card__code">
          <button
            className="solution-card__code-toggle"
            onClick={toggleCode}
            aria-expanded={showCode}
          >
            <FaCode />
            <span>{showCode ? 'Hide' : 'Show'} Code Example</span>
          </button>

          {showCode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="solution-card__code-container"
            >
              <SyntaxHighlighter
                language={language || 'javascript'}
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                }}
                showLineNumbers
              >
                {codeSnippet}
              </SyntaxHighlighter>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SolutionCard;
