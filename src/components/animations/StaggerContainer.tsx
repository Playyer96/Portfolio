import React from 'react';
import { motion } from 'framer-motion';
import { StaggerContainerProps } from '../../types';

/**
 * StaggerContainer Animation Component
 *
 * Container that staggers the animation of its children
 * Each child will animate in sequence with a delay
 */
const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
