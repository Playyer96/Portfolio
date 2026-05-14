import { useState, useEffect, useRef } from 'react';
import './SceneExperience.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchExperience as fetchExperienceFromApi } from '../data/api';
import { FiMapPin } from 'react-icons/fi';

const SceneExperience = ({ selectedExperience = null, setSelectedExperience = () => {} }) => {
  const [items, setItems] = useState([]);
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
        if (data.length > 0) {
          emit('ok', `✓ Loaded ${data.length} experience items from API`);
        } else {
          emit('warn', '! No experience items returned from API');
        }
      } catch (err) {
        emit('error', `✗ Failed to load experience: ${err.message}`);
      }
    };

    const timeoutId = setTimeout(loadExperience, 200);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(itemRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [emit]);

  const handleSelectItem = (item) => {
    setSelectedExperience(item);
  };

  const minYear = items.length > 0 ? Math.min(...items.map(i => i.startYear)) : 2017;
  const maxYear = items.length > 0 ? Math.max(...items.map(i => i.endYear)) : 2026;
  const yearRange = maxYear - minYear;
  const years = Array.from({ length: yearRange + 1 }, (_, i) => minYear + i);

  return (
    <div className="scene-experience">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Experience</h1>

        <div className="timeline-ruler">
          <div className="ruler-track">
            {years.map(year => {
              const position = ((year - minYear) / yearRange) * 100;
              return (
                <div
                  key={year}
                  className="ruler-tick"
                  style={{ left: `${position}%` }}
                >
                  <div className="tick-line" />
                  <div className="tick-label">{year}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="timeline">
          {items.map((item, idx) => {
            const startPos = ((item.startYear - minYear) / yearRange) * 100;
            const endPos = ((item.endYear - minYear) / yearRange) * 100;
            const width = endPos - startPos;
            const colors = [
              'var(--pb-accent)',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#06b6d4',
              '#8b5cf6',
              '#ec4899',
              '#f97316',
            ];
            const color = colors[idx % colors.length];

            return (
              <div
                key={item.id}
                className={`timeline-item ${visibleItems.has(String(item.id)) ? 'visible' : ''} ${
                  selectedExperience?.id === item.id ? 'selected' : ''
                }`}
                data-id={item.id}
                ref={el => (itemRefs.current[item.id] = el)}
              >
                <button
                  className="timeline-bar"
                  onClick={() => handleSelectItem(item)}
                  style={{
                    left: `${startPos}%`,
                    width: `${width}%`,
                    backgroundColor: color,
                  }}
                >
                  <div className="bar-label">
                    <div className="label-title">{item.company}</div>
                    <div className="label-role">{item.role}</div>
                  </div>
                </button>

                <div className="timeline-card">
                  <div className="card-header" style={{ borderLeftColor: color }}>
                    <h3 className="card-title">{item.company}</h3>
                    <span className={`card-type ${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="card-content">
                    <p className="card-role">{item.role}</p>
                    <div className="card-meta">
                      <span className="card-period">{item.period}</span>
                      <span className="card-location"><FiMapPin size={10} style={{marginRight: 3, verticalAlign: 'middle'}} />{item.location}</span>
                    </div>
                  </div>
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="card-highlights">
                      <h4>Key Activities</h4>
                      <ul>
                        {item.highlights.slice(0, 2).map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SceneExperience;
