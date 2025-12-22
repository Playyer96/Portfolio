import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./TechConstellation.scss";

const TechConstellation = ({ technologies, getIconComponent }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [particles, setParticles] = useState([]);

  // Categorize technologies
  const categories = {
    game: { name: "Game Dev", color: "#00ff88", techs: [] },
    web: { name: "Web Dev", color: "#00d9ff", techs: [] },
    tools: { name: "Tools", color: "#ff00ff", techs: [] }
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
      // Default to tools category
      categories.tools.techs.push(tech);
    }
  });

  // Generate particles for connections
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Arrange techs in 3D space
  const getTechPosition = (category, index, total) => {
    const layers = {
      game: { depth: 1, baseAngle: 0 },
      web: { depth: 0.5, baseAngle: 120 },
      tools: { depth: 0.7, baseAngle: 240 }
    };

    const layer = layers[category];
    const angle = layer.baseAngle + (360 / total) * index;
    const radius = 35 + (index % 2) * 10;

    return {
      x: 50 + Math.cos((angle * Math.PI) / 180) * radius,
      y: 50 + Math.sin((angle * Math.PI) / 180) * radius,
      z: layer.depth,
      rotation: angle
    };
  };

  const allTechs = [
    ...categories.game.techs.map((t, i) => ({
      ...t,
      category: 'game',
      position: getTechPosition('game', i, categories.game.techs.length)
    })),
    ...categories.web.techs.map((t, i) => ({
      ...t,
      category: 'web',
      position: getTechPosition('web', i, categories.web.techs.length)
    })),
    ...categories.tools.techs.map((t, i) => ({
      ...t,
      category: 'tools',
      position: getTechPosition('tools', i, categories.tools.techs.length)
    }))
  ];

  const filteredTechs = activeCategory
    ? allTechs.filter(t => t.category === activeCategory)
    : allTechs;

  return (
    <div className="tech-constellation">
      {/* Particle Background */}
      <div className="tech-constellation__particles">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="tech-constellation__particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Category Filter Pills */}
      <div className="tech-constellation__filters">
        <motion.button
          className={`tech-constellation__filter ${!activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="tech-constellation__filter-glow"></span>
          ALL SYSTEMS
        </motion.button>
        {Object.entries(categories).map(([key, cat]) => (
          <motion.button
            key={key}
            className={`tech-constellation__filter ${activeCategory === key ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === key ? null : key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ '--cat-color': cat.color }}
          >
            <span className="tech-constellation__filter-glow"></span>
            {cat.name.toUpperCase()}
          </motion.button>
        ))}
      </div>

      {/* Constellation Space */}
      <div className="tech-constellation__space">
        {/* Connection Lines */}
        <svg className="tech-constellation__connections" viewBox="0 0 100 100">
          <defs>
            {Object.entries(categories).map(([key, cat]) => (
              <linearGradient key={key} id={`gradient-${key}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: cat.color, stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: cat.color, stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: cat.color, stopOpacity: 0 }} />
              </linearGradient>
            ))}
          </defs>

          {filteredTechs.map((tech, i) => {
            const nextTechs = filteredTechs.filter((t, idx) =>
              idx > i && t.category === tech.category && idx <= i + 2
            );
            return nextTechs.map((nextTech, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={tech.position.x}
                y1={tech.position.y}
                x2={nextTech.position.x}
                y2={nextTech.position.y}
                stroke={`url(#gradient-${tech.category})`}
                strokeWidth="0.15"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: i * 0.05 }}
              />
            ));
          })}
        </svg>

        {/* Tech Nodes */}
        {filteredTechs.map((tech, index) => {
          const IconComponent = getIconComponent(tech.text || tech.name);
          const category = categories[tech.category];

          return (
            <motion.div
              key={index}
              className="tech-constellation__node"
              style={{
                '--node-x': `${tech.position.x}%`,
                '--node-y': `${tech.position.y}%`,
                '--node-z': tech.position.z,
                '--node-color': category.color,
                '--node-rotation': `${tech.position.rotation}deg`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{
                scale: 1.3,
                z: 100,
                transition: { duration: 0.2 }
              }}
            >
              {/* Holographic Layers */}
              <div className="tech-constellation__hologram">
                <div className="tech-constellation__hologram-layer tech-constellation__hologram-layer--1"></div>
                <div className="tech-constellation__hologram-layer tech-constellation__hologram-layer--2"></div>
                <div className="tech-constellation__hologram-layer tech-constellation__hologram-layer--3"></div>
              </div>

              {/* Orbital Rings */}
              <motion.div
                className="tech-constellation__orbit tech-constellation__orbit--1"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="tech-constellation__orbit tech-constellation__orbit--2"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Core */}
              <div className="tech-constellation__core">
                <div className="tech-constellation__core-glow"></div>
                <IconComponent className="tech-constellation__icon" />
              </div>

              {/* Scan Lines */}
              <div className="tech-constellation__scanlines"></div>

              {/* Label */}
              <div className="tech-constellation__label">
                <div className="tech-constellation__label-bg"></div>
                <span>{tech.text || tech.name}</span>
              </div>

              {/* Pulse Effect */}
              <motion.div
                className="tech-constellation__pulse"
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.8, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeOut"
                }}
              />
            </motion.div>
          );
        })}

        {/* Center Core */}
        <motion.div
          className="tech-constellation__center"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="tech-constellation__center-ring"></div>
          <div className="tech-constellation__center-core">
            <span className="tech-constellation__center-text">TECH</span>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        className="tech-constellation__stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="tech-constellation__stat">
          <div className="tech-constellation__stat-value">{categories.game.techs.length}</div>
          <div className="tech-constellation__stat-label">Game</div>
        </div>
        <div className="tech-constellation__stat-divider"></div>
        <div className="tech-constellation__stat">
          <div className="tech-constellation__stat-value">{categories.web.techs.length}</div>
          <div className="tech-constellation__stat-label">Web</div>
        </div>
        <div className="tech-constellation__stat-divider"></div>
        <div className="tech-constellation__stat">
          <div className="tech-constellation__stat-value">{categories.tools.techs.length}</div>
          <div className="tech-constellation__stat-label">Tools</div>
        </div>
      </motion.div>
    </div>
  );
};

export default TechConstellation;
