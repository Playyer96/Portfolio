import React, { useState, useEffect } from "react";
import WorkIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import "../styles/Experience.css";

const API_URL = process.env.REACT_APP_API_URL;

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch(`${API_URL}/api/experience`);
                if (!response.ok) {
                    throw new Error('Failed to fetch experience data');
                }
                const data = await response.json();
                setExperiences(data[0].experience || []);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    if (loading) {
        return <div className="experience"><div className="experience-header"><h2>Loading...</h2></div></div>;
    }

    if (error) {
        return <div className="experience"><div className="experience-header"><h2>Error: {error}</h2></div></div>;
    }

    return (
        <div className="experience">
            <div className="experience-header">
                <h1 className="experience-title">Experience</h1>
            </div>
            <VerticalTimeline lineColor="#f9004d">
                {experiences.map((item, index) => (
                    <VerticalTimelineElement
                        key={index}
                        className="vertical-timeline-element--education"
                        date={item.date}
                        iconStyle={{background: item.iconBackground, color: "#fff"}}
                        icon={item.icon === "WorkIcon" ? <WorkIcon/> : <SchoolIcon/>}
                    >
                        <h3 className="vertical-timeline-element-title">{item.title}</h3>
                        <h4 className="vertical-timeline-element-subtitle">
                            {item.subtitle}
                        </h4>
                        {item.responsibilities.map((responsibility, subIndex) => (
                            <p key={subIndex}>{responsibility}</p>
                        ))}
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
};

export default Experience;