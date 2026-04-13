import React from 'react';
import { motion } from 'framer-motion';
import TimelineStep from './TimelineStep';

const Timeline = ({ phases = [], className = '' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className={`timeline ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="timeline__track">
        {/* Animated timeline background line */}
        <motion.div
          className="timeline__line"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{
            duration: 1,
            ease: 'easeOut',
            delay: 0.1
          }}
          viewport={{ once: true, amount: 0.2 }}
        />

        {/* Timeline steps */}
        <div className="timeline__steps">
          {phases.map((phase, index) => (
            <TimelineStep
              key={index}
              {...phase}
              index={index}
              isLast={index === phases.length - 1}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Timeline;
