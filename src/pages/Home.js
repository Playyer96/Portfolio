import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "../components/animations";
import ContactIcons from "../components/ContactIcons";
import ParticleBackground from "../components/effects/ParticleBackground";
import useMousePosition from "../hooks/useMousePosition";
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaSlack, FaJira } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";
import "./Home.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

const Home = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const mousePosition = useMousePosition();

  useEffect(() => {
    const fetchTechnologies = async () => {
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
        setLoading(false);
      }
    };

    fetchTechnologies();
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

  if (loading) {
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
            <div className="home__hero-tag">
              <span className="home__hero-tag-dot"></span>
              Available for work
            </div>
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

        {/* Animated Code Brackets */}
        <div className="home__hero-decoration">
          <motion.div
            className="home__bracket home__bracket--left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {"</>"}
          </motion.div>
          <motion.div
            className="home__bracket home__bracket--right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {"</>"}
          </motion.div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="home__technologies">
        <div className="container">
          <FadeIn direction="up" delay={0.2}>
            <div className="home__section-header">
              <h2 className="home__section-title">
                <span className="home__section-number">01.</span>
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

          <StaggerContainer staggerDelay={0.05} className="home__tech-grid">
            {technologies.map((tech, index) => {
              const IconComponent = getIconComponent(tech.text);
              return (
                <motion.div
                  key={index}
                  className="home__tech-card"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div
                    className="home__tech-icon-wrapper"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="home__tech-icon" />
                  </motion.div>
                  <div className="home__tech-glow"></div>
                  <span className="home__tech-name">{tech.text}</span>
                </motion.div>
              );
            })}
          </StaggerContainer>
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
  );
};

export default React.memo(Home);
