import React from 'react';
import { motion } from 'framer-motion';
import { FadeInProps, AnimationDirection } from '../../types';

/**
 * FadeIn Animation Component
 *
 * Animates children with a fade-in effect when they come into view
 * Supports directional sliding from up, down, left, or right
 */
const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'up',
  className = ''
}) => {
  const directions: Record<AnimationDirection | 'none', { x?: number; y?: number }> = {
    up: { y: 30 },
    down: { y: -30 },
    left: { x: 30 },
    right: { x: -30 },
    none: {}
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
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

export default FadeIn;
