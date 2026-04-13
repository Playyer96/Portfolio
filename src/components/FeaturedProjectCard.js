import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub as FaGithubIcon, FaGitlab, FaDocker } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import "./FeaturedProjectCard.scss";

const FeaturedProjectCard = ({ project, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIconComponent = (techName) => {
    const iconMap = {
      'react': FaReact,
      'unity engine': FaUnity,
      'unity': FaUnity,
      'unreal engine': SiUnrealengine,
      'unreal': SiUnrealengine,
      'html5': FaHtml5,
      'css 3': FaCss3Alt,
      'css3': FaCss3Alt,
      'javascript': FaJs,
      'nodejs': FaNodeJs,
      'node': FaNodeJs,
      'python': FaPython,
      'c++': SiCplusplus,
      'c#': SiSharp,
      'git': FaGitAlt,
      'github': FaGithubIcon,
      'gitlab': FaGitlab,
      'docker': FaDocker,
      'perforce': SiPerforce
    };
    return iconMap[(techName || '').toLowerCase()];
  };

  const imageUrl = project.imageUrl || project.images?.[0]?.image;
  const description = project.descriptions?.[0] || project.description || '';
  const truncatedDescription = description.length > 150
    ? description.substring(0, 150) + '...'
    : description;
  const technologies = project.technologies || [];
  const displayTech = technologies.slice(0, 4);

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className="featured-card"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Image Area */}
      <div className="featured-card__image-container">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={project.name}
            className="featured-card__image"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ) : (
          <div className="featured-card__image-placeholder" />
        )}

        {/* Gradient overlay for text readability */}
        <div className="featured-card__gradient-overlay" />

        {/* Title overlaid on image */}
        <div className="featured-card__image-title">
          <h3 className="featured-card__name">{project.name}</h3>
        </div>

        {/* Technology icons on image */}
        {displayTech.length > 0 && (
          <div className="featured-card__image-tech">
            {displayTech.map((tech, idx) => {
              const techName = tech.name || tech.text || '';
              const IconComponent = getIconComponent(techName);
              return IconComponent ? (
                <span
                  key={idx}
                  className="featured-card__image-tech-icon"
                  title={techName}
                >
                  <IconComponent />
                </span>
              ) : null;
            })}
            {technologies.length > 4 && (
              <span className="featured-card__image-tech-more">
                +{technologies.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="featured-card__content">
        <motion.p
          className="featured-card__description"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {truncatedDescription}
        </motion.p>

        {/* Action buttons */}
        <div className="featured-card__actions">
          {project.githubLink && (
            <motion.a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-card__action-btn featured-card__action-btn--github"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub />
              <span>GitHub</span>
            </motion.a>
          )}
          {project.liveLink && (
            <motion.a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-card__action-btn featured-card__action-btn--live"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt />
              <span>Live Demo</span>
            </motion.a>
          )}
        </div>
      </div>

      {/* Glow effect */}
      <div className="featured-card__glow" />
    </motion.div>
  );
};

export default FeaturedProjectCard;
