import React from "react";
import { motion } from "framer-motion";
import { StaggerContainer } from "./animations";
import StatCard from "./StatCard";
import useGitHubData from "../hooks/useGitHubData";
import { FaGithub, FaUsers } from "react-icons/fa";
import "./StatsShowcase.scss";

const StatsShowcase = ({
  stats = [],
  showGithubIntegration = false,
  columns,
}) => {
  const { userData, loading: githubLoading } = useGitHubData();

  // Build the list of stat cards, optionally including GitHub stats
  const allStats = [...stats];

  if (showGithubIntegration && userData && !githubLoading) {
    allStats.push({
      number: userData.public_repos || 0,
      label: "GitHub Repos",
      color: "primary",
      icon: FaGithub,
      animated: true,
    });
    allStats.push({
      number: userData.followers || 0,
      label: "Followers",
      color: "accent",
      icon: FaUsers,
      animated: true,
    });
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const columnClass = columns ? `stats-showcase--cols-${columns}` : "";

  return (
    <div className={`stats-showcase ${columnClass}`}>
      <motion.div
        className="stats-showcase__grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {allStats.map((stat, index) => (
          <StatCard
            key={stat.label || index}
            number={stat.number}
            label={stat.label}
            color={stat.color || "primary"}
            icon={stat.icon}
            animated={stat.animated !== undefined ? stat.animated : true}
            description={stat.description}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default StatsShowcase;
