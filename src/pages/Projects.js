import React, {useState} from "react";
import ProjectItem from "../components/ProjectItem";
import {ProjectList} from "../helpers/ProjectList";
import Modal from "../components/Modal"; // Import the Modal component

import "../styles/Projects.css";

function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="projects">
            <h1 className="projectsTitle">Projects</h1>
            <div className="projectList">
                {ProjectList.map((project) => {
                    return (
                        <ProjectItem
                            key={project.id}
                            name={project.name}
                            image={project.image}
                            onClick={() => openModal(project)} // Open modal on project click
                        />
                    );
                })}
            </div>
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                project={selectedProject} // Pass the whole project data to the Modal
            />
        </div>
    );
}

export default Projects;