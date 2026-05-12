import { useState, useEffect, useRef } from 'react';
import './SceneProjects.css';
import GridBackground from '../ui/GridBackground';
import useMouseRotation from '../hooks/useMouseRotation';
import useConsoleLog from '../hooks/useConsoleLog';

const defaultProjects = [
  {
    id: 'atlas',
    name: 'Atlas VR Training Platform',
    year: '2024',
    role: 'Lead Unity Engineer',
    color: 'oklch(72% 0.18 35)',
    description: 'Multi-tenant VR training for high-risk industrial procedures.',
    summary: 'A Unity 6 platform delivering OSHA-aligned VR training to operators in mining, oil & gas, and manufacturing.',
    technologies: ['Unity 6', 'C#', 'OpenXR', 'Quest 3', 'Next.js', 'PostgreSQL'],
    responsibilities: [
      'Architected the simulation runtime',
      'Authored the procedure DSL',
      'Built the C# → React telemetry bridge',
    ],
    featured: true,
  },
  {
    id: 'pulse',
    name: 'Pulse Engine Tools',
    year: '2024',
    role: 'Tools Engineer',
    color: 'oklch(72% 0.18 200)',
    description: 'An in-engine authoring suite that replaced six external tools.',
    summary: 'Custom Unity Editor extension consolidating shader graph, animation timelines, and procedural-content authoring.',
    technologies: ['Unity Editor', 'C#', 'UI Toolkit', 'GraphView API'],
    responsibilities: [
      'Designed the docking system',
      'Created IMGUI editor surfaces',
      'Integrated asset-database',
    ],
    featured: true,
  },
  {
    id: 'drift',
    name: 'Drift Arcade',
    year: '2023',
    role: 'Solo Developer',
    color: 'oklch(72% 0.18 295)',
    description: 'Unreal 5 arcade racer prototype with Niagara particle wizardry.',
    summary: 'Vehicle physics built from scratch, Niagara-driven smoke and tire systems, and a custom replay system.',
    technologies: ['Unreal 5', 'C++', 'Blueprints', 'Niagara', 'Chaos'],
    responsibilities: [
      'Gameplay and VFX programming',
      'Level design and iteration',
      'Audio integration and optimization',
    ],
    featured: true,
  },
];

const SceneProjects = () => {
  const [projects, setProjects] = useState(defaultProjects);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Projects');
    emit('info', '> Fetching project data...');

    const fetchProjects = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/projects`, { timeout: 2000 });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
          emit('ok', '✓ Projects loaded from API');
        }
      } catch (err) {
        emit('ok', '✓ Projects loaded (local)');
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchProjects, 200);
  }, [emit]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
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
                  onClick={() => toggleExpand(project.id)}
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
