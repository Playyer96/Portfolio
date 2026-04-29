/**
 * Results Grid Component
 *
 * Displays measurable results and key metrics in a grid layout
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Result, Metric } from '../../types';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import './ResultsGrid.scss';

/**
 * Results Grid Props
 */
interface ResultsGridProps {
  results: Result[];
  metrics?: Metric[];
}

/**
 * Get Trend Icon
 */
const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return <FaArrowUp className="results-grid__trend-icon results-grid__trend-icon--up" />;
    case 'down':
      return <FaArrowDown className="results-grid__trend-icon results-grid__trend-icon--down" />;
    case 'neutral':
      return <FaMinus className="results-grid__trend-icon results-grid__trend-icon--neutral" />;
    default:
      return null;
  }
};

/**
 * Results Grid Component
 */
const ResultsGrid: React.FC<ResultsGridProps> = ({ results, metrics }) => {
  return (
    <div className="results-grid">
      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="results-grid__metrics">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="results-grid__metric"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="results-grid__metric-header">
                <span className="results-grid__metric-label">{metric.label}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="results-grid__metric-value">
                {metric.value}
                {metric.unit && <span className="results-grid__metric-unit">{metric.unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="results-grid__results">
          {results.map((result, index) => (
            <motion.div
              key={index}
              className="results-grid__result"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="results-grid__result-header">
                <span className="results-grid__result-metric">{result.metric}</span>
                <span className="results-grid__result-value">{result.value}</span>
              </div>

              {result.description && (
                <p className="results-grid__result-description">{result.description}</p>
              )}

              {result.improvement && (
                <div className="results-grid__result-improvement">
                  <FaArrowUp />
                  <span>{result.improvement}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsGrid;
