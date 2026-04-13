import React from 'react';
import { motion } from 'framer-motion';

const TimelineStep = ({
  phase,
  duration,
  description,
  index = 0,
  isLast = false,
  delay = 0
}) => {
  const stepVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: delay + 0.1,
        ease: 'backOut'
      }
    },
    hover: {
      scale: 1.2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="timeline-step"
      variants={stepVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {/* Timeline dot */}
      <motion.div
        className="timeline-step__dot"
        variants={dotVariants}
        whileHover="hover"
      >
        <div className="timeline-step__dot-inner" />
      </motion.div>

      {/* Connector line to next step */}
      {!isLast && (
        <motion.div
          className="timeline-step__connector"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + 0.2,
            ease: 'easeOut'
          }}
          viewport={{ once: true, amount: 0.5 }}
        />
      )}

      {/* Content */}
      <motion.div
        className="timeline-step__content"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: delay + 0.15,
          ease: 'easeOut'
        }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <h4 className="timeline-step__phase">{phase}</h4>
        <p className="timeline-step__duration">{duration}</p>
        <p className="timeline-step__description">{description}</p>
      </motion.div>
    </motion.div>
  );
};

export default TimelineStep;
