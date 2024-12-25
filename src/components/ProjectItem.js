import React from "react";
import {useNavigate} from "react-router-dom";
import "../styles/Projects.css";

function ProjectItem({image, name, id}) {
    const navigate = useNavigate();

    return (
        <div
            className="projectItem"
            onClick={() => navigate(`/project/${id}`)}
        >
            <div
                className="bgImage"
                style={{backgroundImage: `url(${image})`}}
                loading="lazy"
                aria-label={`Project: ${name}`}
            />
            <div className="tooltip">{name}</div>
        </div>
    );
}

export default ProjectItem;