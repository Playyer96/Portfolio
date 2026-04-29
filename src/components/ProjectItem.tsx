import React from "react";
import { ProjectItemProps } from "../types";
import "../styles/Projects.css";

/**
 * ProjectItem Component
 *
 * Displays a project as a clickable card with background image
 * Used in the older Projects page layout
 */
const ProjectItem: React.FC<ProjectItemProps> = ({ image, name, onClick }) => {
  return (
    <div className="projectItem" onClick={onClick}>
      <div
        className="bgImage"
        style={{ backgroundImage: `url(${image})` }}
        aria-label={`Project: ${name}`}
      />
      <div className="tooltip">{name}</div>
    </div>
  );
};

export default ProjectItem;
