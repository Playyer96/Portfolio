import { useState, useEffect } from 'react';
import './SceneAbout.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchProjects, fetchExperience, fetchTechnologies } from '../data/api';
import { FiGlobe, FiZap, FiTool, FiRefreshCw, FiBarChart2 } from 'react-icons/fi';

const ICON_MAP = { FiZap, FiTool, FiRefreshCw, FiBarChart2 };

const SceneAbout = ({ about = null }) => {
  const [stats, setStats] = useState({ projects: 0, years: 0, tech: 0 });
  const [colTime, setColTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: about?.timezone || 'America/Bogota' })
  );

  const tz        = about?.timezone      || 'America/Bogota';
  const startDate = about?.careerStartDate || '2019-03-01';
  const bio       = about?.bio           || [];
  const values    = about?.values        || [];

  useEffect(() => {
    const id = setInterval(() => {
      setColTime(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: tz }));
    }, 1000);
    return () => clearInterval(id);
  }, [tz]);

  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: About');

    Promise.all([fetchProjects(), fetchExperience(), fetchTechnologies()])
      .then(([projects, experience, tech]) => {
        const yearsActive = Math.floor((Date.now() - new Date(startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        const targets = { projects: projects.length || 8, years: yearsActive, tech: tech.length || 16 };

        const duration = 1200;
        const start    = Date.now();
        const step     = () => {
          const progress = Math.min((Date.now() - start) / duration, 1);
          setStats({
            projects: Math.floor(targets.projects * progress),
            years:    Math.floor(targets.years    * progress),
            tech:     Math.floor(targets.tech     * progress),
          });
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      })
      .catch(() => {
        const fallbackYears = Math.floor((Date.now() - new Date(startDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
        setStats({ projects: 8, years: fallbackYears, tech: 16 });
      });
  }, [emit, startDate]);

  return (
    <div className="scene-about">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">About</h1>

        <div className="about-bio">
          {bio.length > 0
            ? bio.map((p, i) => <p key={i} style={i > 0 ? { marginTop: '16px' } : undefined}>{p}</p>)
            : (
              <>
                <p>Passionate full-stack developer &amp; creative technologist building interactive experiences at the intersection of web, game development, and design.</p>
                <p style={{ marginTop: '16px' }}>Started coding in 2017. Focused on code quality, team velocity, and user impact.</p>
              </>
            )
          }
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
            <div className="stat-label">{about?.locationDisplay || 'Medellín, Colombia'}</div>
            <div className="stat-label" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>{colTime}</div>
          </div>
        </div>

        {values.length > 0 && (
          <div className="values-grid">
            {values.map((v, i) => {
              const Icon = ICON_MAP[v.iconKey];
              return (
                <div key={i} className="value-card">
                  <div className="value-icon">{Icon ? <Icon /> : null}</div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-desc">{v.desc}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneAbout;
