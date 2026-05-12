import { useState, useEffect } from 'react';
import './SceneAbout.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';

const SceneAbout = () => {
  const [stats, setStats] = useState({ projects: 0, years: 0, tech: 0, coffees: 0 });
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: About');

    const animate = () => {
      const targets = { projects: 5, years: 4, tech: 15, coffees: 42 };
      const duration = 1200;
      const start = Date.now();

      const step = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);

        setStats({
          projects: Math.floor(targets.projects * progress),
          years: Math.floor(targets.years * progress),
          tech: Math.floor(targets.tech * progress),
          coffees: Math.floor(targets.coffees * progress),
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    animate();
  }, [emit]);

  return (
    <div className="scene-about">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">About</h1>

        <div className="about-bio">
          <p>
            I'm a full-stack developer and creative technologist passionate about building interactive experiences that blend design, engineering, and artistic vision. With expertise in modern web technologies and game development, I create tools and applications that push the boundaries of what's possible on the web.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-big">{stats.projects}</div>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-big">{stats.years}+</div>
            <div className="stat-label">Years Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-big">{stats.tech}+</div>
            <div className="stat-label">Technologies</div>
          </div>
          <div className="stat-card">
            <div className="stat-big">☕ {stats.coffees}</div>
            <div className="stat-label">Coffees</div>
          </div>
        </div>

        <div className="about-section">
          <h2>Skills & Expertise</h2>
          <div className="skills-list">
            <div className="skill-tag">React</div>
            <div className="skill-tag">TypeScript</div>
            <div className="skill-tag">Three.js</div>
            <div className="skill-tag">WebGL</div>
            <div className="skill-tag">Node.js</div>
            <div className="skill-tag">Game Development</div>
            <div className="skill-tag">Creative Coding</div>
            <div className="skill-tag">UI/UX Design</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneAbout;
