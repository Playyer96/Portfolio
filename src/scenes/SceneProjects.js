import React, { useState, useEffect, useRef } from 'react';
import './SceneProjects.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import ProjectModal from '../components/ProjectModal';
import { fetchProjects as fetchProjectsFromApi } from '../data/api';

const use3D = (strength = 12) => {
  const ref = useRef(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setRot({ x: -py * strength, y: px * strength * 1.4 }));
    };
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, rot];
};

const SceneProjects = ({ selectedProject = null, setSelectedProject = () => {} }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const { emit } = useConsoleLog();
  const [ref, rot] = use3D(14);

  useEffect(() => {
    emit('info', '> Scene loaded: Projects');
    emit('info', '> Fetching project data...');

    const loadProjects = async () => {
      try {
        const data = await fetchProjectsFromApi();
        setProjects(data);
        if (data.length > 0) {
          emit('ok', `✓ Loaded ${data.length} projects from API`);
        } else {
          emit('warn', '! No projects returned from API');
        }
      } catch (err) {
        emit('error', `✗ Failed to load projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadProjects, 200);
    return () => clearTimeout(timeoutId);
  }, [emit]);

  const handleCardClick = (project) => {
    setCarouselIdx(0);
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  const carouselStep = (e, dir) => {
    e.stopPropagation();
    const len = selectedProject?.images?.length || 0;
    if (len > 1) setCarouselIdx(i => (i + dir + len) % len);
  };

  return (
    <div className="scene-projects">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {selectedProject && (
          <div className="project-detail-overlay" ref={ref} onClick={() => setSelectedProject(null)}>
            <div className="detail-card-container" onClick={(e) => e.stopPropagation()}>
              <div
                className="detail-card"
                style={{
                  transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                  '--project-color': selectedProject.color || 'var(--pb-accent)',
                }}
              >
                <div className="detail-card-grid" />
                <div className="detail-header">
                  <span>ASSET / {selectedProject.id?.toUpperCase() || 'PROJECT'}.PREFAB</span>
                  <button
                    className="detail-close-btn"
                    onClick={() => setSelectedProject(null)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {/* Body: carousel left, content right */}
                <div className="detail-body">
                  {selectedProject.images?.length > 0 && (
                    <div className="detail-carousel">
                      <img
                        className="carousel-img"
                        src={selectedProject.images[carouselIdx]}
                        alt={`${selectedProject.name} ${carouselIdx + 1}`}
                      />
                      {selectedProject.images.length > 1 && (
                        <>
                          <button className="carousel-btn carousel-prev" onClick={(e) => carouselStep(e, -1)}>‹</button>
                          <button className="carousel-btn carousel-next" onClick={(e) => carouselStep(e, 1)}>›</button>
                          <div className="carousel-dots">
                            {selectedProject.images.map((_, i) => (
                              <span
                                key={i}
                                className={`carousel-dot${i === carouselIdx ? ' active' : ''}`}
                                onClick={(e) => { e.stopPropagation(); setCarouselIdx(i); }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="detail-content">
                    <div className="detail-name">{selectedProject.name}</div>
                    <div className="detail-tagline">{selectedProject.description}</div>
                    {selectedProject.technologies?.length > 0 && (
                      <div className="detail-tags">
                        {selectedProject.technologies.map(t => (
                          <span key={t} className="detail-tag">{t}</span>
                        ))}
                      </div>
                    )}
                    {selectedProject.responsibilities?.length > 0 && (
                      <ul className="detail-responsibilities">
                        {selectedProject.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">Compiling project data...</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, idx) => (
              (
                <div
                  key={project.id}
                  className={`project-card${selectedProject?.id === project.id ? ' gizmo-selected' : ''}`}
                  data-name={project.name}
                  style={{
                    '--project-color': project.color || 'var(--pb-accent)',
                    '--card-delay': `${idx * 50}ms`,
                  }}
                  onClick={() => handleCardClick(project)}
                >
                  <div className="card-front">
                    <div className="card-header">
                      <h3 className="card-title">{project.name}</h3>
                      <span className="card-year">{project.year || '—'}</span>
                    </div>
                    <p className="card-desc">{project.description}</p>
                    <div className="card-meta">
                      <span className="tech-count">
                        {project.technologies?.length || 0} tech
                      </span>
                      <span className="click-hint">Expand</span>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneProjects;
