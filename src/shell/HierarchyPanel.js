import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HierarchyPanel.css';
import { fetchProjects, fetchExperience } from '../data/api';

const HierarchyPanel = ({
  selectedProject = null,
  setSelectedProject = () => {},
  selectedExperience = null,
  setSelectedExperience = () => {},
}) => {
  const [scenesOpen, setScenesOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProjects().then(setProjects).catch(() => setProjects([]));
    fetchExperience().then(setExperience).catch(() => setExperience([]));
  }, []);

  const scenes = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects', children: projects },
    { name: 'Experience', path: '/experience', children: experience },
    { name: 'Resume', path: '/cv' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="hierarchy-panel">
      <div className="hierarchy-header">Hierarchy</div>

      <div className="hierarchy-tree">
        <div className="tree-item">
          <button className="tree-toggle" onClick={() => setScenesOpen(!scenesOpen)}>
            {scenesOpen ? '▼' : '▶'}
          </button>
          <span className="tree-label">Scenes</span>
        </div>

        {scenesOpen && (
          <div className="tree-children">
            {scenes.map(scene => (
              <div key={scene.path}>
                <div className={`tree-item ${scene.children?.length ? '' : 'leaf'} ${isActive(scene.path) ? 'active' : ''}`}>
                  {scene.children?.length > 0 && (
                    <button
                      className="tree-toggle"
                      onClick={() => {
                        if (scene.path === '/projects') setProjectsOpen(!projectsOpen);
                        if (scene.path === '/experience') setExperienceOpen(!experienceOpen);
                      }}
                    >
                      {scene.path === '/projects' && (projectsOpen ? '▼' : '▶')}
                      {scene.path === '/experience' && (experienceOpen ? '▼' : '▶')}
                      {!scene.children?.length && <span style={{ visibility: 'hidden' }}>▶</span>}
                    </button>
                  )}
                  {!scene.children?.length && <span style={{ width: '12px' }} />}
                  <span className="tree-icon">{isActive(scene.path) ? '★' : '•'}</span>
                  <button
                    className="tree-label scene-link"
                    onClick={() => navigate(scene.path)}
                  >
                    {scene.name}
                    {scene.children?.length > 0 && (
                      <span className="badge">{scene.children.length}</span>
                    )}
                  </button>
                </div>

                {scene.path === '/projects' && projectsOpen && (
                  <div className="tree-children">
                    {projects.map(project => (
                      <div
                        key={project.id}
                        className={`tree-item leaf project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                      >
                        <span className="tree-icon">📦</span>
                        <button
                          className="tree-label"
                          onClick={() => setSelectedProject(project)}
                        >
                          {project.name}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {scene.path === '/experience' && experienceOpen && (
                  <div className="tree-children">
                    {experience.map(item => (
                      <div
                        key={item.id}
                        className={`tree-item leaf experience-item ${selectedExperience?.id === item.id ? 'selected' : ''}`}
                      >
                        <span className="tree-icon">💼</span>
                        <button
                          className="tree-label"
                          onClick={() => setSelectedExperience(item)}
                        >
                          {item.company}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="tree-item" style={{ marginTop: '12px' }}>
          <button className="tree-toggle" onClick={() => setAssetsOpen(!assetsOpen)}>
            {assetsOpen ? '▼' : '▶'}
          </button>
          <span className="tree-label">Assets</span>
        </div>

        {assetsOpen && (
          <div className="tree-children">
            <div className="tree-item leaf">
              <span className="tree-icon">📄</span>
              <span className="tree-label">CV.pdf</span>
            </div>
            <div className="tree-item leaf">
              <span className="tree-icon">🎨</span>
              <span className="tree-label">Tech Icons</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyPanel;
