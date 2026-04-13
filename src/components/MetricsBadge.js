import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./MetricsBadge.scss";

const MetricsBadge = ({ metric = {}, size = "md", animated = false }) => {
  const { label = "", value = 0, icon: Icon } = metric;
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const hasAnimated = useRef(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    if (!animated || hasAnimated.current || !value) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount(0, value);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (badgeRef.current) {
      observer.observe(badgeRef.current);
    }

    return () => observer.disconnect();
  }, [animated, value]);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const animateCount = (start, end) => {
    const duration = 1500;
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

  const formatValue = (val) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      ref={badgeRef}
      className={`metrics-badge metrics-badge--${size}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
    >
      {Icon && (
        <div className="metrics-badge__icon">
          <Icon />
        </div>
      )}
      <div className="metrics-badge__content">
        <span className="metrics-badge__value">
          {formatValue(displayValue)}
        </span>
        {label && (
          <span className="metrics-badge__label">{label}</span>
        )}
      </div>
    </motion.div>
  );
};

export default MetricsBadge;
