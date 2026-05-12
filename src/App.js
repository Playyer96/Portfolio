import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import useTheme from './hooks/useTheme';
import useConsoleLog from './hooks/useConsoleLog';
import TitleBar from './shell/TitleBar';
import Toolbar from './shell/Toolbar';
import HierarchyPanel from './shell/HierarchyPanel';
import InspectorPanel from './shell/InspectorPanel';
import BottomDock from './shell/BottomDock';
import StatusBar from './shell/StatusBar';
import TweaksPanel from './ui/TweaksPanel';
import SceneHome from './scenes/SceneHome';
import SceneAbout from './scenes/SceneAbout';
import SceneProjects from './scenes/SceneProjects';
import SceneExperience from './scenes/SceneExperience';
import SceneCV from './scenes/SceneCV';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const { logs, emit } = useConsoleLog();

  useEffect(() => {
    emit('info', `> Scene loading: ${location.pathname || '/'}`);
  }, [location, emit]);

  return (
    <div className="app-shell">
      <TitleBar />
      <Toolbar />

      <div className="app-body">
        <HierarchyPanel />

        <div className="center-column">
          <div className="scene-tabs">
            <div className="tab-item">Scene</div>
          </div>

          <div className="scene-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="scene-wrapper"
              >
                <Routes>
                  <Route path="/" element={<SceneHome />} />
                  <Route path="/about" element={<SceneAbout />} />
                  <Route path="/projects" element={<SceneProjects />} />
                  <Route path="/experience" element={<SceneExperience />} />
                  <Route path="/cv" element={<SceneCV />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </div>

          <BottomDock logs={logs} />
        </div>

        <InspectorPanel
          selectedProject={selectedProject}
          selectedExperience={selectedExperience}
        />
      </div>

      <StatusBar consoleCount={logs.length} />
      <TweaksPanel />
    </div>
  );
};

const App = () => {
  const { theme } = useTheme();

  return (
    <div
      id="root"
      data-theme={theme}
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Router>
        <AppContent />
      </Router>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;
