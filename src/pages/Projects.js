import React, { useState, useEffect } from "react";
import ProjectItem from "../components/ProjectItem";
import Modal from "../components/Modal";
import "../styles/Projects.css";

const API_URL = process.env.REACT_APP_API_URL;

function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch projects data
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_URL}/projects`);
                if (!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0].projects)) {
                    throw new Error("Invalid response format: Expected an array inside 'projects'");
                }

                const fetchedProjects = data[0].projects;

                // Dynamically fetch images for each project
                const updatedProjects = await Promise.all(
                    fetchedProjects.map(async (project) => {
                        const imageUrl = await fetchImage(project.images?.[0]?.image || "default.jpg");
                        return { ...project, imageUrl };  // Add the imageUrl to the project
                    })
                );

                setProjects(updatedProjects);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);  // Empty dependency array ensures this runs once

    // Fetch the image dynamically
    const fetchImage = async (url) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return url;
            } else {
                throw new Error("Failed to fetch image");
            }
        } catch (err) {
            console.error("Error fetching image:", err);
            return null;
        }
    };

    // Modal related actions
    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Error and loading UI
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="projects">
            <h1 className="projectsTitle">Projects</h1>
            <div className="projectList">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectItem
                            key={project._id || project.id}
                            name={project.name}
                            image={project.imageUrl || "default.jpg"}
                            onClick={() => openModal(project)}
                        />
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                closeModal={closeModal}
                project={selectedProject}
                className={isModalOpen ? "open" : "close"}
            />
        </div>
    );
}

export default Projects;