import { useState, useEffect, useRef } from 'react';
import './SceneExperience.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchExperience as fetchExperienceFromApi } from '../data/api';
import { FiMapPin, FiBriefcase, FiBook } from 'react-icons/fi';
import { YEARS_MS, CAREER_START_FALLBACK } from '../constants';

function calcDuration(period) {
  if (!period) return '';
  const sep = period.indexOf(' - ');
  if (sep === -1) return '';
  const startStr = period.slice(0, sep).toLowerCase();
  const endStr = period.slice(sep + 3).toLowerCase();
  const monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
  const parseDate = (s) => {
    s = s.trim();
    if (s === 'present') return new Date(new Date().getFullYear(), new Date().getMonth());
    const year = parseInt(s.match(/\d{4}/)?.[0]);
    if (!year) return null;
    for (const [abbr, mo] of Object.entries(monthMap)) {
      if (s.includes(abbr)) return new Date(year, mo);
    }
    return new Date(year, 0);
  };
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  if (!start || !end) return '';
  const total = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  if (total < 1) return '';
  const y = Math.floor(total / 12);
  const m = total % 12;
  if (y === 0) return `${m}mo`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}mo`;
}


const WORK_COLORS = [
  'var(--pb-accent)',
  '#10b981',
  '#f59e0b',
  '#06b6d4',
  '#8b5cf6',
];

const WorkEntrySkeleton = ({ idx, isLast }) => (
  <div className="work-entry-skel" style={{ '--entry-delay': `${idx * 0.06}s` }}>
    <div className="work-entry__track">
      <div className="work-entry__dot skel-exp-dot" />
      {!isLast && <div className="work-entry__line" />}
    </div>
    <div className="skel-exp-content">
      <div className="skel-exp-header">
        <div>
          <div className="skel-exp-bar skel-exp-company pb-shimmer" />
          <div className="skel-exp-bar skel-exp-role pb-shimmer" />
        </div>
        <div className="skel-exp-meta-col">
          <div className="skel-exp-bar skel-exp-period pb-shimmer" />
          <div className="skel-exp-bar skel-exp-badge pb-shimmer" />
        </div>
      </div>
      <div className="skel-exp-chips">
        <div className="skel-exp-bar skel-exp-chip pb-shimmer" />
        <div className="skel-exp-bar skel-exp-chip pb-shimmer" />
        <div className="skel-exp-bar skel-exp-chip pb-shimmer" />
      </div>
    </div>
  </div>
);

const EduCardSkeleton = () => (
  <div className="edu-card-skel">
    <div className="skel-edu-header">
      <div className="skel-exp-bar skel-edu-title pb-shimmer" />
      <div className="skel-exp-bar skel-edu-period pb-shimmer" />
    </div>
    <div className="skel-exp-bar skel-edu-inst pb-shimmer" />
    <div className="skel-exp-bar skel-edu-loc pb-shimmer" />
  </div>
);

const SceneExperience = ({ about = null, selectedExperience = null, setSelectedExperience = () => {} }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef({});
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Experience');
    emit('info', '> Fetching experience timeline...');
    const loadExperience = async () => {
      try {
        const data = await fetchExperienceFromApi();
        setItems(data);
        if (data.length > 0) emit('ok', `✓ Loaded ${data.length} experience items from API`);
        else emit('warn', '! No experience items returned from API');
      } catch (err) {
        emit('error', `✗ Failed to load experience: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    const id = setTimeout(loadExperience, 200);
    return () => clearTimeout(id);
  }, [emit]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting)
          setVisibleItems(prev => new Set([...prev, e.target.dataset.id]));
      }),
      { threshold: 0.08 }
    );
    Object.values(itemRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [items]);

  const workItems = items.filter(i => i.type === 'Work');
  const eduItems  = items.filter(i => i.type === 'Education');
  const careerStart = about?.careerStartDate || CAREER_START_FALLBACK;
  const yearsActive = Math.floor((Date.now() - new Date(careerStart).getTime()) / YEARS_MS);

  return (
    <div className="scene-experience">
      <GridBackground />
      <div className="scene-content">

        <div className="exp-head">
          <h1 className="section-heading">Experience</h1>
          {items.length > 0 && (
            <p className="exp-tagline">
              <span className="exp-tagline__val">{workItems.length}</span> roles &nbsp;·&nbsp;
              <span className="exp-tagline__val">{yearsActive}+</span> years &nbsp;·&nbsp;
              <span className="exp-tagline__val">Unity / Unreal</span>
            </p>
          )}
        </div>

        {loading && (
          <>
            <section className="exp-section">
              <div className="exp-section-label">
                <FiBriefcase size={11} />
                <span>Work</span>
                <span className="exp-section-count">·</span>
              </div>
              <div className="work-list">
                {Array.from({ length: 4 }).map((_, i) => (
                  <WorkEntrySkeleton key={i} idx={i} isLast={i === 3} />
                ))}
              </div>
            </section>
            <section className="exp-section">
              <div className="exp-section-label">
                <FiBook size={11} />
                <span>Education</span>
                <span className="exp-section-count">·</span>
              </div>
              <div className="edu-grid">
                {Array.from({ length: 2 }).map((_, i) => (
                  <EduCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </>
        )}

        {workItems.length > 0 && (
          <section className="exp-section">
            <div className="exp-section-label">
              <FiBriefcase size={11} />
              <span>Work</span>
              <span className="exp-section-count">{workItems.length}</span>
            </div>

            <div className="work-list">
              {workItems.map((item, idx) => {
                const color     = WORK_COLORS[idx % WORK_COLORS.length];
                const duration  = calcDuration(item.period);
                  const engines   = item.technologies || [];
                const isCurrent = item.period.toLowerCase().includes('present');
                const isLast    = idx === workItems.length - 1;
                const isVisible = visibleItems.has(String(item.id));

                return (
                  <div
                    key={item.id}
                    className={`work-entry ${isVisible ? 'visible' : ''} ${selectedExperience?.id === item.id ? 'selected' : ''}`}
                    data-id={item.id}
                    ref={el => (itemRefs.current[item.id] = el)}
                    onClick={() => setSelectedExperience(item)}
                    style={{ '--entry-color': color, '--entry-delay': `${idx * 0.07}s` }}
                  >
                    <div className="work-entry__track">
                      <div className="work-entry__dot" />
                      {!isLast && <div className="work-entry__line" />}
                    </div>

                    <div className="work-entry__content">
                      <div className="work-entry__header">
                        <div className="work-entry__title-block">
                          <h3 className="work-entry__company">{item.company}</h3>
                          <p className="work-entry__role">{item.role}</p>
                        </div>
                        <div className="work-entry__meta">
                          <span className="work-entry__period">{item.period}</span>
                          <div className="work-entry__badges">
                            {duration && <span className="duration-badge">{duration}</span>}
                            {isCurrent && <span className="current-badge">Now</span>}
                          </div>
                        </div>
                      </div>

                      {item.highlights.length > 0 && (
                        <div className="work-entry__projects">
                          <span className="proj-label">Shipped</span>
                          <div className="proj-chips">
                            {item.highlights.map((proj, i) => (
                              <span key={i} className="proj-chip">{proj}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {engines.length > 0 && (
                        <div className="work-entry__engines">
                          {engines.map((e, i) => (
                            <span key={i} className="engine-tag">{e}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {eduItems.length > 0 && (
          <section className="exp-section">
            <div className="exp-section-label">
              <FiBook size={11} />
              <span>Education</span>
              <span className="exp-section-count">{eduItems.length}</span>
            </div>

            <div className="edu-grid">
              {eduItems.map((item, idx) => {
                const isVisible = visibleItems.has(String(item.id));
                return (
                  <div
                    key={item.id}
                    className={`edu-card ${isVisible ? 'visible' : ''}`}
                    data-id={item.id}
                    ref={el => (itemRefs.current[item.id] = el)}
                    onClick={() => setSelectedExperience(item)}
                    style={{ '--entry-delay': `${idx * 0.06}s` }}
                  >
                    <div className="edu-card__header">
                      <h4 className="edu-card__title">{item.company}</h4>
                      <span className="edu-card__period">{item.period}</span>
                    </div>
                    <p className="edu-card__institution">{item.role}</p>
                    {item.highlights[0] && (
                      <div className="edu-card__location">
                        <FiMapPin size={9} />
                        {item.highlights[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default SceneExperience;
