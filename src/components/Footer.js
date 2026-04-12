import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./animations";
import "./Footer.scss";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <div className="container">
        <FadeIn direction="up" delay={0.1}>
          <div className="footer__content">
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
    </footer>
  );
};

export default Footer;
