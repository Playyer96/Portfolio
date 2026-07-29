import { useEffect, useRef, useState } from 'react';
import './SceneCV.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';

const SceneCV = () => {
  const downloadBtnRef = useRef(null);
  const [view, setView] = useState('visual');
  const [latex, setLatex] = useState('');
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Resume');
    emit('info', '> Loading CV document...');

    setTimeout(() => {
      emit('ok', '✓ CV ready for download');
    }, 300);
  }, [emit]);

  useEffect(() => {
    fetch('/CV-Danilo-Vanegas-2026.tex').then(response => response.text()).then(setLatex).catch(() => setLatex('% LaTeX source is unavailable.'));
  }, []);

  const handleDownload = () => {
    window.print();
    emit('ok', '✓ Print dialog opened - choose Save as PDF');
  };

  const handleMagneticButton = (e) => {
    if (!downloadBtnRef.current) return;

    const rect = downloadBtnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) * 0.3;
    const dy = (e.clientY - centerY) * 0.3;

    downloadBtnRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleMagneticLeave = () => {
    if (downloadBtnRef.current) {
      downloadBtnRef.current.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <div className="scene-cv">
      <GridBackground />
      <div className="scene-content">
        <h1 className="section-heading">Resume</h1>
        <p className="cv-intro">A visual resume for quick reading, plus the exact read-only LaTeX source behind it.</p>

        <div className="cv-container">
          <div className="cv-tabs" role="tablist" aria-label="Resume format">
            <button className={view === 'visual' ? 'is-active' : ''} role="tab" aria-selected={view === 'visual'} onClick={() => setView('visual')}>Visual resume</button>
            <button className={view === 'latex' ? 'is-active' : ''} role="tab" aria-selected={view === 'latex'} onClick={() => setView('latex')}>LaTeX source</button>
          </div>

          <div className="cv-preview">
            {view === 'visual' ? (
              <article className="visual-cv" aria-label="Danilo Vanegas resume">
                <header><h2>Danilo Vanegas</h2><p>Software developer · Medellín, Colombia</p><a href="mailto:vanegasdanilo7@gmail.com">vanegasdanilo7@gmail.com</a> · <a href="https://github.com/Playyer96">github.com/Playyer96</a></header>
                <section><h3>Profile</h3><p>I turn complex technical systems into clear, dependable experiences across web products, real-time applications, and developer tools.</p></section>
                <section><h3>Selected work</h3>
                  <div className="cv-work"><div><h4>Off The Shelf Studio</h4><p>Full-stack developer · 2026</p></div><p>Built a clear studio website and inquiry flow. Used Resend for branded visitor confirmation and team-notification templates.</p><small>Next.js · React · TypeScript · Resend · CSS</small></div>
                  <div className="cv-work"><div><h4>WisprTasks</h4><p>Product & app developer · 2026</p></div><p>Designed quick capture, priorities, and next actions to make task management easier to start and use.</p><small>React · TypeScript · Firebase · Cloud Functions · Resend</small></div>
                  <div className="cv-work"><div><h4>Foresight Sports</h4><p>Software / Unity developer · 2021–2025</p></div><p>Developed golf-simulation and calibration tooling, including computer-vision-supported alignment workflows.</p><small>Unity · C# · AR Foundation · Simulator hardware</small></div>
                </section>
                <section><h3>Technical toolkit</h3><p><b>Web:</b> React, Next.js, TypeScript, Node.js, Firebase, Resend</p><p><b>Real-time:</b> Unity, Unreal Engine, C#, C++, AR Foundation</p></section>
                <section><h3>Education</h3><p><b>Institución Universitaria ITM</b> — Systems Engineering, 2017–2022</p><p><b>SENA</b> — Software Analysis and Development, 2017–2018</p></section>
              </article>
            ) : (
              <pre className="latex-viewer" aria-label="Read-only LaTeX source"><code>{latex}</code></pre>
            )}
          </div>

          <div className="cv-actions">
            <button
              ref={downloadBtnRef}
              className="magnetic-btn primary"
              onClick={handleDownload}
              onMouseMove={handleMagneticButton}
              onMouseLeave={handleMagneticLeave}
            >
              ⬇ Download visual PDF
            </button>
          </div>

          <div className="cv-info">
            <h2>Document Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Format</label>
                <value>Visual + LaTeX</value>
              </div>
              <div className="info-item">
                <label>Language</label>
                <value>English</value>
              </div>
              <div className="info-item">
                <label>Pages</label>
                <value>1</value>
              </div>
              <div className="info-item">
                <label>Updated</label>
                <value>July 2026</value>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCV;
