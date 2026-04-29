/**
 * Challenge Card Component
 *
 * Displays an individual challenge with title, description, and tags
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '../../types';
import './ChallengeCard.scss';

/**
 * Challenge Card Props
 */
interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
}

/**
 * Challenge Card Component
 */
const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, index }) => {
  const { title, description, tags, impact } = challenge;

  return (
    <motion.div
      className="challenge-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="challenge-card__header">
        <span className="challenge-card__number">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="challenge-card__title">{title}</h3>
      </div>

      <p className="challenge-card__description">{description}</p>

      {impact && (
        <div className="challenge-card__impact">
          <span className="challenge-card__impact-label">Impact:</span>
          <span className="challenge-card__impact-value">{impact}</span>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="challenge-card__tags">
          {tags.map((tag, tagIndex) => (
            <span key={tagIndex} className="challenge-card__tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ChallengeCard;
