import { useState } from 'react';
import '../styles/ProjectDetail.css';

const ProjectDetail = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const images = project.images || [];
  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="project-detail">
      <div className="detail-header">
        <div>
          <h3 className="detail-project-name">{project.name}</h3>
          <p className="detail-description">{project.description}</p>
        </div>
        <button className="detail-close" onClick={onClose} title="Close">✕</button>
      </div>

      {images.length > 0 && (
        <div className="detail-images">
          <div className="image-carousel">
            <img src={currentImage} alt={`${project.name} ${currentImageIndex + 1}`} className="carousel-image" />
            {hasMultipleImages && (
              <div className="carousel-nav">
                <button className="carousel-btn prev" onClick={handlePrevImage}>‹</button>
                <span className="carousel-counter">{currentImageIndex + 1}/{images.length}</span>
                <button className="carousel-btn next" onClick={handleNextImage}>›</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="detail-content">
        <div className="detail-column">
          <h4 className="detail-label">Technologies</h4>
          <div className="detail-tech-list">
            {project.technologies?.map((tech, i) => (
              <span key={i} className="detail-tech">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-column">
          <h4 className="detail-label">Key Work</h4>
          <ul className="detail-list">
            {project.responsibilities?.map((resp, i) => (
              <li key={i}>{resp}</li>
            ))}
          </ul>
        </div>

        {project.year && (
          <div className="detail-column">
            <h4 className="detail-label">Year</h4>
            <p className="detail-year">{project.year}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
