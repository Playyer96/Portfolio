import React from "react";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import "./TimelineItem.scss";

const TimelineItem = ({ experience, index, isEven }) => {
  const IconComponent = experience.icon === "WorkIcon" ? WorkIcon : SchoolIcon;
  // Use primary green for work, cyan for education
  const iconColor = experience.icon === "WorkIcon" ? "#00ff88" : "#00d9ff";

  return (
    <div className={`timeline-item ${isEven ? "timeline-item--right" : "timeline-item--left"}`}>
      {/* Date Badge */}
      <motion.div
        className="timeline-item__date"
        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {experience.date}
      </motion.div>

      {/* Icon */}
      <motion.div
        className="timeline-item__icon"
        style={{ backgroundColor: iconColor }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.2, rotate: 360 }}
      >
        <IconComponent />
      </motion.div>

      {/* Content Card */}
      <motion.div
        className="timeline-item__card"
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        whileHover={{ y: -5 }}
      >
        <div className="timeline-item__header">
          <h3 className="timeline-item__title">{experience.title}</h3>
          <h4 className="timeline-item__subtitle">{experience.subtitle}</h4>
        </div>

        {experience.responsibilities && experience.responsibilities.length > 0 && (
          <ul className="timeline-item__list">
            {experience.responsibilities.map((resp, idx) => (
              <motion.li
                key={idx}
                className="timeline-item__list-item"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.05 }}
              >
                <span className="timeline-item__bullet">▸</span>
                {resp}
              </motion.li>
            ))}
          </ul>
        )}

        {/* Card corner decoration */}
        <div className="timeline-item__corner"></div>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
