import { useState } from 'react';
import './BottomDock.css';
import useConsoleLog from '../hooks/useConsoleLog';

const BottomDock = ({ logs }) => {
  const [activeTab, setActiveTab] = useState('console');

  return (
    <div className="bottom-dock">
      <div className="dock-tabs">
        <button
          className={`dock-tab ${activeTab === 'console' ? 'active' : ''}`}
          onClick={() => setActiveTab('console')}
        >
          Console
        </button>
        <button
          className={`dock-tab ${activeTab === 'profiler' ? 'active' : ''}`}
          onClick={() => setActiveTab('profiler')}
        >
          Profiler
        </button>
        <button
          className={`dock-tab ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          Assets
        </button>
      </div>

      <div className="dock-content">
        {activeTab === 'console' && (
          <div className="console-logs">
            {logs.length === 0 ? (
              <div className="console-empty">Ready</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className={`log-entry log-${log.type}`}>
                  <span className="log-time">{log.timestamp}</span>
                  <span className="log-msg">{log.msg}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profiler' && (
          <div className="profiler-info">
            <div className="info-row">Render Time: &lt;1ms</div>
            <div className="info-row">Memory: 24.2 MB</div>
            <div className="info-row">FPS: 60</div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="assets-list">
            <div className="asset-item">CV.pdf</div>
            <div className="asset-item">Tech Icons (23)</div>
            <div className="asset-item">Images (12)</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BottomDock;
