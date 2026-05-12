import { useState } from 'react';
import './PanelSection.css';

const PanelSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="panel-section">
      <button className="panel-section-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="panel-section-toggle">{isOpen ? '▼' : '▶'}</span>
        <span className="panel-section-title">{title}</span>
      </button>
      {isOpen && (
        <div className="panel-section-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default PanelSection;
