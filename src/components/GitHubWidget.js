import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import "./GitHubWidget.scss";

const GitHubWidget = () => {
  const [stats, setStats] = useState({
    repos: 15,
    followers: 42,
    contributions: 1200,
    username: "Playyer96"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        const response = await fetch("https://api.github.com/users/Playyer96");
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub stats");
        }
        const data = await response.json();
        setStats(prev => ({
          ...prev,
          repos: data.public_repos || 15,
          followers: data.followers || 42,
          username: data.login || "Playyer96"
        }));
        setError(null);
      } catch (err) {
        console.debug("GitHub API error (using fallback):", err.message);
        // Keep fallback values
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const openGitHub = () => {
    window.open("https://github.com/Playyer96", "_blank");
  };

  return (
    <motion.div
      className="github-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="github-widget__card">
        {/* GitHub Icon */}
        <div className="github-widget__icon">
          <FaGithub size={32} />
        </div>

        {/* Header */}
        <div className="github-widget__header">
          <h3 className="github-widget__title">GitHub Profile</h3>
          <p className="github-widget__username">@{stats.username}</p>
        </div>

        {/* Stats Grid */}
        <div className="github-widget__stats">
          <motion.div
            className="github-widget__stat"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="github-widget__stat-value">{stats.repos}</div>
            <div className="github-widget__stat-label">Repositories</div>
          </motion.div>

          <motion.div
            className="github-widget__stat"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="github-widget__stat-value">{stats.followers}</div>
            <div className="github-widget__stat-label">Followers</div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.button
          className="github-widget__button"
          onClick={openGitHub}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaGithub size={16} />
          Visit GitHub Profile
        </motion.button>

        {/* Divider */}
        <div className="github-widget__divider"></div>

        {/* Footer Text */}
        <p className="github-widget__footer">
          Check out my repositories, contributions, and code quality
        </p>
      </div>
    </motion.div>
  );
};

export default GitHubWidget;
