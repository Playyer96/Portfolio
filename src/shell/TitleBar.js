import { useState, useRef, useEffect } from 'react';
import './TitleBar.css';
import useTheme from '../hooks/useTheme';

const TitleBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuData = {
    File: [
      { label: 'Open CV (PDF)', action: () => window.open('/CV-Danilo-Vanegas-2025.pdf', '_blank') },
      { label: 'Email me', action: () => window.location.href = 'mailto:vanegasdanilo7@gmail.com' },
      { label: 'Copy email', action: () => navigator.clipboard?.writeText('vanegasdanilo7@gmail.com') },
      { label: '—' },
      { label: 'Export as JSON', action: () => console.log('Export') },
    ],
    Edit: [
      { label: 'Find in Hierarchy… (⌘K)', action: () => console.log('Search') },
      { label: 'Toggle theme', action: toggleTheme },
      { label: 'Reset view', action: () => window.location.pathname = '/' },
    ],
    Window: [
      { label: 'Scene', action: () => console.log('Scene') },
      { label: 'Game', action: () => console.log('Game') },
      { label: 'Animator', action: () => console.log('Animator') },
      { label: 'Profiler', action: () => console.log('Profiler') },
    ],
    Help: [
      { label: 'GitHub ↗', action: () => window.open('https://github.com/danilovanegas', '_blank') },
      { label: 'LinkedIn ↗', action: () => window.open('https://linkedin.com/in/danilovanegas', '_blank') },
      { label: 'X ↗', action: () => window.open('https://x.com/danilovanegas', '_blank') },
    ],
  };

  return (
    <div className="title-bar" ref={menuRef}>
      <div className="title-bar-left">
        <div className="title-bar-lights">
          <div className="light red" />
          <div className="light yellow" />
          <div className="light green" />
        </div>
        <div className="title-bar-menu">
          {Object.keys(menuData).map((menuName) => (
            <div key={menuName} className="menu-item">
              <button
                className={openMenu === menuName ? 'active' : ''}
                onClick={() => setOpenMenu(openMenu === menuName ? null : menuName)}
                onMouseEnter={() => openMenu !== null && setOpenMenu(menuName)}
              >
                {menuName}
              </button>
              {openMenu === menuName && (
                <div className="dropdown-menu">
                  {menuData[menuName].map((item, idx) => (
                    item.label === '—' ? (
                      <div key={idx} className="menu-separator" />
                    ) : (
                      <button
                        key={idx}
                        className="menu-item-button"
                        onClick={() => {
                          item.action();
                          setOpenMenu(null);
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="title-bar-center">
        <span className="title-bar-title">danilo-vanegas.unityproj</span>
      </div>

      <div className="title-bar-right">
        <div className="availability-badge">
          <span className="rec-indicator" />
          <span>available · Q3 '26</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? '☼ light' : '☾ dark'}
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
