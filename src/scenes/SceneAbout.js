import { useState, useEffect } from 'react';
import './SceneAbout.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects, fetchExperience, fetchTechnologies } from '../data/api';
import { FiGlobe, FiZap, FiTool, FiRefreshCw, FiBarChart2 } from 'react-icons/fi';

const SceneAbout = () => {
  const [stats, setStats] = useState({ projects: 0, years: 0, tech: 0 });
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: About');

    Promise.all([
      fetchProjects(),
      fetchExperience(),
      fetchTechnologies(),
    ]).then(([projects, experience, tech]) => {
      const yearsActive = Math.floor((Date.now() - new Date('2019-03-01').getTime()) / (365.25 * 24 * 60 * 60 * 1000));

      const targets = {
        projects: projects.length || 8,
        years: yearsActive,
        tech: tech.length || 16,
      };

      const duration = 1200;
      const start = Date.now();

      const step = () => {
        const now = Date.now();
        const progress = Math.min((now - start) / duration, 1);

        setStats({
          projects: Math.floor(targets.projects * progress),
          years: Math.floor(targets.years * progress),
          tech: Math.floor(targets.tech * progress),
        });

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }).catch(() => {
      const fallbackYears = Math.floor((Date.now() - new Date('2019-03-01').getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      setStats({ projects: 8, years: fallbackYears, tech: 16 });
    });
  }, [emit]);

  return (
    <div className="scene-about">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">About</h1>

        <div className="about-bio">
          <p>
            Passionate full-stack developer & creative technologist building interactive experiences at the intersection of web, game development, and design. Expertise spans React, Three.js, game engines (Unity/Unreal), and XR platforms. I craft tools that empower teams and experiences that push boundaries.
          </p>
          <p style={{ marginTop: '16px' }}>
            Started coding in 2017. Built production systems at companies like Optic Power, shipped indie games, and shipped commercial tools. Focused on code quality, team velocity, and user impact.
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
            <div className="stat-big"><FiGlobe /></div>
            <div className="stat-label">Colombia, UTC-5</div>
          </div>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon"><FiZap /></div>
            <div className="value-title">Ship</div>
            <div className="value-desc">Bias toward shipping. Working code beats perfect plans.</div>
          </div>
          <div className="value-card">
            <div className="value-icon"><FiTool /></div>
            <div className="value-title">Tools</div>
            <div className="value-desc">Build abstractions that multiply team productivity.</div>
          </div>
          <div className="value-card">
            <div className="value-icon"><FiRefreshCw /></div>
            <div className="value-title">Cross-discipline</div>
            <div className="value-desc">Collaborate across domains. Best solutions emerge at boundaries.</div>
          </div>
          <div className="value-card">
            <div className="value-icon"><FiBarChart2 /></div>
            <div className="value-title">Performance</div>
            <div className="value-desc">Measure impact. Optimize ruthlessly. Details compound.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneAbout;
