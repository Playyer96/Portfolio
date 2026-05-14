import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import PortfolioShell from './PortfolioShell';
import SceneHome from './scenes/SceneHome';
import SceneAbout from './scenes/SceneAbout';
import SceneProjects from './scenes/SceneProjects';
import SceneExperience from './scenes/SceneExperience';
import SceneCV from './scenes/SceneCV';
import SceneStack from './scenes/SceneStack';
import SceneContact from './scenes/SceneContact';
import { fetchProjects, fetchExperience } from './data/api';
import CustomCursor from './components/CustomCursor';

const AppContent = () => {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proj, exp] = await Promise.all([
          fetchProjects(),
          fetchExperience(),
        ]);
        setProjects(proj);
        setExperience(exp);
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <PortfolioShell
      projects={projects}
      experience={experience}
      selectedProject={selectedProject}
      setSelectedProject={setSelectedProject}
      selectedExperience={selectedExperience}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Routes>
            <Route path="/" element={<SceneHome />} />
            <Route path="/about" element={<SceneAbout />} />
            <Route path="/projects" element={<SceneProjects selectedProject={selectedProject} setSelectedProject={setSelectedProject} />} />
            <Route path="/experience" element={<SceneExperience selectedExperience={selectedExperience} setSelectedExperience={setSelectedExperience} />} />
            <Route path="/stack" element={<SceneStack />} />
            <Route path="/contact" element={<SceneContact />} />
            <Route path="/cv" element={<SceneCV />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </PortfolioShell>
  );
};

const App = () => {
  return (
    <Router>
      <CustomCursor />
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </Router>
  );
};

export default App;
