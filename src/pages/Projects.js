import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "../components/animations";
import PageTransition from "../components/PageTransition";
import ParticleBackground from "../components/effects/ParticleBackground";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import SEO from "../components/SEO";
import "./Projects.scss";

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(`${API_URL}/projects`);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0].projects)) {
          throw new Error("Invalid response format");
        }

        const fetchedProjects = data[0].projects;

        const updatedProjects = await Promise.all(
          fetchedProjects.map(async (project) => {
            const imageUrl = await fetchImage(project.images?.[0]?.image || "default.jpg");
            return { ...project, imageUrl };
          })
        );

        setProjects(updatedProjects);
        setFilteredProjects(updatedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.message);
      } finally {
        const loadTime = Date.now() - startTime;
        if (loadTime < 200) {
          setTimeout(() => setLoading(false), 200 - loadTime);
        } else {
          setLoading(false);
        }
      }
    };

    const loadingTimer = setTimeout(() => setShowLoading(true), 200);

    fetchProjects();

    return () => clearTimeout(loadingTimer);
  }, []);

  const fetchImage = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
      throw new Error("Failed to fetch image");
    } catch (err) {
      console.error("Error fetching image:", err);
      return null;
    }
  };

  // Get unique categories from projects
  const categories = ["all", ...new Set(projects.flatMap(p =>
    p.technologies?.map(t => (t.name || t.text || '').toLowerCase()) || []
  ))];

  // Filter projects
  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter(project =>
        project.technologies?.some(tech =>
          (tech.name || tech.text || '').toLowerCase() === activeFilter.toLowerCase()
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.descriptions?.some(desc => desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.technologies?.some(tech =>
          (tech.name || tech.text || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  }, [activeFilter, searchQuery, projects]);

  if (loading && showLoading) {
    return (
      <div className="projects">
        <ParticleBackground particleCount={30} />
        <div className="projects__loading">
          <motion.div
            className="projects__loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p>Loading Projects...</p>
        </div>
      </div>
    );
  }

  if (loading && !showLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="projects">
        <div className="projects__error">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEO
        title="Projects - Danilo Vanegas | Game Development Portfolio"
        description="Browse through my Unity and Unreal game development projects. From multiplayer systems to immersive 3D experiences, explore my technical skills and creative solutions."
        keywords="Game Development Projects, Unity Projects, Unreal Projects, Multiplayer Games, 3D Game Development, Portfolio Projects"
        canonicalUrl="https://danidev.xyz/projects"
      />
      <div className="projects">
        <ParticleBackground particleCount={40} />

      <div className="container">
        {/* Header Section */}
        <section className="projects__header">
          <FadeIn direction="down" delay={0.2}>
            <div className="projects__title-wrapper">
              <h1 className="projects__title">
                My Projects
              </h1>
              <div className="projects__title-line"></div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="projects__subtitle">
              A showcase of games, tools, and experiences I've crafted
            </p>
          </FadeIn>
        </section>

        {/* Search and Filter Bar */}
        <section className="projects__controls">
          <FadeIn direction="left" delay={0.5}>
            <div className="projects__search">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="projects__search-input"
              />
              <motion.div
                className="projects__search-icon"
                whileHover={{ scale: 1.1 }}
              >
                🔍
              </motion.div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.6}>
            <div className="projects__filters">
              {categories.slice(0, 6).map((category, index) => (
                <motion.button
                  key={category}
                  className={`projects__filter-btn ${
                    activeFilter === category ? "active" : ""
                  }`}
                  onClick={() => setActiveFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Projects Count */}
        <FadeIn direction="up" delay={0.7}>
          <div className="projects__count">
            Showing <span className="projects__count-number">{filteredProjects.length}</span> projects
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <div className="projects__grid">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || project.id || project.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  layout
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    index={index}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="projects__no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3>No projects found</h3>
                <p>Try adjusting your filters or search query</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      </div>
    </PageTransition>
  );
};

export default Projects;
