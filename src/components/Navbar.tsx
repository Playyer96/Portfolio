import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.scss";

/**
 * Navigation Item Interface
 */
interface NavItem {
  name: string;
  path: string;
}

/**
 * Navbar Component
 *
 * Main navigation bar with desktop and mobile responsive layouts
 * Features scroll detection, active link highlighting, and smooth animations
 */
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navbarRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const toggleMenu = (): void => {
    setIsOpen((prevState) => !prevState);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  // Close the menu if clicked outside
  const closeMenuOnClickOutside = (event: MouseEvent): void => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.addEventListener("click", closeMenuOnClickOutside);
    return () => {
      document.removeEventListener("click", closeMenuOnClickOutside);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location]);

  const navItems: NavItem[] = [
    { name: "Projects", path: "/projects" },
    { name: "Experience", path: "/experience" },
    { name: "CV", path: "/cv" }
  ];

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      ref={navbarRef}
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <motion.span
            className="navbar__logo-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="navbar__logo-bracket">{"<"}</span>
            Dani
            <span className="navbar__logo-bracket">{" />"}</span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar__desktop">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar__link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
              </motion.span>
              {location.pathname === item.path && (
                <motion.div
                  className="navbar__link-active"
                  layoutId="activeNav"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className={`navbar__toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="navbar__overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <motion.div
              className="navbar__mobile"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="navbar__mobile-content">
                {navItems.map((item) => (
                  <motion.div key={item.path} variants={itemVariants}>
                    <Link
                      to={item.path}
                      className={`navbar__mobile-link ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                      onClick={closeMenu}
                    >
                      <span className="navbar__mobile-link-text">
                        {item.name}
                      </span>
                      {location.pathname === item.path && (
                        <span className="navbar__mobile-link-indicator">→</span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
