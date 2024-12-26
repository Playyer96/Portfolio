import React, {useState, useEffect} from "react";
import "../styles/Modal.css";

function Modal({isOpen, closeModal, project}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle carousel navigation
    const nextItem = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (project.images.length + (project.videoUrl ? 1 : 0)));
    };

    const prevItem = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + (project.images.length + (project.videoUrl ? 1 : 0))) %
                (project.images.length + (project.videoUrl ? 1 : 0))
        );
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"; // Disable scrolling
            setIsAnimating(true);
        } else {
            document.body.style.overflow = ""; // Re-enable scrolling when modal closes
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(closeModal, 300); // Wait for animation duration before actually closing
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div className={`modalOverlay ${isAnimating ? "fadeIn" : "fadeOut"}`} onClick={handleClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h1>{project.name}</h1>
                <div className="modalCarousel">
                    <div className="carouselNavigation prev">
                        <button onClick={prevItem}>&lt;</button>
                    </div>

                    <div className="carouselContent">
                        {currentIndex < project.images.length && (
                            <img
                                src={project.images[currentIndex].image}
                                alt={project.name}
                                className="carouselImage"
                            />
                        )}
                        {currentIndex === project.images.length && project.videoUrl && (
                            <div className="videoWrapper">
                                <iframe
                                    src={project.videoUrl}
                                    title={project.name}
                                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="carouselVideo"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Next Button */}
                    <div className="carouselNavigation next">
                        <button onClick={nextItem}>&gt;</button>
                    </div>
                </div>

                <div className="modalDescription">
                    <h3>Description</h3>
                    <p>{project.descriptions && project.descriptions.join(" ")}</p>
                </div>
                <div className="modalResponsabilities">
                    <h3>Responsibilities</h3>
                    <ul>
                        {project.responsabilities &&
                            project.responsabilities.map((task, index) => (
                                <li key={index}>{task}</li>
                            ))}
                    </ul>
                </div>
                {project.link && (
                    <div className="projectLink">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;