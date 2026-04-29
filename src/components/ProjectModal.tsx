import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaUnity, FaTimes, FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGitlab, FaDocker } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import { IconType } from "react-icons";
import ReactPlayer from "react-player";
import { ProjectModalProps } from "../types";
import CaseStudySection from "./CaseStudy/CaseStudySection";
import "./ProjectModal.scss";

/**
 * Media Item Interface
 */
interface MediaItem {
  type: 'image' | 'video';
  image?: string;
  url?: string;
}

/**
 * Icon Map Type
 */
type IconMap = Record<string, IconType>;

/**
 * ProjectModal Component
 *
 * Displays detailed project information in a modal
 * Features image/video carousel, technology badges, and project links
 */
const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'caseStudy'>('overview');

  const hasCaseStudy = !!project?.caseStudy;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
      setActiveTab('overview');
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!project) return null;

  const images = project.images || [];
  const hasVideo = Boolean(project.videoUrl || project.video);

  const media: MediaItem[] = hasVideo
    ? [
        { type: 'video', url: project.videoUrl || project.video },
        ...images.map(img => ({ type: 'image' as const, ...img }))
      ]
    : images.map(img => ({ type: 'image' as const, ...img }));

  const nextImage = (): void => {
    setCurrentImageIndex((prev) => (prev + 1) % media.length);
  };

  const prevImage = (): void => {
    setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
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
              aria-label="Close modal"
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
                        src={media[currentImageIndex].url || ''}
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
                      loading="lazy"
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
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </motion.button>
                  <motion.button
                    className="project-modal__nav project-modal__nav--next"
                    onClick={nextImage}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Next image"
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
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            {hasCaseStudy && (
              <div className="project-modal__tabs">
                <motion.button
                  className={`project-modal__tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Overview
                </motion.button>
                <motion.button
                  className={`project-modal__tab ${activeTab === 'caseStudy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('caseStudy')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Case Study
                </motion.button>
              </div>
            )}

            {/* Project Info */}
            <div className="project-modal__info">
              {/* Tab Content */}
              {activeTab === 'overview' ? (
                <>
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
                  {(project.descriptions || project.description) && (
                    <div className="project-modal__section">
                      <h3 className="project-modal__section-title">About</h3>
                      {project.descriptions ? (
                        project.descriptions.map((desc, idx) => (
                          <p key={idx} className="project-modal__description">
                            {desc}
                          </p>
                        ))
                      ) : (
                        <p className="project-modal__description">
                          {project.description || "No description available."}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="project-modal__section">
                      <h3 className="project-modal__section-title">Technologies</h3>
                      <div className="project-modal__tech-grid">
                        {project.technologies.map((tech, index) => {
                          const techName = tech.name || tech.text || '';
                          const IconComponent = getIconComponent(techName);
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
                              <span>{techName}</span>
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
                </>
              ) : (
                /* Case Study Tab */
                project.caseStudy && <CaseStudySection caseStudy={project.caseStudy} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
