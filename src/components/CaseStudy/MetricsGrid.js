import React from 'react';
import { motion } from 'framer-motion';
import StaggerContainer from '../animations/StaggerContainer';
import MetricsCard from './MetricsCard';

const MetricsGrid = ({ metrics = [], className = '' }) => {
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <StaggerContainer
      className={`metrics-grid ${className}`}
      staggerDelay={0.1}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          className="metrics-grid__item"
          variants={itemVariants}
        >
          <MetricsCard
            {...metric}
            delay={index * 0.05}
          />
        </motion.div>
      ))}
    </StaggerContainer>
  );
};

export default MetricsGrid;
