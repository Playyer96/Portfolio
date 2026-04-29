/**
 * Learnings List Component
 *
 * Displays key learnings and takeaways from the project
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import './LearningsList.scss';

/**
 * Learnings List Props
 */
interface LearningsListProps {
  learnings: string[];
}

/**
 * Learnings List Component
 */
const LearningsList: React.FC<LearningsListProps> = ({ learnings }) => {
  return (
    <div className="learnings-list">
      {learnings.map((learning, index) => (
        <motion.div
          key={index}
          className="learnings-list__item"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="learnings-list__icon">
            <FaLightbulb />
          </div>
          <p className="learnings-list__text">{learning}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default LearningsList;
