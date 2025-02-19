import React, { useState, useEffect, useMemo } from "react";
import "../styles/Modal.css";
import { FaReact, FaNodeJs, FaPython, FaJira, FaJava, FaHtml5, FaCss3Alt, FaJs, FaDocker, FaGithub, FaDatabase, FaSlack, FaMicrosoft } from "react-icons/fa";
import { SiTypescript, SiMongodb, SiPostgresql, SiSpring, SiExpress, SiDjango, SiTailwindcss, SiUnity, SiUnrealengine, SiCsharp, SiCplusplus, SiAzuredevops } from "react-icons/si";

function Modal({ isOpen, closeModal, project }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const getIconComponent = (techName) => {
        const normalizedTechName = techName.toLowerCase().trim();
        const iconMap = {
            'react': FaReact,
            'nodejs': FaNodeJs,
            'python': FaPython,
            'java': FaJava,
            'html': FaHtml5,
            'html5': FaHtml5,
            'css': FaCss3Alt,
            'css3': FaCss3Alt,
            'javascript': FaJs,
            'js': FaJs,
            'jira': FaJira,
            'typescript': SiTypescript,
            'ts': SiTypescript,
            'mongodb': SiMongodb,
            'postgresql': SiPostgresql,
            'postgres': SiPostgresql,
            'spring': SiSpring,
            'spring boot': SiSpring,
            'springboot': SiSpring,
            'express': SiExpress,
            'expressjs': SiExpress,
            'django': SiDjango,
            'docker': FaDocker,
            'github': FaGithub,
            'git': FaGithub,
            'sql': FaDatabase,
            'database': FaDatabase,
            'tailwind': SiTailwindcss,
            'tailwindcss': SiTailwindcss,
            'unity': SiUnity,
            'unreal': SiUnrealengine,
            'c#': SiCsharp,
            'c++': SiCplusplus,
            'csharp': SiCsharp,
            'slack': FaSlack,
            'dev ops': SiAzuredevops,
            'devops': SiAzuredevops,
            'visual studio': FaMicrosoft
        };
        const Icon = iconMap[normalizedTechName];
        return Icon || null;
    };

    const techIcons = useMemo(() => {
        if (!project?.technologies) return [];
        return project.technologies.map((tech) => {
            const Icon = tech?.name ? getIconComponent(tech.name) : null;
            return (
                <div className="techIcon" key={tech?.name || 'unknown'} data-tooltip={tech?.name || 'Unknown Technology'}>
                    {Icon ? <Icon size={24} /> : <span>{tech?.name || 'Unknown Technology'}</span>}
                </div>
            );
        });
    }, [project?.technologies]);

    // Handle carousel navigation
    const nextItem = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (project.images.length + (project.videoUrl ? 1 : 0)));
    };

    const prevItem = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (project.images.length + (project.videoUrl ? 1 : 0))) % (project.images.length + (project.videoUrl ? 1 : 0)));
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            document.body.style.overflow = "hidden";
            setIsAnimating(true);
        } else {
            document.body.style.overflow = "";
            setIsAnimating(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(closeModal, 300);
    };

    useEffect(() => {
        if (!isTransitioning) return;
        const timer = setTimeout(() => setIsTransitioning(false), 300);
        return () => clearTimeout(timer);
    }, [isTransitioning]);

    if (!isOpen && !isAnimating) return null;

    return (<div className={`modalOverlay ${isAnimating ? "fadeIn" : "fadeOut"}`} onClick={handleClose}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h1>{project.name}</h1>
            <div className="modalCarousel">
                <div className="carouselNavigation prev">
                    <button onClick={prevItem}>&lt;</button>
                </div>

                <div className="carouselContent">
                    <div className={`carouselItem ${isTransitioning ? "fadeOut" : "fadeIn"}`}>
                        {currentIndex < project.images.length && (<img
                            src={project.images[currentIndex].image}
                            alt={project.name}
                            className="carouselImage"
                        />)}
                        {currentIndex === project.images.length && project.videoUrl && (
                            <div className="videoWrapper">
                                <iframe
                                    src={project.videoUrl}
                                    title={project.name}
                                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="carouselVideo"
                                ></iframe>
                            </div>)}
                    </div>
                </div>

                <div className="carouselNavigation next">
                    <button onClick={nextItem}>&gt;</button>
                </div>
            </div>

            <div className="modalDescription">
                <h3>Description</h3>
                <p>{project.descriptions && project.descriptions.join(" ")}</p>
            </div>

            <div className="modalTechnologies">
                <h3>Technologies</h3>
                <div className="techIcons">
                    {techIcons}
                </div>
            </div>

            <div className="modalResponsabilities">
                <h3>Responsibilities</h3>
                <ul>
                    {project.responsibilities.map((task, index) => (
                        <li key={index}>{task}</li>))}
                </ul>
                {project.link && (<div className="projectLink">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                        View Project
                    </a>
                </div>)}
            </div>
        </div>
    </div>
    );
}

export default Modal;