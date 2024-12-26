import React, {useState} from "react";
import "../styles/Modal.css";

function Modal({isOpen, closeModal, project}) {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={closeModal}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h1>{project.name}</h1>
                <div className="modalCarousel">
                    {/* Previous Button */}
                    <div className="carouselNavigation prev">
                        <button onClick={prevItem}>&lt;</button>
                    </div>

                    {/* Carousel Content */}
                    <div className="carouselContent">
                        {/* Display images or video based on the current index */}
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
                                    frameBorder="0"
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