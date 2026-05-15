import React, { useEffect, useState } from 'react';
import './ComingSoon.css';

const BARS = 20;

const ComingSoon = ({ label = 'section', hint = '' }) => {
  const [fill, setFill] = useState(0);

  useEffect(() => {
    const target = 30 + Math.floor(Math.random() * 45);
    let f = 0;
    const iv = setInterval(() => {
      f += 1;
      setFill(f);
      if (f >= target) clearInterval(iv);
    }, 28);
    return () => clearInterval(iv);
  }, []);

  const filled = Math.round((fill / 100) * BARS);

  return (
    <div className="cs-block">
      <div className="cs-terminal-header">
        <span className="cs-dot cs-dot--r" />
        <span className="cs-dot cs-dot--y" />
        <span className="cs-dot cs-dot--g" />
        <span className="cs-terminal-title">build.log</span>
      </div>

      <div className="cs-body">
        <div className="cs-line cs-line--comment">{'// ' + label + '.status = "coming_soon"'}</div>
        <div className="cs-spacer" />

        <div className="cs-progress-row">
          <span className="cs-progress-label">BUILD</span>
          <div className="cs-progress-track">
            <span className="cs-progress-fill" style={{ width: `${(fill / 100) * 100}%` }} />
          </div>
          <span className="cs-progress-pct">{fill}%</span>
        </div>

        <div className="cs-spacer" />
        <div className="cs-line cs-line--ok">  [✓] backend API        ready</div>
        <div className="cs-line cs-line--ok">  [✓] dashboard CRUD     ready</div>
        <div className="cs-line cs-line--pending">  [...] content           in progress</div>
        {hint && <div className="cs-line cs-line--dim">  {hint}</div>}
        <div className="cs-spacer" />
        <div className="cs-line cs-line--dim">{'// add content via /dashboard and flip COMING_SOON = false'}</div>
      </div>
    </div>
  );
};

export default ComingSoon;
