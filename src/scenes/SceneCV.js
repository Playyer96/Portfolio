import { useEffect, useRef } from 'react';
import './SceneCV.css';
import GridBackground from '../ui/GridBackground';
import useConsoleLog from '../hooks/useConsoleLog';

const SceneCV = () => {
  const downloadBtnRef = useRef(null);
  const { emit } = useConsoleLog();

  useEffect(() => {
    emit('info', '> Scene loaded: Resume');
    emit('info', '> Loading CV document...');

    setTimeout(() => {
      emit('ok', '✓ CV ready for download');
    }, 300);
  }, [emit]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/CV-Danilo-Vanegas-2025.pdf';
    link.download = 'CV-Danilo-Vanegas-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    emit('ok', '✓ CV downloaded');
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

        <div className="cv-container">
          <div className="cv-preview">
            <iframe
              src="/CV-Danilo-Vanegas-2025.pdf"
              className="pdf-viewer"
              title="CV-Danilo-Vanegas-2025.pdf"
            />
          </div>

          <div className="cv-actions">
            <button
              ref={downloadBtnRef}
              className="magnetic-btn primary"
              onClick={handleDownload}
              onMouseMove={handleMagneticButton}
              onMouseLeave={handleMagneticLeave}
            >
              ⬇ Download CV
            </button>
          </div>

          <div className="cv-info">
            <h2>Document Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Format</label>
                <value>PDF</value>
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
                <value>May 2025</value>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneCV;
