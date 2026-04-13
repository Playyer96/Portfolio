import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const MetricsCard = ({
  label,
  value,
  unit = '',
  icon = null,
  context = '',
  trend = null,
  delay = 0,
  glow = true
}) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Animate number counter if value is numeric
  useEffect(() => {
    if (inView && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  const displayValue = typeof value === 'number' ? count : value;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }
    }
  };

  const hoverVariants = {
    scale: 1.05,
    transition: { duration: 0.3 }
  };

  return (
    <motion.div
      ref={ref}
      className={`metrics-card ${glow ? 'metrics-card--glow' : ''}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={hoverVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="metrics-card__content">
        {icon && (
          <motion.div
            className="metrics-card__icon"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        )}

        <div className="metrics-card__value-wrapper">
          <motion.div
            className="metrics-card__value"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.2 }}
          >
            {displayValue}
            {unit && <span className="metrics-card__unit">{unit}</span>}
          </motion.div>

          {trend && (
            <motion.div
              className={`metrics-card__trend metrics-card__trend--${trend}`}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: delay + 0.3 }}
            >
              {trend === 'up' ? '↑' : '↓'}
            </motion.div>
          )}
        </div>

        <div className="metrics-card__label">{label}</div>

        {context && (
          <motion.div
            className="metrics-card__context"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.4 }}
          >
            {context}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricsCard;
