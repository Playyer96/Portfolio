import WorkIcon from "@mui/icons-material/Engineering";
import SchoolIcon from "@mui/icons-material/School";
import React, { Component } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { ExperienceList } from "../helpers/ExperienceList"; // Adjust the import path
import "../styles/Experience.css";

class Experience extends Component {
  render() {
    return (
      <div className="experience">
        <VerticalTimeline lineColor="#191919">
          {ExperienceList.map((item, index) => (
            <VerticalTimelineElement
              key={index}
              className="vertical-timeline-element--education"
              date={item.date}
              iconStyle={{ background: item.iconBackground, color: "#fff" }}
              icon={item.icon === "WorkIcon" ? <WorkIcon /> : <SchoolIcon />}
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
  }
}

export default Experience;
