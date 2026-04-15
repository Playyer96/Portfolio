import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "../components/animations";
import PageTransition from "../components/PageTransition";
import ContactIcons from "../components/ContactIcons";
import ParticleBackground from "../components/effects/ParticleBackground";
import TechStackGraph from "../components/TechStackGraph";
import GitHubWidget from "../components/GitHubWidget";
import FeaturedProjects from "../components/FeaturedProjects";
import StatsShowcase from "../components/StatsShowcase";
import SEO from "../components/SEO";
import useMousePosition from "../hooks/useMousePosition";
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaSlack, FaJira } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import "./Home.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

const Home = () => {
  const [technologies, setTechnologies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ yearsOfExperience: "5+" });
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  useEffect(() => {
    const fetchTechnologies = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(`${API_URL}/technologies`);
        if (!response.ok) {
          throw new Error('Failed to fetch technologies data');
        }
        const data = await response.json();
        setTechnologies(data[0].technologies || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        const loadTime = Date.now() - startTime;
        // Only show loading if it takes longer than 200ms
        if (loadTime < 200) {
          setTimeout(() => setLoading(false), 200 - loadTime);
        } else {
          setLoading(false);
        }
      }
    };

    // Delay showing the loading spinner to avoid flash
    const loadingTimer = setTimeout(() => setShowLoading(true), 200);

    fetchTechnologies();

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data[0]?.projects) {
            setProjects(data[0].projects);
          }
        }
      } catch (err) {
        console.debug('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/stats`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.yearsOfExperience) {
            setStats(data);
          }
        }
      } catch (err) {
        // Silently fail - use fallback value
        console.debug('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, []);

  const getIconComponent = (techName) => {
    const iconMap = {
      'react': FaReact,
      'unity engine': FaUnity,
      'unreal engine': SiUnrealengine,
      'html5': FaHtml5,
      'css 3': FaCss3Alt,
      'javascript': FaJs,
      'nodejs': FaNodeJs,
      'python': FaPython,
      'c++': SiCplusplus,
      'c#': SiSharp,
      'git': FaGitAlt,
      'github': FaGithub,
      'gitlab': FaGitlab,
      'docker': FaDocker,
      'slack': FaSlack,
      'jira': FaJira,
      'perforce': SiPerforce
    };

    return iconMap[(techName || '').toLowerCase()] || FaReact;
  };

  if (loading && showLoading) {
    return (
      <div className="home">
        <ParticleBackground particleCount={30} />
        <div className="home__loading">
          <motion.div
            className="home__loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (loading && !showLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="home">
        <div className="home__error">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO
        title="Danilo Vanegas - Unity & Unreal Game Developer Portfolio"
        description="Explore the portfolio of Danilo Vanegas, a skilled Unity and Unreal game developer. View projects, experience, and technical expertise in game development, multiplayer systems, and immersive gameplay."
        keywords="Unity Developer, Unreal Engine, Game Developer, Portfolio, C#, C++, Game Programming, Multiplayer Games, 3D Games, Game Development Portfolio"
        canonicalUrl="https://danidev.xyz/"
      />
      <div className="home">
        <ParticleBackground particleCount={50} />

      {/* Cursor Follow Effect */}
      <motion.div
        className="home__cursor-glow"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Hero Section */}
      <section className="home__hero">
        <div className="home__hero-content">
          {/* Left Column: Text Content */}
          <div className="home__hero-left">
            <FadeIn direction="down" delay={0.2}>
              <motion.div
                className="home__hero-tag"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <span className="home__hero-tag-icon">{"</>"}</span>
                Available to work
              </motion.div>
            </FadeIn>

            <div className="home__hero-title">
              <FadeIn direction="up" delay={0.4}>
                <h1>
                  Game Developer specializing in <span className="text-gradient-primary">multiplayer systems</span>, graphics optimization, and gameplay architecture
                </h1>
              </FadeIn>
            </div>

            <FadeIn direction="up" delay={0.8}>
              <p className="home__hero-description">
                5+ years building immersive experiences with Unreal Engine and Unity. Shipped indie games, VR simulators, and developer tools. Specialized in gameplay systems, real-time optimization, and problem-solving at scale.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={1.0}>
              <div className="home__hero-actions">
                <motion.button
                  className="home__cta-primary"
                  onClick={() => window.open("https://github.com/Playyer96", "_blank")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View on GitHub
                </motion.button>
                <motion.button
                  className="home__cta-secondary"
                  onClick={() => navigate("/projects")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Projects
                </motion.button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={1.2}>
              <div className="home__hero-socials">
                <ContactIcons />
              </div>
            </FadeIn>
          </div>

          {/* Right Column: GitHub Widget */}
          <div className="home__hero-right">
            <GitHubWidget />
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="home__technologies">
        <div className="container">
          <FadeIn direction="up" delay={0.2}>
            <div className="home__section-header">
              <h2 className="home__section-title">
                Tech Stack
              </h2>
              <div className="home__section-line"></div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="home__section-description">
              Technologies and tools I work with to bring game ideas to life
            </p>
          </FadeIn>

          <TechStackGraph />
        </div>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="home__featured-projects">
          <FeaturedProjects projects={projects} limit={3} />
        </section>
      )}

      {/* Quick Stats Section */}
      <section className="home__stats">
        <div className="container">
          <FadeIn direction="up" delay={0.2}>
            <div className="home__section-header">
              <h2 className="home__section-title">
                Track Record
              </h2>
              <div className="home__section-line"></div>
            </div>
          </FadeIn>

          <StatsShowcase
            stats={[
              {
                number: stats.yearsOfExperience?.replace('+', '') || '5',
                label: 'Years Experience',
                color: 'primary',
                animated: true
              },
              {
                number: '20',
                label: 'Shipped Projects',
                color: 'secondary',
                animated: true
              },
              {
                number: '10',
                label: 'Technologies',
                color: 'accent',
                animated: true
              }
            ]}
            showGithubIntegration={true}
            columns={4}
          />
        </div>
      </section>
      </div>
    </PageTransition>
  );
};

export default React.memo(Home);
