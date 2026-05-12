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
          emit('warn', '⚠ No projects returned from API');
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
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  return (
    <div className="scene-projects">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {selectedProject && (
          <div className="project-detail-overlay" ref={ref}>
            <div className="detail-card-container">
              <div
                className="detail-card"
                style={{
                  transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
                  background: `linear-gradient(135deg, ${selectedProject.color}, ${selectedProject.color}66)`,
                }}
              >
                <div className="detail-card-grid" />
                <button
                  className="detail-close-btn"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="detail-header">ASSET / {selectedProject.id?.toUpperCase() || 'PROJECT'}.PREFAB</div>
                <div className="detail-content">
                  <div className="detail-text">
                    <div className="detail-name">{selectedProject.name}</div>
                    <div className="detail-tagline">{selectedProject.description}</div>
                  </div>
                  <div className="detail-meta">
                    <div>{selectedProject.year || '—'}</div>
                    <div>{selectedProject.technologies?.[0] || 'Dev'}</div>
                    <div>{selectedProject.responsibilities?.[0] || '—'}</div>
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
                  className="project-card"
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
