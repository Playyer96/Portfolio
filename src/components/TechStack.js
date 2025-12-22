import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer } from "./animations";
import "./TechStack.scss";

const TechStack = ({ technologies, getIconComponent }) => {
  // Categorize technologies by industry
  const categorizedTech = useMemo(() => {
    const categories = {
      "Game Development": [],
      "Web Development": [],
      "Backend & Tools": []
    };

    const gameDevKeywords = ['unity', 'unreal', 'c++', 'c#', 'perforce'];
    const webDevKeywords = ['react', 'html', 'css', 'javascript', 'js'];
    const backendKeywords = ['node', 'python', 'git', 'github', 'gitlab', 'docker', 'slack', 'jira'];

    technologies.forEach(tech => {
      const techName = (tech.text || tech.name || '').toLowerCase();

      if (gameDevKeywords.some(keyword => techName.includes(keyword))) {
        categories["Game Development"].push(tech);
      } else if (webDevKeywords.some(keyword => techName.includes(keyword))) {
        categories["Web Development"].push(tech);
      } else if (backendKeywords.some(keyword => techName.includes(keyword))) {
        categories["Backend & Tools"].push(tech);
      } else {
        // Default to backend if unknown
        categories["Backend & Tools"].push(tech);
      }
    });

    return categories;
  }, [technologies]);

  return (
    <div className="tech-stack">
      {Object.entries(categorizedTech).map(([category, techs], categoryIndex) => {
        if (techs.length === 0) return null;

        return (
          <FadeIn key={category} direction="up" delay={categoryIndex * 0.2}>
            <div className="tech-stack__category">
              <div className="tech-stack__category-header">
                <span className="tech-stack__category-number">
                  {String(categoryIndex + 1).padStart(2, '0')}
                </span>
                <h3 className="tech-stack__category-title">{category}</h3>
                <div className="tech-stack__category-line"></div>
              </div>

              <StaggerContainer
                staggerDelay={0.05}
                className="tech-stack__grid"
              >
                {techs.map((tech, index) => {
                  const IconComponent = getIconComponent(tech.text || tech.name);

                  return (
                    <motion.div
                      key={index}
                      className="tech-stack__card"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="tech-stack__card-inner">
                        <div className="tech-stack__icon-wrapper">
                          <IconComponent className="tech-stack__icon" />
                          <div className="tech-stack__glow"></div>
                        </div>
                        <span className="tech-stack__name">{tech.text || tech.name}</span>
                      </div>
                      <div className="tech-stack__card-border"></div>
                    </motion.div>
                  );
                })}
              </StaggerContainer>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
};

export default TechStack;
