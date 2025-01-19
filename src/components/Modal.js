import React, {useState, useEffect, useMemo} from "react";
import "../styles/Modal.css";
import {FaGithub, FaUnity, FaReact, FaNodeJs} from "react-icons/fa";
import {SiSlack, SiVisualstudio} from "react-icons/si";
import {VscAzureDevops} from "react-icons/vsc";

const techIconsMap = {
    "Unity": <FaUnity/>,
    "C#": <FaReact/>,
    "Github": <FaGithub/>,
    "Slack": <SiSlack/>,
    "Visual Studio": <SiVisualstudio/>,
    "Dev Ops": <VscAzureDevops/>,
};

function Modal({isOpen, closeModal, project}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const techIcons = useMemo(() => (project.technologies?.map((tech, index) => (
        <div className="techIcon" key={index} data-tooltip={tech.name}>
            {techIconsMap[tech.name] || <span>{tech.name}</span>}
        </div>))), [project.technologies]);

    // Handle carousel navigation
    const nextItem = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (project.images.length + (project.videoUrl ? 1 : 0)));
    };

    const prevItem = () => {
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (project.images.length + (project.videoUrl ? 1 : 0))) % (project.images.length + (project.videoUrl ? 1 : 0)));
    };

    // Reset carousel to first item when modal is opened
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

    // Reset the transition effect after the animation ends
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
                        {currentIndex === project.images.length && project.videoUrl && (<div className="videoWrapper">
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
        </div>

        <div className="modalResponsabilities">
            <h3>Responsibilities</h3>
            <ul>
                {project.responsabilities && project.responsabilities.map((task, index) => (
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
)
    ;
}

export default Modal;