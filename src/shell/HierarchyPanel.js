import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './HierarchyPanel.css';

const HierarchyPanel = () => {
  const [scenesOpen, setScenesOpen] = useState(true);
  const [assetsOpen, setAssetsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const scenes = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Experience', path: '/experience' },
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
              <div key={scene.path} className={`tree-item leaf ${isActive(scene.path) ? 'active' : ''}`}>
                <span className="tree-icon">{isActive(scene.path) ? '★' : '•'}</span>
                <button
                  className="tree-label scene-link"
                  onClick={() => navigate(scene.path)}
                >
                  {scene.name}
                </button>
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
