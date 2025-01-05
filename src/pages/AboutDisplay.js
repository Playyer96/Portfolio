import React from "react";
import profilePic from "../assets/profile-pic.png";
import "../styles/AboutDisplay.css";

function AboutDisplay() {
    return (
        <div className="main">
            <div className="about">
                <img src={profilePic} alt="Profile"/>
                <div className="about-text">
                    <h1>
                        Hi, I'm <span>Dani</span>
                    </h1>
                    <h5>
                        Unity & Unreal <span>Game Developer</span>
                    </h5>
                    <p>
                        With over six years of experience in game development, I specialize
                        in creating immersive, high-performance experiences across platforms
                        like PC, mobile, and XR. Currently a Senior Game Developer at Optic
                        Power, I bring expertise in Unity (C#) and Unreal Engine (C++/Blueprints), with a proven track
                        record of leading multidisciplinary teams to deliver polished, performance-optimized projects.
                    </p>
                    <p>
                        My passion lies in designing innovative gameplay mechanics, solving
                        complex technical challenges, and pushing the boundaries of VR/AR
                        experiences. Whether it's developing precise physics systems for a
                        golf simulator or optimizing VR performance, I thrive on creating
                        engaging, seamless user experiences.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AboutDisplay;