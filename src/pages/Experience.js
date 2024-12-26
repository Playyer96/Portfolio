import React from "react";
import WorkIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {ExperienceList} from "../helpers/ExperienceList";
import "../styles/Experience.css";

const Experience = () => {
    return (
        <div className="experience">
            <div className="experience-header">
                <h1 className="experience-title">Experience</h1>
            </div>
            <VerticalTimeline lineColor="#f9004d">
                {ExperienceList.map((item, index) => (
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