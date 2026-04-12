import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./animations";
import { FaEnvelope, FaLinkedin, FaGithub, FaXTwitter } from "react-icons/fa6";
import "./Footer.scss";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const links = [
    {
      label: "Email",
      href: "mailto:vanegasdanilo7@gmail.com",
      icon: FaEnvelope,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/danisvs/",
      icon: FaLinkedin,
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/Playyer96",
      icon: FaGithub,
      external: true,
    },
    {
      label: "Twitter",
      href: "https://twitter.com",
      icon: FaXTwitter,
      external: true,
    },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Main footer info */}
          <FadeIn direction="up" delay={0.1}>
            <div className="footer__main">
              <div className="footer__branding">
                <h3 className="footer__name">Danilo Vanegas</h3>
                <p className="footer__subtitle">Game Developer & Technical Architect</p>
              </div>

              <div className="footer__divider"></div>

              {/* Quick links */}
              <nav className="footer__nav">
                <div className="footer__nav-section">
                  <h4 className="footer__nav-title">Navigate</h4>
                  <ul className="footer__nav-list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/projects">Projects</a></li>
                    <li><a href="/experience">Experience</a></li>
                  </ul>
                </div>

                <div className="footer__nav-section">
                  <h4 className="footer__nav-title">Connect</h4>
                  <ul className="footer__nav-list">
                    <li><a href="mailto:vanegasdanilo7@gmail.com">Email</a></li>
                    <li><a href="https://www.linkedin.com/in/danisvs/" target="_blank" rel="noreferrer">LinkedIn</a></li>
                    <li><a href="https://github.com/Playyer96" target="_blank" rel="noreferrer">GitHub</a></li>
                  </ul>
                </div>
              </nav>
            </div>
          </FadeIn>

          {/* Social icons */}
          <FadeIn direction="up" delay={0.2}>
            <div className="footer__social">
              {links.map(({ label, href, icon: Icon, external }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="footer__social-link"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  title={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </FadeIn>

          {/* Bottom section */}
          <FadeIn direction="up" delay={0.3}>
            <div className="footer__bottom">
              <p className="footer__copyright">
                © {currentYear} Danilo Vanegas. All rights reserved.
              </p>
              <p className="footer__credit">
                Built with <motion.span
                  className="footer__heart"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ♥
                </motion.span> using React, Sass, and Framer Motion
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
