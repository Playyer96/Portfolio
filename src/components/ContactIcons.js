import React from "react";
import { motion } from "framer-motion";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import "./ContactIcons.scss";

const ContactIcons = () => {
  const socialLinks = [
    {
      icon: <EmailIcon />,
      href: "mailto:vanegasdanilo7@gmail.com",
      label: "Email",
      color: "#00ff88"
    },
    {
      icon: <GitHubIcon />,
      href: "https://github.com/Playyer96",
      label: "GitHub",
      color: "#00d9ff"
    },
    {
      icon: <LinkedInIcon />,
      href: "https://www.linkedin.com/in/danisvs/",
      label: "LinkedIn",
      color: "#00ff88"
    },
    {
      icon: <InstagramIcon />,
      href: "https://www.instagram.com/_dani.svs/",
      label: "Instagram",
      color: "#ff00ff"
    }
  ];

  return (
    <div className="contact-icons">
      {socialLinks.map((social, index) => (
        <motion.a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          className="contact-icons__link"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{
            scale: 1.2,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={social.label}
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};

export default ContactIcons;
