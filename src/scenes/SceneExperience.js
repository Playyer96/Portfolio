import { useState, useEffect, useRef } from 'react';
import './SceneExperience.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';
import { fetchExperience as fetchExperienceFromApi } from '../data/api';

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
          emit('warn', '⚠ No experience items returned from API');
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

  return (
    <div className="scene-experience">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Experience</h1>

        <div className="timeline">
          <div className="timeline-line" />

          {items.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={item.id}
                className={`timeline-item ${isLeft ? 'left' : 'right'} ${
                  visibleItems.has(String(item.id)) ? 'visible' : ''
                } ${selectedExperience?.id === item.id ? 'selected' : ''}`}
                data-id={item.id}
                ref={el => (itemRefs.current[item.id] = el)}
              >
                <button
                  className="timeline-content"
                  onClick={() => handleSelectItem(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-card">
                    <h3 className="card-title">{item.company}</h3>
                    <p className="card-role">{item.role}</p>
                    <div className="card-meta">
                      <span className="card-period">{item.period}</span>
                      <span className={`card-type ${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </div>
                    <p className="card-location">{item.location}</p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SceneExperience;
