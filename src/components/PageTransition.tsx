import React from 'react';
import { motion, Variants, Transition } from 'framer-motion';
import { PageTransitionProps } from '../types';

/**
 * Page Animation Variants
 */
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0
  },
  exit: {
    opacity: 0,
    y: -20
  }
};

/**
 * Page Transition Configuration
 */
const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

/**
 * PageTransition Component
 *
 * Wraps page content with enter/exit animations
 * Used with AnimatePresence for smooth page transitions
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
