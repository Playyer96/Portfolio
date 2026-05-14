import { useState, useEffect, useRef } from 'react';
import './SceneHome.css';
import GridBackground from '../ui/GridBackground';
import useMouseRotation from '../hooks/useMouseRotation';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects, fetchExperience, fetchTechnologies } from '../data/api';

const SceneHome = () => {
  const containerRef = useRef(null);
  const { handlers } = useMouseRotation(containerRef);
  const { emit } = useConsoleLog();
  const [stats, setStats] = useState({ projects: 0, years: 0, tech: 0 });

  const heroText = 'Danilo Vanegas';

  useEffect(() => {
    emit('info', '> Scene loaded: Home');

    Promise.all([
      fetchProjects(),
      fetchExperience(),
      fetchTechnologies(),
    ]).then(([projects, experience, tech]) => {
      const startYear = 2017;
      const currentYear = new Date().getFullYear();
      const yearsActive = currentYear - startYear;

      setStats({
        projects: projects.length || 8,
        years: yearsActive,
        tech: tech.length || 16,
      });
      emit('ok', '✓ Portfolio stats loaded');
    }).catch(() => {
      setStats({ projects: 8, years: 9, tech: 16 });
      emit('ok', '✓ Using default stats');
    });
  }, [emit]);

  return (
    <div className="scene-home" ref={containerRef} {...handlers}>
      <GridBackground />

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

          <div className="floating-card">
            <div className="card-stat">
              <div className="stat-number">{stats.projects}</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="card-stat">
              <div className="stat-number">{stats.years}+</div>
              <div className="stat-label">Years</div>
            </div>
            <div className="card-stat">
              <div className="stat-number">{stats.tech}+</div>
              <div className="stat-label">Technologies</div>
            </div>
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
      </div>
    </div>
  );
};

export default SceneHome;
