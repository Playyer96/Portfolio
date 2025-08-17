import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';

interface NavItem {
  path: string;
  label: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const navbarRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleMenu = (): void => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = (): void => {
    setIsOpen(false);
  };

  // Close menu when clicking outside
  const handleClickOutside = (event: MouseEvent): void => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      closeMenu();
    }
  };

  // Handle scroll effect
  const handleScroll = (): void => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/experience', label: 'Experience' },
    { path: '/cv', label: 'CV' },
  ];

  const isActiveLink = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-effect backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold font-kaushan text-primary-500 hover:text-primary-400 transition-colors duration-300 hover:scale-105 transform"
          >
            Dani
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item: NavItem) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link font-medium ${
                  isActiveLink(item.path)
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-effect hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 hover:scale-110"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <HiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <HiMoon className="w-5 h-5 text-primary-500" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full glass-effect hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <HiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <HiMoon className="w-5 h-5 text-primary-500" />
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full glass-effect hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <HiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <HiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-64 opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="glass-effect backdrop-blur-xl border-t border-white/20 dark:border-white/10">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item: NavItem) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  isActiveLink(item.path)
                    ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;