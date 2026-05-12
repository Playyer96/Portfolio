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

const PROJECT_COLORS = [
  'oklch(72% 0.18 35)', 'oklch(72% 0.18 200)', 'oklch(72% 0.18 295)',
  'oklch(72% 0.18 145)', 'oklch(72% 0.18 85)', 'oklch(72% 0.18 340)',
  'oklch(72% 0.18 50)', 'oklch(72% 0.18 240)',
];

const AppContent = () => {
  const location = useLocation();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
        const [projRes, expRes] = await Promise.all([
          fetch(`${apiUrl}/projects`),
          fetch(`${apiUrl}/experience`),
        ]);

        if (projRes.ok) {
          const raw = await projRes.json();
          const transformed = raw[0]?.projects?.map((p, i) => ({
            id: String(p.id),
            name: p.name,
            color: PROJECT_COLORS[i % PROJECT_COLORS.length],
          })) || [];
          setProjects(transformed);
        }

        if (expRes.ok) {
          const raw = await expRes.json();
          const transformed = raw[0]?.experience?.map((e) => ({
            company: e.title || '',
          })) || [];
          setExperience(transformed);
        }
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
            <Route path="/experience" element={<SceneExperience />} />
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
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </Router>
  );
};

export default App;
