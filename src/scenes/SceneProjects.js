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

  const toggleExpand = (project) => {
    const newExpanded = expanded === project.id ? null : project.id;
    setExpanded(newExpanded);
    if (newExpanded) {
      setSelectedProject(project);
    } else {
      setSelectedProject(null);
    }
  };

  return (
    <div className="scene-projects" ref={containerRef}>
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {loading ? (
          <div className="loading-state">Compiling project data...</div>
        ) : (
          <div className="projects-list">
            {projects.map(project => (
              <div
                key={project.id}
                className={`project-row ${expanded === project.id ? 'expanded' : ''}`}
                style={{
                  '--project-color': project.color || 'var(--pb-accent)',
                }}
              >
                <button
                  className="project-header"
                  onClick={() => toggleExpand(project)}
                >
                  <span className="project-toggle">
                    {expanded === project.id ? '▼' : '▶'}
                  </span>
                  <h3 className="project-name">{project.name}</h3>
                  <span className="project-year">{project.year}</span>
                  <span className="project-status">{project.status}</span>
                </button>

                {expanded === project.id && (
                  <div className="project-details">
                    <div className="detail-section">
                      <p className="detail-text">{project.description}</p>
                    </div>

                    <div className="detail-section">
                      <h4 className="detail-label">Role</h4>
                      <p className="detail-text">{project.role}</p>
                    </div>

                    <div className="detail-section">
                      <h4 className="detail-label">Technologies</h4>
                      <div className="tech-list">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4 className="detail-label">Responsibilities</h4>
                      <ul className="responsibilities">
                        {project.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneProjects;
