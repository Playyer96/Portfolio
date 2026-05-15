import { useState, useEffect, useRef } from 'react';
import './SceneHome.css';
import GridBackground from '../ui/GridBackground';
import useMouseRotation from '../hooks/useMouseRotation';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects, fetchExperience, fetchTechnologies } from '../data/api';
import { YEARS_MS, CAREER_START_FALLBACK, FALLBACK_PROJECT_COUNT, FALLBACK_TECH_COUNT } from '../constants';

const SceneHome = ({ about = null }) => {
  const containerRef = useRef(null);
  const { handlers } = useMouseRotation(containerRef);
  const { emit } = useConsoleLog();
  const [stats, setStats] = useState({ projects: 0, years: 0, tech: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const heroText = about?.heroText || 'Danilo Vanegas';
  const subtitle = about?.subtitle || 'Software Engineer / Creative Developer';
  const marquee  = about?.marqueeItems || ['React', 'TypeScript', 'Three.js', 'WebGL', 'Node.js', 'Game Dev', 'Creative Coding', 'UI/UX'];
  const startDate = about?.careerStartDate || CAREER_START_FALLBACK;

  useEffect(() => {
    emit('info', '> Scene loaded: Home');

    Promise.all([fetchProjects(), fetchExperience(), fetchTechnologies()])
      .then(([projects, experience, tech]) => {
        const yearsActive = Math.floor((Date.now() - new Date(startDate).getTime()) / YEARS_MS);
        setStats({ projects: projects.length || FALLBACK_PROJECT_COUNT, years: yearsActive, tech: tech.length || FALLBACK_TECH_COUNT });
        setStatsLoaded(true);
        emit('ok', '✓ Portfolio stats loaded');
      })
      .catch(() => {
        const yearsActive = Math.floor((Date.now() - new Date(startDate).getTime()) / YEARS_MS);
        setStats({ projects: FALLBACK_PROJECT_COUNT, years: yearsActive, tech: FALLBACK_TECH_COUNT });
        setStatsLoaded(true);
        emit('warn', '! Using fallback stats');
      });
  }, [emit, startDate]);

  return (
    <div className="scene-home" ref={containerRef} {...handlers}>
      <GridBackground />

      <div className="scene-content">
        <div className="hero-section">
          <h1 className="hero-text">
            {heroText.split('').map((char, i) => (
              <span key={i} style={{ '--char-i': i }}>{char}</span>
            ))}
          </h1>
          <p className="hero-subtitle">{subtitle}</p>

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
              {statsLoaded ? <div className="stat-number">{stats.projects}</div> : <div className="skel-stat-num pb-shimmer" />}
              <div className="stat-label">Projects</div>
            </div>
            <div className="card-stat">
              {statsLoaded ? <div className="stat-number">{stats.years}+</div> : <div className="skel-stat-num pb-shimmer" />}
              <div className="stat-label">Years</div>
            </div>
            <div className="card-stat">
              {statsLoaded ? <div className="stat-number">{stats.tech}+</div> : <div className="skel-stat-num pb-shimmer" />}
              <div className="stat-label">Technologies</div>
            </div>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee">
            {[...marquee, ...marquee].map((item, i) => (
              <div key={i} className="marquee-item">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneHome;
