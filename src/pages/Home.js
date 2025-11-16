import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardDisplay from "../components/CardDisplay";
import ContactIcons from "../components/ContactIcons";
import { FaReact, FaUnity, FaHtml5, FaCss3Alt, FaJs, FaNodeJs, FaPython, FaGitAlt, FaGithub, FaGitlab, FaDocker, FaSlack, FaJira } from "react-icons/fa";
import { SiUnrealengine, SiCplusplus, SiSharp, SiPerforce } from "react-icons/si";

import "../styles/Home.css";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [technologies, setTechnologies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTechnologies = async () => {
            try {
                const response = await fetch(`${API_URL}/technologies`);
                if (!response.ok) {
                    throw new Error('Failed to fetch technologies data');
                }
                const data = await response.json();
                setTechnologies(data[0].technologies || []);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTechnologies();
        setIsLoaded(true);
    }, []);

    if (loading) {
        return <div className="home"><div className="skills-section"><h2>Loading...</h2></div></div>;
    }

    if (error) {
        return <div className="home"><div className="skills-section"><h2>Error: {error}</h2></div></div>;
    }

    return (
        <div className={`home ${isLoaded ? "fade-in" : ""}`}>
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
                <h1>Technologies</h1>
                <div className="skills">
                    <div className="skillList">
                        {technologies.map((tech, index) => {
                            let IconComponent;
                            console.log('Technology text:', tech?.text);
                            switch ((tech?.text || '').toLowerCase()) {
                                case 'react': IconComponent = FaReact; break;
                                case 'unity engine': IconComponent = FaUnity; break;
                                case 'unreal engine': IconComponent = SiUnrealengine; break;
                                case 'html5': IconComponent = FaHtml5; break;
                                case 'css 3': IconComponent = FaCss3Alt; break;
                                case 'javascript': IconComponent = FaJs; break;
                                case 'nodejs': IconComponent = FaNodeJs; break;
                                case 'python': IconComponent = FaPython; break;
                                case 'c++': IconComponent = SiCplusplus; break;
                                case 'c#': IconComponent = SiSharp; break;
                                case 'git': IconComponent = FaGitAlt; break;
                                case 'github': IconComponent = FaGithub; break;
                                case 'gitlab': IconComponent = FaGitlab; break;
                                case 'docker': IconComponent = FaDocker; break;
                                case 'slack': IconComponent = FaSlack; break;
                                case 'jira': IconComponent = FaJira; break;
                                case 'perforce': IconComponent = SiPerforce; break;
                                default: IconComponent = FaReact;
                            }
                            return (
                                <CardDisplay
                                    key={index}
                                    icon={IconComponent}
                                    tooltip={tech.text}
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