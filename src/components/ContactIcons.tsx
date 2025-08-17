import React from 'react';
import { HiMail } from 'react-icons/hi';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface SocialLink {
  href: string;
  icon: IconType;
  label: string;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'mailto:vanegasdanilo7@gmail.com',
    icon: HiMail,
    label: 'Email',
    color: 'hover:text-red-500',
  },
  {
    href: 'https://www.instagram.com/_dani.svs/',
    icon: FaInstagram,
    label: 'Instagram',
    color: 'hover:text-pink-500',
  },
  {
    href: 'https://github.com/Playyer96',
    icon: FaGithub,
    label: 'GitHub',
    color: 'hover:text-gray-800 dark:hover:text-gray-200',
  },
  {
    href: 'https://www.linkedin.com/in/danisvs/',
    icon: FaLinkedin,
    label: 'LinkedIn',
    color: 'hover:text-blue-500',
  },
];

const ContactIcons: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-4">
      {socialLinks.map(({ href, icon: Icon, label, color }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`glass-effect p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/20 text-gray-600 dark:text-gray-300 ${color} group`}
          aria-label={label}
        >
          <Icon 
            className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" 
          />
        </a>
      ))}
    </div>
  );
};

export default ContactIcons;