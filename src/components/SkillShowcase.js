import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./animations";
import { skillCategories, skillProjectMap } from "../data/skillProjectMap";
import "./SkillShowcase.scss";

const SkillShowcase = ({ projects = [] }) => {
  const [selectedSkills, setSelectedSkills] = useState(["Unreal Engine", "Unity"]);
  const [activeCategory, setActiveCategory] = useState("Game Engines");

  // Filter projects by skill keywords
  const getProjectsForSkill = (skillName) => {
    const skillData = skillProjectMap[skillName];
    if (!skillData) return [];

    return projects.filter((project) => {
      const projectText = `${project.name} ${project.description} ${(
        project.technologies || []
      )
        .map((t) => (typeof t === "string" ? t : t.name || t.text))
        .join(" ")}`.toLowerCase();

      return skillData.projectKeywords.some((keyword) =>
        projectText.includes(keyword.toLowerCase())
      );
    });
  };

  const allSkills = Object.keys(skillProjectMap);
  const categorizedSkills = {};

  // Organize skills by category
  Object.entries(skillCategories).forEach(([category, skills]) => {
    categorizedSkills[category] = skills;
  });

  const currentCategorySkills = categorizedSkills[activeCategory] || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <section className="skill-showcase">
      <FadeIn direction="up">
        <div className="skill-showcase__header">
          <h2 className="skill-showcase__title">Technical Skills</h2>
          <p className="skill-showcase__subtitle">
            Click on any skill to see projects demonstrating my expertise
          </p>
        </div>
      </FadeIn>

      {/* Category Tabs */}
      <motion.div
        className="skill-showcase__categories"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {Object.keys(categorizedSkills).map((category) => (
          <motion.button
            key={category}
            className={`skill-showcase__category-btn ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(category);
              // Expand all skills in new category
              setSelectedSkills(categorizedSkills[category]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Skills Grid */}
      <motion.div
        className="skill-showcase__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AnimatePresence mode="wait">
          {currentCategorySkills.map((skillName) => {
            const skillData = skillProjectMap[skillName];
            const relatedProjects = getProjectsForSkill(skillName);
            const isSelected = selectedSkills.includes(skillName);

            return (
              <motion.div
                key={skillName}
                variants={itemVariants}
                className="skill-showcase__skill active"
              >
                {/* Skill Pill */}
                <motion.div
                  className="skill-showcase__pill"
                  style={{ borderColor: skillData.color }}
                  whileHover={{ boxShadow: `0 0 20px ${skillData.color}40` }}
                >
                  <div className="skill-showcase__pill-content">
                    <h3
                      className="skill-showcase__skill-name"
                      style={{ color: skillData.color }}
                    >
                      {skillName}
                    </h3>
                    <p className="skill-showcase__skill-focus">
                      {skillData.focus}
                    </p>
                  </div>

                  <motion.div
                    className="skill-showcase__expand-indicator"
                    animate={{ rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.div>
                </motion.div>

                {/* Expanded Details */}
                <motion.div
                  className="skill-showcase__details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                      <div className="skill-showcase__description">
                        {skillData.description}
                      </div>

                      {/* Examples */}
                      <div className="skill-showcase__examples">
                        <h4>What I Build</h4>
                        <ul>
                          {skillData.examples.map((example, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <span className="skill-showcase__bullet">▸</span>
                              {example}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Related Projects */}
                      {relatedProjects.length > 0 && (
                        <div className="skill-showcase__projects">
                          <h4>See In Projects</h4>
                          <div className="skill-showcase__project-tags">
                            {relatedProjects.slice(0, 3).map((project) => (
                              <motion.span
                                key={project.name}
                                className="skill-showcase__project-tag"
                                style={{
                                  borderColor: skillData.color,
                                  color: skillData.color
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 300
                                }}
                              >
                                {project.name}
                              </motion.span>
                            ))}
                            {relatedProjects.length > 3 && (
                              <span className="skill-showcase__more-projects">
                                +{relatedProjects.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </section>
  );
};

export default SkillShowcase;
