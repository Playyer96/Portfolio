import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer } from "../components/animations";
import ParticleBackground from "../components/effects/ParticleBackground";
import TimelineItem from "../components/TimelineItem";
import "./Experience.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, work, education

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(`${API_URL}/experience`);
        if (!response.ok) {
          throw new Error('Failed to fetch experience data');
        }
        const data = await response.json();
        setExperiences(data[0].experience || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const filteredExperiences = experiences.filter(exp => {
    if (filter === "all") return true;
    if (filter === "work") return exp.icon === "WorkIcon";
    if (filter === "education") return exp.icon === "SchoolIcon";
    return true;
  });

  if (loading) {
    return (
      <div className="experience">
        <ParticleBackground particleCount={30} />
        <div className="experience__loading">
          <motion.div
            className="experience__loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading Experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="experience">
        <div className="experience__error">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="experience">
      <ParticleBackground particleCount={40} />

      <div className="container">
        {/* Header Section */}
        <section className="experience__header">
          <FadeIn direction="down" delay={0.2}>
            <div className="experience__title-wrapper">
              <h1 className="experience__title">
                <span className="experience__title-number">04.</span>
                My Journey
              </h1>
              <div className="experience__title-line"></div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="experience__subtitle">
              Professional experience and educational background in game development
            </p>
          </FadeIn>

          {/* Filter Tabs */}
          <FadeIn direction="up" delay={0.5}>
            <div className="experience__filters">
              <motion.button
                className={`experience__filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              <motion.button
                className={`experience__filter-btn ${filter === "work" ? "active" : ""}`}
                onClick={() => setFilter("work")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Work Experience
              </motion.button>
              <motion.button
                className={`experience__filter-btn ${filter === "education" ? "active" : ""}`}
                onClick={() => setFilter("education")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Education
              </motion.button>
            </div>
          </FadeIn>
        </section>

        {/* Timeline */}
        <section className="experience__timeline">
          <div className="experience__timeline-line"></div>

          <AnimatePresence mode="wait">
            <StaggerContainer staggerDelay={0.15} className="experience__timeline-container">
              {filteredExperiences.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <TimelineItem
                    experience={exp}
                    index={index}
                    isEven={index % 2 === 0}
                  />
                </motion.div>
              ))}
            </StaggerContainer>
          </AnimatePresence>

          {filteredExperiences.length === 0 && (
            <motion.div
              className="experience__no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>No experiences found</h3>
              <p>Try selecting a different filter</p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Experience;
