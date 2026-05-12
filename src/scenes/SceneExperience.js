import { useState, useEffect, useRef } from 'react';
import './SceneExperience.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';

const defaultExperience = [
  {
    id: 1,
    company: 'Optic Power',
    role: 'Unity & Unreal Engineer',
    period: 'Oct 2021 — Present',
    duration: '3y 8mo',
    location: 'Medellín, CO',
    type: 'Full-time',
    blurb: 'Lead engineer on industrial XR training simulations. Architecting cross-platform builds (Quest, PCVR, web), authoring shaders, and shipping the C# tooling the rest of the team uses every day.',
  },
  {
    id: 2,
    company: 'Dream House Studios',
    role: 'Unity & Unreal Developer',
    period: '2019 — 2021',
    duration: '2y',
    location: 'Remote',
    type: 'Contract',
    blurb: 'Gameplay and systems programming on contract titles. Built character controllers, inventory systems, and the UI frameworks that survived three engine upgrades.',
  },
  {
    id: 3,
    company: 'Universidad Pontificia Bolivariana',
    role: 'Engineering, Digital Entertainment',
    period: '2015 — 2020',
    duration: '5y',
    location: 'Medellín, CO',
    type: 'Education',
    blurb: 'Computer graphics, OOP, real-time rendering. Thesis on procedural terrain generation for open-world games.',
  },
];

const SceneExperience = () => {
  const [items, setItems] = useState(defaultExperience);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const itemRefs = useRef({});
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Experience');
    emit('info', '> Fetching experience timeline...');

    const fetchExperience = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${apiUrl}/experience`);
        if (response.ok) {
          const data = await response.json();
          setItems(data);
          emit('ok', '✓ Timeline loaded from API');
        }
      } catch (err) {
        emit('ok', '✓ Timeline loaded (local)');
      }
    };

    setTimeout(fetchExperience, 200);

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

    return () => observer.disconnect();
  }, [emit]);

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
                }`}
                data-id={item.id}
                ref={el => (itemRefs.current[item.id] = el)}
              >
                <div className="timeline-content">
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
