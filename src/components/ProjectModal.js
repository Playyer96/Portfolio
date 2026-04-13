import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaUnity, FaTimes, FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGitlab, FaDocker } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import ReactPlayer from "react-player";
import FadeIn from "./animations/FadeIn";
import { CaseStudySection, MetricsGrid, Timeline } from "./CaseStudy";
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
  const hasVideo = project.videoUrl || project.video;
  const media = hasVideo ? [{type: 'video', url: project.videoUrl || project.video}, ...images.map(img => ({type: 'image', ...img}))] : images.map(img => ({type: 'image', ...img}));

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

              {/* Case Study Content */}
              {project.caseStudy ? (
                <div className="project-modal__case-study">
                  {/* Problem Statement Section */}
                  {project.caseStudy.problem && (
                    <CaseStudySection
                      title="Problem Statement"
                      delay={0.1}
                      className="project-modal__case-study-section"
                    >
                      {project.caseStudy.problem.challenge && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Challenge</h4>
                          <p className="project-modal__case-study-text">
                            {project.caseStudy.problem.challenge}
                          </p>
                        </div>
                      )}
                      {project.caseStudy.problem.context && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Context</h4>
                          <p className="project-modal__case-study-text">
                            {project.caseStudy.problem.context}
                          </p>
                        </div>
                      )}
                      {project.caseStudy.problem.goals && project.caseStudy.problem.goals.length > 0 && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Goals</h4>
                          <ul className="project-modal__case-study-list">
                            {project.caseStudy.problem.goals.map((goal, idx) => (
                              <li key={idx} className="project-modal__case-study-list-item">
                                {goal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CaseStudySection>
                  )}

                  {/* Solution Section */}
                  {project.caseStudy.solution && (
                    <CaseStudySection
                      title="Solution"
                      delay={0.2}
                      className="project-modal__case-study-section"
                    >
                      {project.caseStudy.solution.approach && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Approach</h4>
                          <p className="project-modal__case-study-text">
                            {project.caseStudy.solution.approach}
                          </p>
                        </div>
                      )}
                      {project.caseStudy.solution.keyFeatures && project.caseStudy.solution.keyFeatures.length > 0 && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Key Features</h4>
                          <ul className="project-modal__case-study-list">
                            {project.caseStudy.solution.keyFeatures.map((feature, idx) => (
                              <li key={idx} className="project-modal__case-study-list-item">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.caseStudy.solution.technicalHighlights && project.caseStudy.solution.technicalHighlights.length > 0 && (
                        <div className="project-modal__case-study-item">
                          <h4 className="project-modal__case-study-subtitle">Technical Highlights</h4>
                          <ul className="project-modal__case-study-list">
                            {project.caseStudy.solution.technicalHighlights.map((highlight, idx) => (
                              <li key={idx} className="project-modal__case-study-list-item">
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CaseStudySection>
                  )}

                  {/* Metrics Section */}
                  {project.caseStudy.metrics && project.caseStudy.metrics.length > 0 && (
                    <FadeIn
                      delay={0.3}
                      duration={0.6}
                      direction="up"
                      className="project-modal__case-study-section"
                    >
                      <div className="project-modal__case-study-metrics-header">
                        <h3 className="project-modal__case-study-metrics-title">Impact & Results</h3>
                      </div>
                      <MetricsGrid
                        metrics={project.caseStudy.metrics}
                        className="project-modal__metrics-grid"
                      />
                    </FadeIn>
                  )}

                  {/* Timeline Section */}
                  {project.caseStudy.timeline && project.caseStudy.timeline.length > 0 && (
                    <FadeIn
                      delay={0.4}
                      duration={0.6}
                      direction="up"
                      className="project-modal__case-study-section"
                    >
                      <div className="project-modal__case-study-timeline-header">
                        <h3 className="project-modal__case-study-timeline-title">Project Timeline</h3>
                      </div>
                      <Timeline
                        phases={project.caseStudy.timeline}
                        className="project-modal__timeline"
                      />
                    </FadeIn>
                  )}

                  {/* Key Learnings Section */}
                  {project.caseStudy.learnings && project.caseStudy.learnings.length > 0 && (
                    <CaseStudySection
                      title="Key Learnings"
                      delay={0.5}
                      className="project-modal__case-study-section"
                    >
                      <ul className="project-modal__case-study-list">
                        {project.caseStudy.learnings.map((learning, idx) => (
                          <li key={idx} className="project-modal__case-study-list-item">
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </CaseStudySection>
                  )}
                </div>
              ) : (
                <>
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
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
