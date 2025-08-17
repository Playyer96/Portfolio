import React, { useState } from 'react';
import { HiEye } from 'react-icons/hi';

interface ProjectItemProps {
  image: string;
  name: string;
  onClick: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ image, name, onClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="group relative glass-card overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/20"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`View project: ${name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden rounded-lg">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {/* View Icon */}
        <div className={`absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <HiEye className="w-5 h-5 text-white" />
        </div>
      </div>
      
      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          {name}
        </h3>
        
        {/* Animated underline */}
        <div className={`h-0.5 bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-300 ${
          isHovered ? 'w-full' : 'w-0'
        }`} />
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/10 to-purple-500/10 transition-opacity duration-300 pointer-events-none ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
    </div>
  );
};

export default ProjectItem;