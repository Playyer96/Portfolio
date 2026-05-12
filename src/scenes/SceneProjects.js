import React, { useState, useEffect, useRef } from 'react';
import './SceneProjects.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import ProjectModal from '../components/ProjectModal';
import { fetchProjects as fetchProjectsFromApi } from '../data/api';

const SceneProjects = ({ selectedProject = null, setSelectedProject = () => {} }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { emit } = useConsoleLog();
  const detailRef = useRef(null);

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

  useEffect(() => {
    if (selectedProject && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [selectedProject]);

  const handleCardClick = (project) => {
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  };

  return (
    <div className="scene-projects">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Projects</h1>

        {selectedProject && (
          <div className="project-split-panel">
            <div className="split-images">
              {selectedProject.images?.[0] && <img src={selectedProject.images[0]} alt={selectedProject.name} />}
            </div>
            <div className="split-details">
              <h2>{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
              <h3>Technologies</h3>
              <div>{selectedProject.technologies?.join(' • ')}</div>
              <h3 style={{marginTop:'16px'}}>Key Work</h3>
              <ul>{selectedProject.responsibilities?.map((r,i)=><li key={i}>{r}</li>)}</ul>
              <button onClick={()=>setSelectedProject(null)} style={{marginTop:'24px'}}>Close</button>
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
