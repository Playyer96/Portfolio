import React from "react";
import { useNavigate } from "react-router-dom";
import CardDisplay from "../components/CardDisplay";
import ContactIcons from "../components/ContactIcons";
import { SkillsList } from "../helpers/SkillsList";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="aboutme">
        <h2>
          Hi, I'm <span>Dani</span>
        </h2>
        <div className="prompt">
          <p>Unreal And Unity developer with a passion to learn new stuff</p>
          <ContactIcons />
          <button onClick={() => navigate("/about")}>About Me!</button>
        </div>
      </div>
      <div className="skills-section">
        <h2>Skills</h2>

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
