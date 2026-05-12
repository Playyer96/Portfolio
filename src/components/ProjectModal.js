import { useEffect, useState } from 'react';
import '../styles/ProjectModal.css';

const ProjectModal = ({ project, onClose, allProjects, onNext, onPrev }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

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
    <div className="project-modal-overlay" onClick={onClose}>
      <div className="project-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close (Esc)">✕</button>

        <div className="modal-header">
          <h2 className="modal-title">{project.name}</h2>
          <span className="modal-year">{project.year || '—'}</span>
        </div>

        <div className="modal-content">
          <div className="modal-images">
            {images.length > 0 ? (
              <>
                <div className="image-container">
                  <img src={currentImage} alt={`${project.name} ${currentImageIndex + 1}`} className="modal-image" />
                </div>
                {hasMultipleImages && (
                  <div className="image-nav">
                    <button className="nav-btn prev" onClick={handlePrevImage}>‹</button>
                    <div className="image-counter">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                    <button className="nav-btn next" onClick={handleNextImage}>›</button>
                  </div>
                )}
              </>
            ) : (
              <div className="image-placeholder" style={{ background: `linear-gradient(135deg, ${project.color || 'var(--pb-accent)'} 0%, var(--pb-bg) 100%)` }}>
                <span className="placeholder-text">{project.name}</span>
              </div>
            )}
          </div>

          <div className="modal-details">
            <div className="detail-section">
              <h3 className="detail-title">Description</h3>
              <p className="detail-text">{project.description}</p>
            </div>

            <div className="detail-section">
              <h3 className="detail-title">Technologies</h3>
              <div className="tech-list">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3 className="detail-title">Key Work</h3>
              <ul className="responsibilities-list">
                {project.responsibilities?.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="nav-project-btn" onClick={onPrev} title="Previous project">←</button>
          <span className="project-counter">{project.id}</span>
          <button className="nav-project-btn" onClick={onNext} title="Next project">→</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
