import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./StatCard.scss";

const StatCard = ({
  number,
  label,
  color = "primary",
  icon: Icon,
  animated = false,
  description,
}) => {
  const numericValue = typeof number === "number" ? number : parseFloat(number);
  const isNumeric = !isNaN(numericValue) && isFinite(numericValue);

  const [displayValue, setDisplayValue] = useState(
    animated && isNumeric ? 0 : number
  );
  const hasAnimated = useRef(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!animated || !isNumeric || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounter(0, numericValue);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [animated, numericValue, isNumeric]);

  // Update display if number changes and not animated
  useEffect(() => {
    if (!animated) {
      setDisplayValue(number);
    }
  }, [number, animated]);

  const animateCounter = (start, end) => {
    const duration = 2500;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const formatNumber = (val) => {
    if (typeof val !== "number") return val;
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}K`;
    }
    return val.toLocaleString();
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      className={`stat-card stat-card--${color}`}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {Icon && (
        <div className="stat-card__icon">
          <Icon />
        </div>
      )}
      <div className="stat-card__content">
        <span className={`stat-card__number stat-card__number--${color}`}>
          {formatNumber(displayValue)}
        </span>
        <span className="stat-card__label">{label}</span>
        {description && (
          <span className="stat-card__description">{description}</span>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
