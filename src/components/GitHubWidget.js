import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from "react-icons/fa";
import { FadeIn } from "./animations";
import useGitHubData from "../hooks/useGitHubData";
import "./GitHubWidget.scss";

// Language colors matching GitHub's language colors
const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  ShaderLab: "#222c37",
  HLSL: "#aace60",
  Lua: "#000080",
  Rust: "#dea584",
  Go: "#00ADD8",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
};

const getLanguageColor = (language) => {
  return LANGUAGE_COLORS[language] || "#8b949e";
};

const SkeletonLoader = () => (
  <div className="github-widget__skeleton">
    <div className="github-widget__skeleton-header">
      <div className="github-widget__skeleton-bar github-widget__skeleton-bar--wide" />
      <div className="github-widget__skeleton-bar github-widget__skeleton-bar--narrow" />
    </div>
    <div className="github-widget__skeleton-stats">
      {[1, 2, 3].map((i) => (
        <div key={i} className="github-widget__skeleton-stat" />
      ))}
    </div>
    <div className="github-widget__skeleton-repos">
      {[1, 2, 3].map((i) => (
        <div key={i} className="github-widget__skeleton-repo" />
      ))}
    </div>
  </div>
);

const GitHubWidget = ({
  username = "Playyer96",
  showTopLanguages = true,
  maxRepositories = 4,
}) => {
  const { userData, repositories, languages, loading, error } =
    useGitHubData(username);

  const topLanguages = Object.entries(languages).slice(0, 5);
  const topRepos = repositories
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, maxRepositories);

  const openGitHub = () => {
    window.open(`https://github.com/${username}`, "_blank", "noopener");
  };

  if (loading) {
    return (
      <div className="github-widget">
        <div className="github-widget__card">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <FadeIn>
        <div className="github-widget">
          <div className="github-widget__card">
            <div className="github-widget__icon">
              <FaGithub size={32} />
            </div>
            <div className="github-widget__header">
              <h3 className="github-widget__title">GitHub Insights</h3>
              <p className="github-widget__error">
                Unable to fetch GitHub data. Please try again later.
              </p>
            </div>
            <motion.button
              className="github-widget__button"
              onClick={openGitHub}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGithub size={16} />
              Visit GitHub Profile
            </motion.button>
          </div>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="github-widget">
        <div className="github-widget__card">
          {/* Header */}
          <div className="github-widget__header-row">
            <div className="github-widget__icon">
              <FaGithub size={28} />
            </div>
            <div className="github-widget__header">
              <h3 className="github-widget__title">GitHub Insights</h3>
              <p className="github-widget__username">@{userData?.login}</p>
            </div>
          </div>

          <div className="github-widget__body">
            {/* Left Column - Stats + Languages */}
            <div className="github-widget__left">
              {/* Stats */}
              <div className="github-widget__stats">
                <motion.div
                  className="github-widget__stat"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="github-widget__stat-value">
                    {userData?.public_repos || 0}
                  </div>
                  <div className="github-widget__stat-label">Repositories</div>
                </motion.div>

                <motion.div
                  className="github-widget__stat"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="github-widget__stat-value">
                    {userData?.followers || 0}
                  </div>
                  <div className="github-widget__stat-label">Followers</div>
                </motion.div>

                <motion.div
                  className="github-widget__stat"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="github-widget__stat-value">
                    {userData?.following || 0}
                  </div>
                  <div className="github-widget__stat-label">Following</div>
                </motion.div>
              </div>

              {/* Top Languages */}
              {showTopLanguages && topLanguages.length > 0 && (
                <div className="github-widget__languages">
                  <h4 className="github-widget__section-title">
                    Top Languages
                  </h4>
                  <div className="github-widget__language-list">
                    {topLanguages.map(([lang, percentage], index) => (
                      <motion.div
                        key={lang}
                        className="github-widget__language"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <div className="github-widget__language-header">
                          <span
                            className="github-widget__language-dot"
                            style={{
                              backgroundColor: getLanguageColor(lang),
                            }}
                          />
                          <span className="github-widget__language-name">
                            {lang}
                          </span>
                          <span className="github-widget__language-pct">
                            {percentage}%
                          </span>
                        </div>
                        <div className="github-widget__language-bar-bg">
                          <motion.div
                            className="github-widget__language-bar"
                            style={{
                              backgroundColor: getLanguageColor(lang),
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            viewport={{ once: true }}
                            transition={{
                              delay: index * 0.1 + 0.2,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Repositories */}
            <div className="github-widget__right">
              {topRepos.length > 0 && (
                <div className="github-widget__repos">
                  <h4 className="github-widget__section-title">
                    Top Repositories
                  </h4>
                  <div className="github-widget__repo-list">
                    {topRepos.map((repo, index) => (
                      <motion.a
                        key={repo.name}
                        className="github-widget__repo"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="github-widget__repo-header">
                          <span className="github-widget__repo-name">
                            {repo.name}
                          </span>
                          <FaExternalLinkAlt
                            size={10}
                            className="github-widget__repo-link-icon"
                          />
                        </div>
                        {repo.description && (
                          <p className="github-widget__repo-desc">
                            {repo.description}
                          </p>
                        )}
                        <div className="github-widget__repo-meta">
                          {repo.language && (
                            <span className="github-widget__repo-lang">
                              <span
                                className="github-widget__language-dot"
                                style={{
                                  backgroundColor: getLanguageColor(
                                    repo.language
                                  ),
                                }}
                              />
                              {repo.language}
                            </span>
                          )}
                          <span className="github-widget__repo-stat">
                            <FaStar size={12} />
                            {repo.stargazers_count}
                          </span>
                          <span className="github-widget__repo-stat">
                            <FaCodeBranch size={12} />
                            {repo.forks_count}
                          </span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
        </div>
      </div>
    </FadeIn>
  );
};

export default GitHubWidget;
