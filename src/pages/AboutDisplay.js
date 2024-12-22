import React from "react";
import profilePic from "../assets/profile-pic.png";
import "../styles/AboutDisplay.css";

function AboutDisplay() {
  return (
    <div className="main">
      <div className="about">
        <img src={profilePic} />
        <div className="about-text">
          <h1>
            Hi I'm <span>Dani</span>
          </h1>
          <h5>
            Unity & Unreal <span>Software Developer</span>
          </h5>
          <p>
            Software Engineer at Optic Power with a Engineering in Digital
            Entertainment Degree from Universidad Pontificia Bolivariana. Strong
            passion and interest for game development, web development and game
            design and willing to learn new technologies. Passionate about
            Programming, Game Development, and VR/AR experiences creation. Love
            working with multidisciplinary teams, and I am interested in
            Object-Oriented Programming (OOP), Computer Graphics, and Agile
            Methodologies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutDisplay;
