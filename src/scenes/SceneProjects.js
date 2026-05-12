import { useState, useEffect, useRef } from 'react';
import './SceneProjects.css';
import GridBackground from '../ui/GridBackground';
import useMouseRotation from '../hooks/useMouseRotation';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects as fetchProjectsFromApi } from '../data/api';

const SceneProjects = ({ selectedProject = null, setSelectedProject = () => {} }) => {
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState(selectedProject?.id || null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { emit } = useConsoleLog();

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
    setExpanded(selectedProject?.id === project.id ? null : project.id);
  };

  return (
    <div className="scene-projects" ref={containerRef}>
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {loading ? (
          <div className="loading-state">Compiling project data...</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                style={{
                  '--project-color': project.color || 'var(--pb-accent)',
                  '--card-delay': `${idx * 50}ms`,
                }}
                onClick={() => handleCardClick(project)}
              >
                <div className="card-inner">
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
                    </div>
                  </div>

                  <div className="card-back">
                    <div className="back-content">
                      <h4 className="back-label">Technologies</h4>
                      <div className="tech-grid">
                        {project.technologies?.slice(0, 4).map((tech, i) => (
                          <span key={i} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <h4 className="back-label" style={{ marginTop: '16px' }}>
                        Key Work
                      </h4>
                      <ul className="work-list">
                        {project.responsibilities?.slice(0, 2).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedProject && (
          <div className="project-details-panel">
            <div className="details-header">
              <h2>{selectedProject.name}</h2>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>
                ✕
              </button>
            </div>
            <div className="details-content">
              <div className="detail-col">
                <h4>About</h4>
                <p>{selectedProject.summary || selectedProject.description}</p>
              </div>
              <div className="detail-col">
                <h4>Technologies</h4>
                <div className="full-tech-list">
                  {selectedProject.technologies?.map((tech, i) => (
                    <span key={i} className="tech-full-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="detail-col">
                <h4>Responsibilities</h4>
                <ul className="resp-list">
                  {selectedProject.responsibilities?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneProjects;
