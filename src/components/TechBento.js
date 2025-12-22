import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import "./TechBento.scss";

const TechBento = ({ technologies, getIconComponent }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Categorize technologies
  const categories = {
    game: { name: "Game Development", color: "#00ff88", techs: [] },
    web: { name: "Web Development", color: "#00d9ff", techs: [] },
    tools: { name: "Tools & DevOps", color: "#ff00ff", techs: [] }
  };

  const gameDevKeywords = ['unity', 'unreal', 'c++', 'c#', 'perforce'];
  const webDevKeywords = ['react', 'html', 'css', 'javascript', 'js'];

  technologies.forEach(tech => {
    const techName = (tech.text || tech.name || '').toLowerCase();
    if (gameDevKeywords.some(k => techName.includes(k))) {
      categories.game.techs.push(tech);
    } else if (webDevKeywords.some(k => techName.includes(k))) {
      categories.web.techs.push(tech);
    } else {
      categories.tools.techs.push(tech);
    }
  });

  return (
    <div className="tech-bento">
      {/* Category Headers */}
      <div className="tech-bento__categories">
        {Object.entries(categories).map(([key, category], index) => (
          <motion.div
            key={key}
            className="tech-bento__category"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="tech-bento__category-header">
              <h3 className="tech-bento__category-title">{category.name}</h3>
              <span className="tech-bento__category-count">{category.techs.length}</span>
            </div>

            {/* Bento Grid */}
            <div className="tech-bento__grid">
              {category.techs.map((tech, techIndex) => (
                <MagneticCard
                  key={techIndex}
                  tech={tech}
                  index={techIndex}
                  color={category.color}
                  getIconComponent={getIconComponent}
                  isHovered={hoveredCard === `${key}-${techIndex}`}
                  onHover={() => setHoveredCard(`${key}-${techIndex}`)}
                  onLeave={() => setHoveredCard(null)}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MagneticCard = ({ tech, index, color, getIconComponent, isHovered, onHover, onLeave }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    onLeave();
  };

  const IconComponent = getIconComponent(tech.text || tech.name);

  return (
    <motion.div
      className="tech-bento__card"
      style={{
        '--card-color': color,
        rotateX,
        rotateY,
        x: springX,
        y: springY
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHover}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tech-bento__card-inner">
        <motion.div
          className="tech-bento__card-glow"
          animate={{
            opacity: isHovered ? 0.6 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        <div className="tech-bento__card-content">
          <IconComponent className="tech-bento__icon" />
          <span className="tech-bento__label">{tech.text || tech.name}</span>
        </div>

        <motion.div
          className="tech-bento__card-border"
          animate={{
            opacity: isHovered ? 1 : 0
          }}
        />
      </div>
    </motion.div>
  );
};

export default TechBento;
