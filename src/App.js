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
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.scss";

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

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ScrollToTop />
        <main className="App__main">
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
