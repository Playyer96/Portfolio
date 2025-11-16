import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import "../styles/ContactIcons.css";

function ContactIcons() {
  return (
    <div className="socialMedia">
      <a href="mailto:vanegasdanilo7@gmail.com" target="_blank" rel="noreferrer">
        <EmailIcon />
      </a>
      <a
        href="https://www.instagram.com/_dani.svs/"
        target="_blank"
        rel="noreferrer"
      >
        <InstagramIcon />
      </a>
      <a href="https://github.com/Playyer96" target="_blank" rel="noreferrer">
        <GitHubIcon />
      </a>
      <a
        href="https://www.linkedin.com/in/danisvs/"
        target="_blank"
        rel="noreferrer"
      >
        <LinkedInIcon />
      </a>
    </div>
  );
}

export default ContactIcons;
