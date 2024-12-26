import React from "react";
import "../styles/Projects.css";

function ProjectItem({image, name, id, onClick}) {
    return (
        <div className="projectItem" onClick={onClick}>
            < div
                className="bgImage"
                style={{backgroundImage: `url(${image})`}}
                aria-label={`Project: ${name}`}
            />
            <div className="tooltip">{name}
            </div>
        </div>
    );
}

export default ProjectItem;