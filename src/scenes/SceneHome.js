import { useState, useEffect, useRef } from 'react';
import './SceneHome.css';
import GridBackground from '../ui/GridBackground';
import useMouseRotation from '../hooks/useMouseRotation';
import useConsoleLog from '../hooks/useConsoleLog';

const SceneHome = () => {
  const containerRef = useRef(null);
  const { style, handlers } = useMouseRotation(containerRef);
  const { emit } = useConsoleLog();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const trailRef = useRef(null);

  const heroText = 'Danilo Vanegas';

  useEffect(() => {
    emit('info', '> Scene loaded: Home');
    emit('info', '> Initializing typewriter...');

    const bootLogs = [
      'Loading portfolio engine...',
      'Compiling assets...',
      'Initializing 3D context...',
      'Ready to render.',
    ];

    bootLogs.forEach((log, i) => {
      setTimeout(() => {
        emit('ok', `✓ ${log}`);
      }, 240 * (i + 1));
    });
  }, [emit]);

  useEffect(() => {
    const handleMouseMove = e => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (trailRef.current) {
        trailRef.current.style.left = `${e.clientX - 8}px`;
        trailRef.current.style.top = `${e.clientY - 8}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="scene-home" ref={containerRef} {...handlers}>
      <GridBackground />
      <div className="cursor-trail" ref={trailRef} />

      <div className="scene-content">
        <div className="hero-section">
          <h1 className="hero-text">
            {heroText.split('').map((char, i) => (
              <span key={i} style={{ '--char-i': i }}>
                {char}
              </span>
            ))}
          </h1>
          <p className="hero-subtitle">Software Engineer / Creative Developer</p>

          <div className="cta-buttons">
            <button className="magnetic-btn primary" onClick={() => window.location.href = '/projects'}>
              View Projects
            </button>
            <button className="magnetic-btn secondary" onClick={() => window.location.href = '/cv'}>
              Download CV
            </button>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee">
            {['React', 'TypeScript', 'Three.js', 'WebGL', 'Node.js', 'Game Dev', 'Creative Coding', 'UI/UX'].map((tech, i) => (
              <div key={i} className="marquee-item">
                {tech}
              </div>
            ))}
            {['React', 'TypeScript', 'Three.js', 'WebGL', 'Node.js', 'Game Dev', 'Creative Coding', 'UI/UX'].map((tech, i) => (
              <div key={`copy-${i}`} className="marquee-item">
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="floating-card">
          <div className="card-stat">
            <div className="stat-number">5</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="card-stat">
            <div className="stat-number">4+</div>
            <div className="stat-label">Years</div>
          </div>
          <div className="card-stat">
            <div className="stat-number">15+</div>
            <div className="stat-label">Technologies</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneHome;
