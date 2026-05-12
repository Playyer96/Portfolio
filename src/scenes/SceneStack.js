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

  const categorizeApiTech = (techArray) => {
    const keywordMap = {
      'Engines':   ['unity', 'unreal', 'engine', 'godot'],
      'Languages': ['c#', 'c++', 'typescript', 'javascript', 'python', 'rust', 'go', 'glsl', 'hlsl'],
      'Web':       ['react', 'next', 'three', 'webgl', 'node', 'vue', 'angular', 'svelte', 'html', 'css'],
      'XR/3D':     ['openxr', 'vr', 'ar', 'xr', 'spatial', 'hololens', 'quest', 'blender', 'substance'],
      'Tools':     ['git', 'docker', 'aws', 'vercel', 'ci', 'cd', 'sql', 'postgres', 'redis', 'jira', 'jenkins'],
    };
    const result = {};
    categories.forEach(cat => { result[cat.name] = { color: cat.color, items: [] }; });
    const uncategorized = [];
    techArray.forEach(t => {
      const name = (t.name || String(t)).toLowerCase();
      let placed = false;
      for (const [catName, kws] of Object.entries(keywordMap)) {
        if (kws.some(kw => name.includes(kw))) {
          result[catName].items.push(t.name || String(t));
          placed = true;
          break;
        }
      }
      if (!placed) uncategorized.push(t.name || String(t));
    });
    result['Tools'].items.push(...uncategorized);
    return result;
  };

  const categorized = tech.length > 0 ? categorizeApiTech(tech) : null;

  return (
    <div className="scene-stack">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Stack</h1>

        {loading ? (
          <div className="loading-state">Compiling technology stack...</div>
        ) : (
          <div className="asset-manifest">
            <div className="manifest-head">
              <span className="manifest-title">TECHNOLOGY MANIFEST</span>
              <span className="manifest-total">{tech.length > 0 ? `${tech.length} items` : `${categories.reduce((n, c) => n + c.items.length, 0)} items`}</span>
            </div>
            {categories.map((cat) => {
              const items = categorized ? categorized[cat.name].items : cat.items;
              if (items.length === 0) return null;
              return (
                <div key={cat.name} className="manifest-section">
                  <div className="manifest-section-head" style={{ '--cat-color': cat.color }}>
                    <span className="manifest-cat-name">{cat.name.toUpperCase()}</span>
                    <span className="manifest-cat-count">{items.length}</span>
                  </div>
                  <div className="manifest-items">
                    {items.map((item, i) => (
                      <div key={i} className="manifest-item">
                        <span className="manifest-diamond">◆</span>
                        <span className="manifest-item-name">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneStack;
