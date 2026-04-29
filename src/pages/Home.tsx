import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "../components/animations";
import PageTransition from "../components/PageTransition";
import ContactIcons from "../components/ContactIcons";
import ParticleBackground from "../components/effects/ParticleBackground";
import TechBento from "../components/TechBento";
import SEO from "../components/SEO";
import useMousePosition from "../hooks/useMousePosition";
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaSlack, FaJira } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import { IconType } from "react-icons";
import { Technology } from "../types";
import "./Home.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

/**
 * Icon Map Type
 */
type IconMap = Record<string, IconType>;

/**
 * Home Page Component
 *
 * Main landing page with hero section, tech stack, and quick stats
 * Features particle background, cursor glow effect, and call-to-action buttons
 */
const Home: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  useEffect(() => {
    const fetchTechnologies = async (): Promise<void> => {
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
        setError(err instanceof Error ? err.message : 'Unknown error');
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

  const getIconComponent = (techName: string): IconType | undefined => {
    const iconMap: IconMap = {
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
                Hi, I'm <span className="text-gradient-primary">Dani</span>
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.6}>
              <div className="home__hero-subtitle">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="home__hero-role">Game Developer</span>
                  <span className="home__hero-separator">|</span>
                  <span className="home__hero-engines">Unreal & Unity</span>
                </motion.h2>
              </div>
            </FadeIn>
          </div>

          <FadeIn direction="up" delay={1}>
            <p className="home__hero-description">
              Passionate about creating immersive gaming experiences and learning cutting-edge technologies.
              Specializing in gameplay programming, graphics optimization, and interactive systems.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={1.2}>
            <div className="home__hero-actions">
              <motion.button
                className="home__cta-primary"
                onClick={() => navigate("/projects")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Projects
              </motion.button>
              <motion.button
                className="home__cta-secondary"
                onClick={() => navigate("/about")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                About Me
              </motion.button>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={1.4}>
            <div className="home__hero-socials">
              <ContactIcons />
            </div>
          </FadeIn>
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

          <TechBento technologies={technologies} getIconComponent={getIconComponent} />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="home__stats">
        <div className="container">
          <StaggerContainer staggerDelay={0.1} className="home__stats-grid">
            <motion.div
              className="home__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <h3 className="home__stat-number text-gradient-primary">5+</h3>
              <p className="home__stat-label">Years Experience</p>
            </motion.div>
            <motion.div
              className="home__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <h3 className="home__stat-number text-gradient-primary">20+</h3>
              <p className="home__stat-label">Projects Completed</p>
            </motion.div>
            <motion.div
              className="home__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <h3 className="home__stat-number text-gradient-primary">10+</h3>
              <p className="home__stat-label">Technologies</p>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>
      </div>
    </PageTransition>
  );
};

export default React.memo(Home);
