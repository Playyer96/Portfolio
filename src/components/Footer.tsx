import React, { useMemo } from 'react';
import ContactIcons from './ContactIcons';

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative mt-20 py-12 border-t border-white/10 dark:border-gray-800/50">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="glass-card text-center">
          {/* Social Icons */}
          <div className="mb-8">
            <ContactIcons />
          </div>
          
          {/* Footer Text */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Made with{' '}
              <span className="text-red-500 animate-pulse">❤️</span>
              {' '}by{' '}
              <span className="text-gradient font-semibold">
                Danilo Vanegas
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <a 
                href="mailto:vanegasdanilo7@gmail.com"
                className="hover:text-primary-500 transition-colors duration-300"
              >
                vanegasdanilo7@gmail.com
              </a>
              <span className="hidden sm:block">•</span>
              <p>© {currentYear} All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;