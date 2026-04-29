import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaBook } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import { IconType } from "react-icons";
import { ProjectCardProps } from "../types";
import "./ProjectCard.scss";

/**
 * Mouse Position Interface
 */
interface MousePosition {
  x: number;
  y: number;
}

/**
 * Icon Map Type
 */
type IconMap = Record<string, IconType>;

/**
 * ProjectCard Component
 *
 * Displays a project card with 3D hover effect, image, title, description, and technologies
 * Features mouse-following rotation and technology icon display
 */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [showAllTech, setShowAllTech] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = (): void => {
    setMousePosition({ x: 0, y: 0 });
  };

  const getIconComponent = (techName: string): IconType | undefined => {
    const iconMap: IconMap = {
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
      'github': FaGithub,
      'gitlab': FaGitlab,
      'docker': FaDocker,
      'perforce': SiPerforce
    };
    return iconMap[(techName || '').toLowerCase()];
  };

  return (
    <motion.div
      className="project-card"
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
          loading="lazy"
        />

        {/* Case Study Badge */}
        {project.caseStudy && (
          <motion.div
            className="project-card__badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaBook />
            <span>Case Study</span>
          </motion.div>
        )}

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
          {(project.descriptions?.[0]?.length ?? 0) > 100 || (project.description?.length ?? 0) > 100 ? '...' : ''}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="project-card__tech">
            <div className="project-card__tech-tags">
              {(showAllTech ? project.technologies : project.technologies.slice(0, 3)).map((tech, idx) => {
                const techName = tech.name || tech.text || '';
                const IconComponent = getIconComponent(techName);
                return (
                  <motion.div
                    key={idx}
                    className="project-card__tech-tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {IconComponent && <IconComponent className="project-card__tech-tag-icon" />}
                    <span className="project-card__tech-tag-text">{techName}</span>
                  </motion.div>
                );
              })}
            </div>
            {project.technologies.length > 3 && (
              <motion.button
                className="project-card__tech-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTech(!showAllTech);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showAllTech ? 'Show Less' : `+${project.technologies.length - 3} More`}
              </motion.button>
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
