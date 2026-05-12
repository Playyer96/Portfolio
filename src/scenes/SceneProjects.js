import { useState, useEffect } from 'react';
import './SceneProjects.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects as fetchProjectsFromApi } from '../data/api';

const SceneProjects = ({ selectedProject = null, setSelectedProject = () => {} }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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
  };

  return (
    <div className="scene-projects">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {selectedProject && (
          <div className="project-image-strip">
            {selectedProject.images && selectedProject.images.length > 0 ? (
              selectedProject.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${selectedProject.name} ${i + 1}`}
                  className="strip-image"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              ))
            ) : (
              <div
                className="strip-placeholder"
                style={{ background: `linear-gradient(135deg, ${selectedProject.color || 'var(--pb-accent)'} 0%, var(--pb-bg) 100%)` }}
              >
                <span className="strip-label">{selectedProject.name}</span>
              </div>
            )}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default SceneProjects;
