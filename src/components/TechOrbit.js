import React from "react";
import { motion } from "framer-motion";
import "./TechOrbit.scss";

const TechOrbit = ({ technologies, getIconComponent }) => {
  return (
    <div className="tech-orbit">
      <div className="tech-orbit__center">
        <motion.div
          className="tech-orbit__core"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="tech-orbit__core-text">TECH</div>
        </motion.div>
      </div>

      {technologies.map((tech, index) => {
        const IconComponent = getIconComponent(tech.text);
        const angle = (360 / technologies.length) * index;
        const radius = 180;
        const delay = index * 0.1;

        return (
          <motion.div
            key={index}
            className="tech-orbit__item"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            style={{
              "--angle": `${angle}deg`,
              "--radius": `${radius}px`,
            }}
          >
            <motion.div
              className="tech-orbit__icon-wrapper"
              whileHover={{ scale: 1.3, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent className="tech-orbit__icon" />
              <div className="tech-orbit__glow"></div>
            </motion.div>
            <span className="tech-orbit__label">{tech.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TechOrbit;
