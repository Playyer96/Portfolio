import React from "react";
import ProjectItem from "../components/ProjectItem";
import {ProjectList} from "../helpers/ProjectList";

import "../styles/Projects.css";

function Projects() {
    return (
        <div className="projects">
            <h1 className="projectsTitle">Projects</h1>
            <div className="projectList">

                {ProjectList.map((project, index) => {
                    return (
                        <ProjectItem
                            id={index}
                            key={project.id}
                            name={project.name}
                            image={project.image}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default Projects;
