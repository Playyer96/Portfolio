import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaUnity, FaTimes, FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp } from "react-icons/si";
import ReactPlayer from "react-player";
import "./ProjectModal.scss";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = project.images || [];
  const hasVideo = project.video;
  const media = hasVideo ? [{type: 'video', url: project.video}, ...images.map(img => ({type: 'image', ...img}))] : images.map(img => ({type: 'image', ...img}));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % media.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="project-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="project-modal__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="project-modal__content"
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 100 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="project-modal__close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>

            {/* Image Carousel */}
            <div className="project-modal__carousel">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className="project-modal__media-wrapper"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  {media[currentImageIndex]?.type === 'video' ? (
                    <div className="project-modal__video">
                      <ReactPlayer
                        url={media[currentImageIndex].url}
                        controls
                        width="100%"
                        height="100%"
                        playing={false}
                      />
                    </div>
                  ) : (
                    <img
                      src={media[currentImageIndex]?.image}
                      alt={`${project.name} ${currentImageIndex + 1}`}
                      className="project-modal__image"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {media.length > 1 && (
                <>
                  <motion.button
                    className="project-modal__nav project-modal__nav--prev"
                    onClick={prevImage}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaChevronLeft />
                  </motion.button>
                  <motion.button
                    className="project-modal__nav project-modal__nav--next"
                    onClick={nextImage}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaChevronRight />
                  </motion.button>
                </>
              )}

              {/* Image Indicators */}
              {media.length > 1 && (
                <div className="project-modal__indicators">
                  {media.map((_, index) => (
                    <button
                      key={index}
                      className={`project-modal__indicator ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="project-modal__info">
              <div className="project-modal__header">
                <h2 className="project-modal__title">{project.name}</h2>
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal__link"
                  >
                    <FaGithub /> GitHub
                  </a>
                )}
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal__link project-modal__link--primary"
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>

              {/* Description */}
              <div className="project-modal__section">
                <h3 className="project-modal__section-title">About</h3>
                <p className="project-modal__description">
                  {project.description || "No description available."}
                </p>
              </div>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="project-modal__section">
                  <h3 className="project-modal__section-title">Technologies</h3>
                  <div className="project-modal__tech-grid">
                    {project.technologies.map((tech, index) => {
                      const IconComponent = getIconComponent(tech.text);
                      return (
                        <motion.div
                          key={index}
                          className="project-modal__tech-badge"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {IconComponent && <IconComponent className="project-modal__tech-icon" />}
                          <span>{tech.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {project.responsibilities && project.responsibilities.length > 0 && (
                <div className="project-modal__section">
                  <h3 className="project-modal__section-title">Key Features & Responsibilities</h3>
                  <ul className="project-modal__list">
                    {project.responsibilities.map((item, index) => (
                      <motion.li
                        key={index}
                        className="project-modal__list-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="project-modal__list-bullet">▸</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
