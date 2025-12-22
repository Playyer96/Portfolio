import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./TechTree.scss";

const TechTree = ({ technologies, getIconComponent }) => {
  const [unlockedNodes, setUnlockedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Categorize technologies
  const branches = {
    game: {
      name: "Game Development",
      color: "#00ff88",
      icon: "🎮",
      techs: []
    },
    web: {
      name: "Web Development",
      color: "#00d9ff",
      icon: "🌐",
      techs: []
    },
    tools: {
      name: "Tools & Infrastructure",
      color: "#ff00ff",
      icon: "⚙️",
      techs: []
    }
  };

  const gameDevKeywords = ['unity', 'unreal', 'c++', 'c#', 'perforce'];
  const webDevKeywords = ['react', 'html', 'css', 'javascript', 'js'];
  const toolsKeywords = ['node', 'python', 'git', 'github', 'gitlab', 'docker', 'slack', 'jira'];

  technologies.forEach(tech => {
    const techName = (tech.text || tech.name || '').toLowerCase();
    if (gameDevKeywords.some(k => techName.includes(k))) {
      branches.game.techs.push(tech);
    } else if (webDevKeywords.some(k => techName.includes(k))) {
      branches.web.techs.push(tech);
    } else if (toolsKeywords.some(k => techName.includes(k))) {
      branches.tools.techs.push(tech);
    } else {
      branches.tools.techs.push(tech);
    }
  });

  // Progressive unlock animation
  useEffect(() => {
    const unlockSequence = async () => {
      const allTechs = [...branches.game.techs, ...branches.web.techs, ...branches.tools.techs];
      for (let i = 0; i < allTechs.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUnlockedNodes(prev => new Set([...prev, i]));
      }
    };
    unlockSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBranches = selectedBranch === 'all'
    ? Object.entries(branches)
    : Object.entries(branches).filter(([key]) => key === selectedBranch);

  return (
    <div className="tech-tree">
      {/* Branch Selector */}
      <div className="tech-tree__selector">
        <motion.button
          className={`tech-tree__branch-btn ${selectedBranch === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedBranch('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="tech-tree__branch-icon">🌟</span>
          All Skills
        </motion.button>
        {Object.entries(branches).map(([key, branch]) => (
          <motion.button
            key={key}
            className={`tech-tree__branch-btn ${selectedBranch === key ? 'active' : ''}`}
            onClick={() => setSelectedBranch(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ '--branch-color': branch.color }}
          >
            <span className="tech-tree__branch-icon">{branch.icon}</span>
            {branch.name}
          </motion.button>
        ))}
      </div>

      {/* Tech Branches */}
      <div className="tech-tree__branches">
        {filteredBranches.map(([branchKey, branch], branchIndex) => {
          let globalOffset = 0;
          if (branchKey === 'web') globalOffset = branches.game.techs.length;
          if (branchKey === 'tools') globalOffset = branches.game.techs.length + branches.web.techs.length;

          return (
            <motion.div
              key={branchKey}
              className="tech-tree__branch"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: branchIndex * 0.2 }}
              style={{ '--branch-color': branch.color }}
            >
              {/* Branch Header */}
              <div className="tech-tree__branch-header">
                <motion.div
                  className="tech-tree__branch-root"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: branchIndex * 0.2 + 0.3, type: "spring" }}
                >
                  <div className="tech-tree__root-pulse"></div>
                  <div className="tech-tree__branch-icon-large">{branch.icon}</div>
                </motion.div>
                <div className="tech-tree__branch-info">
                  <h3 className="tech-tree__branch-title">{branch.name}</h3>
                  <p className="tech-tree__branch-count">{branch.techs.length} Skills Mastered</p>
                </div>
                <div className="tech-tree__branch-line"></div>
              </div>

              {/* Tech Nodes Grid */}
              <div className="tech-tree__nodes-grid">
                {branch.techs.map((tech, index) => {
                  const globalIndex = globalOffset + index;
                  const isUnlocked = unlockedNodes.has(globalIndex);
                  const IconComponent = getIconComponent(tech.text || tech.name);

                  return (
                    <motion.div
                      key={index}
                      className={`tech-tree__node ${isUnlocked ? 'unlocked' : 'locked'}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={isUnlocked ? {
                        scale: 1,
                        opacity: 1,
                      } : { scale: 0.5, opacity: 0.3 }}
                      transition={{
                        delay: globalIndex * 0.1,
                        duration: 0.5,
                        type: "spring"
                      }}
                      onMouseEnter={() => setHoveredNode(globalIndex)}
                      onMouseLeave={() => setHoveredNode(null)}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <div className="tech-tree__node-inner">
                        {/* Glow Effect */}
                        <div className="tech-tree__node-glow"></div>

                        {/* Icon Container */}
                        <div className="tech-tree__node-icon-wrapper">
                          <IconComponent className="tech-tree__node-icon" />
                        </div>

                        {/* Unlock Burst */}
                        {isUnlocked && (
                          <motion.div
                            className="tech-tree__unlock-burst"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.6, delay: globalIndex * 0.1 }}
                          />
                        )}

                        {/* Level Badge */}
                        <div className="tech-tree__node-badge">
                          {isUnlocked ? 'MAX' : '🔒'}
                        </div>
                      </div>

                      {/* Node Label */}
                      <div className="tech-tree__node-label">
                        {tech.text || tech.name}
                      </div>

                      {/* Connection Line to Previous */}
                      {index > 0 && (
                        <motion.div
                          className="tech-tree__connection-line"
                          initial={{ scaleX: 0 }}
                          animate={isUnlocked ? { scaleX: 1 } : { scaleX: 0 }}
                          transition={{ delay: globalIndex * 0.1 + 0.2 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode !== null && (
          <motion.div
            className="tech-tree__tooltip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="tech-tree__tooltip-header">⭐ Skill Mastered</div>
            <div className="tech-tree__tooltip-body">
              <div className="tech-tree__tooltip-row">
                <span>Level:</span>
                <span className="tech-tree__tooltip-value">MAX</span>
              </div>
              <div className="tech-tree__tooltip-row">
                <span>Proficiency:</span>
                <span className="tech-tree__tooltip-value">Expert</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Footer */}
      <motion.div
        className="tech-tree__stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="tech-tree__stat-card">
          <div className="tech-tree__stat-icon">🎯</div>
          <div className="tech-tree__stat-value">{technologies.length}</div>
          <div className="tech-tree__stat-label">Total Skills</div>
        </div>
        <div className="tech-tree__stat-card">
          <div className="tech-tree__stat-icon">🎮</div>
          <div className="tech-tree__stat-value">{branches.game.techs.length}</div>
          <div className="tech-tree__stat-label">Game Dev</div>
        </div>
        <div className="tech-tree__stat-card">
          <div className="tech-tree__stat-icon">🌐</div>
          <div className="tech-tree__stat-value">{branches.web.techs.length}</div>
          <div className="tech-tree__stat-label">Web Dev</div>
        </div>
        <div className="tech-tree__stat-card">
          <div className="tech-tree__stat-icon">⚙️</div>
          <div className="tech-tree__stat-value">{branches.tools.techs.length}</div>
          <div className="tech-tree__stat-label">Tools</div>
        </div>
      </motion.div>
    </div>
  );
};

export default TechTree;
