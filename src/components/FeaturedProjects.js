import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { StaggerContainer, FadeIn } from "./animations";
import FeaturedProjectCard from "./FeaturedProjectCard";
import "./FeaturedProjects.scss";

const FeaturedProjects = ({ projects = [], limit = 3 }) => {
  // Sort by featured flag if available, then take top N
  const sortedProjects = [...projects]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    })
    .slice(0, limit);

  if (!projects.length) {
    return null;
  }

  return (
    <section className="featured-projects">
      {/* Section Header */}
      <FadeIn direction="up">
        <div className="featured-projects__header">
          <h2 className="featured-projects__title">Featured Projects</h2>
          <div className="featured-projects__divider" />
          <p className="featured-projects__subtitle">Explore my best work</p>
        </div>
      </FadeIn>

      {/* Project Grid */}
      <StaggerContainer
        staggerDelay={0.15}
        className="featured-projects__grid"
      >
        {sortedProjects.map((project, index) => (
          <FeaturedProjectCard
            key={project._id || project.id || index}
            project={project}
            index={index}
          />
        ))}
      </StaggerContainer>

      {/* View All Link */}
      {projects.length > limit && (
        <FadeIn direction="up" delay={0.4}>
          <div className="featured-projects__cta">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/projects" className="featured-projects__view-all">
                <span>View All Projects</span>
                <FaArrowRight className="featured-projects__view-all-icon" />
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      )}
    </section>
  );
};

export default FeaturedProjects;
