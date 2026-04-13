import React from "react";
import { motion } from "framer-motion";
import WorkIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import "./TimelineItem.scss";

// Tech extraction mapping from project names and keywords
const TECH_MAP = {
  "Unreal": { name: "Unreal Engine", color: "accent" },
  "unreal engine": { name: "Unreal Engine", color: "accent" },
  "Unity": { name: "Unity", color: "primary" },
  "unity engine": { name: "Unity", color: "primary" },
  "C#": { name: "C#", color: "primary" },
  "C++": { name: "C++", color: "accent" },
  "AR": { name: "AR", color: "secondary" },
  "VR": { name: "VR", color: "secondary" },
  "Hololens": { name: "Mixed Reality", color: "secondary" },
  "React": { name: "React", color: "primary" },
  "Node": { name: "Node.js", color: "primary" },
  "Python": { name: "Python", color: "accent" }
};

const extractTechFromResponsibilities = (responsibilities = []) => {
  const techMap = new Map(); // name -> { name, color }

  if (!Array.isArray(responsibilities)) return [];

  responsibilities.forEach(resp => {
    if (!resp) return;
    const respLower = resp.toLowerCase();

    // Check for exact matches
    Object.entries(TECH_MAP).forEach(([key, value]) => {
      if (respLower.includes(key.toLowerCase())) {
        techMap.set(value.name, value);
      }
    });
  });

  return Array.from(techMap.values());
};

const TimelineItem = ({ experience, index, isEven }) => {
  const IconComponent = experience.icon === "WorkIcon" ? WorkIcon : SchoolIcon;
  // Use primary green for work, cyan for education
  const iconColor = experience.icon === "WorkIcon" ? "#00ff88" : "#00d9ff";
  const extractedTechs = extractTechFromResponsibilities(experience.responsibilities);

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

        {/* Tech Badges */}
        {extractedTechs.length > 0 && (
          <div className="timeline-item__tech-badges">
            {extractedTechs.map((tech, idx) => (
              <motion.span
                key={tech.name}
                className={`timeline-item__tech-badge timeline-item__tech-badge--${tech.color}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 + idx * 0.06 }}
              >
                {tech.name}
              </motion.span>
            ))}
          </div>
        )}

        {/* Responsibilities as Badges */}
        {experience.responsibilities && experience.responsibilities.length > 0 && (
          <div className="timeline-item__responsibilities">
            {experience.responsibilities.map((resp, idx) => (
              <motion.div
                key={idx}
                className="timeline-item__responsibility-item"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * 0.05 }}
              >
                <span className="timeline-item__bullet">▸</span>
                <span className="timeline-item__responsibility-text">{resp}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Card corner decoration */}
        <div className="timeline-item__corner"></div>
      </motion.div>
    </div>
  );
};

export default TimelineItem;
