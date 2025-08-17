import React from 'react';
import { HiDownload, HiEye } from 'react-icons/hi';
import MyCv from '../assets/cv/CV-Danilo-Vanegas-2025.pdf';

const Cv: React.FC = () => {
  const handleDownload = (): void => {
    const link = document.createElement('a');
    link.href = MyCv;
    link.download = 'CV-Danilo-Vanegas-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            My Resume
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Download or view my latest resume
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center gap-2"
            >
              <HiDownload className="w-5 h-5" />
              Download PDF
            </button>
            <a
              href={MyCv}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-effect px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2 justify-center"
            >
              <HiEye className="w-5 h-5" />
              Open in New Tab
            </a>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="glass-card p-4">
          <div className="relative w-full" style={{ height: '80vh' }}>
            <iframe
              src={MyCv}
              title="My CV"
              className="w-full h-full rounded-lg border-0"
              style={{
                minHeight: '600px',
              }}
            />
            
            {/* Fallback message for browsers that don't support PDF viewing */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="text-center p-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  If the PDF doesn't load, you can:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleDownload}
                    className="btn-primary inline-flex items-center gap-2 pointer-events-auto"
                  >
                    <HiDownload className="w-5 h-5" />
                    Download PDF
                  </button>
                  <a
                    href={MyCv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-effect px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2 justify-center pointer-events-auto"
                  >
                    <HiEye className="w-5 h-5" />
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cv;