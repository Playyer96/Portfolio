import React, { useState, useEffect, useCallback } from 'react';
import { HiX, HiChevronLeft, HiChevronRight, HiExternalLink } from 'react-icons/hi';
import { FaReact, FaNodeJs, FaPython, FaJira, FaJava, FaHtml5, FaCss3Alt, FaJs, FaDocker, FaGithub, FaDatabase, FaSlack, FaMicrosoft } from 'react-icons/fa';
import { SiTypescript, SiPerforce, SiMongodb, SiPostgresql, SiSpring, SiExpress, SiDjango, SiTailwindcss, SiUnity, SiUnrealengine, SiCsharp, SiCplusplus, SiAzuredevops } from 'react-icons/si';
import { IconType } from 'react-icons';

interface Technology {
  name: string;
}

interface ProjectImage {
  image: string;
}

interface Project {
  name: string;
  descriptions?: string | string[];
  technologies?: Technology[];
  responsibilities?: string[];
  images?: ProjectImage[];
  videoUrl?: string;
  link?: string;
}

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  project: Project | null;
}

interface TechIconProps {
  tech: Technology;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, project }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Technology icon mapping
  const getIconComponent = useCallback((techName: string): IconType | null => {
    const normalizedTechName = techName?.toLowerCase().trim() || '';
    const iconMap: Record<string, IconType> = {
      'react': FaReact,
      'nodejs': FaNodeJs,
      'node.js': FaNodeJs,
      'python': FaPython,
      'java': FaJava,
      'html': FaHtml5,
      'html5': FaHtml5,
      'css': FaCss3Alt,
      'css3': FaCss3Alt,
      'javascript': FaJs,
      'js': FaJs,
      'jira': FaJira,
      'typescript': SiTypescript,
      'ts': SiTypescript,
      'mongodb': SiMongodb,
      'postgresql': SiPostgresql,
      'postgres': SiPostgresql,
      'spring': SiSpring,
      'spring boot': SiSpring,
      'springboot': SiSpring,
      'express': SiExpress,
      'expressjs': SiExpress,
      'django': SiDjango,
      'docker': FaDocker,
      'github': FaGithub,
      'git': FaGithub,
      'sql': FaDatabase,
      'database': FaDatabase,
      'tailwind': SiTailwindcss,
      'tailwindcss': SiTailwindcss,
      'unity': SiUnity,
      'unreal': SiUnrealengine,
      'unreal engine': SiUnrealengine,
      'c#': SiCsharp,
      'c++': SiCplusplus,
      'csharp': SiCsharp,
      'slack': FaSlack,
      'dev ops': SiAzuredevops,
      'devops': SiAzuredevops,
      'visual studio': FaMicrosoft,
      'perforce': SiPerforce
    };
    return iconMap[normalizedTechName] || null;
  }, []);

  // Technology icons component
  const TechIcon: React.FC<TechIconProps> = ({ tech }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const Icon = getIconComponent(tech?.name);

    return (
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="glass-effect p-3 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/20">
          {Icon ? (
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          ) : (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {tech?.name || 'Unknown'}
            </span>
          )}
        </div>
        
        {/* Tooltip */}
        <div className={`absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded shadow-lg transition-all duration-300 whitespace-nowrap z-10 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          {tech?.name || 'Unknown Technology'}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
        </div>
      </div>
    );
  };

  // Get total media count
  const totalMediaCount = (project?.images?.length || 0) + (project?.videoUrl ? 1 : 0);

  // Navigation handlers
  const nextItem = useCallback(() => {
    if (totalMediaCount <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalMediaCount);
  }, [totalMediaCount]);

  const prevItem = useCallback(() => {
    if (totalMediaCount <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalMediaCount) % totalMediaCount);
  }, [totalMediaCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevItem();
          break;
        case 'ArrowRight':
          nextItem();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal, nextItem, prevItem]);

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      document.body.style.overflow = '';
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle transition animation
  useEffect(() => {
    if (!isTransitioning) return;
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [isTransitioning]);

  if (!isOpen && !isAnimating) return null;
  if (!project) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0 pointer-events-none'
      }`}
      onClick={closeModal}
    >
      <div
        className={`glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-800/50">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient">
            {project.name}
          </h1>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Close modal"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Media Carousel */}
        {((project.images && project.images.length > 0) || project.videoUrl) && (
          <div className="relative">
            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg m-6 overflow-hidden">
              <div className={`w-full h-full transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}>
                {currentIndex < (project?.images?.length || 0) ? (
                  <img
                    src={project.images?.[currentIndex]?.image}
                    alt={`${project.name} - ${currentIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  project.videoUrl && (
                    <iframe
                      src={project.videoUrl}
                      title={project.name}
                      allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            {totalMediaCount > 1 && (
              <>
                <button
                  onClick={prevItem}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 glass-effect p-2 rounded-full hover:scale-110 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextItem}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 glass-effect p-2 rounded-full hover:scale-110 transition-all duration-200"
                  aria-label="Next image"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {Array.from({ length: totalMediaCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsTransitioning(true);
                        setCurrentIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? 'bg-primary-500 scale-125'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Description */}
          {project.descriptions && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {Array.isArray(project.descriptions)
                  ? project.descriptions.join(' ')
                  : project.descriptions}
              </p>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <TechIcon key={tech?.name || index} tech={tech} />
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {project.responsibilities && project.responsibilities.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Responsibilities
              </h3>
              <ul className="space-y-2">
                {project.responsibilities.map((task, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                  >
                    <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project Link */}
          {project.link && (
            <div className="pt-4 border-t border-white/10 dark:border-gray-800/50">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <HiExternalLink className="w-5 h-5" />
                View Project
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;