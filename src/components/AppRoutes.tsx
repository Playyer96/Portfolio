import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import Home from '../pages/Home';
import Projects from '../pages/Projects';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02
    }
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate' as const,
    duration: 0.4
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Projects />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;