import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ContactIcons from "./ContactIcons";
import { FadeIn } from "./animations";
import "./Footer.scss";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="footer__decoration"></div>

      <div className="footer__content container">
        <FadeIn direction="up" delay={0.1}>
          <div className="footer__logo">
            <span className="footer__logo-bracket">{"<"}</span>
            Dani
            <span className="footer__logo-bracket">{" />"}</span>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <p className="footer__tagline">
            Crafting immersive gaming experiences, one line of code at a time
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={0.3}>
          <ContactIcons />
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          <div className="footer__divider"></div>
        </FadeIn>

        <FadeIn direction="up" delay={0.5}>
          <div className="footer__bottom">
            <p className="footer__copyright">
              © {currentYear} Danilo Vanegas. All rights reserved.
            </p>
            <p className="footer__made-with">
              Built with <motion.span
                className="footer__heart"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >♥</motion.span> using React & Sass
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.6}>
          <a
            href="mailto:vanegasdanilo7@gmail.com"
            className="footer__email"
          >
            vanegasdanilo7@gmail.com
          </a>
        </FadeIn>
      </div>
    </footer>
  );
};

export default Footer;
