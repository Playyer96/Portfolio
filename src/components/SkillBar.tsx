import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SkillBarProps } from "../types";
import "./SkillBar.scss";

/**
 * SkillBar Component
 *
 * Animated skill level progress bar with counting animation
 * Triggers animation when scrolled into view
 */
const SkillBar: React.FC<SkillBarProps> = ({ name, level, color, delay = 0 }) => {
  const [count, setCount] = useState<number>(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = level;
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
    return undefined;
  }, [inView, level]);

  return (
    <motion.div
      ref={ref}
      className="skill-bar"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="skill-bar__header">
        <span className="skill-bar__name">{name}</span>
        <motion.span
          className="skill-bar__percentage"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: delay + 0.3 }}
        >
          {count}%
        </motion.span>
      </div>
      <div className="skill-bar__track">
        <motion.div
          className="skill-bar__fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ delay: delay + 0.2, duration: 1.5, ease: "easeOut" }}
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}66`
          }}
        >
          <div
            className="skill-bar__glow"
            style={{ background: color }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillBar;
