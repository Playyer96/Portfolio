import { useState, useEffect } from 'react';
import './SceneStack.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchTechnologies } from '../data/api';

const SceneStack = () => {
  const [tech, setTech] = useState([]);
  const [loading, setLoading] = useState(true);
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Stack');
    emit('info', '> Loading technology stack...');

    fetchTechnologies()
      .then(data => {
        setTech(data);
        emit('ok', `✓ Loaded ${data.length} technologies`);
      })
      .catch(err => {
        emit('error', `✗ Failed to load technologies`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [emit]);

  const categories = [
    {
      name: 'Engines',
      icon: 'E',
      color: '#3b82f6',
      items: ['Unity', 'Unreal Engine', 'Custom engines'],
    },
    {
      name: 'Languages',
      icon: 'L',
      color: '#f59e0b',
      items: ['C#', 'C++', 'TypeScript', 'JavaScript', 'Python'],
    },
    {
      name: 'Web',
      icon: 'W',
      color: '#10b981',
      items: ['React', 'Next.js', 'Three.js', 'WebGL', 'Node.js'],
    },
    {
      name: 'XR/3D',
      icon: 'X',
      color: '#8b5cf6',
      items: ['OpenXR', 'Spatial Computing', 'VR Platforms', 'AR'],
    },
    {
      name: 'Tools',
      icon: 'T',
      color: '#ec4899',
      items: ['Git', 'CI/CD', 'Docker', 'AWS', 'Vercel', 'Database Design'],
    },
  ];

  return (
    <div className="scene-stack">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Stack</h1>

        {loading ? (
          <div className="loading-state">Compiling technology stack...</div>
        ) : (
          <div className="stack-grid">
            {categories.map((category, idx) => (
              <div
                key={category.name}
                className="tech-category"
                style={{
                  '--category-color': category.color,
                  '--category-delay': `${idx * 50}ms`,
                }}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h2 className="category-name">{category.name}</h2>
                </div>
                <div className="tech-items">
                  {category.items.map((item, i) => (
                    <div
                      key={i}
                      className="tech-item"
                      style={{ '--item-delay': `${i * 30}ms` }}
                    >
                      <span className="tech-name">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="stack-footer">
          <p className="footer-text">
            Tech evolves. Focus stays on shipping quality software, learning fast, and solving hard problems.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SceneStack;
