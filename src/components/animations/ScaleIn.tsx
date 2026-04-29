import React from 'react';
import { motion } from 'framer-motion';
import { ScaleInProps } from '../../types';

/**
 * ScaleIn Animation Component
 *
 * Animates children with a scale-up effect when they come into view
 */
const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  scale = 0.8,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      initial={{
        scale,
        opacity: 0
      }}
      whileInView={{
        scale: 1,
        opacity: 1
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
