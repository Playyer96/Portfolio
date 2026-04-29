import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutDisplay from "./pages/AboutDisplay";
import Cv from "./pages/Cv";
import ScrollToTop from "./components/ScrollToTop";
import SkipLink from "./components/SkipLink";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.scss";

/**
 * AnimatedRoutes Component
 *
 * Handles route transitions with AnimatePresence
 * Ensures smooth page transitions between routes
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutDisplay />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/cv" element={<Cv />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * App Component
 *
 * Root application component with routing, navigation, and analytics
 * Includes skip link for accessibility and error boundary wrapper
 */
function App() {
  return (
    <div className="App">
      <Router>
        <SkipLink />
        <Navbar />
        <ScrollToTop />
        <main id="main-content" className="App__main">
          <AnimatedRoutes />
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </Router>
    </div>
  );
}

export default App;
