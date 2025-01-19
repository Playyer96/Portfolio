import React, {useState, useEffect, useMemo} from "react";
import "../styles/Modal.css";
import {FaGithub, FaUnity, FaReact, FaNodeJs} from "react-icons/fa";
import {SiSlack, SiVisualstudio, SiUnrealengine} from "react-icons/si";
import {VscAzure} from "react-icons/vsc";

const techIconsMap = {
    "Unity": <FaUnity/>,
    "C#": <FaReact/>,
    "Github": <FaGithub/>,
    "Slack": <SiSlack/>,
    "Visual Studio": <SiVisualstudio/>,
    "Dev Ops": <VscAzure/>,
    "Unreal": <SiUnrealengine/>,
    "Node Js": <FaNodeJs/>,
};

function Modal({isOpen, closeModal, project}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const techIcons = useMemo(() => (project.technologies?.map((tech, index) => (
        <div className="techIcon" key={index} data-tooltip={tech.name}>
            {techIconsMap[tech.name] || <span>{tech.name}</span>}
        </div>))), [project.technologies]);

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

    useEffect(() => {
        if (!isTransitioning) return;
        const timer = setTimeout(() => setIsTransitioning(false), 300);
        return () => clearTimeout(timer);
    }, [isTransitioning]);

    if (!isOpen && !isAnimating) return null;

    return (<div className={`modal-overlay ${isAnimating ? "fade-in" : "fade-out"}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1>{project.name}</h1>
            <div className="modal-carousel">
                <button className="carousel-btn prev"
                        onClick={() => setIsTransitioning(true) || setCurrentIndex((prev) => (prev - 1 + project.images.length) % project.images.length)}>&lt;</button>
                <div className={`carousel-item ${isTransitioning ? "fade-out" : "fade-in"}`}>
                    {project.images.length > 0 && <img src={project.images[currentIndex]?.image} alt={project.name}
                                                       className="carousel-image"/>}
                    {currentIndex === project.images.length && project.videoUrl && (
                        <iframe className="carousel-video" src={project.videoUrl} title={project.name}
                                allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen></iframe>)}
                </div>
                <button className="carousel-btn next"
                        onClick={() => setIsTransitioning(true) || setCurrentIndex((prev) => (prev + 1) % project.images.length)}>&gt;</button>
            </div>
            <div className="modal-description">
                <h3>Description</h3>
                <p>{project.descriptions?.join(" ")}</p>
            </div>
            <div className="modal-technologies">
                <h3>Technologies</h3>
                <div className="tech-icons">{techIcons}</div>
            </div>
            <div className="modal-responsibilities">
                <h3>Responsibilities</h3>
                <ul>
                    {project.responsibilities?.map((task, index) => <li key={index}>{task}</li>)}
                </ul>
                {project.link &&
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View
                        Project</a>}
            </div>
        </div>
    </div>);
}

export default Modal;