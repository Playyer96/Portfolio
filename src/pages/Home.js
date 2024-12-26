import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDisplay from "../components/CardDisplay";
import ContactIcons from "../components/ContactIcons";
import { SkillsList } from "../helpers/SkillsList";
import "../styles/Home.css";

const Home = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // After the component mounts, set the state to trigger the fade-in
        setIsLoaded(true);
    }, []);

    return (
        <div className={`home ${isLoaded ? "fade-in" : ""}`}>
            <div className="aboutme">
                <h2>
                    Hi, I'm <span>Skills</span>
                </h2>
                <div className="prompt">
                    <p>Unreal And Unity developer with a passion to learn new stuff</p>
                    <ContactIcons />
                    <button onClick={() => navigate("/about")}>About Me!</button>
                </div>
            </div>
            <div className="skills-section">
                <h1>Skills</h1>
                <div className="skills">
                    <div className="skillList">
                        {SkillsList.map((skill, index) => {
                            return (
                                <CardDisplay
                                    key={index}
                                    image={skill.icon}
                                    tooltip={skill.text}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Home);