import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "../components/animations";
import PageTransition from "../components/PageTransition";
import ParticleBackground from "../components/effects/ParticleBackground";
import SkillBar from "../components/SkillBar";
import SEO from "../components/SEO";
import "./AboutDisplay.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

const AboutDisplay = () => {
  const seoData = {
    title: "About Dani - Game Developer",
    description: "Learn more about Danilo Vanegas, a passionate game developer specializing in Unity and Unreal Engine with expertise in gameplay programming, graphics optimization, and multiplayer systems.",
    canonicalUrl: "https://danidev.xyz/about"
  };
  const [aboutData, setAboutData] = useState(null);
  const [stats, setStats] = useState({ yearsOfExperience: "5+" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${API_URL}/about`);
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          setAboutData(data);
        } else if (data.length > 0) {
          setAboutData(data[0]);
        } else {
          throw new Error('Invalid response format');
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
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

  // Game developer skills
  const skills = [
    { name: "Unreal Engine", level: 90, color: "#00ff88" },
    { name: "Unity", level: 85, color: "#00d9ff" },
    { name: "C++", level: 80, color: "#ff00ff" },
    { name: "C#", level: 85, color: "#00ff88" },
    { name: "Game Design", level: 75, color: "#00d9ff" },
    { name: "Graphics Programming", level: 70, color: "#ff00ff" }
  ];

  const services = [
    {
      icon: "🎮",
      title: "Gameplay Programming",
      description: "Creating engaging game mechanics, player controllers, and interactive systems"
    },
    {
      icon: "🎨",
      title: "Graphics & Optimization",
      description: "Shader development, rendering optimization, and performance tuning"
    },
    {
      icon: "🔧",
      title: "Tools Development",
      description: "Building editor tools and workflows to enhance productivity"
    },
    {
      icon: "🌐",
      title: "Multiplayer Systems",
      description: "Network programming, replication, and online game architecture"
    }
  ];

  if (loading) {
    return (
      <div className="about">
        <ParticleBackground particleCount={30} />
        <div className="about__loading">
          <motion.div
            className="about__loading-spinner"
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
      <div className="about">
        <div className="about__error">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <PageTransition>
        <div className="about">
        <ParticleBackground particleCount={40} />

      {/* Hero Section with Image */}
      <section className="about__hero">
        <div className="container">
          <div className="about__hero-grid">
            {/* Image Side */}
            <FadeIn direction="left" delay={0.2}>
              <div className="about__image-wrapper">
                {aboutData?.image && (
                  <motion.div
                    className="about__image-container"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={aboutData.image}
                      alt="Profile"
                      className="about__image"
                    />
                    <div className="about__image-glow"></div>
                  </motion.div>
                )}
              </div>
            </FadeIn>

            {/* Content Side */}
            <div className="about__content">
              <FadeIn direction="right" delay={0.3}>
                <div className="about__title-wrapper">
                  <h1 className="about__title">
                    About Me
                  </h1>
                  <div className="about__title-line"></div>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.4}>
                <h2 className="about__subtitle">
                  {aboutData?.title || "Game Developer"}
                </h2>
              </FadeIn>

              <FadeIn direction="right" delay={0.5}>
                <h3 className="about__role">
                  <span className="about__engines">{aboutData?.engines || "Unreal & Unity"}</span>
                  <span className="about__separator">|</span>
                  <span>{aboutData?.jobTitle || "Game Programmer"}</span>
                </h3>
              </FadeIn>

              <div className="about__description">
                {aboutData?.description?.map((paragraph, index) => (
                  <FadeIn key={index} direction="right" delay={0.6 + index * 0.1}>
                    <p>{paragraph}</p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="about__skills-section">
        <div className="container">
          <FadeIn direction="up" delay={0.2}>
            <h2 className="about__section-title">Technical Skills</h2>
            <p className="about__section-subtitle">
              My expertise in game development technologies
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="about__skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0 }
                }}
              >
                <SkillBar
                  name={skill.name}
                  level={skill.level}
                  color={skill.color}
                  delay={index * 0.1}
                />
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Section */}
      <section className="about__services-section">
        <div className="container">
          <FadeIn direction="up" delay={0.2}>
            <h2 className="about__section-title">What I Do</h2>
            <p className="about__section-subtitle">
              Specialized services for game development
            </p>
          </FadeIn>

          <StaggerContainer staggerDelay={0.1} className="about__services-grid">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="about__service-card"
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
              >
                <div className="about__service-icon">{service.icon}</div>
                <h3 className="about__service-title">{service.title}</h3>
                <p className="about__service-description">{service.description}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about__stats-section">
        <div className="container">
          <StaggerContainer staggerDelay={0.1} className="about__stats-grid">
            <motion.div
              className="about__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="about__stat-number">{stats.yearsOfExperience}</h3>
              <p className="about__stat-label">Years of Experience</p>
            </motion.div>
            <motion.div
              className="about__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="about__stat-number">20+</h3>
              <p className="about__stat-label">Projects Completed</p>
            </motion.div>
            <motion.div
              className="about__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="about__stat-number">10+</h3>
              <p className="about__stat-label">Technologies Mastered</p>
            </motion.div>
            <motion.div
              className="about__stat-card"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="about__stat-number">100%</h3>
              <p className="about__stat-label">Passion for Games</p>
            </motion.div>
          </StaggerContainer>
        </div>
      </section>
        </div>
      </PageTransition>
    </>
  );
};

export default AboutDisplay;
