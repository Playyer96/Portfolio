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
import Dashboard from './dashboard/Dashboard';
import ResetPassword from './dashboard/ResetPassword';
import { fetchAbout, fetchProjects, fetchExperience, fetchTechnologies } from './data/api';
import CustomCursor from './components/CustomCursor';

const AppContent = () => {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [about, setAbout] = useState(null);
  const [technologies, setTechnologies] = useState([]);

  useEffect(() => {
    Promise.all([fetchAbout(), fetchProjects(), fetchExperience(), fetchTechnologies()])
      .then(([abt, proj, exp, tech]) => {
        setAbout(abt);
        setProjects(proj);
        setExperience(exp);
        setTechnologies(tech);
      })
      .catch(err => console.error('API fetch error:', err));
  }, []);

  return (
    <PortfolioShell
      about={about}
      projects={projects}
      experience={experience}
      technologies={technologies}
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
            <Route path="/"           element={<SceneHome about={about} />} />
            <Route path="/about"      element={<SceneAbout about={about} />} />
            <Route path="/projects"   element={<SceneProjects selectedProject={selectedProject} setSelectedProject={setSelectedProject} />} />
            <Route path="/experience" element={<SceneExperience about={about} selectedExperience={selectedExperience} setSelectedExperience={setSelectedExperience} />} />
            <Route path="/stack"      element={<SceneStack />} />
            <Route path="/contact"    element={<SceneContact about={about} />} />
            <Route path="/cv"         element={<SceneCV about={about} />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </PortfolioShell>
  );
};

const App = () => (
  <Router>
    <CustomCursor />
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<AppContent />} />
    </Routes>
    <Analytics />
    <SpeedInsights />
  </Router>
);

export default App;
