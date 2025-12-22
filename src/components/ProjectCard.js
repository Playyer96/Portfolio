import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaUnity } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp } from "react-icons/si";
import "./ProjectCard.scss";

const ProjectCard = ({ project, onClick, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const getIconComponent = (techName) => {
    const iconMap = {
      'react': FaReact,
      'unity engine': FaUnity,
      'unity': FaUnity,
      'unreal engine': SiUnrealengine,
      'unreal': SiUnrealengine,
      'c++': SiCplusplus,
      'c#': SiSharp
    };
    return iconMap[(techName || '').toLowerCase()];
  };

  return (
    <motion.div
      className="project-card"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      style={{
        transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
      }}
    >
      {/* Image Container */}
      <div className="project-card__image-container">
        <img
          src={project.imageUrl || project.images?.[0]?.image}
          alt={project.name}
          className="project-card__image"
        />
        <div className="project-card__overlay">
          <motion.div
            className="project-card__view-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            View Project
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="project-card__content">
        <h3 className="project-card__title">{project.name}</h3>

        <p className="project-card__description">
          {project.descriptions?.[0]?.substring(0, 100) || project.description?.substring(0, 100) || ''}
          {(project.descriptions?.[0]?.length > 100 || project.description?.length > 100) ? '...' : ''}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="project-card__tech">
            {project.technologies.slice(0, 4).map((tech, idx) => {
              const techName = tech.name || tech.text || '';
              const IconComponent = getIconComponent(techName);
              return (
                <motion.div
                  key={idx}
                  className="project-card__tech-item"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  title={techName}
                >
                  {IconComponent ? (
                    <IconComponent />
                  ) : (
                    <span className="project-card__tech-text">{techName.substring(0, 2)}</span>
                  )}
                </motion.div>
              );
            })}
            {project.technologies.length > 4 && (
              <div className="project-card__tech-more">
                +{project.technologies.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Glow Effect */}
      <div
        className="project-card__glow"
        style={{
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`
        }}
      />
    </motion.div>
  );
};

export default ProjectCard;
