import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "../components/animations";
import PageTransition from "../components/PageTransition";
import ParticleBackground from "../components/effects/ParticleBackground";
import SEO from "../components/SEO";
import { FaDownload, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import MyCv from "../assets/cv/CV-Danilo-Vanegas-2025.pdf";
import "./Cv.scss";

const Cv = () => {

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = MyCv;
    link.download = 'CV-Danilo-Vanegas-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const skills = [
    { category: "Game Engines", items: ["Unreal Engine", "Unity"] },
    { category: "Languages", items: ["C++", "C#", "JavaScript", "Python"] },
    { category: "Tools", items: ["Git", "Perforce", "Jira", "Docker"] },
    { category: "Specialties", items: ["Gameplay", "Graphics", "Multiplayer", "Tools"] }
  ];

  return (
    <PageTransition>
      <SEO
        title="CV/Resume - Danilo Vanegas | Download Game Developer Resume"
        description="View and download the CV/Resume of Danilo Vanegas, a Unity and Unreal game developer. Get in touch for game development opportunities and collaborations."
        keywords="Game Developer CV, Unity Developer Resume, Unreal Developer Resume, Download CV, Game Development Resume, Hire Game Developer"
        canonicalUrl="https://danidev.xyz/cv"
      />
      <div className="cv">
        <ParticleBackground particleCount={40} />

      <div className="container">
        {/* Header */}
        <section className="cv__header">
          <FadeIn direction="down" delay={0.2}>
            <div className="cv__title-wrapper">
              <h1 className="cv__title">
                Resume
              </h1>
              <div className="cv__title-line"></div>
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.4}>
            <p className="cv__subtitle">
              Download my resume or view it online
            </p>
          </FadeIn>
        </section>

        {/* Action Buttons */}
        <section className="cv__actions">
          <FadeIn direction="up" delay={0.5}>
            <div className="cv__buttons">
              <motion.button
                className="cv__btn cv__btn--primary"
                onClick={handleDownload}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload />
                Download PDF
              </motion.button>
            </div>
          </FadeIn>
        </section>


        {/* Quick Overview */}
        <section className="cv__overview">
          <FadeIn direction="up" delay={0.6}>
            <h2 className="cv__section-title">Quick Overview</h2>
          </FadeIn>

          <div className="cv__skills-grid">
            {skills.map((skill, index) => (
              <FadeIn key={skill.category} direction="up" delay={0.7 + index * 0.1}>
                <motion.div
                  className="cv__skill-card"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="cv__skill-category">{skill.category}</h3>
                  <ul className="cv__skill-list">
                    {skill.items.map((item, idx) => (
                      <motion.li
                        key={item}
                        className="cv__skill-item"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <span className="cv__skill-bullet">▸</span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="cv__cta">
          <FadeIn direction="up" delay={0.9}>
            <div className="cv__cta-card">
              <h2 className="cv__cta-title">Let's Work Together</h2>
              <p className="cv__cta-text">
                Interested in collaborating? Feel free to reach out through any of these channels.
              </p>
              <div className="cv__cta-links">
                <motion.a
                  href="mailto:vanegasdanilo7@gmail.com"
                  className="cv__cta-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEnvelope />
                  Email
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/danisvs/"
                  target="_blank"
                  rel="noreferrer"
                  className="cv__cta-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin />
                  LinkedIn
                </motion.a>
                <motion.a
                  href="https://github.com/Playyer96"
                  target="_blank"
                  rel="noreferrer"
                  className="cv__cta-link"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub />
                  GitHub
                </motion.a>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
      </div>
    </PageTransition>
  );
};

export default Cv;
