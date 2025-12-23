import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./animations";
import "./Footer.scss";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="footer__content container">
        <FadeIn direction="up" delay={0.1}>
          <div className="footer__info">
            <div className="footer__logo">
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="footer__bottom">
            <p className="footer__copyright">
              © {currentYear} Danilo Vanegas. All rights reserved.
            </p>
            <p className="footer__made-with">
              Built with <motion.span
                className="footer__heart"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >♥</motion.span> React & Sass
            </p>
            <a
              href="mailto:vanegasdanilo7@gmail.com"
              className="footer__email"
            >
              vanegasdanilo7@gmail.com
            </a>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
};

export default Footer;
