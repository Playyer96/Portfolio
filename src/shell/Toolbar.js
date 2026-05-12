import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Toolbar.css';

const Toolbar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();

  const getSceneName = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  const tools = ['Q', 'W', 'E', 'R', 'T'];

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {tools.map(tool => (
          <button key={tool} className="tool-btn" title={`Tool ${tool}`}>
            {tool}
          </button>
        ))}
      </div>

      <div className="toolbar-center">
        <button
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Stop' : 'Play'}
        >
          {isPlaying ? '⏹' : '▶'}
        </button>
      </div>

      <div className="toolbar-right">
        <div className="scene-pill">{getSceneName()}</div>
      </div>
    </div>
  );
};

export default Toolbar;
