import React, { useMemo } from "react";
import ContactIcons from "./ContactIcons";
import "../styles/Footer.css";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="footer">
      <ContactIcons />
      <p>Copyright danidev.xyz &copy; {currentYear}</p>
    </footer>
  );
};

export default Footer;
